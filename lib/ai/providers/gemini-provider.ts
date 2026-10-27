import { GoogleGenAI, Type } from '@google/genai';
import type { LyricsAIProvider, LyricsConversionInput } from './provider-interface';
import { NormalizedAIOutputSchema, type NormalizedAIOutput } from '../lyrics-schema';
import { buildLyricsSystemPrompt } from '../lyrics-prompt';
import { AIProviderError } from '../errors/provider-errors';

export class GeminiLyricsProvider implements LyricsAIProvider {
  public readonly providerName = 'gemini';
  public readonly modelName: string;
  private readonly client: GoogleGenAI;

  constructor(apiKey: string, modelName = 'gemini-2.5-flash') {
    if (!apiKey) {
      throw new AIProviderError('UNAUTHORIZED', 'Gemini API key is missing.', 401);
    }

    this.client = new GoogleGenAI({ apiKey });
    this.modelName = modelName;
  }

  async convertLyrics(input: LyricsConversionInput): Promise<NormalizedAIOutput> {
    const systemPrompt = buildLyricsSystemPrompt();

    const promptText = `Convert the following indexed lyric lines:\n${JSON.stringify(input.parsedLines, null, 2)}`;

    try {
      const response = await this.client.models.generateContent({
        model: this.modelName,
        contents: promptText,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              lines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sectionIndex: { type: Type.INTEGER },
                    lineIndex: { type: Type.INTEGER },
                    native: { type: Type.STRING },
                    translation: { type: Type.STRING },
                    uncertaintyFlag: { type: Type.BOOLEAN },
                  },
                  required: ['sectionIndex', 'lineIndex', 'native', 'translation'],
                },
              },
            },
            required: ['lines'],
          },
        },
      });

      if (!response.text?.trim()) {
        throw new AIProviderError('MALFORMED_OUTPUT', 'Gemini returned empty output.', 502);
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(response.text);
      } catch {
        throw new AIProviderError('MALFORMED_OUTPUT', 'Gemini returned invalid JSON.', 502);
      }

      return NormalizedAIOutputSchema.parse(parsed);
    } catch (error: unknown) {
      if (error instanceof AIProviderError) {
        throw error;
      }

      const err = error as {
        status?: number;
        message?: string;
        code?: number | string;
      };

      const message = err.message ?? 'Unknown Gemini error';
      const status = err.status;

      if (status === 429) {
        throw new AIProviderError('RATE_LIMIT_EXCEEDED', 'Gemini rate limit reached.', 429);
      }

      if (status === 402 || /quota|billing|credit balance/i.test(message)) {
        throw new AIProviderError('AI_CREDITS_EXHAUSTED', 'Gemini quota or billing limit reached.', 402);
      }

      throw new AIProviderError('PROVIDER_OUTAGE', `Gemini API error: ${message}`, 502);
    }
  }
}

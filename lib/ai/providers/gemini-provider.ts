import { GoogleGenAI, Type } from '@google/genai';
import { LyricsAIProvider, LyricsConversionInput } from './provider-interface';
import { NormalizedAIOutput } from '../lyrics-schema';
import { buildLyricsSystemPrompt } from '../lyrics-prompt';
import { AIProviderError } from '../errors/provider-errors';

export class GeminiLyricsProvider implements LyricsAIProvider {
  public readonly providerName = 'gemini';
  public readonly modelName: string;
  private client: GoogleGenAI;

  constructor(apiKey: string, modelName?: string) {
    if (!apiKey) {
      throw new AIProviderError('UNAUTHORIZED', 'Gemini API key is missing.', 401);
    }
    this.client = new GoogleGenAI({ apiKey });
    this.modelName = modelName || 'gemini-2.5-flash';
  }

  async convertLyrics(input: LyricsConversionInput): Promise<NormalizedAIOutput> {
    const systemPrompt = buildLyricsSystemPrompt(input.sourceLanguage, input.nativeLanguage, input.nativeScript);

    const promptText = `Convert the following lines:\n${JSON.stringify(input.parsedLines, null, 2)}`;

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

      if (!response.text) {
        throw new AIProviderError('MALFORMED_OUTPUT', 'Gemini returned empty output', 500);
      }

      const parsed = JSON.parse(response.text);
      return parsed as NormalizedAIOutput;
    } catch (err: any) {
      if (err instanceof AIProviderError) throw err;

      if (err.status === 429) {
        throw new AIProviderError('RATE_LIMIT_EXCEEDED', 'Gemini rate limit hit', 429);
      }
      if (err.status === 402 || err.message?.includes('quota')) {
        throw new AIProviderError('AI_CREDITS_EXHAUSTED', 'Gemini quota exhausted', 402);
      }
      throw new AIProviderError('PROVIDER_OUTAGE', `Gemini API error: ${err.message}`, 502);
    }
  }
}

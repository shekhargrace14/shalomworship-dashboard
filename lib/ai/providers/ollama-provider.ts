import type { LyricsAIProvider, LyricsConversionInput } from './provider-interface';

import { NormalizedAIOutputSchema, type NormalizedAIOutput } from '../lyrics-schema';

import { buildLyricsSystemPrompt } from '../lyrics-prompt';
import { AIProviderError } from '../errors/provider-errors';

export class OllamaLyricsProvider implements LyricsAIProvider {
  public readonly providerName = 'ollama';
  public readonly modelName: string;

  private readonly baseUrl: string;

  constructor(modelName = process.env.OLLAMA_MODEL || 'gemma3:4b', baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434') {
    this.modelName = modelName;
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  async convertLyrics(input: LyricsConversionInput): Promise<NormalizedAIOutput> {
    const systemPrompt = buildLyricsSystemPrompt();

    try {
      const response = await fetch(`${this.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.modelName,
          stream: false,
          format: {
            type: 'object',
            properties: {
              lines: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    sectionIndex: { type: 'integer' },
                    lineIndex: { type: 'integer' },
                    native: { type: 'string' },
                    translation: { type: 'string' },
                    uncertaintyFlag: { type: 'boolean' },
                  },
                  required: ['sectionIndex', 'lineIndex', 'native', 'translation'],
                },
              },
            },
            required: ['lines'],
          },
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: `Convert the following indexed lyric lines:\n${JSON.stringify(input.parsedLines, null, 2)}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const details = await response.text();

        if (response.status === 404) {
          throw new AIProviderError('PROVIDER_OUTAGE', `Ollama model or endpoint not found. Check model "${this.modelName}". ${details}`, 502);
        }

        throw new AIProviderError('PROVIDER_OUTAGE', `Ollama API returned ${response.status}: ${details}`, 502);
      }

      const data = await response.json();
      const content = data.message?.content;

      if (typeof content !== 'string' || !content.trim()) {
        throw new AIProviderError('MALFORMED_OUTPUT', 'Ollama returned empty output.', 500);
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(content);
      } catch {
        throw new AIProviderError('MALFORMED_OUTPUT', 'Ollama returned invalid JSON.', 500);
      }

      return NormalizedAIOutputSchema.parse(parsed);
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'ZodError') {
        throw new AIProviderError('MALFORMED_OUTPUT', 'Ollama output did not match the expected schema.', 500);
      }

      throw new AIProviderError('PROVIDER_OUTAGE', `Ollama request failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 502);
    }
  }
}

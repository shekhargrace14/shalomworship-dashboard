import { LyricsAIProvider } from './provider-interface';
import { GeminiLyricsProvider } from './gemini-provider';
import { OllamaLyricsProvider } from './ollama-provider';
import { AIProviderError } from '../errors/provider-errors';

type ProviderConfig = {
  provider: 'cloud' | 'local';
  model: string;
};

export function createLyricsAIProvider({ provider, model }: ProviderConfig): LyricsAIProvider {
  switch (provider) {
    case 'cloud': {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        throw new AIProviderError('UNAUTHORIZED', 'GEMINI_API_KEY environment variable is missing.', 401);
      }

      return new GeminiLyricsProvider(apiKey, model);
    }

    case 'local':
      return new OllamaLyricsProvider(model, process.env.OLLAMA_BASE_URL || 'http://localhost:11434');

    default:
      throw new AIProviderError('PROVIDER_OUTAGE', `Unsupported lyrics AI provider: "${provider}".`, 500);
  }
}

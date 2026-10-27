export const AI_CONFIG = {
  ollama: {
    baseUrl: process.env.NEXT_PUBLIC_OLLAMA_BASE_URL ?? 'http://localhost:11434',
    defaultModel: 'gemma3:4b',
  },

  gemini: {
    defaultModel: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
  },
} as const;

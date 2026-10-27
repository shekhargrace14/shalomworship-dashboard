import { NormalizedAIOutputSchema } from '../lyrics-schema';
import { buildLyricsSystemPrompt } from '../lyrics-prompt';

import { AI_CONFIG } from '../config';

const OLLAMA_URL = AI_CONFIG.ollama.baseUrl;
const MODEL = AI_CONFIG.ollama.defaultModel;

type ParsedInputLine = {
  sectionIndex: number;
  lineIndex: number;
  romanizedText: string;
};

type ConvertInput = {
  parsedLines: ParsedInputLine[];
  sourceLanguage: string;
  nativeLanguage: string;
  nativeScript: string;
};

export async function convertLyricsLocally(input: ConvertInput) {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
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
          content: buildLyricsSystemPrompt(),
        },
        {
          role: 'user',
          content: `Convert the following indexed lyric lines:\n${JSON.stringify(input.parsedLines, null, 2)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}. Check that Ollama is running and the model "${MODEL}" is installed.`);
  }

  const data = await response.json();
  const content = data.message?.content;

  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('Ollama returned empty output.');
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('Ollama returned invalid JSON.');
  }

  return NormalizedAIOutputSchema.parse(parsed);
}

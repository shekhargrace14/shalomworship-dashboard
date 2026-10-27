import { NormalizedAIOutputSchema, Version4LyricsSchema, type LyricsConversionRequest, type Version4LyricsJSON } from './lyrics-schema';

import { createLyricsAIProvider } from './providers/provider-factory';
import { parseLyricsText } from './lyrics-parser';
import { toTitleCase } from './utils/title-case';

export async function convertLyricsService(payload: LyricsConversionRequest): Promise<Version4LyricsJSON> {
  const sections = parseLyricsText(payload.lyricsText);

  if (sections.length === 0) {
    throw new Error('No lyric lines were found in the input.');
  }

  const parsedLines = sections.flatMap((section, sectionIndex) =>
    section.lines.map((romanizedText, lineIndex) => ({
      sectionIndex,
      lineIndex,
      romanizedText,
    })),
  );

  const provider = createLyricsAIProvider({
    provider: payload.provider,
    model: payload.model,
  });

  const aiResult = await provider.convertLyrics({
    parsedLines,
  });

  const aiOutput = NormalizedAIOutputSchema.parse(aiResult);

  // Validate that the AI returns only expected, unique lines.
  const expectedLineKeys = new Set(parsedLines.map(({ sectionIndex, lineIndex }) => `${sectionIndex}:${lineIndex}`));

  const outputByLine = new Map<string, (typeof aiOutput.lines)[number]>();

  for (const line of aiOutput.lines) {
    const key = `${line.sectionIndex}:${line.lineIndex}`;

    if (!expectedLineKeys.has(key)) {
      throw new Error(`AI returned an unexpected lyric line: ${key}`);
    }

    if (outputByLine.has(key)) {
      throw new Error(`AI returned a duplicate lyric line: ${key}`);
    }

    outputByLine.set(key, line);
  }

  let hasUncertainties = false;
  let lineCounter = 1;

  const arrangement = sections.map((section, sectionIndex) => ({
    id: sectionIndex + 1,
    type: section.type,
    label: section.label,
    repeat: 1,
    lines: section.lines.map((originalLyrics, lineIndex) => {
      const key = `${sectionIndex}:${lineIndex}`;
      const match = outputByLine.get(key);

      if (!match) {
        throw new Error(`AI output is missing lyric line: ${key}`);
      }

      if (match.uncertaintyFlag) {
        hasUncertainties = true;
      }

      return {
        id: lineCounter++,
        lyrics: {
          english: toTitleCase(originalLyrics),
          native: toTitleCase(match.native),
          translation: toTitleCase(match.translation),
        },
        chords: [],
        indent: 0,
        sectionBreak: lineIndex === section.lines.length - 1,
      };
    }),
  }));

  return Version4LyricsSchema.parse({
    arrangement,
    metadata: {
      providerUsed: provider.providerName,
      modelUsed: provider.modelName,
      hasUncertainties,
    },
  });
}

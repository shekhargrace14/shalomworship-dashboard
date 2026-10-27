import { NormalizedAIOutputSchema, Version4LyricsSchema, type Version4LyricsJSON } from './lyrics-schema';
import type { ParsedSection } from './lyrics-parser';
import { toTitleCase } from './utils/title-case';

type BuildVersion4Input = {
  sections: ParsedSection[];
  aiOutput: unknown;
  providerName: string;
  modelName: string;
};

export function buildVersion4Lyrics({ sections, aiOutput: rawAIOutput, providerName, modelName }: BuildVersion4Input): Version4LyricsJSON {
  const aiOutput = NormalizedAIOutputSchema.parse(rawAIOutput);

  const outputByLine = new Map<string, (typeof aiOutput.lines)[number]>();

  for (const line of aiOutput.lines) {
    const key = `${line.sectionIndex}:${line.lineIndex}`;

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
    lines: section.lines.map((originalRomanized, lineIndex) => {
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
          english: toTitleCase(originalRomanized),
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
      providerUsed: providerName,
      modelUsed: modelName,
      hasUncertainties,
    },
  });
}

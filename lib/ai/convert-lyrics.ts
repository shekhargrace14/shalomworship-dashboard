import { GoogleGenAI, Type } from '@google/genai';
import { LyricsConversionInputPayload, Version4LyricsSchema, Version4LyricsJSON } from './lyrics-schema';
import { SectionLabels } from '@/utils/SectionLabels';

// Ensure Gemini Client initializes with API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

type ParsedSection = {
  type: keyof typeof SectionLabels;
  label: string;
  lines: string[];
};

function parseLyricsText(text: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  const headingPattern = /^(?:#+\s*)?(intro|verse(?:\s+\d+)?|pre[\s-]+chorus|chorus|post[\s-]+chorus|bridge|interlude|instrumental|solo|rap|hook|refrain|breakdown|outro|ending|spoken|adlibs?|other)\s*:?\s*$/i;

  function startSection(label: string) {
    const normalized = label
      .replace(/^#+\s*/, '')
      .replace(/:\s*$/, '')
      .trim();

    const match = normalized.match(headingPattern);
    if (!match) return false;

    const heading = match[1].toLowerCase().replace(/[\s-]+/g, '');

    let type: keyof typeof SectionLabels = 'OTHER';

    if (heading.startsWith('verse')) type = 'VERSE';
    else if (heading === 'prech orus'.replace(/\s/g, '')) type = 'PRE_CHORUS';
    else if (heading === 'prechorus') type = 'PRE_CHORUS';
    else if (heading === 'postchorus') type = 'POST_CHORUS';
    else if (heading === 'intro') type = 'INTRO';
    else if (heading === 'chorus') type = 'CHORUS';
    else if (heading === 'bridge') type = 'BRIDGE';
    else if (heading === 'interlude') type = 'INTERLUDE';
    else if (heading === 'instrumental') type = 'INSTRUMENTAL';
    else if (heading === 'solo') type = 'SOLO';
    else if (heading === 'rap') type = 'RAP';
    else if (heading === 'hook') type = 'HOOK';
    else if (heading === 'refrain') type = 'REFRAIN';
    else if (heading === 'breakdown') type = 'BREAKDOWN';
    else if (heading === 'outro') type = 'OUTRO';
    else if (heading === 'ending') type = 'ENDING';
    else if (heading === 'spoken') type = 'SPOKEN';
    else if (heading === 'adlib' || heading === 'adlibs') type = 'ADLIB';

    if (currentSection?.lines.length) {
      sections.push(currentSection);
    }

    currentSection = {
      type,
      label: normalized,
      lines: [],
    };

    return true;
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed) continue;

    if (startSection(trimmed)) continue;

    if (!currentSection) {
      currentSection = {
        type: 'VERSE',
        label: SectionLabels.VERSE,
        lines: [],
      };
    }

    currentSection.lines.push(trimmed);
  }

  if (currentSection?.lines.length) {
    sections.push(currentSection);
  }

  return sections;
}

export async function convertLyricsService(payload: LyricsConversionInputPayload): Promise<Version4LyricsJSON> {
  // Check API Key existence early
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY environment variable is not defined.');
  }

  const intermediateSections = parseLyricsText(payload.lyricsText);

  // Index lines for Gemini
  const parsedLines: Array<{ sectionIndex: number; lineIndex: number; romanizedText: string }> = [];
  intermediateSections.forEach((sec, secIdx) => {
    sec.lines.forEach((lineText, lineIdx) => {
      parsedLines.push({ sectionIndex: secIdx, lineIndex: lineIdx, romanizedText: lineText });
    });
  });

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  // Call Gemini API using @google/genai
  const response = await ai.models.generateContent({
    model: modelName,
    contents: `Convert these indexed lines:\n${JSON.stringify(parsedLines, null, 2)}`,
    config: {
      systemInstruction: `You are an expert linguistic and theological AI translator for Christian worship lyrics.
Convert the provided indexed lines into:
1. "native": Transliterated lyrics in ${payload.nativeLanguage} (${payload.nativeScript} script).
2. "translation": Natural, theological English translation.

RULES:
- Do NOT rewrite or modify the original Romanized lyrics.
- Preserve sectionIndex and lineIndex matching input array.
- Return structured array under "lines".
- Set "uncertaintyFlag" to true for ambiguous words.`,
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
    throw new Error('Gemini API returned an empty text response.');
  }

  let aiOutput;
  try {
    aiOutput = JSON.parse(response.text);
  } catch (err) {
    throw new Error(`Failed to parse Gemini JSON output: ${response.text}`);
  }

  // Reconstruct Version 4 JSON
  let hasUncertainties = false;
  let sectionCounter = 1;
  let lineCounter = 1;

  const arrangement = intermediateSections.map((sec, secIdx) => {
    const sectionLines = sec.lines.map((originalRomanized, lineIdx) => {
      const match = aiOutput.lines?.find((l: any) => l.sectionIndex === secIdx && l.lineIndex === lineIdx);

      if (match?.uncertaintyFlag) hasUncertainties = true;

      return {
        id: lineCounter++,
        lyrics: {
          english: originalRomanized,
          native: match ? match.native : '',
          translation: match ? match.translation : '',
        },
        chords: [],
        indent: 0,
        sectionBreak: lineIdx === sec.lines.length - 1,
      };
    });

    return {
      id: sectionCounter++,
      type: sec.type as any,
      label: sec.label,
      repeat: 1,
      lines: sectionLines,
    };
  });

  return Version4LyricsSchema.parse({
    arrangement,
    metadata: {
      providerUsed: 'gemini',
      modelUsed: modelName,
      hasUncertainties,
    },
  });
}

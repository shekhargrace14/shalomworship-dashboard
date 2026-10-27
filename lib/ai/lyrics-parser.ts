import { SectionLabels } from '@/utils/SectionLabels';

export type SectionType = keyof typeof SectionLabels;

export type ParsedSection = {
  type: SectionType;
  label: string;
  lines: string[];
};

export function parseLyricsText(text: string): ParsedSection[] {
  const sections: ParsedSection[] = [];
  let currentSection: ParsedSection | null = null;

  const headingPattern = /^(?:#+\s*)?(intro|verse(?:\s+\d+)?|pre[\s-]+chorus|chorus|post[\s-]+chorus|bridge|interlude|instrumental|solo|rap|hook|refrain|breakdown|outro|ending|spoken|adlibs?|other)\s*:?\s*$/i;

  function startSection(line: string): boolean {
    const normalized = line
      .replace(/^#+\s*/, '')
      .replace(/:\s*$/, '')
      .trim();

    const match = normalized.match(headingPattern);

    if (!match) return false;

    const heading = match[1].toLowerCase().replace(/[\s-]+/g, '');

    let type: SectionType = 'OTHER';

    if (heading.startsWith('verse')) type = 'VERSE';
    else if (heading === 'intro') type = 'INTRO';
    else if (heading === 'prechorus') type = 'PRE_CHORUS';
    else if (heading === 'chorus') type = 'CHORUS';
    else if (heading === 'postchorus') type = 'POST_CHORUS';
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

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) continue;
    if (startSection(line)) continue;

    if (!currentSection) {
      currentSection = {
        type: 'VERSE',
        label: SectionLabels.VERSE,
        lines: [],
      };
    }

    currentSection.lines.push(line);
  }

  if (currentSection?.lines.length) {
    sections.push(currentSection);
  }

  return sections;
}

type V3Chord = {
  root?: string | null;
  number?: number | null;
  quality?: string | null;
  space?: number | null;
};

type V3Line = {
  label?: string;
  chords?: V3Chord[];
  lyrics?: {
    hi?: string;
    en?: string;
  };
  translation?: {
    en?: string;
  };
  break?: 'break';
};

type V4SectionType = 'VERSE' | 'CHORUS' | 'PRE_CHORUS' | 'BRIDGE' | 'OUTRO' | 'INTRO' | 'RAP' | 'OTHER';

type V4Line = {
  id: string;
  lyrics: {
    english: string;
    native: string;
    translation: string;
  };
  chords: {
    id: string;
    root: string;
    nashville: number | null;
    quality: string;
    position: number;
  }[];
  indent: number;
  sectionBreak: boolean;
};

type V4Section = {
  id: string;
  type: V4SectionType;
  label: string;
  repeat: number;
  lines: V4Line[];
};

type V4Lyrics = {
  arrangement: V4Section[];
};

function createId() {
  return crypto.randomUUID();
}

function getSectionType(label: string): V4SectionType {
  const value = label.toLowerCase().trim();

  if (value.startsWith('verse')) return 'VERSE';
  if (value.includes('pre-chorus') || value.includes('pre chorus')) {
    return 'PRE_CHORUS';
  }
  if (value.includes('chorus')) return 'CHORUS';
  if (value.includes('bridge')) return 'BRIDGE';
  if (value.includes('outro')) return 'OUTRO';
  if (value.includes('intro')) return 'INTRO';
  if (value.includes('rap')) return 'RAP';

  return 'OTHER';
}

function normalizeV3Lines(lyricsV3: unknown): V3Line[] {
  if (!Array.isArray(lyricsV3)) {
    throw new Error('V3 lyrics must be an array');
  }

  /*
Supports both:

```
[{ line1 }, { line2 }]

and old accidentally nested data:

[[{ line1 }, { line2 }]]
```

*/
  if (Array.isArray(lyricsV3[0])) {
    return lyricsV3.flat() as V3Line[];
  }

  return lyricsV3 as V3Line[];
}

function convertChords(chords: V3Chord[] | undefined) {
  if (!Array.isArray(chords)) {
    return [];
  }

  return chords
    .filter((chord) => {
      // Removes this fake empty chord:
      // { root: "", number: null, quality: "", space: null }
      return Boolean(chord.root?.trim());
    })
    .map((chord) => ({
      id: createId(),
      root: chord.root?.trim() ?? '',
      nashville: chord.number ?? null,
      quality: chord.quality ?? '',
      position: chord.space ?? 0,
    }));
}

export function convertLyricsV3ToV4(lyricsV3: unknown): V4Lyrics {
  const flatLines = normalizeV3Lines(lyricsV3);

  const arrangement: V4Section[] = [];
  let currentSection: V4Section | null = null;

  for (const oldLine of flatLines) {
    // A label starts a new section.
    if (oldLine.label?.trim()) {
      currentSection = {
        id: createId(),
        type: getSectionType(oldLine.label),
        label: oldLine.label.trim(),
        repeat: 1,
        lines: [],
      };

      arrangement.push(currentSection);
    }

    // Handles lyrics that appear before the first label.
    if (!currentSection) {
      currentSection = {
        id: createId(),
        type: 'OTHER',
        label: 'Untitled',
        repeat: 1,
        lines: [],
      };

      arrangement.push(currentSection);
    }

    currentSection.lines.push({
      id: createId(),

      lyrics: {
        english: oldLine.lyrics?.en ?? '',
        native: oldLine.lyrics?.hi ?? '',
        translation: oldLine.translation?.en ?? '',
      },

      chords: convertChords(oldLine.chords),

      indent: 0,
      sectionBreak: oldLine.break === 'break',
    });
  }

  return {
    arrangement,
  };
}

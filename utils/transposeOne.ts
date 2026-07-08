const NOTE_INDEXES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const ENHARMONICS: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
};

function normalizeNote(note: string): string {
  return ENHARMONICS[note] || note;
}

function getKeyByShift(key: string, shift: number): string {
  // Handle minor keys like "Cm"
  const match = key.match(/^([A-G][#b]?)(m?)$/);
  if (!match) throw new Error('Invalid key: ' + key);

  const [_, root, minor] = match;
  const normalized = normalizeNote(root);
  const index = NOTE_INDEXES.indexOf(normalized);
  if (index === -1) throw new Error('Invalid key root: ' + key);

  const newRoot = NOTE_INDEXES[(index + shift + 12) % 12];
  return minor ? newRoot + 'm' : newRoot;
}

function normalizeChord(chord: string): [string, string, string?] {
  const clean = chord.trim().replace(/\s+/g, '');
  const match = clean.match(/^([A-G][#b]?)(.*?)(?:\/([A-G][#b]?))?$/);
  if (!match) throw new Error('Invalid chord: ' + chord);
  const [, root, suffix, bass] = match;
  return [root, suffix, bass];
}

function transposeChord(chords: string[], fromKey: string, toKey: string): string[] {
  const shift = NOTE_INDEXES.indexOf(normalizeNote(toKey.replace('m', ''))) - NOTE_INDEXES.indexOf(normalizeNote(fromKey.replace('m', '')));

  return chords.map((chordRaw) => {
    const chord = chordRaw.trim();
    if (!chord) return '';

    try {
      const [root, suffix, bass] = normalizeChord(chord);
      const rootIndex = NOTE_INDEXES.indexOf(normalizeNote(root));
      const transposedRoot = rootIndex !== -1 ? NOTE_INDEXES[(rootIndex + shift + 12) % 12] : root;

      let transposedBass = bass;
      if (bass) {
        const bassIndex = NOTE_INDEXES.indexOf(normalizeNote(bass));
        transposedBass = bassIndex !== -1 ? NOTE_INDEXES[(bassIndex + shift + 12) % 12] : bass;
      }

      return transposedBass ? `${transposedRoot}${suffix}/${transposedBass}` : `${transposedRoot}${suffix}`;
    } catch {
      console.warn(`Skipping invalid chord: "${chordRaw}"`);
      return chordRaw;
    }
  });
}

export { transposeChord, getKeyByShift };

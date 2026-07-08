const SHARP_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,

  'C#': 1,
  Db: 1,

  D: 2,

  'D#': 3,
  Eb: 3,

  E: 4,

  F: 5,

  'F#': 6,
  Gb: 6,

  G: 7,

  'G#': 8,
  Ab: 8,

  A: 9,

  'A#': 10,
  Bb: 10,

  B: 11,
};

const MAJOR_STEPS = [2, 2, 1, 2, 2, 2, 1];

export function getScale(key: string) {
  const rootIndex = NOTE_TO_INDEX[key];

  if (rootIndex === undefined) {
    throw new Error(`Invalid key: ${key}`);
  }

  const scale = [key];

  let currentIndex = rootIndex;

  for (const step of MAJOR_STEPS.slice(0, 6)) {
    currentIndex = (currentIndex + step) % 12;
    scale.push(SHARP_SCALE[currentIndex]);
  }

  return scale;
}

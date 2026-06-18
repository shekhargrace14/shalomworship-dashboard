import { getScale } from "./getScale";

const DIATONIC_QUALITIES = [
  "major",
  "m",
  "m",
  "major",
  "major",
  "m",
  "dim",
];

const SHARP_SCALE = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B"
];

const FLAT_SCALE = [
  "C", "Db", "D", "Eb", "E", "F",
  "Gb", "G", "Ab", "A", "Bb", "B"
];

const NOTE_TO_INDEX: Record<string, number> = {
  C: 0,

  "C#": 1,
  Db: 1,

  D: 2,

  "D#": 3,
  Eb: 3,

  E: 4,

  F: 5,

  "F#": 6,
  Gb: 6,

  G: 7,

  "G#": 8,
  Ab: 8,

  A: 9,

  "A#": 10,
  Bb: 10,

  B: 11,
};
export function getFamilyKey(key: string) {
  if (!key.endsWith("m")) {
    return key;
  }

  const root = key.replace("m", "");

  const rootIndex = NOTE_TO_INDEX[root];

  if (rootIndex === undefined) {
    throw new Error(`Invalid key: ${key}`);
  }

  // Relative major = +3 semitones
  const familyIndex = (rootIndex + 3) % 12;

  return SHARP_SCALE[familyIndex];
}

export function generateChordFamily(key: string) {
  const familyKey = getFamilyKey(key);

  const scale = getScale(familyKey);

  return scale.map((root, index) => ({
    nashville: index + 1,
    root,
    quality: DIATONIC_QUALITIES[index],
  }));
}
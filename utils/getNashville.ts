const MAJOR_SCALE = [
  'C', 'C#', 'D', 'D#', 'E', 'F',
  'F#', 'G', 'G#', 'A', 'A#', 'B'
];

const DEGREES = ['1', '2', '3', '4', '5', '6', '7'];

// Map flats to sharps to keep index matching uniform
const flatToSharpMap: Record<string, string> = {
  'DB': 'C#', 'EB': 'D#', 'GB': 'F#', 'AB': 'G#', 'BB': 'A#'
};

// Helper to normalize any user input (e.g., 'bb' -> 'BB' -> 'A#', 'c#' -> 'C#')
function normalizeNote(note: string): string {
  if (!note) return '';
  let upper = note.trim().toUpperCase();
  
  // Standardize styling: if it's 'C#', keep it; if it's 'db', match 'DB'
  if (upper.length > 1 && (upper.endsWith('B') || upper.endsWith('𝄬'))) {
    // Ensure it's treated as a flat note
    upper = upper.charAt(0) + 'B';
  }

  return flatToSharpMap[upper] || upper;
}

function getScale(key: string): string[] {
  const normalizedKey = normalizeNote(key);
  const startIndex = MAJOR_SCALE.indexOf(normalizedKey);

  if (startIndex === -1) {
    return [];
  }

  // A major scale has 7 distinct notes: Root, W, W, H, W, W, W
  // The steps relative to the root index are:
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
  
  const scale = majorIntervals.map(interval => {
    const index = (startIndex + interval) % 12;
    return MAJOR_SCALE[index];
  });

  return scale; // Returns exactly 7 scale degrees
}

export function getNashville(
  key: string,
  root: string,
  bass?: string
): string | null {
  if (!key || !root) {
    return null;
  }

  const normalizedKey = normalizeNote(key);
  const normalizedRoot = normalizeNote(root);

  const scale = getScale(normalizedKey);
  if (scale.length === 0) return null;

  const rootIndex = scale.indexOf(normalizedRoot);
  if (rootIndex === -1) {
    return null; // Not in this key's scale
  }

  const rootDegree = DEGREES[rootIndex];

  if (!bass || bass.trim() === '') {
    return rootDegree;
  }

  const normalizedBass = normalizeNote(bass);
  const bassIndex = scale.indexOf(normalizedBass);

  if (bassIndex === -1) {
    return rootDegree; // Fallback to just root if bass isn't in scale
  }

  return `${rootDegree}/${DEGREES[bassIndex]}`;
}
export const SONG_SECTION_OPTIONS = [
  "INTRO",
  "VERSE",
  "PRE_CHORUS",
  "CHORUS",
  "POST_CHORUS",
  "BRIDGE",
  "INTERLUDE",
  "INSTRUMENTAL",
  "SOLO",
  "RAP",
  "HOOK",
  "REFRAIN",
  "BREAKDOWN",
  "OUTRO",
  "ENDING",
  "SPOKEN",
  "ADLIB",
  "OTHER",
] as const

export type SongSectionType =
  typeof SONG_SECTION_OPTIONS[number]
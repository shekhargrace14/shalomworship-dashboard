export type Chord = {
  root: string;
  number: number | string;
  quality: string;
  space: number | null;
};

export type SongLine = {
  chords: Chord[];

  lyrics: {
    en: string;
    hi: string;
  };

  translation: {
    en: string;
  };

  indent?: number;

  break?: boolean;
};

export type SongSection = {
  id: string;

  type: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro';

  repeat?: number;

  label: {
    hi: string;
    en: string;
  };

  lines: SongLine[];
};

export type LyricsData = {
  arrangement: string[];
  sections: SongSection[];
};

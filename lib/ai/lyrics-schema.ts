import { z } from 'zod';

// --- Input Contract Schema ---
export const LyricsConversionInputSchema = z.object({
  lyricsText: z.string().min(1, 'Lyrics text is required').max(10000, 'Input exceeds maximum limit'),
  sourceLanguage: z.string().default('Hindi'),
  nativeLanguage: z.string().default('Hindi'),
  nativeScript: z.string().default('Devanagari'),
});

export type LyricsConversionInputPayload = z.infer<typeof LyricsConversionInputSchema>;

// --- Normalized AI Output Schema ---
export const NormalizedLineOutputSchema = z.object({
  sectionIndex: z.number().int().min(0),
  lineIndex: z.number().int().min(0),
  native: z.string(),
  translation: z.string(),
  uncertaintyFlag: z.boolean().optional(),
});

export const NormalizedAIOutputSchema = z.object({
  lines: z.array(NormalizedLineOutputSchema),
});

export type NormalizedAIOutput = z.infer<typeof NormalizedAIOutputSchema>;

// --- Version 4 JSON Schema ---
export const ChordSchema = z.object({
  id: z.string().or(z.number()).optional(),
  root: z.string(),
  nashville: z.string().optional(),
  quality: z.string().optional(),
  position: z.number(),
  bass: z.string().optional(),
});

export const LineSchema = z.object({
  id: z.number(),
  lyrics: z.object({
    english: z.string(),
    native: z.string(),
    translation: z.string(),
  }),
  chords: z.array(ChordSchema).default([]),
  indent: z.number().default(0),
  sectionBreak: z.boolean().default(false),
});

export const SectionSchema = z.object({
  id: z.number(),
  type: z.enum(['INTRO', 'VERSE', 'PRE_CHORUS', 'CHORUS', 'INTERLUDE', 'BRIDGE', 'HOOK', 'OUTRO', 'ENDING', 'OTHER']),
  label: z.string(),
  repeat: z.number().default(1),
  lines: z.array(LineSchema),
});

export const Version4LyricsSchema = z.object({
  arrangement: z.array(SectionSchema),
  metadata: z
    .object({
      providerUsed: z.string(),
      modelUsed: z.string(),
      hasUncertainties: z.boolean().default(false),
    })
    .optional(),
});

export type Version4LyricsJSON = z.infer<typeof Version4LyricsSchema>;

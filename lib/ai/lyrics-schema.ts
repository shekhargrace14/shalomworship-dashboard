import { z } from 'zod';
import { SectionLabels } from '@/utils/SectionLabels';

// Section types are derived from the existing application taxonomy.
const sectionTypes = Object.keys(SectionLabels) as [keyof typeof SectionLabels, ...(keyof typeof SectionLabels)[]];

// 1. Base lyrics input contract
export const LyricsConversionInputSchema = z.object({
  lyricsText: z.string().trim().min(1, 'Lyrics text is required').max(10000, 'Input exceeds maximum limit'),
});

export type LyricsConversionInputPayload = z.infer<typeof LyricsConversionInputSchema>;

// 2. API request contract
export const LyricsConversionRequestSchema = LyricsConversionInputSchema.extend({
  provider: z.enum(['cloud', 'local']),
  model: z.string().trim().min(1, 'AI model is required'),
});

export type LyricsConversionRequest = z.infer<typeof LyricsConversionRequestSchema>;

// 2. Normalized AI output contract
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

// 3. Version 4 chord schema
export const ChordSchema = z.object({
  id: z.string().or(z.number()).optional(),
  root: z.string(),
  nashville: z.string().optional(),
  quality: z.string().optional(),
  position: z.number(),
  bass: z.string().optional(),
});

// 4. Version 4 line schema
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

// 5. Version 4 section schema
export const SectionSchema = z.object({
  id: z.number(),
  type: z.enum(sectionTypes),
  label: z.string(),
  repeat: z.number().default(1),
  lines: z.array(LineSchema),
});

// 6. Final Version 4 document schema
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

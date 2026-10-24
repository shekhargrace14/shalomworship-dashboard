import { NormalizedAIOutput } from '../lyrics-schema';

export interface ParsedInputLine {
  sectionIndex: number;
  lineIndex: number;
  romanizedText: string;
}

export interface LyricsConversionInput {
  parsedLines: ParsedInputLine[];
  sourceLanguage: string;
  nativeLanguage: string;
  nativeScript: string;
}

export interface LyricsAIProvider {
  readonly providerName: string;
  readonly modelName: string;
  convertLyrics(input: LyricsConversionInput): Promise<NormalizedAIOutput>;
}

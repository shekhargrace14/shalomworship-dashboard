import { NextRequest, NextResponse } from 'next/server';
import { LyricsConversionRequestSchema } from '@/lib/ai/lyrics-schema';
import { convertLyricsService } from '@/lib/ai/convert-lyrics';

export async function POST(req: NextRequest) {
  let rawBody: unknown;

  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_JSON',
          message: 'Request body must contain valid JSON.',
        },
      },
      { status: 400 },
    );
  }

  const parseResult = LyricsConversionRequestSchema.safeParse(rawBody);

  if (!parseResult.success) {
    return NextResponse.json(
      {
        error: {
          code: 'INVALID_REQUEST',
          message: 'Validation failed.',
          details: parseResult.error.format(),
        },
      },
      { status: 400 },
    );
  }

  try {
    const version4Data = await convertLyricsService(parseResult.data);

    return NextResponse.json(version4Data, { status: 200 });
  } catch (error: any) {
    console.error('Convert lyrics error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'CONVERSION_FAILED',
          message: error.message || 'Lyrics conversion failed. Please try again.',
        },
      },
      { status: 500 },
    );
  }
}

// app/api/song/[id]/credits/route.ts

import { NextResponse } from 'next/server';
import { CreditRole } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type CreditInput = {
  channelId: string;
  role: CreditRole;
};

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: songId } = await params;

    console.log(songId, 'route songID');

    if (!songId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Song ID is missing',
        },
        { status: 400 },
      );
    }

    const body = await request.json();
    const credits = body.credits as CreditInput[];

    console.log(credits, 'route-Credits');

    if (!Array.isArray(credits)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Credits must be an array',
        },
        { status: 400 },
      );
    }

    const song = await prisma.song.findUnique({
      where: {
        id: songId,
      },
      select: {
        id: true,
      },
    });

    if (!song) {
      return NextResponse.json(
        {
          success: false,
          message: 'Song not found',
        },
        { status: 404 },
      );
    }

    // Remove old credits for this song.
    await prisma.songCredit.deleteMany({
      where: {
        songId,
      },
    });

    // Do not call createMany with an empty array.
    if (credits.length > 0) {
      await prisma.songCredit.createMany({
        data: credits.map((credit) => ({
          songId,
          channelId: credit.channelId,
          role: credit.role,
        })),
      });
    }

    const savedCredits = await prisma.songCredit.findMany({
      where: {
        songId,
      },
      include: {
        channel: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // This return was missing.
    return NextResponse.json(
      {
        success: true,
        data: savedCredits,
        message: 'Credits saved successfully',
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error('SAVE CREDITS ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to save credits',
      },
      {
        status: 500,
      },
    );
  }
}

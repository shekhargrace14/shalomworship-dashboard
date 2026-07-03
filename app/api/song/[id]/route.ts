import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { success } from 'zod';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // console.log("ID:", id)

    const song = await prisma.song.findUnique({
      where: {
        id,
      },
      include: {
        // genre: true,
        // category: true,
        // scripture: true,
        // album: true,
        // credits: true,
        credits: {
          include: {
            channel: true,
          },
        },
      },
    });
    console.log('SONG:', song);

    return NextResponse.json({
      song,
      success: true,
    });
  } catch (error) {
    console.error('FULL ERROR:', error);
    throw error;
  }
}
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.$transaction([
      prisma.songCredit.deleteMany({
        where: { songId: id },
      }),
      prisma.songGenre.deleteMany({
        where: { songId: id },
      }),
      prisma.songCategory.deleteMany({
        where: { songId: id },
      }),
      prisma.songScripture.deleteMany({
        where: { songId: id },
      }),
      prisma.songAlbum.deleteMany({
        where: { songId: id },
      }),
      prisma.seasonSong.deleteMany({
        where: { songId: id },
      }),

      prisma.song.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hard delete song failed:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete song" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const body = await req.json();

    const {
      credits,

      id: _id,
      createdAt,
      updatedAt,
      view,
      like,

      ...allowedData
    } = body;

    // Update normal song fields
    const song = await prisma.song.update({
      where: {
        id,
      },
      data: allowedData,
    });

    // Update credits relation
    if (credits) {
      await prisma.songCredit.deleteMany({
        where: {
          songId: id,
        },
      });

      if (credits.length > 0) {
        await prisma.songCredit.createMany({
          data: credits.map((credit: any) => ({
            songId: id,
            artistId: credit.artistId,
            department: credit.department,
            role: credit.role,
          })),
        });
      }
    }

    // Return updated song with credits
    const updatedSong = await prisma.song.findUnique({
      where: {
        id,
      },
      include: {
        credits: {
          include: {
            channel: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Changes Saved',
        song: updatedSong,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error('PATCH SONG ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to Save Changes',
      },
      {
        status: 500,
      },
    );
  }
}

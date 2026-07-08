import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { success } from 'zod';
import getSingleChannelController from './controller';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  return getSingleChannelController(req, context);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const [songCount, albumCount, eventCount, playlistCount, seasonCount] = await Promise.all([
      prisma.song.count({ where: { channelId: id } }),
      prisma.album.count({ where: { channelId: id } }),
      prisma.event.count({ where: { channelId: id } }),
      prisma.playlist.count({ where: { channelId: id } }),
      prisma.season.count({ where: { channelId: id } }),
    ]);

    if (songCount || albumCount || eventCount || playlistCount || seasonCount) {
      return NextResponse.json(
        {
          success: false,
          message: 'This channel has songs, albums, events, playlists, or seasons. Remove or transfer them before deleting the channel.',
        },
        { status: 409 },
      );
    }

    await prisma.$transaction([
      prisma.songCredit.deleteMany({ where: { channelId: id } }),
      prisma.eventCredit.deleteMany({ where: { channelId: id } }),
      prisma.channelFollower.deleteMany({ where: { channelId: id } }),
      prisma.channelTeam.deleteMany({ where: { channelId: id } }),

      prisma.channel.delete({
        where: { id },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Channel deleted successfully',
    });
  } catch (error) {
    console.error('Hard delete channel failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete channel',
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updatedChannel = await prisma.channel.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Changes Saved',
        channel: updatedChannel,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    console.error('PATCH CHANNEL ERROR:', error);

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

import { NextResponse } from 'next/server';
import { createChannelSongService, getChannelSongsService } from './service';
import { success } from 'zod';

export async function getChannelSongsController({ params }: { params: Promise<{ channelId: string }> }) {
  try {
    const { channelId } = await params;
    const channelSong = await getChannelSongsService(channelId);

    return NextResponse.json(
      {
        success: true,
        message: ' success channel songs',
        data: channelSong,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      {
        success: false,
        message: 'fail',
      },
      {
        status: 500,
      },
    );
  }
}

export async function createChannelSongController(req: Request) {
  try {
    const body = await req.json();
    const song = await createChannelSongService(body);
    return NextResponse.json(
      {
        success: true,
        message: 'Song Created',
        data: song,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error('CREATE SONG ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create song',
      },
      {
        status: 500,
      },
    );
  }
}

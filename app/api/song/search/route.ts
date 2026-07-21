import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      where: {
        status: 'PUBLISH', // or whatever your published status is
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        status: true,
        searchVariant: true,
        channel: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    const result = songs.map((song) => ({
      id: song.id,
      title: song.title.trim(),
      slug: song.slug,
      image: song.image,
      status: song.status,
      channel: song.channel?.title.trim() ?? '',
      searchVariant: song.searchVariant.join(' '),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ message: 'Failed to load songs.' }, { status: 500 });
  }
}

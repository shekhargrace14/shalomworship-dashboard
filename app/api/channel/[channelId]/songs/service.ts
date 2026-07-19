import { prisma } from '@/lib/prisma';

import { StatusType } from '@prisma/client';

export async function getChannelSongsService(channelId: string) {
  return prisma.song.findMany({
    where: {
      channelId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createChannelSongService(body: any) {
  const { view, like, createdAt, updatedAt, ...songData } = body;

  const song = await prisma.song.create({
    data: {
      ...songData,
      status: songData.status || StatusType.DRAFT,
      view: 0,
      like: 0,
    },
  });
  return song;
}

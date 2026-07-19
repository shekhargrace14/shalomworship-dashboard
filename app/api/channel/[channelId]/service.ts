import { prisma } from '@/lib/prisma';
import { channelWithDetails } from '@/types';

export default async function getSingleChannelService(channelId: any) {
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId,
    },
    ...channelWithDetails,
    include: {
      team: {
        include: {
          user: true,
        },
      },
      songs: true,
      songCredits: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          song: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
              status: true,
            },
          },
        },
      },
    },
  });

  return channel;
}

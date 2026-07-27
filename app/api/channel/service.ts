import { prisma } from '@/lib/prisma';
import { getCurrentUserService } from '@/lib/services/auth.service';

export async function getChannelsService(mine: boolean) {
  if (mine) {
    const user = await getCurrentUserService();

    const teams = await prisma.channelTeam.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
      include: {
        channel: true,
      },
    });

    return teams.map((team) => ({
      ...team.channel,
      role: team.role,
    }));
  }
  const channel = prisma.channel.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return channel;
}

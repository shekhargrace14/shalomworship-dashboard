import { channel, Prisma, song } from '@prisma/client';

// export type ChannelWithSongs = channel & {
//   songs: song[];
// };

export type ChannelWithSongs = Prisma.channelGetPayload<{
  include: {
    songs: true;
    songCredits: {
      include: {
        song: true;
      };
    };
  };
}>;

export type SongWithDetails = Prisma.songGetPayload<{
  include: {
    channels: true;

    category: {
      include: {
        category: true;
      };
    };

    genre: {
      include?: {
        genre: true;
      };
    };

    credits: {
      include: {
        channel: true;
      };
    };

    album: true;
    scripture: true;
  };
}>;

export const channelWithDetails = Prisma.validator<Prisma.channelDefaultArgs>()({
  include: {
    team: {
      include: {
        user: true,
      },
    },

    songs: true,

    songCredits: {
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

export type ChannelWithDetails = Prisma.channelGetPayload<typeof channelWithDetails>;

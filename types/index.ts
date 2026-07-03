import { channel, song } from "@prisma/client";

export type ChannelWithSongs = channel & {
  songs: song[];
};
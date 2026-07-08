import { channel } from '@prisma/client';
import { create } from 'zustand';

interface ChannelsStore {
  channels: channel[];
  set: (vale: channel[]) => void;
}

export const useChannelsStore = create<ChannelsStore>((set) => ({
  channels: [],
  set: (value) => set({ channels: value }),
}));

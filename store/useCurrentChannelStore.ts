import { ChannelWithDetails, ChannelWithSongs } from '@/types';
import { create } from 'zustand';

interface ChannelStore {
  channel: ChannelWithDetails | null;
  setCurrentChannel: (vale: ChannelWithDetails | null) => void;
}

export const useCurrentChannelStore = create<ChannelStore>((set) => ({
  channel: null,
  setCurrentChannel: (value) => set({ channel: value }),
}));

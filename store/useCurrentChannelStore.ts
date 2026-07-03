import { ChannelWithSongs } from "@/types";
import { create } from "zustand";



interface ChannelStore {
    channel: ChannelWithSongs | null;
    setCurrentChannel: (vale: ChannelWithSongs | null) => void
}

export const useCurrentChannelStore = create<ChannelStore>((set)=>({
    channel: null ,
    setCurrentChannel: (value) => set({channel: value}),
}))
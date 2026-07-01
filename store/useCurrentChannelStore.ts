import { channel } from "@prisma/client";
import { number } from "zod";
import { create } from "zustand";

interface ChannelStore {
    channel: channel | null;
    setCurrentChannel: (vale: channel | null) => void
}

export const useCurrentChannelStore = create<ChannelStore>((set)=>({
    channel: null ,
    setCurrentChannel: (value) => set({channel: value}),
}))
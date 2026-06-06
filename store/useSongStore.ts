import { create } from "zustand";

interface SongStore {
  key: string;
  setKey: (value: string) => void;
}

export const useSongStore = create<SongStore>((set) => ({
  key: "",
  setKey: (value) => set({ key: value }),
}));    
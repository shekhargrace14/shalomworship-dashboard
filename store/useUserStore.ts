import { user } from '@prisma/client';
import { create } from 'zustand';

interface UserStore {
  user: user | null;
  setUser: (value: user | null) => void;
}
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (value) => set({ user: value }),
}));

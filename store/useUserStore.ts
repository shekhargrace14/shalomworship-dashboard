// import { user } from '@prisma/client';
import { User } from '@/types/user';
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  setUser: (value: User | null) => void;
}
export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (value) => set({ user: value }),
}));

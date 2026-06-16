import { create } from "zustand";

interface UserStore{
    user: {};
    setUser: (value: {}) => void;
}
export const useUserStore = create<UserStore>((set)=>({
    user:{},
    setUser: (value)=> set({user:value}),
}))
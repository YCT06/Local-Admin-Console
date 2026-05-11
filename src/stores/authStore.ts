import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionUser } from '../types/user';

interface AuthState {
  isLoggedIn: boolean;
  user: SessionUser | null;
  token: string | null;
  login: (user: SessionUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      login: (user, token) => set({ isLoggedIn: true, user, token }),
      logout: () => set({ isLoggedIn: false, user: null, token: null }),
    }),
    { name: 'auth' },
  ),
);

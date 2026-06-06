import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-store' },
  ),
);

interface CompareState {
  ids: string[];
  names: Record<string, string>;
  add: (id: string, name: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  ids: [],
  names: {},
  add: (id, name) => {
    const { ids } = get();
    if (ids.length >= 3 || ids.includes(id)) return;
    set((s) => ({ ids: [...s.ids, id], names: { ...s.names, [id]: name } }));
  },
  remove: (id) =>
    set((s) => {
      const names = { ...s.names };
      delete names[id];
      return { ids: s.ids.filter((i) => i !== id), names };
    }),
  clear: () => set({ ids: [], names: {} }),
  has: (id) => get().ids.includes(id),
}));

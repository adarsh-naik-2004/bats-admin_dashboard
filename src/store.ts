import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Store {
    id: number;
    name: string;
    address: string;
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    store?: Store;
}

interface AuthState {
    user: null | User;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    devtools((set) => ({
        user: null,
        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),
    }))
);

interface ThemeState {
    darkMode: boolean;
    toggleDarkMode: () => void;
}
  
export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            darkMode: false,
            toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
        }),
        {
            name: 'theme-storage', // LocalStorage key
        }
    )
);
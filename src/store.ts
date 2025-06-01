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
    isAuthenticated: boolean; // Add this computed property
}

export const useAuthStore = create<AuthState>()(
    devtools((set, get) => ({
        user: null,
        get isAuthenticated() {
            return get().user !== null;
        },
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
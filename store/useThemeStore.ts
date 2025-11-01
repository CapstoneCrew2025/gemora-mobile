import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeState {
  isDarkTheme: boolean;
  setIsDarkTheme: (isDark: boolean) => void;
  loadTheme: () => Promise<void>;
  toggleTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDarkTheme: false,

  setIsDarkTheme: (isDark: boolean) => {
    set({ isDarkTheme: isDark });
    AsyncStorage.setItem('theme', isDark ? 'dark' : 'light');
  },

  loadTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const isDark = savedTheme === 'dark';
      set({ isDarkTheme: isDark });
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  },

  toggleTheme: async () => {
    set((state) => {
      const newTheme = !state.isDarkTheme;
      AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return { isDarkTheme: newTheme };
    });
  },
}));
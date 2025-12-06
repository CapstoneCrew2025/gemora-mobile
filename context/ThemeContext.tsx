import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  card: string;
  header: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  muted: string;
  input: string;
  success: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: '#f3f4f6',
  card: '#ffffff',
  header: '#ecfdf3',
  text: '#111827',
  subtext: '#6b7280',
  border: '#e5e7eb',
  primary: '#10b981',
  muted: '#d1d5db',
  input: '#ffffff',
  success: '#10b981',
};

const darkColors: ThemeColors = {
  background: '#0f172a',
  card: '#111827',
  header: '#0f172a',
  text: '#f8fafc',
  subtext: '#cbd5e1',
  border: '#1f2937',
  primary: '#34d399',
  muted: '#334155',
  input: '#1f2937',
  success: '#34d399',
};

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'app-theme-mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');
  const [isReady, setIsReady] = useState(false);

  // Load persisted theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
          setMode(stored);
        }
      } catch (error) {
        console.warn('Failed to load theme preference', error);
      } finally {
        setIsReady(true);
      }
    };
    loadTheme();
  }, []);

  const setTheme = useCallback(async (nextMode: ThemeMode) => {
    try {
      setMode(nextMode);
      await AsyncStorage.setItem(STORAGE_KEY, nextMode);
    } catch (error) {
      console.warn('Failed to persist theme preference', error);
    }
  }, []);

  const toggleTheme = useCallback(async () => {
    const nextMode: ThemeMode = mode === 'light' ? 'dark' : 'light';
    await setTheme(nextMode);
  }, [mode, setTheme]);

  const theme: Theme = useMemo(() => ({
    mode,
    colors: mode === 'light' ? lightColors : darkColors,
  }), [mode]);

  const value: ThemeContextValue = useMemo(() => ({
    theme,
    isDark: mode === 'dark',
    setTheme,
    toggleTheme,
    isReady,
  }), [theme, mode, setTheme, toggleTheme, isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
};

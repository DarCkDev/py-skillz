import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';

type ThemeMode = 'light' | 'dark-highcontrast';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme: ThemeMode) => set({ theme }),
    }),
    {
      name: 'pi-skillz-theme',
    }
  )
);

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  
  useEffect(() => {
    const root = window.document.documentElement;
    
    
    root.classList.remove('light', 'dark');
    root.removeAttribute('data-theme');
    
    
    if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.remove('high-contrast');
    } else {
    
      root.classList.add('dark');
      root.classList.add('high-contrast');
    }
  }, [theme]);
  
  return {
    theme,
    setTheme,
    isLight: theme === 'light',
    isDarkHighContrast: theme === 'dark-highcontrast',
    toggleTheme: () => setTheme(theme === 'light' ? 'dark-highcontrast' : 'light')
  };
} 
import { ReactNode, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useAccessibilityStore } from '@/hooks/useAccessibilityStore';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useTheme();
  const { setHighContrast } = useAccessibilityStore();
  
  useEffect(() => {
    setHighContrast(theme === 'dark-highcontrast');
  }, [theme, setHighContrast]);
  
  return <>{children}</>;
} 
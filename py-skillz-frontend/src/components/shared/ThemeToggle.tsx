import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
      aria-label={t('accessibility.toggleTheme') as string}
    >
      {theme === 'light' ? 
        <Sun className="h-5 w-5" /> : 
        <Moon className="h-5 w-5" />
      }
    </button>
  );
} 
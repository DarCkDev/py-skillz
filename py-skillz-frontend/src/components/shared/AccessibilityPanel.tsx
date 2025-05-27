import { useTranslation } from 'react-i18next';
import { useAccessibilityStore } from '@/hooks/useAccessibilityStore';
import { useTheme } from '@/hooks/useTheme';
import { Switch } from '@/components/ui/switch';

export function AccessibilityPanel() {
  const { t } = useTranslation();
  const { 
    fontSize, 
    setFontSize, 
    lineHeight, 
    setLineHeight 
  } = useAccessibilityStore();
  
  const { theme, setTheme } = useTheme();
  const isDarkHighContrast = theme === 'dark-highcontrast';

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark-highcontrast' : 'light');
  };

  return (
    <div className="space-y-4">
      
      <div className="flex items-center justify-between bg-muted">
        <label htmlFor="theme-toggle" className="text-sm font-medium">
          {t('accessibility.highContrast')}
        </label>
        <Switch
          id="theme-toggle"
          checked={isDarkHighContrast}
          onCheckedChange={handleThemeToggle}
        />
      </div>

      <div>
        <label htmlFor="font-size" className="text-sm font-medium block mb-2">
          {t('accessibility.fontSize')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`py-1 px-2 text-sm rounded-md transition-colors ${
              fontSize === 'small' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setFontSize('small')}
          >
            {t('accessibility.fontSizeSmall')}
          </button>
          <button
            className={`py-1 px-2 text-sm rounded-md transition-colors ${
              fontSize === 'medium' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setFontSize('medium')}
          >
            {t('accessibility.fontSizeMedium')}
          </button>
          <button
            className={`py-1 px-2 text-sm rounded-md transition-colors ${
              fontSize === 'large' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setFontSize('large')}
          >
            {t('accessibility.fontSizeLarge')}
          </button>
        </div>
      </div>
      
      <div>
        <label htmlFor="line-height" className="text-sm font-medium block mb-2">
          {t('accessibility.lineHeight')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            className={`py-1 px-2 text-sm rounded-md transition-colors ${
              lineHeight === 'small' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setLineHeight('small')}
          >
            {t('accessibility.lineHeightSmall')}
          </button>
          <button
            className={`py-1 px-2 text-sm rounded-md transition-colors ${
              lineHeight === 'medium' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setLineHeight('medium')}
          >
            {t('accessibility.lineHeightMedium')}
          </button>
          <button
            className={`py-1 px-2 text-sm rounded-md transition-colors ${
              lineHeight === 'large' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted hover:bg-muted/80'
            }`}
            onClick={() => setLineHeight('large')}
          >
            {t('accessibility.lineHeightLarge')}
            
          </button>
        </div>
      </div>
    </div>
  );
}

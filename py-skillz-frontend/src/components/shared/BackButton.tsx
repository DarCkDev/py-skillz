import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BackButton() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  
  const currentPath = location.pathname;
  const pathSegments = currentPath.split('/').filter(segment => segment !== '');
  
  
  const canGoBack = pathSegments.length > 0;
  
  
  const handleBack = () => {
    if (pathSegments.length === 0) {
  
      return;
    } else if (pathSegments.length === 1) {
  
      navigate('/');
    } else {
  
      const newPath = '/' + pathSegments.slice(0, -1).join('/');
      navigate(newPath);
    }
  };

  if (!canGoBack) {
    return null;
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4"
      aria-label={String(t('common.back'))}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      {t('common.back')}
    </button>
  );
}

import { ReactNode } from 'react';
import { Header } from '../components/shared/Header';
import { Footer } from '../components/shared/Footer';
import { useAccessibilityStore } from '../hooks/useAccessibilityStore';
import { Outlet, useLocation } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import { useEffect } from 'react';

interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { fontSize, lineHeight } = useAccessibilityStore();
  const { setLoading } = useLoading();
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Clear loading state after a delay
    }, 500); // 500ms delay

    return () => clearTimeout(timer); // Cleanup the timer
  }, [location.pathname, setLoading]);
  
  const getAccessibilityClasses = () => {
    const classes = [];
    
    // Tamaño de fuente
    switch (fontSize) {
      case 'small':
        classes.push('text-sm');
        break;
      case 'medium':
        classes.push('text-base');
        break;
      case 'large':
        classes.push('text-lg');
        break;
      default:
        classes.push('text-base');
    }
    
    // Interlineado
    switch (lineHeight) {
      case 'small':
        classes.push('leading-tight');
        break;
      case 'medium':
        classes.push('leading-normal');
        break;
      case 'large':
        classes.push('leading-relaxed');
        break;
      default:
        classes.push('leading-normal');
    }
    
    return classes.join(' ');
  };

  const renderContent = () => {
    if (children) {
      return children;
    }
    return <Outlet />;
  };

  return (
    <div className={`min-h-screen flex flex-col ${getAccessibilityClasses()}`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 min-h-[calc(100vh-100px)]">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
}

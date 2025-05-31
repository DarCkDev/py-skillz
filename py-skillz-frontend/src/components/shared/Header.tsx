import { useState, useContext } from 'react';
import { Link } from '../ui/link';
import { useTranslation } from 'react-i18next';
import { MenuIcon, X, User, LogOut } from 'lucide-react';
import iconBolivia from '../../../public/bolivia.png';
import iconPy from '../../../public/py.png';
import { AuthContext } from '../../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { t, i18n } = useTranslation();
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated || false;
  const role = auth?.role || '';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    if (auth) {
      auth.logout();
    }
  };

  // Determinar los enlaces de navegación según el rol
  const getNavLinks = () => {
    const links = [];
    
    
    links.push({ to: '/catalog', label: t('nav.catalog') });
    
    
    if (isAuthenticated) {
      links.push({ to: '/my-courses', label: t('nav.myCourses') });
      
      if (role === 'STUDENT') {
        links.push({ to: '/progress', label: t('nav.progress') });
      }
      
      
      if (role === 'TEACHER' || role === 'ADMIN') {
        links.push({ to: '/courses/create', label: t('nav.createCourse') });
        links.push({ to: '/reports', label: t('nav.reports') });
      }
      
      
      if (role === 'ADMIN') {
        links.push({ to: '/admin', label: t('nav.adminPanel') });
        links.push({ to: '/admin/users', label: t('nav.userManagement') });
      }
    } else {
      
      links.push({ to: '/login', label: t('auth.login') });
      links.push({ to: '/register', label: t('auth.register') });
    }
    
    return links;
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            <img src={iconPy} alt="Py" className='w-5 h-5' />
            <span >Pi-</span>
            <span>Skillz</span>
          </Link>
          
          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            

            <ThemeToggle />
            
            <div className="relative ml-4 group text">
              <button className="px-3 pt-2 pb-2 rounded-md hover:bg-primary-foreground/10 transition-colors border border-b-black flex">
                <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' />
                {i18n.language.toUpperCase()}
              </button>
              <div className="absolute right-0 w-40 bg-background border border-border rounded-md shadow-lg hidden group-hover:block z-10 text-primary">
                <button 
                  onClick={() => changeLanguage('es')} 
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex"
                >
                  <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' />
                  Español
                </button>
                <button 
                  onClick={() => changeLanguage('qu')} 
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex"
                >
                  <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' />
                  Quechua
                </button>
                <button 
                  onClick={() => changeLanguage('ay')} 
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex"
                >
                  <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' />
                  Aymara
                </button>
                <button 
                  onClick={() => changeLanguage('gn')} 
                  className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex"
                >
                  <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' />
                  Guaraní

                </button>
              </div>
            </div>
            

            {isAuthenticated && (
              <div className="relative ml-4 group">
                <button className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/30 transition-colors">
                  <User className="h-5 w-5" />
                </button>
                <div className="absolute right-0 w-48 bg-background border border-border rounded-md shadow-lg hidden group-hover:block z-10 text-primary">
                  <div className="py-2">
                    <Link 
                      to="/profile" 
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors block"
                    >
                      {t('nav.profile')}
                    </Link>
                    <div className="border-t border-border my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center text-red-500"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('auth.logout')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>
          
          <button 
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        

        {mobileMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              

              {isAuthenticated && (
                <>
                  <div className="border-t border-primary-foreground/20 my-2 pt-2">
                  
                    <div className="font-semibold mb-2">{t('nav.userOptions')}</div>
                    <Link 
                      to="/profile" 
                      className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.profile')}
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors flex items-center text-red-500"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('auth.logout')}
                    </button>
                  </div>
                </>
              )}
              

              <div className="py-2">
                <ThemeToggle />
              </div>
              

              <div className="mt-4 border-t border-primary-foreground/20 pt-4">
                <div className="font-semibold mb-2">{t('common.language')}</div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      changeLanguage('es');
                      setMobileMenuOpen(false);
                    }} 
                    className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors text-left flex"
                  >
                   <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' /> 
                    Español
                  </button>
                  <button 
                    onClick={() => {
                      changeLanguage('qu');
                      setMobileMenuOpen(false);
                    }} 
                    className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors text-left flex"
                  >
                    <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' /> 
                    Quechua
                  </button>
                  <button 
                    onClick={() => {
                      changeLanguage('ay');
                      setMobileMenuOpen(false);
                    }} 
                    className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors text-left flex"
                  >
                    <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' /> 
                    Aymara
                  </button>
                  <button 
                    onClick={() => {
                      changeLanguage('gn');
                      setMobileMenuOpen(false);
                    }} 
                    className="px-3 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors text-left flex"
                  >
                    <img src={iconBolivia} alt="Bolivia" className='w-5 h-5 mr-2' /> 
                    Guaraní
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

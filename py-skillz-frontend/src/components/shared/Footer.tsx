import { Link } from '../ui/link';
import { useTranslation } from 'react-i18next';
import { AccessibilityPanel } from './AccessibilityPanel';
import iconPy from '../../../public/py.png';
export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Sobre la plataforma */}
          <div>
            <div className="flex items-center">
              <img src={iconPy} alt="Py" className='w-5 h-5' />
              <h3 className="text-lg font-semibold">Pi-Skillz</h3>
            </div>
            <p className="text-muted-foreground">
              Plataforma educativa inclusiva y accesible para todos.
            </p>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.catalog')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Idiomas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('common.languages')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => {}} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Español

                </button>
              </li>
              <li>
                <button 
                  onClick={() => {}} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Quechua

                </button>
              </li>
              <li>
                <button 
                  onClick={() => {}} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Aymara
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {}} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Guaraní
                  
                </button>
              </li>
            </ul>
          </div>

          {/* Columna 4: Accesibilidad */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('accessibility.settings')}</h3>
            <AccessibilityPanel />
          </div>
        </div>

        {/* Derechos de autor */}
        <div className="mt-8 pt-4 border-t border-border text-center text-muted-foreground">
          <p>© {currentYear} Pi-Skillz. {t('common.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}

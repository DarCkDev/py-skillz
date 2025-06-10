import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


import esJSON from './locales/es.json';
import quJSON from './locales/qu.json';
import ayJSON from './locales/ay.json';
import gnJSON from './locales/gn.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: esJSON
      },
      qu: {
        translation: quJSON
      },
      ay: {
        translation: ayJSON
      },
      gn: {
        translation: gnJSON
      }
    },
    fallbackLng: 'es',
    debug: false, 
    saveMissing: false,
    missingKeyHandler: false,

    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    }
  });

export default i18n;

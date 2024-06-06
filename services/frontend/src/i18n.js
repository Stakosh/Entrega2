import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Archivos de traducción
import translationEN from './locales/en.json';
import translationES from './locales/es.json';

// Configuración de i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      es: {
        translation: translationES,
      },
    },
    fallbackLng: 'en', // Idioma por defecto
    debug: true, // Habilitar modo debug
    interpolation: {
      escapeValue: false, // No necesitamos escapar valores HTML
    },
  });

export default i18n;

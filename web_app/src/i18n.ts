import { useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { useSearchParams } from 'react-router-dom';

const I18nInitializer = () => {
  const [searchParams] = useSearchParams();
  const langParam = searchParams.get('lang');
  useEffect(() => {
    // Initialize i18next
    i18n
      .use(HttpBackend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        lng: langParam || 'en',
        fallbackLng: 'en',
        debug: true,
        interpolation: {
          escapeValue: false,
        },
      });
  }, [langParam]);

  return null; // This component doesn't render anything
};

export default I18nInitializer;

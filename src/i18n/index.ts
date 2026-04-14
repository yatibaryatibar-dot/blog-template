import 'server-only'
import { locales, defaultLocale, type Locale, type Dictionary } from './config';

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/../public/locales/en/common.json').then((module) => module.default),
  zh: () => import('@/../public/locales/zh/common.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const loadDictionary = dictionaries[locale] ?? dictionaries[defaultLocale];
  try {
    return await loadDictionary();
  } catch (error) {
    console.error(`Error loading dictionary for locale: ${locale}`, error);
    if (locale !== defaultLocale) {
      const loadDefaultDictionary = dictionaries[defaultLocale];
      try {
        return await loadDefaultDictionary();
      } catch (fallbackError) {
        console.error(`Error loading default dictionary for locale: ${defaultLocale}`, fallbackError);
        return {} as Dictionary;
      }
    }
    return {} as Dictionary;
  }
};

export { locales, defaultLocale, type Locale, type Dictionary }; 

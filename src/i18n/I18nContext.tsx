import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { SupportedLang, LangPreference, TranslationSchema } from './types';
import { en } from './locales/en';
import { ko } from './locales/ko';

const translations: Record<SupportedLang, TranslationSchema> = {
  en,
  ko,
};

interface I18nContextType {
  lang: SupportedLang;
  langPreference: LangPreference;
  setLangPreference: (pref: LangPreference) => void;
  t: TranslationSchema;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'tickten_lang_pref';

function detectSystemLang(): SupportedLang {
  if (typeof navigator === 'undefined') return 'en';

  const langs = navigator.languages || [navigator.language || 'en'];
  for (const l of langs) {
    const lower = l.toLowerCase();
    if (lower.startsWith('ko')) return 'ko';
    if (lower.startsWith('en')) return 'en';
  }
  return 'en'; // default fallback
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [langPreference, setLangPreferenceState] = useState<LangPreference>(() => {
    if (typeof window === 'undefined') return 'auto';
    const saved = localStorage.getItem(STORAGE_KEY) as LangPreference | null;
    if (saved && (saved === 'auto' || saved === 'en' || saved === 'ko')) {
      return saved;
    }
    return 'auto';
  });

  const [systemLang, setSystemLang] = useState<SupportedLang>(detectSystemLang);

  useEffect(() => {
    const handleLangChange = () => {
      setSystemLang(detectSystemLang());
    };
    window.addEventListener('languagechange', handleLangChange);
    return () => window.removeEventListener('languagechange', handleLangChange);
  }, []);

  const setLangPreference = (pref: LangPreference) => {
    setLangPreferenceState(pref);
    localStorage.setItem(STORAGE_KEY, pref);
  };

  const currentLang: SupportedLang = useMemo(() => {
    if (langPreference === 'auto') {
      return systemLang;
    }
    return langPreference;
  }, [langPreference, systemLang]);

  const t = translations[currentLang] || en;

  return (
    <I18nContext.Provider value={{ lang: currentLang, langPreference, setLangPreference, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}

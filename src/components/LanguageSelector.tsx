import React from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { LangPreference } from '../i18n/types';
import { Globe } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'full';
}

export const LanguageSelector: React.FC<Props> = ({ variant = 'compact' }) => {
  const { langPreference, setLangPreference, t } = useI18n();

  const options: { value: LangPreference; label: string }[] = [
    { value: 'auto', label: variant === 'compact' ? 'Auto' : t.common.langAuto },
    { value: 'en', label: 'EN' },
    { value: 'ko', label: 'KO' },
  ];

  return (
    <div className="inline-flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl shadow-inner">
      <Globe size={14} className="text-slate-400 ml-1.5 mr-0.5" />
      <div className="flex items-center gap-0.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLangPreference(opt.value)}
            className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
              langPreference === opt.value
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

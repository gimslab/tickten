import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../i18n/I18nContext';
import type { LangPreference } from '../i18n/types';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'full';
}

export const LanguageSelector: React.FC<Props> = ({ variant = 'compact' }) => {
  const { langPreference, setLangPreference, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const options: { value: LangPreference; label: string; fullLabel: string }[] = [
    { value: 'auto', label: 'Auto', fullLabel: t.common.langAuto },
    { value: 'en', label: 'EN', fullLabel: 'English (EN)' },
    { value: 'ko', label: 'KO', fullLabel: '한국어 (KO)' },
  ];

  const currentOption = options.find((opt) => opt.value === langPreference) || options[0];

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all shadow-sm text-xs font-semibold active:scale-95"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe size={14} className="text-cyan-400" />
        <span>{variant === 'compact' ? currentOption.label : currentOption.fullLabel}</span>
        <ChevronDown
          size={13}
          className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 z-50 min-w-[7.5rem] py-1 bg-slate-900/95 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setLangPreference(opt.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left transition-colors ${
                langPreference === opt.value
                  ? 'text-cyan-300 bg-cyan-950/60 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <span>{opt.fullLabel}</span>
              {langPreference === opt.value && <Check size={13} className="text-cyan-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Smartphone, AlertCircle, ShieldCheck } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  status: 'active' | 'released' | 'unsupported' | 'error';
  isTimerRunning: boolean;
}

export const WakeLockBadge: React.FC<Props> = ({ status, isTimerRunning }) => {
  const { t } = useI18n();

  if (status === 'unsupported') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <AlertCircle size={14} />
        <span>{t.wakeLock.unsupported}</span>
      </div>
    );
  }

  if (isTimerRunning && status === 'active') {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 animate-pulse">
        <ShieldCheck size={14} />
        <span>{t.wakeLock.active}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/50">
      <Smartphone size={14} />
      <span>{t.wakeLock.idle}</span>
    </div>
  );
};

import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  status: 'idle' | 'running' | 'paused';
  onToggle: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<Props> = ({ status, onToggle, onReset }) => {
  const isRunning = status === 'running';

  return (
    <div className="flex items-center justify-center gap-4 w-full max-w-sm px-4 mt-2">
      {/* Reset Button */}
      <button
        type="button"
        onClick={onReset}
        disabled={status === 'idle'}
        className={`flex items-center justify-center w-16 h-16 rounded-2xl border transition-all active:scale-95 shadow-lg ${
          status === 'idle'
            ? 'border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed'
            : 'border-slate-700 bg-slate-800/90 text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
        aria-label="타이머 초기화"
      >
        <RotateCcw size={24} />
      </button>

      {/* Main Start / Pause Button */}
      <button
        type="button"
        onClick={onToggle}
        className={`flex-1 flex items-center justify-center gap-2 h-16 rounded-2xl font-bold text-lg tracking-wide transition-all active:scale-98 shadow-xl ${
          isRunning
            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/25 ring-2 ring-amber-400/50'
            : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/25 ring-2 ring-cyan-400/50'
        }`}
        aria-label={isRunning ? '타이머 일시정지' : '타이머 시작'}
      >
        {isRunning ? (
          <>
            <Pause size={26} className="fill-current" />
            <span>일시정지</span>
          </>
        ) : (
          <>
            <Play size={26} className="fill-current ml-1" />
            <span>{status === 'paused' ? '계속하기' : '시작'}</span>
          </>
        )}
      </button>
    </div>
  );
};

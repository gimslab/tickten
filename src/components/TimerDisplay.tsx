import React from 'react';
import { useI18n } from '../i18n/I18nContext';

interface Props {
  elapsedMs: number;
  intervalSeconds: number;
  isTimerRunning: boolean;
}

export const TimerDisplay: React.FC<Props> = ({
  elapsedMs,
  intervalSeconds,
  isTimerRunning,
}) => {
  const { t } = useI18n();

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((elapsedMs % 1000) / 10);

  // Time elapsed in current interval
  const currentIntervalProgress = (totalSeconds % intervalSeconds) + ((elapsedMs % 1000) / 1000);
  const progressRatio = Math.min(1, currentIntervalProgress / intervalSeconds);
  const remainingInInterval = intervalSeconds - (totalSeconds % intervalSeconds);
  const isBeepFlash = isTimerRunning && totalSeconds > 0 && totalSeconds % intervalSeconds === 0 && (elapsedMs % 1000) < 300;

  // SVG Circle calculation
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const formattedHundredths = String(hundredths).padStart(2, '0');

  return (
    <div className="relative flex flex-col items-center justify-center my-6">
      {/* Circular Progress & Glow Ring */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 300 300">
          {/* Background Track */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Active Progress */}
          <circle
            cx="150"
            cy="150"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-[color,filter] duration-150 ${
              isBeepFlash
                ? 'text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]'
                : 'text-cyan-500 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]'
            }`}
          />
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          {/* Main Time (MM:SS) */}
          <div className="flex items-baseline justify-center">
            <span
              className={`text-5xl sm:text-6xl font-black tracking-tight font-mono transition-colors duration-150 ${
                isBeepFlash ? 'text-cyan-300 scale-105' : 'text-slate-100'
              }`}
            >
              {formattedTime}
            </span>
            <span className="text-xl sm:text-2xl font-mono text-slate-500 ml-1.5 w-8 text-left">
              .{formattedHundredths}
            </span>
          </div>

          {/* Subtext info */}
          <div className="mt-3 flex flex-col items-center">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {totalSeconds === 0 && !isTimerRunning ? (
                t.timerDisplay.ready
              ) : remainingInInterval === intervalSeconds && totalSeconds > 0 ? (
                <span className="text-cyan-400 font-bold text-sm animate-bounce">
                  {t.timerDisplay.reached(totalSeconds)}
                </span>
              ) : (
                <span className="text-slate-300 font-medium text-xs">
                  {t.timerDisplay.nextBeep(remainingInInterval)}
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              {t.timerDisplay.intervalInfo(intervalSeconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

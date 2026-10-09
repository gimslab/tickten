import React, { useState } from 'react';
import { Volume2, VolumeX, Bell, Clock, ChevronDown, ChevronUp, Music, Target, Globe, RotateCcw, Check } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';
import { DEFAULT_SETTINGS } from '../lib/settings';
import { useI18n } from '../i18n/I18nContext';
import { LanguageSelector } from './LanguageSelector';

interface Props {
  intervalSeconds: number;
  onIntervalChange: (sec: number) => void;
  tickEnabled: boolean;
  onTickToggle: (enabled: boolean) => void;
  targetGoalSeconds: number | null;
  onTargetGoalChange: (sec: number | null) => void;
  onResetSettings?: () => void;
}

const INTERVAL_PRESETS = [5, 10, 15, 20, 30, 60];
const GOAL_VALUES: (number | null)[] = [null, 30, 45, 60, 90];

export const SettingsPanel: React.FC<Props> = ({
  intervalSeconds,
  onIntervalChange,
  tickEnabled,
  onTickToggle,
  targetGoalSeconds,
  onTargetGoalChange,
  onResetSettings,
}) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [masterVolume, setMasterVolume] = useState(() => audioEngine.getSettings().masterVolume);
  const [isMuted, setIsMuted] = useState(() => audioEngine.getSettings().isMuted);
  const [justReset, setJustReset] = useState(false);

  const handleResetSettings = () => {
    setMasterVolume(DEFAULT_SETTINGS.masterVolume);
    setIsMuted(DEFAULT_SETTINGS.isMuted);
    onResetSettings?.();
    setJustReset(true);
    setTimeout(() => {
      setJustReset(false);
    }, 1800);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMasterVolume(val);
    audioEngine.setMasterVolume(val);
    if (isMuted && val > 0) {
      setIsMuted(false);
      audioEngine.setMuted(false);
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  };

  const testBeep = async () => {
    await audioEngine.unlock();
    audioEngine.playBeep();
  };

  const testTick = async () => {
    await audioEngine.unlock();
    audioEngine.playTick();
  };

  return (
    <div className="w-full max-w-md mt-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm overflow-hidden shadow-xl">
      {/* Header Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-slate-200 hover:text-white transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-cyan-400" />
          <span>{t.settings.panelTitle}</span>
        </div>
        {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 space-y-5 text-sm">
          {/* 1. Interval Setting */}
          <div className="border-t border-slate-800/80 pt-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Bell size={15} className="text-cyan-400" />
                {t.settings.beepIntervalTitle}
              </span>
              <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                {t.settings.everySec(intervalSeconds)}
              </span>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2.5">
              {INTERVAL_PRESETS.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onIntervalChange(sec)}
                  className={`py-1.5 px-2 rounded-lg font-medium text-xs transition-all active:scale-95 ${
                    intervalSeconds === sec
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {t.settings.secUnit(sec)}
                </button>
              ))}
            </div>

            {/* Fine Adjust Stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onIntervalChange(Math.max(1, intervalSeconds - 5))}
                className="flex-1 py-1 px-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs active:scale-95"
              >
                -5s
              </button>
              <button
                type="button"
                onClick={() => onIntervalChange(Math.max(1, intervalSeconds - 1))}
                className="flex-1 py-1 px-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs active:scale-95"
              >
                -1s
              </button>
              <button
                type="button"
                onClick={() => onIntervalChange(intervalSeconds + 1)}
                className="flex-1 py-1 px-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs active:scale-95"
              >
                +1s
              </button>
              <button
                type="button"
                onClick={() => onIntervalChange(intervalSeconds + 5)}
                className="flex-1 py-1 px-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs active:scale-95"
              >
                +5s
              </button>
            </div>
          </div>

          {/* 2. 1-Second Tick Toggle */}
          <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-300">{t.settings.tickSoundTitle}</div>
              <div className="text-xs text-slate-500 mt-0.5">{t.settings.tickSoundDesc}</div>
            </div>
            <button
              type="button"
              onClick={() => onTickToggle(!tickEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                tickEnabled ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  tickEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 3. Target Goal Setting */}
          <div className="border-t border-slate-800/80 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Target size={15} className="text-emerald-400" />
                {t.settings.targetTimeTitle}
              </span>
              <span className="font-mono text-emerald-400 font-bold text-xs">
                {t.settings.targetSubtext(targetGoalSeconds)}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {GOAL_VALUES.map((val) => {
                const label = val === null ? t.settings.targetUnlimited : t.settings.secUnit(val);
                return (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => onTargetGoalChange(val)}
                    className={`py-1.5 px-2 rounded-lg font-medium text-xs transition-all active:scale-95 ${
                      targetGoalSeconds === val
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Language Selection */}
          <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <Globe size={15} className="text-cyan-400" />
              <span>{t.common.language}</span>
            </div>
            <LanguageSelector variant="compact" />
          </div>

          {/* 5. Sound Test & Volume */}
          <div className="border-t border-slate-800/80 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Music size={15} className="text-slate-400" />
                {t.settings.soundPreviewTitle}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={testTick}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 active:scale-95"
                >
                  {t.settings.tickTest}
                </button>
                <button
                  type="button"
                  onClick={testBeep}
                  className="px-2.5 py-1 text-xs rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 active:scale-95"
                >
                  {t.settings.beepTest}
                </button>
              </div>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMuteToggle}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={isMuted ? t.settings.unmute : t.settings.mute}
              >
                {isMuted || masterVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : masterVolume}
                onChange={handleVolumeChange}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="font-mono text-xs text-slate-400 w-8 text-right">
                {isMuted ? '0%' : `${Math.round(masterVolume * 100)}%`}
              </span>
            </div>
          </div>

          {/* 6. Reset Settings to Defaults */}
          <div className="border-t border-slate-800/80 pt-4 flex items-center justify-end">
            <button
              type="button"
              onClick={handleResetSettings}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-95 border ${
                justReset
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/60 text-slate-300 hover:text-white'
              }`}
            >
              {justReset ? (
                <>
                  <Check size={13} className="text-emerald-400 stroke-[2.5]" />
                  <span>{t.settings.resetSuccess}</span>
                </>
              ) : (
                <>
                  <RotateCcw size={13} className="text-slate-400" />
                  <span>{t.settings.resetDefaults}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

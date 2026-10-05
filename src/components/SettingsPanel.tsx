import React, { useState } from 'react';
import { Volume2, VolumeX, Bell, Clock, ChevronDown, ChevronUp, Music, Target } from 'lucide-react';
import { audioEngine } from '../lib/audioEngine';

interface Props {
  intervalSeconds: number;
  onIntervalChange: (sec: number) => void;
  tickEnabled: boolean;
  onTickToggle: (enabled: boolean) => void;
  targetGoalSeconds: number | null;
  onTargetGoalChange: (sec: number | null) => void;
}

const INTERVAL_PRESETS = [5, 10, 15, 20, 30, 60];
const GOAL_PRESETS: { label: string; value: number | null }[] = [
  { label: '무제한', value: null },
  { label: '30초', value: 30 },
  { label: '45초', value: 45 },
  { label: '60초', value: 60 },
  { label: '90초', value: 90 },
];

export const SettingsPanel: React.FC<Props> = ({
  intervalSeconds,
  onIntervalChange,
  tickEnabled,
  onTickToggle,
  targetGoalSeconds,
  onTargetGoalChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

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
          <span>타이머 및 사운드 설정</span>
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
                비프 알림 주기
              </span>
              <span className="font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                {intervalSeconds}초 마다
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
                  {sec}초
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
                -5초
              </button>
              <button
                type="button"
                onClick={() => onIntervalChange(Math.max(1, intervalSeconds - 1))}
                className="flex-1 py-1 px-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs active:scale-95"
              >
                -1초
              </button>
              <button
                type="button"
                onClick={() => onIntervalChange(intervalSeconds + 1)}
                className="flex-1 py-1 px-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs active:scale-95"
              >
                +1초
              </button>
              <button
                type="button"
                onClick={() => onIntervalChange(intervalSeconds + 5)}
                className="flex-1 py-1 px-2 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs active:scale-95"
              >
                +5초
              </button>
            </div>
          </div>

          {/* 2. 1-Second Tick Toggle */}
          <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-300">1초 단위 미세 틱 소리</div>
              <div className="text-xs text-slate-500 mt-0.5">매 초마다 은은한 소리로 시간 흐름 인지</div>
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
                목표 유지 시간 (선택)
              </span>
              <span className="font-mono text-emerald-400 font-bold text-xs">
                {targetGoalSeconds ? `${targetGoalSeconds}초 (도달 시 2회 비프)` : '무제한'}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {GOAL_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => onTargetGoalChange(preset.value)}
                  className={`py-1.5 px-2 rounded-lg font-medium text-xs transition-all active:scale-95 ${
                    targetGoalSeconds === preset.value
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Sound Test & Volume */}
          <div className="border-t border-slate-800/80 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-300 flex items-center gap-1.5">
                <Music size={15} className="text-slate-400" />
                사운드 미리듣기 & 볼륨
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={testTick}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 active:scale-95"
                >
                  틱 테스트
                </button>
                <button
                  type="button"
                  onClick={testBeep}
                  className="px-2.5 py-1 text-xs rounded bg-cyan-950 text-cyan-300 hover:bg-cyan-900 border border-cyan-800 active:scale-95"
                >
                  비프 테스트 🔔
                </button>
              </div>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMuteToggle}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={isMuted ? '음소거 해제' : '음소거'}
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
        </div>
      )}
    </div>
  );
};

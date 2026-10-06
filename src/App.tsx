import { useState, useRef } from 'react';
import { useTimer } from './hooks/useTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { SettingsPanel } from './components/SettingsPanel';
import { WakeLockBadge } from './components/WakeLockBadge';
import { InstallPrompt } from './components/InstallPrompt';
import { LanguageSelector } from './components/LanguageSelector';
import { AdSenseBanner } from './components/AdSenseBanner';
import { VersionToast } from './components/VersionToast';
import { useI18n } from './i18n/I18nContext';
import { Activity } from 'lucide-react';

export function App() {
  const { t } = useI18n();

  // Stealth 5-tap easter egg state & handler
  const [isVersionToastOpen, setIsVersionToastOpen] = useState(false);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<number | null>(null);

  const handleTitleTap = () => {
    tapCountRef.current += 1;
    if (tapTimerRef.current) {
      window.clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 5) {
      setIsVersionToastOpen(true);
      tapCountRef.current = 0;
    } else {
      tapTimerRef.current = window.setTimeout(() => {
        tapCountRef.current = 0;
      }, 2000);
    }
  };

  const {
    status,
    elapsedMs,
    config,
    wakeLockStatus,
    toggle,
    reset,
    setIntervalSeconds,
    setTickEnabled,
    setTargetGoalSeconds,
  } = useTimer({
    intervalSeconds: 10,
    tickEnabled: true,
    targetGoalSeconds: null,
  });

  const isTimerRunning = status === 'running';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between items-center p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Header */}
      <header className="w-full flex flex-col items-center pt-2 sm:pt-4">
        <div className="w-full flex items-center justify-between mb-2 px-1">
          <div
            className="flex items-center gap-2 select-none cursor-pointer active:opacity-90"
            onClick={handleTitleTap}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleTap();
            }}
            aria-label="TickTen Title"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 text-slate-950 shadow-lg shadow-cyan-500/20">
              <Activity size={22} className="stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {t.common.appTitle}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">{t.common.appSubtitle}</p>
            </div>
          </div>
          <LanguageSelector variant="compact" />
        </div>

        {/* Wake Lock Status Indicator */}
        <div className="mt-1">
          <WakeLockBadge status={wakeLockStatus} isTimerRunning={isTimerRunning} />
        </div>
      </header>

      {/* Main Core: Display & Playback Controls */}
      <main className="w-full flex flex-col items-center justify-center flex-1 my-2">
        <TimerDisplay
          elapsedMs={elapsedMs}
          intervalSeconds={config.intervalSeconds}
          isTimerRunning={isTimerRunning}
        />

        <TimerControls
          status={status}
          onToggle={toggle}
          onReset={reset}
        />

        {/* Install as PWA Prompt */}
        <InstallPrompt />

        {/* Settings Panel */}
        <SettingsPanel
          intervalSeconds={config.intervalSeconds}
          onIntervalChange={setIntervalSeconds}
          tickEnabled={config.tickEnabled}
          onTickToggle={setTickEnabled}
          targetGoalSeconds={config.targetGoalSeconds}
          onTargetGoalChange={setTargetGoalSeconds}
        />

        {/* Google AdSense Banner (단위 광고 슬롯 ID 적용) */}
        <AdSenseBanner slot="2385760186" />
      </main>

      {/* Bottom Footer / Tips */}
      <footer className="w-full text-center text-[12px] text-slate-500 py-3 mt-4 border-t border-slate-900">
        <p>{t.common.footerTip(config.intervalSeconds)}</p>
      </footer>

      {/* Stealth Version Info Toast */}
      <VersionToast
        isOpen={isVersionToastOpen}
        onClose={() => setIsVersionToastOpen(false)}
      />
    </div>
  );
}

export default App;

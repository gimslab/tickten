import { useTimer } from './hooks/useTimer';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { SettingsPanel } from './components/SettingsPanel';
import { WakeLockBadge } from './components/WakeLockBadge';
import { InstallPrompt } from './components/InstallPrompt';
import { LanguageSelector } from './components/LanguageSelector';
import { useI18n } from './i18n/I18nContext';
import { Activity } from 'lucide-react';

export function App() {
  const { t } = useI18n();

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
          <div className="flex items-center gap-2">
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
      </main>

      {/* Bottom Footer / Tips */}
      <footer className="w-full text-center text-[12px] text-slate-500 py-3 mt-4 border-t border-slate-900">
        <p>{t.common.footerTip(config.intervalSeconds)}</p>
      </footer>
    </div>
  );
}

export default App;

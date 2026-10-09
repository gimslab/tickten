import type { TranslationSchema } from '../types';

export const en: TranslationSchema = {
  common: {
    appTitle: 'TickTen',
    appSubtitle: 'Stretching & Workout Interval Timer',
    language: 'Language',
    langAuto: 'Auto (System)',
    langEn: 'English',
    langKo: '한국어',
    footerTip: (intervalSec: number) =>
      `💡 Track time with ${intervalSec}s beeps and 1s ticks without looking at the screen.`,
  },
  wakeLock: {
    unsupported: 'Screen keep-awake unsupported',
    active: 'Screen staying awake',
    idle: 'Screen stays awake on start',
  },
  timerDisplay: {
    ready: 'READY',
    reached: (sec: number) => `🔔 ${sec}s REACHED!`,
    nextBeep: (sec: number) => `Next beep in ${sec}s`,
    intervalInfo: (sec: number) => `Interval: ${sec}s beep`,
  },
  timerControls: {
    start: 'START',
    resume: 'RESUME',
    pause: 'PAUSE',
    reset: 'RESET',
    resetAria: 'Reset timer',
  },
  install: {
    installButton: 'Install App on Phone',
    iosTitle: 'iPhone (iOS) Installation Guide',
    iosDesc: 'In Safari, follow these steps to add the app to your home screen:',
    iosStep1: 'Tap the Share icon at the bottom of Safari',
    iosStep2: "Scroll down and select 'Add to Home Screen'",
    iosStep3: "Tap 'Add' at the top right to finish!",
    confirm: 'Got it',
    fallbackAlert: 'Please select "Add to Home Screen" or "Install" from the browser menu (⋮).',
  },
  settings: {
    panelTitle: 'Timer & Sound Settings',
    beepIntervalTitle: 'Beep Notification Interval',
    everySec: (sec: number) => `Every ${sec}s`,
    secUnit: (sec: number) => `${sec}s`,
    tickSoundTitle: '1-Second Subtle Tick',
    tickSoundDesc: 'Sense time passing with a soft tick each second',
    targetTimeTitle: 'Target Hold Time (Optional)',
    targetUnlimited: 'Unlimited',
    targetSubtext: (sec: number | null) =>
      sec ? `${sec}s (Double beep on reach)` : 'Unlimited',
    soundPreviewTitle: 'Sound Preview & Volume',
    tickTest: 'Tick Test',
    beepTest: 'Beep Test 🔔',
    mute: 'Mute',
    unmute: 'Unmute',
    resetDefaults: 'Reset to Defaults',
    resetSuccess: 'Reset to Defaults Done',
  },
};

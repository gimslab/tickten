export type SupportedLang = 'en' | 'ko';
export type LangPreference = 'auto' | SupportedLang;

export interface TranslationSchema {
  common: {
    appTitle: string;
    appSubtitle: string;
    language: string;
    langAuto: string;
    langEn: string;
    langKo: string;
    footerTip: (intervalSec: number) => string;
  };
  wakeLock: {
    unsupported: string;
    active: string;
    idle: string;
  };
  timerDisplay: {
    ready: string;
    reached: (sec: number) => string;
    nextBeep: (sec: number) => string;
    intervalInfo: (sec: number) => string;
  };
  timerControls: {
    start: string;
    resume: string;
    pause: string;
    reset: string;
    resetAria: string;
  };
  install: {
    installButton: string;
    iosTitle: string;
    iosDesc: string;
    iosStep1: string;
    iosStep2: string;
    iosStep3: string;
    confirm: string;
    fallbackAlert: string;
  };
  settings: {
    panelTitle: string;
    beepIntervalTitle: string;
    everySec: (sec: number) => string;
    secUnit: (sec: number) => string;
    tickSoundTitle: string;
    tickSoundDesc: string;
    targetTimeTitle: string;
    targetUnlimited: string;
    targetSubtext: (sec: number | null) => string;
    soundPreviewTitle: string;
    tickTest: string;
    beepTest: string;
    mute: string;
    unmute: string;
    resetDefaults: string;
    resetSuccess: string;
  };
}

export interface AppSettings {
  intervalSeconds: number;
  tickEnabled: boolean;
  targetGoalSeconds: number | null;
  masterVolume: number;
  isMuted: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  intervalSeconds: 10,
  tickEnabled: true,
  targetGoalSeconds: null,
  masterVolume: 0.8,
  isMuted: false,
};

const STORAGE_KEY = 'tickten_settings';

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { ...DEFAULT_SETTINGS };
    }

    const intervalSeconds =
      typeof parsed.intervalSeconds === 'number' && parsed.intervalSeconds >= 1
        ? parsed.intervalSeconds
        : DEFAULT_SETTINGS.intervalSeconds;

    const tickEnabled =
      typeof parsed.tickEnabled === 'boolean'
        ? parsed.tickEnabled
        : DEFAULT_SETTINGS.tickEnabled;

    const targetGoalSeconds =
      typeof parsed.targetGoalSeconds === 'number' && parsed.targetGoalSeconds > 0
        ? parsed.targetGoalSeconds
        : parsed.targetGoalSeconds === null
        ? null
        : DEFAULT_SETTINGS.targetGoalSeconds;

    const masterVolume =
      typeof parsed.masterVolume === 'number' && parsed.masterVolume >= 0 && parsed.masterVolume <= 1
        ? parsed.masterVolume
        : DEFAULT_SETTINGS.masterVolume;

    const isMuted =
      typeof parsed.isMuted === 'boolean'
        ? parsed.isMuted
        : DEFAULT_SETTINGS.isMuted;

    return {
      intervalSeconds,
      tickEnabled,
      targetGoalSeconds,
      masterVolume,
      isMuted,
    };
  } catch (error) {
    console.warn('Failed to load settings from localStorage:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(partial: Partial<AppSettings>): void {
  if (typeof window === 'undefined') return;

  try {
    const current = loadSettings();
    const updated = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error);
  }
}

export function resetSettings(): AppSettings {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (error) {
      console.warn('Failed to reset settings in localStorage:', error);
    }
  }
  return { ...DEFAULT_SETTINGS };
}

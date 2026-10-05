import React, { useState, useEffect } from 'react';
import { Download, Share, X, Check } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPrompt: React.FC = () => {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone / installed mode
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Listen for Chrome / Android beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android / Chrome native prompt
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // iOS Guide
      setShowIOSGuide(true);
    } else {
      // Fallback guide
      alert(t.install.fallbackAlert);
    }
  };

  // If already running as an installed standalone app, don't show the button
  if (isStandalone || isInstalled) {
    return null;
  }

  return (
    <>
      <div className="w-full max-w-sm mt-3 px-4">
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:bg-slate-800/90 hover:border-cyan-400 active:scale-98 transition-all shadow-md shadow-cyan-950/50 text-xs sm:text-sm font-semibold"
        >
          <Download size={16} className="text-cyan-400 animate-bounce" />
          <span>{t.install.installButton}</span>
        </button>
      </div>

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Share size={18} className="text-cyan-400" />
                {t.install.iosTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.install.iosDesc}
            </p>

            <ol className="text-xs text-slate-300 space-y-2.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">
                  1
                </span>
                <span>
                  {t.install.iosStep1} [ <Share size={13} className="inline mb-0.5 text-cyan-400" /> ]
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">
                  2
                </span>
                <span>
                  {t.install.iosStep2}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">
                  3
                </span>
                <span>
                  {t.install.iosStep3}
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Check size={16} />
              <span>{t.install.confirm}</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

import React, { useState, useEffect } from 'react';
import { Download, Share, X, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallPrompt: React.FC = () => {
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
      alert('브라우저 메뉴(⋮)에서 "홈 화면에 추가" 또는 "앱 설치"를 선택해주세요.');
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
          <span>스마트폰에 앱으로 설치하기</span>
        </button>
      </div>

      {/* iOS Installation Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Share size={18} className="text-cyan-400" />
                아이폰(iOS) 앱 설치 안내
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
              아이폰 Safari에서는 아래 순서로 홈 화면에 앱을 추가할 수 있습니다:
            </p>

            <ol className="text-xs text-slate-300 space-y-2.5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">
                  1
                </span>
                <span>
                  사파리 화면 하단(또는 상단)의 <strong>공유 아이콘 [ <Share size={13} className="inline mb-0.5 text-cyan-400" /> ]</strong> 터치
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">
                  2
                </span>
                <span>
                  메뉴를 아래로 스크롤하여 <strong>'홈 화면에 추가'</strong> 선택
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[11px]">
                  3
                </span>
                <span>
                  우측 상단 <strong>'추가'</strong>를 누르면 설치 완료!
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Check size={16} />
              <span>확인했습니다</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

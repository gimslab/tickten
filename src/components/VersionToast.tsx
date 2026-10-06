import React, { useState, useEffect } from 'react';
import { Copy, Check, X, ShieldCheck } from 'lucide-react';

interface VersionToastProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionToast: React.FC<VersionToastProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    // Auto-close after 6 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 6000);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const versionText = `v${__APP_VERSION__}`;
  const commitText = __COMMIT_HASH__;
  const buildDateText = new Date(__BUILD_TIME__).toLocaleString();

  const handleCopy = async () => {
    const fullInfo = `TickTen ${versionText} (${commitText}) - Built: ${buildDateText}`;
    try {
      await navigator.clipboard.writeText(fullInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is not available
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-2xl p-4 shadow-2xl shadow-cyan-950/50 text-slate-200">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-xs tracking-wider uppercase">
            <ShieldCheck size={16} />
            <span>Deployment Info</span>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-200 p-1 -mr-1 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Version</span>
            <span className="font-mono font-bold text-cyan-300">{versionText}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Commit</span>
            <span className="font-mono text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded text-[11px]">
              {commitText}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Build Time</span>
            <span className="font-mono text-slate-300 text-[11px]">{buildDateText}</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700/60"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-slate-400" />
                <span>Copy info</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

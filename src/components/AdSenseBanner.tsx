import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSenseBannerProps {
  slot?: string;
  client?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export function AdSenseBanner({
  slot,
  client = 'ca-pub-8737481802188771',
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    // Only attempt push if slot is provided and element hasn't already been filled
    if (!slot || !adRef.current) return;

    // Prevent duplicate push error in React StrictMode / re-renders
    if (adRef.current.getAttribute('data-adsbygoogle-status')) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense banner error:', e);
    }
  }, [slot]);

  if (!slot) {
    return null;
  }

  return (
    <div className={`w-full flex justify-center my-4 overflow-hidden min-h-[90px] ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

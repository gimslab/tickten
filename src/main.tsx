import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nContext'

// Log version badge in console and expose global version object
if (typeof window !== 'undefined') {
  window.__TICKTEN_VERSION__ = {
    version: __APP_VERSION__,
  };
  console.log(
    `%c TickTen %cv${__APP_VERSION__} `,
    'background:#06b6d4;color:#020617;font-weight:bold;padding:2px 6px;border-radius:4px 0 0 4px',
    'background:#1e293b;color:#38bdf8;font-weight:bold;padding:2px 6px;border-radius:0 4px 4px 0',
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </StrictMode>,
)

// Register service worker for offline/PWA capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = `${import.meta.env.BASE_URL}sw.js`;
    navigator.serviceWorker.register(swUrl).then((reg) => {
      console.log('SW registered successfully:', reg.scope);
    }).catch((err) => {
      console.warn('SW registration failed:', err);
    });
  });
}



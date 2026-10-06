/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;

interface Window {
  __TICKTEN_VERSION__?: {
    version: string;
    buildTime: string;
  };
}

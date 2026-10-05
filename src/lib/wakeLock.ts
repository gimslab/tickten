/**
 * Screen Wake Lock API Manager for TickTen
 * Keeps screen awake during workout sessions.
 */

type WakeLockStatus = 'active' | 'released' | 'unsupported' | 'error';
type StatusListener = (status: WakeLockStatus) => void;

class WakeLockManager {
  private sentinel: WakeLockSentinel | null = null;
  private shouldBeActive: boolean = false;
  private listeners: Set<StatusListener> = new Set();
  private currentStatus: WakeLockStatus = 'released';

  constructor() {
    if (typeof window !== 'undefined' && 'document' in window) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  }

  public getStatus(): WakeLockStatus {
    if (!this.isSupported()) return 'unsupported';
    return this.currentStatus;
  }

  public subscribe(listener: StatusListener): () => void {
    this.listeners.add(listener);
    listener(this.getStatus());
    return () => this.listeners.delete(listener);
  }

  private notify(status: WakeLockStatus) {
    this.currentStatus = status;
    this.listeners.forEach((listener) => listener(status));
  }

  private handleVisibilityChange = async () => {
    if (this.shouldBeActive && document.visibilityState === 'visible') {
      await this.acquire();
    }
  };

  public async acquire(): Promise<boolean> {
    if (!this.isSupported()) {
      this.notify('unsupported');
      return false;
    }

    this.shouldBeActive = true;
    try {
      if (this.sentinel && !this.sentinel.released) {
        return true;
      }

      this.sentinel = await navigator.wakeLock.request('screen');
      this.sentinel.addEventListener('release', () => {
        if (!this.shouldBeActive) {
          this.notify('released');
        }
      });

      this.notify('active');
      return true;
    } catch (err) {
      console.warn('Screen WakeLock failed to acquire:', err);
      this.notify('error');
      return false;
    }
  }

  public async release(): Promise<void> {
    this.shouldBeActive = false;
    if (this.sentinel) {
      try {
        await this.sentinel.release();
      } catch (err) {
        console.warn('Screen WakeLock release error:', err);
      } finally {
        this.sentinel = null;
        this.notify('released');
      }
    } else {
      this.notify('released');
    }
  }
}

export const wakeLockManager = new WakeLockManager();

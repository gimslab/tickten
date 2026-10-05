import { useState, useRef, useEffect, useCallback } from 'react';
import { audioEngine } from '../lib/audioEngine';
import { wakeLockManager } from '../lib/wakeLock';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerConfig {
  intervalSeconds: number; // Major beep interval (default 10)
  tickEnabled: boolean;     // 1s subtle tick sound
  targetGoalSeconds: number | null; // e.g. 30s, 60s, or null for unlimited
}

export function useTimer(initialConfig: Partial<TimerConfig> = {}) {
  const [config, setConfig] = useState<TimerConfig>({
    intervalSeconds: initialConfig.intervalSeconds ?? 10,
    tickEnabled: initialConfig.tickEnabled ?? true,
    targetGoalSeconds: initialConfig.targetGoalSeconds ?? null,
  });

  const [status, setStatus] = useState<TimerStatus>('idle');
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [wakeLockStatus, setWakeLockStatus] = useState(wakeLockManager.getStatus());

  // Refs for tracking timing accurately without drift
  const startTimeRef = useRef<number>(0);
  const accumulatedMsRef = useRef<number>(0);
  const timerLoopRef = useRef<number | null>(null);
  const lastTriggeredSecondRef = useRef<number>(0);

  // Keep latest config in ref for the animation loop
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Subscribe to wake lock changes
  useEffect(() => {
    const unsubscribe = wakeLockManager.subscribe(setWakeLockStatus);
    return () => unsubscribe();
  }, []);

  const triggerAudioCues = useCallback((fromSec: number, toSec: number) => {
    const { intervalSeconds, tickEnabled, targetGoalSeconds } = configRef.current;

    for (let sec = fromSec + 1; sec <= toSec; sec++) {
      if (sec <= 0) continue;

      const isGoal = targetGoalSeconds !== null && sec === targetGoalSeconds;
      const isInterval = sec % intervalSeconds === 0;

      if (isGoal) {
        audioEngine.playDoubleBeep();
      } else if (isInterval) {
        audioEngine.playBeep();
      } else if (tickEnabled) {
        audioEngine.playTick();
      }
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (timerLoopRef.current !== null) {
      cancelAnimationFrame(timerLoopRef.current);
      timerLoopRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    stopLoop();

    const loop = (currentTime: number) => {
      const delta = currentTime - startTimeRef.current;
      const currentTotalMs = accumulatedMsRef.current + delta;
      setElapsedMs(currentTotalMs);

      const currentSecond = Math.floor(currentTotalMs / 1000);
      if (currentSecond > lastTriggeredSecondRef.current) {
        triggerAudioCues(lastTriggeredSecondRef.current, currentSecond);
        lastTriggeredSecondRef.current = currentSecond;
      }

      timerLoopRef.current = requestAnimationFrame(loop);
    };

    timerLoopRef.current = requestAnimationFrame(loop);
  }, [stopLoop, triggerAudioCues]);

  const start = useCallback(async () => {
    await audioEngine.unlock();
    await wakeLockManager.acquire();

    startTimeRef.current = performance.now();
    setStatus('running');
    startLoop();
  }, [startLoop]);

  const pause = useCallback(async () => {
    if (status !== 'running') return;
    stopLoop();

    const delta = performance.now() - startTimeRef.current;
    accumulatedMsRef.current += delta;
    setElapsedMs(accumulatedMsRef.current);

    setStatus('paused');
    await wakeLockManager.release();
  }, [status, stopLoop]);

  const reset = useCallback(async () => {
    stopLoop();
    accumulatedMsRef.current = 0;
    lastTriggeredSecondRef.current = 0;
    setElapsedMs(0);
    setStatus('idle');
    await wakeLockManager.release();
  }, [stopLoop]);

  const toggle = useCallback(() => {
    if (status === 'running') {
      pause();
    } else {
      start();
    }
  }, [status, pause, start]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopLoop();
      wakeLockManager.release();
    };
  }, [stopLoop]);

  const setIntervalSeconds = useCallback((sec: number) => {
    setConfig((prev) => ({ ...prev, intervalSeconds: Math.max(1, sec) }));
  }, []);

  const setTickEnabled = useCallback((enabled: boolean) => {
    setConfig((prev) => ({ ...prev, tickEnabled: enabled }));
  }, []);

  const setTargetGoalSeconds = useCallback((target: number | null) => {
    setConfig((prev) => ({ ...prev, targetGoalSeconds: target }));
  }, []);

  return {
    status,
    elapsedMs,
    currentSecond: Math.floor(elapsedMs / 1000),
    config,
    wakeLockStatus,
    start,
    pause,
    reset,
    toggle,
    setIntervalSeconds,
    setTickEnabled,
    setTargetGoalSeconds,
  };
}

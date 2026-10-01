'use client';

import { useSyncExternalStore } from 'react';

export type WebGLSupport = 'unknown' | 'supported' | 'unsupported';

/**
 * Detect WebGL support.
 *
 * Read through `useSyncExternalStore` because the answer differs between
 * server and client: the server reports `unknown`, the client resolves it
 * after hydration without a cascading render or a hydration mismatch.
 */
export function useWebGLSupport(): WebGLSupport {
  return useSyncExternalStore(
    subscribeToNothing,
    getWebGLSupport,
    getWebGLSnapshotOnServer,
  );
}

function subscribeToNothing(): () => void {
  return () => {};
}

function getWebGLSupport(): WebGLSupport {
  return detectWebGLSupport() ? 'supported' : 'unsupported';
}

function getWebGLSnapshotOnServer(): WebGLSupport {
  return 'unknown';
}

export function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');

    return Boolean(
      canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl'),
    );
  } catch {
    return false;
  }
}

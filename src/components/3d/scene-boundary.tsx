'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type SceneBoundaryProps = {
  children: ReactNode;
  /** Rendered when the scene throws (unsupported GPU, driver crash, ...). */
  fallback: ReactNode;
};

type SceneBoundaryState = {
  failed: boolean;
};

/**
 * Catches runtime failures of the 3D scene.
 *
 * A broken WebGL context must never take the whole configurator down: the
 * stage degrades to the editorial reference image instead.
 */
export class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  override state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('A cena 3D falhou:', error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.failed) return this.props.fallback;

    return this.props.children;
  }
}

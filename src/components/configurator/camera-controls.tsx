'use client';

import { Move3d } from 'lucide-react';

import { cameraViews } from '@/config/configurator';

/**
 * Preset camera controls. Disabled on purpose: they become functional with the
 * 3D scene in Phase 4. Kept visible so the final layout is already clear.
 */
export function CameraControls() {
  return (
    <section
      aria-labelledby="camera-title"
      className="rounded-lg border border-line bg-ink-900/50 px-5 py-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Move3d className="size-4 text-fog-500" aria-hidden="true" />
        <h2
          id="camera-title"
          className="text-[0.6875rem] font-bold tracking-[0.18em] text-fog-300 uppercase"
        >
          Câmara
        </h2>

        <div className="ml-auto flex flex-wrap gap-1.5">
          {cameraViews.map((view) => (
            <button
              key={view.id}
              type="button"
              disabled
              aria-disabled="true"
              title="Disponível na Fase 4, com a cena 3D"
              className="rounded-xs border border-line px-2.5 py-1.5 text-xs font-medium text-fog-500 transition-colors duration-200 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 hover:enabled:border-line-strong hover:enabled:text-fog-200"
            >
              {view.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fog-500">
        Rotação, zoom e vistas predefinidas (frontal, lateral, traseira e superior) ficam
        ativos com a cena 3D.
      </p>
    </section>
  );
}

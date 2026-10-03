'use client';

import { Move3d, RotateCw } from 'lucide-react';

import { cameraViews } from '@/config/configurator';
import { useBikeStore } from '@/store/bike-store';
import { cn } from '@/lib/utils';

/**
 * Preset camera controls.
 *
 * Wired to the store: the 3D scene reads `camera.view` and `camera.autoRotate`
 * and moves the camera accordingly.
 */
export function CameraControls() {
  const view = useBikeStore((state) => state.camera.view);
  const autoRotate = useBikeStore((state) => state.camera.autoRotate);
  const setCameraView = useBikeStore((state) => state.setCameraView);
  const toggleAutoRotate = useBikeStore((state) => state.toggleAutoRotate);

  return (
    <section
      aria-labelledby="camera-title"
      className="rounded-lg border border-line bg-ink-900/50 px-5 py-4"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Move3d className="size-4 text-fog-500" aria-hidden="true" />
        <h2
          id="camera-title"
          className="text-[0.6875rem] font-bold tracking-[0.18em] text-fog-300 uppercase"
        >
          Câmara
        </h2>

        <div
          className="flex w-full flex-wrap gap-1.5 sm:ml-auto sm:w-auto"
          role="group"
          aria-label="Vistas predefinidas"
        >
          {cameraViews.map((preset) => {
            const active = view === preset.id;

            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={active}
                onClick={() => setCameraView(preset.id)}
                className={cn(
                  // A finger needs a real target; the desktop bar stays compact
                  // because the label, not the padding, sets the width.
                  'inline-flex min-h-11 items-center rounded-xs border px-3 text-xs font-medium transition-colors duration-200',
                  active
                    ? 'border-lime-400/50 bg-lime-400/12 text-lime-300'
                    : 'border-line text-fog-400 hover:border-line-strong hover:text-fog-100',
                )}
              >
                {preset.label}
              </button>
            );
          })}

          <button
            type="button"
            aria-pressed={autoRotate}
            onClick={toggleAutoRotate}
            className={cn(
              'inline-flex min-h-11 items-center gap-1.5 rounded-xs border px-3 text-xs font-medium transition-colors duration-200',
              autoRotate
                ? 'border-lime-400/50 bg-lime-400/12 text-lime-300'
                : 'border-line text-fog-400 hover:border-line-strong hover:text-fog-100',
            )}
          >
            <RotateCw className="size-3.5" aria-hidden="true" />
            Rodar
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-fog-500">
        Rode com o ponteiro ou com um dedo, aproxime com a roda ou com dois dedos. A
        bicicleta mantém-se centrada em qualquer vista.
      </p>
    </section>
  );
}

'use client';

import { useState } from 'react';
import { StageCanvas } from '@/components/3d/stage-canvas';
import { Bike2DViewer } from '@/components/2d/bike-2d-viewer';
import { Badge } from '@/components/ui/badge';
import { Layers, Box } from 'lucide-react';

const cornerClass = 'pointer-events-none absolute size-5 border-lime-400/40 opacity-70';

/**
 * The bike stage.
 *
 * Defaults to the crisp, responsive 2D layered studio viewer with instant
 * component updates, with an optional toggle to the 3D procedural WebGL scene.
 */
export function StagePanel() {
  const [visualMode, setVisualMode] = useState<'2d' | '3d'>('2d');

  return (
    <section
      aria-labelledby="stage-title"
      className="relative overflow-hidden rounded-lg border border-line bg-ink-950 shadow-2xl"
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        {/* Main Stage: 2D Studio or 3D WebGL */}
        {visualMode === '2d' ? (
          <Bike2DViewer />
        ) : (
          <StageCanvas />
        )}

        {/* Viewfinder Grid Overlay */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Framing Corner Markers */}
        <span aria-hidden="true" className={`${cornerClass} top-4 left-4 border-t border-l`} />
        <span aria-hidden="true" className={`${cornerClass} top-4 right-4 border-t border-r`} />
        <span aria-hidden="true" className={`${cornerClass} bottom-4 left-4 border-b border-l`} />
        <span aria-hidden="true" className={`${cornerClass} bottom-4 right-4 border-b border-r`} />

        {/* Mode Switcher: 2D Studio vs 3D */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-1 rounded-lg border border-line bg-ink-950/90 p-1 backdrop-blur-md shadow-lg">
          <button
            type="button"
            onClick={() => setVisualMode('2d')}
            className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-medium transition-all ${
              visualMode === '2d'
                ? 'bg-lime-400/20 text-lime-300 border border-lime-400/40 shadow-sm'
                : 'text-fog-400 hover:text-fog-100 hover:bg-ink-900/60'
            }`}
          >
            <Layers className="size-3.5" />
            <span>Estúdio 2D</span>
          </button>
          <button
            type="button"
            onClick={() => setVisualMode('3d')}
            className={`flex items-center gap-1.5 rounded-xs px-3 py-1.5 text-xs font-medium transition-all ${
              visualMode === '3d'
                ? 'bg-lime-400/20 text-lime-300 border border-lime-400/40 shadow-sm'
                : 'text-fog-400 hover:text-fog-100 hover:bg-ink-900/60'
            }`}
          >
            <Box className="size-3.5" />
            <span>Modelo 3D</span>
          </button>
        </div>

        {/* Badge in top-left */}
        <div className="pointer-events-none absolute top-4 left-4 z-20 flex items-center gap-2">
          <Badge variant="accent">
            {visualMode === '2d' ? 'Visualização 2D Real' : 'Cena 3D WebGL'}
          </Badge>
        </div>
      </div>
    </section>
  );
}

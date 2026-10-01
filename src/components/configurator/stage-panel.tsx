import Image from 'next/image';

import { Badge } from '@/components/ui/badge';

const cornerClass =
  'pointer-events-none absolute size-5 border-lime-400/40 opacity-70';

/**
 * Placeholder for the interactive 3D stage.
 *
 * Phase 1 ships the layout, framing and visual reference only. The WebGL scene
 * (Phase 4) and the interchangeable parts (Phase 5) replace this panel.
 */
export function StagePanel() {
  return (
    <section
      aria-labelledby="stage-title"
      className="relative overflow-hidden rounded-lg border border-line bg-ink-900"
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src="/images/bike-stage.webp"
          alt="Bicicleta de estrada em carbono em estúdio, vista lateral"
          fill
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-ink-950/45"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        <span aria-hidden="true" className={`${cornerClass} top-4 left-4 border-t border-l`} />
        <span aria-hidden="true" className={`${cornerClass} top-4 right-4 border-t border-r`} />
        <span aria-hidden="true" className={`${cornerClass} bottom-4 left-4 border-b border-l`} />
        <span aria-hidden="true" className={`${cornerClass} bottom-4 right-4 border-b border-r`} />

        <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2">
          <Badge variant="accent">Referência visual</Badge>
        </div>

        <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="stage-title"
              className="text-[0.8125rem] font-bold tracking-[0.18em] text-fog-100 uppercase"
            >
              Cena 3D
            </h2>
            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-fog-400">
              A bicicleta interactiva entra na Fase 4, com geometria própria e modelos GLB
              opcionais.
            </p>
          </div>
          <p className="num text-[0.6875rem] tracking-[0.16em] text-fog-500 uppercase">
            Fase 4
          </p>
        </div>
      </div>
    </section>
  );
}

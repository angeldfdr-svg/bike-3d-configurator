import { StageCanvas } from '@/components/3d/stage-canvas';
import { Badge } from '@/components/ui/badge';

const cornerClass = 'pointer-events-none absolute size-5 border-lime-400/40 opacity-70';

/**
 * The 3D stage.
 *
 * The canvas owns the scene; this panel owns the framing, the viewfinder marks
 * and the labels around it.
 */
export function StagePanel() {
  return (
    <section
      aria-labelledby="stage-title"
      className="relative overflow-hidden rounded-lg border border-line bg-ink-950"
    >
      <div className="relative aspect-[16/10] w-full">
        <StageCanvas />

        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        <span aria-hidden="true" className={`${cornerClass} top-4 left-4 border-t border-l`} />
        <span aria-hidden="true" className={`${cornerClass} top-4 right-4 border-t border-r`} />
        <span aria-hidden="true" className={`${cornerClass} bottom-4 left-4 border-b border-l`} />
        <span aria-hidden="true" className={`${cornerClass} bottom-4 right-4 border-b border-r`} />

        <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2">
          <Badge variant="accent">Vista 3D</Badge>
        </div>

        <div className="pointer-events-none absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="stage-title"
              className="text-[0.8125rem] font-bold tracking-[0.18em] text-fog-100 uppercase"
            >
              Cena 3D
            </h2>
            <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-fog-400">
              Arraste para rodar, use a roda do rato para aproximar. Cada
              componente escolhido muda a peça desenhada na cena.
            </p>
          </div>
          <p className="num text-[0.6875rem] tracking-[0.16em] text-fog-500 uppercase">
            Procedural · intercambiável
          </p>
        </div>
      </div>
    </section>
  );
}

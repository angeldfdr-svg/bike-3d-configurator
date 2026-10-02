import { Check } from 'lucide-react';

const phases = [
  { phase: 1, label: 'Arquitetura e interface', done: true },
  { phase: 2, label: 'Catálogo de componentes', done: true },
  { phase: 3, label: 'Estado global (Zustand)', done: true },
  { phase: 4, label: 'Cena 3D (React Three Fiber)', done: true },
  { phase: 5, label: 'Peças 3D intercambiáveis', done: true },
  { phase: 6, label: 'Preço e peso em tempo real', done: true },
  { phase: 7, label: 'Motor de compatibilidade', done: false },
] as const;

/** Transparent progress view of the build plan inside the configurator. */
export function RoadmapPanel() {
  return (
    <section
      aria-labelledby="roadmap-title"
      className="rounded-lg border border-line bg-ink-900/50 px-5 py-4"
    >
      <h2
        id="roadmap-title"
        className="text-[0.6875rem] font-bold tracking-[0.18em] text-fog-300 uppercase"
      >
        Estado do projeto
      </h2>

      <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {phases.map((item) => (
          <li key={item.phase} className="flex items-center gap-3 text-xs">
            <span
              aria-hidden="true"
              className={
                item.done
                  ? 'flex size-4 shrink-0 items-center justify-center rounded-full bg-lime-400 text-ink-950'
                  : 'flex size-4 shrink-0 items-center justify-center rounded-full border border-line-strong text-transparent'
              }
            >
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            <span className={item.done ? 'text-fog-200' : 'text-fog-500'}>
              <span className="num mr-1.5 text-fog-600">Fase {item.phase}</span>
              {item.label}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

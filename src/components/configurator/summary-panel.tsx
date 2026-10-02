'use client';

import { useMemo } from 'react';

import { ConfigurationStatus } from '@/components/configurator/configuration-status';
import { Badge } from '@/components/ui/badge';
import { catalog } from '@/data/catalog';
import { formatList, formatPrice, formatWeight } from '@/lib/format';
import { costBuild, slotLabels } from '@/lib/pricing';
import { useBikeStore } from '@/store/bike-store';
import { componentSlots } from '@/types/configuration';

/**
 * Live summary of the build.
 *
 * The numbers come from the pricing engine, which is a pure function: this
 * component only decides how they are presented. An incomplete build is shown
 * as incomplete — the running total is labelled and the missing components are
 * named, so a partial price is never mistaken for the price of a bicycle.
 */
export function SummaryPanel() {
  const configuration = useBikeStore((state) => state.configuration);

  const cost = useMemo(() => costBuild(catalog, configuration), [configuration]);

  const price = formatPrice(cost.price);
  const weight = formatWeight(cost.weight);
  const missing = cost.missing.map((slot) => slotLabels[slot]);

  return (
    <section
      aria-labelledby="summary-title"
      className="overflow-hidden rounded-lg border border-line bg-ink-900/50"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2
          id="summary-title"
          className="text-[0.8125rem] font-bold tracking-[0.18em] text-fog-100 uppercase"
        >
          Resumo
        </h2>
        <div className="flex items-center gap-3">
          <ConfigurationStatus />
          <Badge variant={cost.complete ? 'accent' : 'muted'}>
            {cost.complete ? 'Completo' : 'Incompleto'}
          </Badge>
        </div>
      </header>

      <dl className="divide-y divide-line">
        <div className="flex items-baseline justify-between gap-4 px-5 py-4">
          <div>
            <dt className="text-[0.8125rem] font-medium text-fog-200">Preço total</dt>
            <dd className="mt-1 text-xs leading-relaxed text-fog-500">
              Soma do catálogo, com extras e quantidades
            </dd>
          </div>
          <span
            className={`num shrink-0 text-lg font-bold ${cost.complete ? 'text-fog-100' : 'text-fog-600'}`}
          >
            {cost.price === 0 ? '—' : price}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-4 px-5 py-4">
          <div>
            <dt className="text-[0.8125rem] font-medium text-fog-200">Peso total</dt>
            <dd className="mt-1 text-xs leading-relaxed text-fog-500">
              Soma dos componentes selecionados
            </dd>
          </div>
          <span
            className={`num shrink-0 text-lg font-bold ${cost.complete ? 'text-fog-100' : 'text-fog-600'}`}
          >
            {cost.weight === 0 ? '—' : weight}
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-4 px-5 py-4">
          <div>
            <dt className="text-[0.8125rem] font-medium text-fog-200">Especificações</dt>
            <dd className="mt-1 text-xs leading-relaxed text-fog-500">
              Quadro, grupo, rodas e pneus em destaque
            </dd>
          </div>
          <span className="num shrink-0 text-lg font-bold text-fog-600">—</span>
        </div>

        <div className="flex items-baseline justify-between gap-4 px-5 py-4">
          <div>
            <dt className="text-[0.8125rem] font-medium text-fog-200">Compatibilidade</dt>
            <dd className="mt-1 text-xs leading-relaxed text-fog-500">
              Validação por regras antes de avançar
            </dd>
          </div>
          <span className="num shrink-0 text-lg font-bold text-fog-600">—</span>
        </div>
      </dl>

      <footer className="border-t border-line bg-ink-900/60 px-5 py-4">
        {cost.complete ? (
          <>
            <p className="text-xs leading-relaxed text-fog-500">
              Configuração completa. O preço e o peso acompanham cada escolha.
            </p>
            <p className="num mt-2 text-xs leading-relaxed text-fog-400">
              {`${cost.lines.length} componentes · ${cost.accessories.length} extras`}
            </p>
          </>
        ) : (
          <>
            <p className="text-xs leading-relaxed text-fog-500">
              {cost.price === 0
                ? 'Escolhe componentes para ver o preço e o peso a evoluir.'
                : 'Parcial: faltam componentes para o total corresponder a uma bicicleta.'}
            </p>
            <p className="num mt-2 text-xs leading-relaxed text-fog-400">
              {`${cost.lines.length}/${componentSlots.length} componentes · faltam ${formatList(missing)}`}
            </p>
          </>
        )}
      </footer>
    </section>
  );
}

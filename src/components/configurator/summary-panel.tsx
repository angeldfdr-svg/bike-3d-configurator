'use client';

import { useMemo } from 'react';

import { ConfigurationStatus } from '@/components/configurator/configuration-status';
import { Badge } from '@/components/ui/badge';
import { catalog } from '@/data/catalog';
import { isFrame, isGroupset, isTire, isWheelset } from '@/lib/catalog';
import { evaluateCompatibility } from '@/lib/compatibility';
import { formatLength, formatList, formatPrice, formatWeight } from '@/lib/format';
import { costBuild, slotLabels } from '@/lib/pricing';
import { useBikeStore } from '@/store/bike-store';
import { componentSlots } from '@/types/configuration';

/**
 * Live summary of the build.
 *
 * The numbers come from the pricing engine and the compatibility state from the
 * compatibility engine; both are pure functions. This component only decides how
 * they are presented. An incomplete build is shown as incomplete and an
 * incompatible one is shown as incompatible — with the reason and the way out —
 * so neither state is ever silent.
 */
export function SummaryPanel() {
  const configuration = useBikeStore((state) => state.configuration);

  const cost = useMemo(() => costBuild(catalog, configuration), [configuration]);
  const compatibility = useMemo(
    () => evaluateCompatibility(catalog, configuration),
    [configuration],
  );

  const price = formatPrice(cost.price);
  const weight = formatWeight(cost.weight);
  const missing = cost.missing.map((slot) => slotLabels[slot]);

  const specifications = buildSpecifications(configuration.frameSize, cost.lines);

  return (
    <section
      aria-labelledby="summary-title"
      className="overflow-hidden rounded-lg border border-line bg-ink-900/50"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2
          id="summary-title"
          className="flex items-center gap-2 text-[0.8125rem] font-bold tracking-[0.18em] text-fog-100 uppercase"
        >
          <span
            aria-hidden="true"
            title="Atualiza em tempo real"
            className="animate-pulse-dot inline-block size-1.5 rounded-full bg-lime-400"
          />
          Resumo
        </h2>
        <div className="flex items-center gap-3">
          <ConfigurationStatus />
          <Badge variant={compatibility.compatible ? 'accent' : 'danger'}>
            {compatibility.compatible ? 'Compatível' : 'Incompatível'}
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
            key={price}
            className={`num animate-pop-in shrink-0 text-lg font-bold ${
              cost.complete ? 'text-fog-100' : 'text-fog-600'
            }`}
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
            key={weight}
            className={`num animate-pop-in shrink-0 text-lg font-bold ${
              cost.complete ? 'text-fog-100' : 'text-fog-600'
            }`}
          >
            {cost.weight === 0 ? '—' : weight}
          </span>
        </div>

        <div className="px-5 py-4">
          <dt className="text-[0.8125rem] font-medium text-fog-200">Especificações</dt>
          <dd className="mt-2 space-y-1 text-xs leading-relaxed text-fog-400">
            {specifications.length === 0 ? (
              <p className="text-fog-600">Escolhe componentes para ver as especificações.</p>
            ) : (
              specifications.map((row) => (
                <p key={row.label}>
                  <span className="text-fog-500">{row.label}: </span>
                  <span className="num">{row.value}</span>
                </p>
              ))
            )}
          </dd>
        </div>

        <div className="px-5 py-4">
          <dt className="text-[0.8125rem] font-medium text-fog-200">Compatibilidade</dt>
          <dd className="mt-2 space-y-2">
            {compatibility.errors.length === 0 && compatibility.warnings.length === 0 ? (
              <p className="text-xs leading-relaxed text-fog-500">
                {cost.complete
                  ? 'Todos os componentes escolhidos são compatíveis entre si.'
                  : 'Sem conflitos nos componentes já escolhidos.'}
              </p>
            ) : null}

            {compatibility.errors.map((issue) => (
              <div key={`${issue.rule}-${issue.slots.join('-')}`} className="text-xs leading-relaxed">
                <p className="font-semibold text-rose-300">{issue.title}</p>
                <p className="mt-0.5 text-fog-400">{issue.detail}</p>
                <p className="mt-0.5 text-fog-500">{issue.resolution}</p>
              </div>
            ))}

            {compatibility.warnings.map((issue) => (
              <div key={`${issue.rule}-${issue.slots.join('-')}`} className="text-xs leading-relaxed">
                <p className="font-semibold text-amber-300">{issue.title}</p>
                <p className="mt-0.5 text-fog-400">{issue.detail}</p>
                <p className="mt-0.5 text-fog-500">{issue.resolution}</p>
              </div>
            ))}
          </dd>
        </div>
      </dl>

      <footer className="border-t border-line bg-ink-900/60 px-5 py-4">
        {compatibility.errors.length > 0 ? (
          <>
            <p className="text-xs leading-relaxed text-rose-300">
              {`${compatibility.errors.length === 1 ? '1 conflito' : `${compatibility.errors.length} conflitos`} impedem esta bicicleta de ser montada.`}
            </p>
            <p className="num mt-2 text-xs leading-relaxed text-fog-400">
              {formatList(
                compatibility.errors.flatMap((issue) =>
                  issue.slots.map((slot) => slotLabels[slot]),
                ),
              )}
            </p>
          </>
        ) : cost.complete ? (
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

/** The rows the brief asks to highlight, from the chosen products. */
function buildSpecifications(
  frameSize: string | null,
  lines: ReturnType<typeof costBuild>['lines'],
): readonly { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];

  for (const line of lines) {
    const product = line.product;

    if (isFrame(product)) {
      rows.push({ label: 'Quadro', value: `${product.name} · ${product.material}` });
    } else if (isGroupset(product)) {
      rows.push({
        label: 'Grupo',
        value: `${product.name} · ${product.speeds}v ${product.shifting}`,
      });
    } else if (isWheelset(product)) {
      rows.push({
        label: 'Rodas',
        value: `${product.name} · ${formatLength(product.rimDepth)} de perfil`,
      });
    } else if (isTire(product)) {
      rows.push({ label: 'Pneus', value: `${product.name} · ${formatLength(product.width)}` });
    }
  }

  const frame = lines.find((line) => isFrame(line.product))?.product;

  if (frameSize !== null && frame !== undefined && isFrame(frame)) {
    rows.push({ label: 'Tamanho', value: `${frameSize} · ${frame.name}` });
  }

  return rows;
}

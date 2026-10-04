'use client';

import { AlertTriangle, Check } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatLength, formatList, formatPrice, formatWeight } from '@/lib/format';
import { catalog } from '@/data/catalog';
import { conflictsWithBuild } from '@/lib/compatibility';
import type {
  Accessory,
  BikeFrame,
  Component,
  Crankset,
  Groupset,
  Handlebar,
  Saddle,
  Tire,
  Wheelset,
} from '@/types/components';
import type { FrameSize } from '@/types/components';
import type { BikeConfiguration } from '@/types/configuration';
import { useBikeStore } from '@/store/bike-store';
import { useVisualStore } from '@/store/visual-store';

/**
 * Product selection.
 *
 * Every category lists its real products from the catalog and writes the choice
 * straight into the store, which is what makes the 3D parts interchangeable:
 * picking a mono-plate crankset removes the inner chainring from the scene.
 *
 * Prices and weights shown here are catalog facts per product; the totals of
 * the build are computed in a later phase.
 */

import { getModelVisuals, getComponentVisualMeta } from '@/data/model-visuals';

type Slot = {
  readonly products: readonly Component[];
  readonly selectedId: (configuration: BikeConfiguration) => string | null;
  readonly select: (id: string) => void;
};

function productThumbnail(product: Component): string | null {
  if (product.category === 'quadro') {
    const visuals = getModelVisuals(product.id);
    return visuals.colorways[0]?.image ?? '/images/bikes/canyon-aeroad-red.jpg';
  }
  return getComponentVisualMeta(product.category, product.id).thumbnail;
}

/** Stable id for the element that describes a product's clash. */
function conflictId(productId: string): string {
  return `conflito-${productId}`;
}

/** Products of a single slot, with the current selection highlighted. */
export function ProductList({ categoryId }: { categoryId: string }) {
  const configuration = useBikeStore((state) => state.configuration);

  // Each action is a stable reference, so these subscriptions never re-render.
  const selectFrame = useBikeStore((state) => state.selectFrame);
  const selectWheelset = useBikeStore((state) => state.selectWheelset);
  const selectGroupset = useBikeStore((state) => state.selectGroupset);
  const selectCrankset = useBikeStore((state) => state.selectCrankset);
  const selectHandlebar = useBikeStore((state) => state.selectHandlebar);
  const selectSaddle = useBikeStore((state) => state.selectSaddle);
  const selectTire = useBikeStore((state) => state.selectTire);

  const slots: Record<string, Slot> = {
    quadro: {
      products: catalog.frames,
      selectedId: (current) => current.frameId,
      select: selectFrame,
    },
    rodas: {
      products: catalog.wheelsets,
      selectedId: (current) => current.wheelsetId,
      select: selectWheelset,
    },
    grupo: {
      products: catalog.groupsets,
      selectedId: (current) => current.groupsetId,
      select: selectGroupset,
    },
    pedaleiro: {
      products: catalog.cranksets,
      selectedId: (current) => current.cranksetId,
      select: selectCrankset,
    },
    guiador: {
      products: catalog.handlebars,
      selectedId: (current) => current.handlebarId,
      select: selectHandlebar,
    },
    selim: {
      products: catalog.saddles,
      selectedId: (current) => current.saddleId,
      select: selectSaddle,
    },
    pneus: {
      products: catalog.tires,
      selectedId: (current) => current.tireId,
      select: selectTire,
    },
  };

  const slot = slots[categoryId];

  if (slot === undefined) {
    return <AccessoryList />;
  }

  const selectedId = slot.selectedId(configuration);

  return (
    <ul className="mt-3 grid gap-2">
      {slot.products.map((product) => {
        const selected = product.id === selectedId;
        // A selected product is flagged too: if it is what breaks the build,
        // the picker has to say so rather than hide behind the check mark.
        const conflicts = conflictsWithBuild(catalog, configuration, product);
        const conflict = conflicts[0];

        return (
          <li key={product.id}>
            <button
              type="button"
              aria-pressed={selected}
              // The clash is described from outside the button: folding it into
              // the markup would put another product's name inside this
              // button's accessible name.
              aria-describedby={conflict ? conflictId(product.id) : undefined}
              data-conflict={conflict ? conflict.rule : undefined}
              onClick={() => {
                slot.select(product.id);
                useVisualStore.getState().setActiveCategory(categoryId);
              }}
              className={cn(
                'w-full rounded-xs border px-3 py-3 text-left transition-colors duration-200',
                selected
                  ? 'border-lime-400/50 bg-lime-400/10'
                  : conflict
                    ? 'border-amber-400/30 hover:border-amber-400/50 hover:bg-ink-850/60'
                    : 'border-line hover:border-line-strong hover:bg-ink-850/60',
              )}
            >
              {(() => {
                const thumbnail = productThumbnail(product);
                return (
                  <span className="flex items-start justify-between gap-3">
                    <span className="flex items-center gap-3 min-w-0">
                      {thumbnail ? (
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-md border border-line bg-ink-950">
                          <Image src={thumbnail} alt={product.name} fill sizes="48px" className="object-cover" />
                        </span>
                      ) : null}
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-fog-50">{product.name}</span>
                        <span className="num mt-0.5 block text-[0.6875rem] tracking-wide text-fog-500">
                          {product.brand} · {product.model}
                        </span>
                      </span>
                    </span>
                    {selected ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-lime-400" aria-hidden="true" />
                    ) : null}
                  </span>
                );
              })()}

              <span className="mt-2 block text-xs leading-relaxed text-fog-400">
                {productHighlights(product)}
              </span>

              <span className="num mt-2.5 flex items-center gap-3 text-[0.6875rem] text-fog-500">
                <span>{formatPrice(product.price)}</span>
                <span aria-hidden="true">·</span>
                <span>{formatWeight(product.weight)}</span>
              </span>
            </button>

            {conflict ? (
              <p
                id={conflictId(product.id)}
                className="mt-1.5 flex items-start gap-1.5 px-3 text-[0.6875rem] leading-relaxed text-amber-300"
              >
                <AlertTriangle className="mt-px size-3 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-semibold">{conflict.title}</span>
                  {' — '}
                  {conflict.resolution}
                </span>
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/** Extras are toggled rather than swapped, so they get their own list. */
function AccessoryList() {
  const accessories = useBikeStore((state) => state.configuration.accessories);
  const toggleAccessory = useBikeStore((state) => state.toggleAccessory);
  const setAccessoryQuantity = useBikeStore((state) => state.setAccessoryQuantity);

  return (
    <ul className="mt-3 grid gap-2">
      {catalog.accessories.map((accessory) => {
        const selected = accessories.find((item) => item.id === accessory.id);
        const quantity = selected?.quantity ?? 0;

        return (
          <li
            key={accessory.id}
            className={cn(
              'rounded-xs border px-3 py-3 transition-colors duration-200',
              selected ? 'border-lime-400/50 bg-lime-400/10' : 'border-line',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-fog-50">{accessory.name}</p>
                <p className="num mt-0.5 text-[0.6875rem] tracking-wide text-fog-500">
                  {accessory.brand} · {accessory.model}
                </p>
              </div>
              <Badge variant={selected ? 'accent' : 'muted'}>
                {selected ? `${quantity}×` : 'não montado'}
              </Badge>
            </div>

            <p className="num mt-2.5 text-[0.6875rem] text-fog-500">
              {formatPrice(accessory.price)} · {formatWeight(accessory.weight)}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleAccessory(accessory.id, accessory.quantity)}
                className="rounded-xs border border-line px-2.5 py-1.5 text-xs font-medium text-fog-300 transition-colors duration-200 hover:border-line-strong hover:text-fog-100"
              >
                {selected ? 'Remover' : 'Montar'}
              </button>

              {selected ? (
                <div className="flex items-center gap-1.5" role="group" aria-label="Quantidade">
                  {[1, 2].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={quantity === value}
                      onClick={() => setAccessoryQuantity(accessory.id, value)}
                      className={cn(
                        'num size-7 rounded-xs border text-xs transition-colors duration-200',
                        quantity === value
                          ? 'border-lime-400/50 bg-lime-400/12 text-lime-300'
                          : 'border-line text-fog-400 hover:text-fog-100',
                      )}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Frame sizes, shown only while a frame with more than one size is selected. */
export function FrameSizePicker() {
  const frameId = useBikeStore((state) => state.configuration.frameId);
  const frameSize = useBikeStore((state) => state.configuration.frameSize);
  const setFrameSize = useBikeStore((state) => state.setFrameSize);
  const frame = catalog.frames.find((candidate) => candidate.id === frameId);

  if (frame === undefined || frame.sizes.length < 2) return null;

  return (
    <div
      className="mt-3 flex flex-wrap items-center gap-1.5"
      role="group"
      aria-label="Tamanho do quadro"
    >
      <span className="mr-1 text-[0.6875rem] tracking-[0.16em] text-fog-500 uppercase">
        Tamanho
      </span>
      {frame.sizes.map((size) => (
        <button
          key={size}
          type="button"
          aria-pressed={frameSize === size}
          onClick={() => setFrameSize(size as FrameSize)}
          className={cn(
            'num rounded-xs border px-2.5 py-1.5 text-xs font-medium transition-colors duration-200',
            frameSize === size
              ? 'border-lime-400/50 bg-lime-400/12 text-lime-300'
              : 'border-line text-fog-400 hover:border-line-strong hover:text-fog-100',
          )}
        >
          {size}
        </button>
      ))}
    </div>
  );
}

/** The one line of technical detail that identifies a product at a glance. */
function productHighlights(product: Component): string {
  switch (product.category) {
    case 'quadro':
      return frameHighlights(product);
    case 'rodas':
      return wheelsetHighlights(product);
    case 'grupo':
      return groupsetHighlights(product);
    case 'pedaleiro':
      return cranksetHighlights(product);
    case 'guiador':
      return handlebarHighlights(product);
    case 'selim':
      return saddleHighlights(product);
    case 'pneus':
      return tireHighlights(product);
    case 'extras':
      return accessoryHighlights(product);
    default:
      return '';
  }
}

function frameHighlights(frame: BikeFrame): string {
  return `${frame.material} · pneus até ${frame.maxTireWidth} mm · ${frame.bottomBracket} · espigão ${formatLength(frame.seatpostDiameter)}`;
}

function wheelsetHighlights(wheelset: Wheelset): string {
  return `${wheelset.material} · aro ${wheelset.rimDepth} mm · ${wheelset.wheelSize} · ${wheelset.freehub}`;
}

function groupsetHighlights(groupset: Groupset): string {
  return `${groupset.speeds} velocidades · ${groupset.shifting} · ${groupset.brakeSystem}`;
}

function cranksetHighlights(crankset: Crankset): string {
  return `${crankset.chainrings === 1 ? 'Prato único' : 'Duplo'} ${crankset.ratio} · pedaleira ${formatLength(crankset.length)}`;
}

function handlebarHighlights(handlebar: Handlebar): string {
  return `${handlebar.type} · ${formatLength(handlebar.width)} · abraçadeira ${formatLength(handlebar.clamp)}`;
}

function saddleHighlights(saddle: Saddle): string {
  return `${formatLength(saddle.width)} de largura · carris ${saddle.railMaterial}`;
}

function tireHighlights(tire: Tire): string {
  return `${tire.type} · ${formatLength(tire.width)} · ${tire.tpi} tpi · ${tire.wheelSize}`;
}

function accessoryHighlights(accessory: Accessory): string {
  return formatList([accessory.slot, `${accessory.quantity} un. por predefinição`]);
}

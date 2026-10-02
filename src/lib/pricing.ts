import type { Catalog, Component } from '@/types/components';
import {
  componentSlots,
  type BikeConfiguration,
  type ComponentSlot,
} from '@/types/configuration';

import { findSelection, type ConfigurationSelection } from './catalog';

/**
 * Price and weight engine.
 *
 * Pure arithmetic over the catalog: no React, no store, no formatting. It reads
 * the ids a configuration points at, resolves them against the catalog and adds
 * them up. Every rule that could reasonably change — how many units a bicycle
 * needs, what a price means, what happens when the build is incomplete — is
 * declared here once, as data, and covered by `tests/pricing.test.ts`.
 */

/* ------------------------------------------------------------------ *
 * Units and quantities
 * ------------------------------------------------------------------ */

/**
 * How many units of each slot a complete bicycle needs.
 *
 * These multipliers are the only place quantity enters the engine. They are a
 * product decision, not a calculation, which is why they live as data:
 *
 * - `wheelsetId` counts once: a wheelset is sold and weighed per pair, as the
 *   catalog itself states in its "Peso do par" specification row.
 * - `tireId` counts twice: a tire product is one wheel's worth of rubber, and
 *   the catalog prices and weighs a single tire.
 *
 * Everything else is one unit per bicycle.
 */
export const slotQuantities: Readonly<Record<ComponentSlot, number>> = {
  frameId: 1,
  wheelsetId: 1,
  groupsetId: 1,
  cranksetId: 1,
  handlebarId: 1,
  saddleId: 1,
  tireId: 2,
};

/** Display names of the single-component slots, in interface order. */
export const slotLabels: Readonly<Record<ComponentSlot, string>> = {
  frameId: 'Quadro',
  wheelsetId: 'Rodas',
  groupsetId: 'Grupo',
  cranksetId: 'Pedaleiro',
  handlebarId: 'Guiador',
  saddleId: 'Selim',
  tireId: 'Pneus',
};

/**
 * How to read each slot out of a resolved selection.
 *
 * Written as readers rather than a key map so the compiler, not a cast, decides
 * what a slot resolves to.
 */
const slotReaders: Readonly<
  Record<ComponentSlot, (selection: ConfigurationSelection) => Component | undefined>
> = {
  frameId: (selection) => selection.frame,
  wheelsetId: (selection) => selection.wheelset,
  groupsetId: (selection) => selection.groupset,
  cranksetId: (selection) => selection.crankset,
  handlebarId: (selection) => selection.handlebar,
  saddleId: (selection) => selection.saddle,
  tireId: (selection) => selection.tire,
};

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */

/** One single-component slot, priced. */
export type PricedLine = {
  readonly slot: ComponentSlot;
  readonly label: string;
  readonly product: Component;
  readonly quantity: number;
  /** Catalog price of one unit, in cents. */
  readonly unitPrice: number;
  readonly linePrice: number;
  /** Catalog weight of one unit, in grams. */
  readonly unitWeight: number;
  readonly lineWeight: number;
};

/** One mounted accessory, priced at its configured quantity. */
export type PricedAccessory = {
  readonly id: string;
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly linePrice: number;
  readonly unitWeight: number;
  readonly lineWeight: number;
};

export type BuildCost = {
  /** True when every single-component slot resolved to a catalog product. */
  readonly complete: boolean;
  /**
   * Slots that are unselected, or that point at a product no longer in the
   * catalog. An incomplete build is reported, never silently priced as if the
   * missing part were free.
   */
  readonly missing: readonly ComponentSlot[];
  /** Sum of every priced line, in cents. */
  readonly price: number;
  /** Sum of every priced line, in grams. */
  readonly weight: number;
  readonly lines: readonly PricedLine[];
  readonly accessories: readonly PricedAccessory[];
};

/* ------------------------------------------------------------------ *
 * Engine
 * ------------------------------------------------------------------ */

/**
 * Total price and weight of a build.
 *
 * No rounding is applied. Catalog prices are integer cents and catalog weights
 * are integer grams, so every line and every total is already an exact integer
 * in its own unit. If a catalog ever carries fractional values, the rounding
 * policy has to be decided once, here — not inside a component.
 *
 * Nothing is counted twice: the seven single-component slots are visited
 * exactly once each, and the accessories once each. The groupset carries the
 * cassette, derailleurs and brakes in its own price, and the wheelset carries
 * its hubs and spokes; neither has a separate slot, so there is no second line
 * that could double them.
 */
export function costBuild(source: Catalog, configuration: BikeConfiguration): BuildCost {
  const selection = findSelection(source, configuration);

  const lines: PricedLine[] = [];
  const missing: ComponentSlot[] = [];

  for (const slot of componentSlots) {
    const product = slotReaders[slot](selection);

    if (product === undefined) {
      missing.push(slot);
      continue;
    }

    const quantity = slotQuantities[slot];

    lines.push({
      slot,
      label: slotLabels[slot],
      product,
      quantity,
      unitPrice: product.price,
      linePrice: product.price * quantity,
      unitWeight: product.weight,
      lineWeight: product.weight * quantity,
    });
  }

  const accessories: PricedAccessory[] = [];

  for (const selected of configuration.accessories) {
    const accessory = source.accessories.find((item) => item.id === selected.id);

    if (accessory === undefined) continue;

    // The store already refuses quantities outside 1..2; this keeps a hand
    // edited or stale configuration from silently multiplying a line.
    const quantity = Math.max(1, Math.trunc(selected.quantity));

    accessories.push({
      id: accessory.id,
      name: accessory.name,
      quantity,
      unitPrice: accessory.price,
      linePrice: accessory.price * quantity,
      unitWeight: accessory.weight,
      lineWeight: accessory.weight * quantity,
    });
  }

  let price = 0;
  let weight = 0;

  for (const line of lines) {
    price += line.linePrice;
    weight += line.lineWeight;
  }

  for (const accessory of accessories) {
    price += accessory.linePrice;
    weight += accessory.lineWeight;
  }

  return {
    complete: missing.length === 0,
    missing,
    price,
    weight,
    lines,
    accessories,
  };
}

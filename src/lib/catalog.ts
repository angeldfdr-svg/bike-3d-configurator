import type {
  Accessory,
  BikeFrame,
  Catalog,
  CatalogKey,
  Component,
  ComponentCategory,
  Crankset,
  Groupset,
  Handlebar,
  Saddle,
  Tire,
  Wheelset,
} from '@/types/components';
import type { BikeConfiguration } from '@/types/configuration';

/**
 * Pure accessors over the catalog.
 *
 * They take the catalog as an argument instead of importing it, so the same
 * functions work against the local data today and against a payload fetched
 * from an API tomorrow.
 */

const categoryToKey: Record<ComponentCategory, CatalogKey> = {
  quadro: 'frames',
  rodas: 'wheelsets',
  grupo: 'groupsets',
  pedaleiro: 'cranksets',
  guiador: 'handlebars',
  selim: 'saddles',
  pneus: 'tires',
  extras: 'accessories',
};

export const categoryKeys: readonly CatalogKey[] = [
  'frames',
  'wheelsets',
  'groupsets',
  'cranksets',
  'handlebars',
  'saddles',
  'tires',
  'accessories',
];

/** Every product, in catalog order. */
export function allProducts(source: Catalog): readonly Component[] {
  const products: Component[] = [];

  for (const key of categoryKeys) {
    products.push(...source[key]);
  }

  return products;
}

/** Products belonging to a single interface category. */
export function productsByCategory(
  source: Catalog,
  category: ComponentCategory,
): readonly Component[] {
  return source[categoryToKey[category]];
}

/** Look up a product by id across every category. */
export const legacyProductIdAliases: Readonly<Record<string, string>> = {
  'frame-aurelia-aero-sl': 'frame-veloce-aero-sl',
  'frame-aurelia-endurance': 'frame-veloce-endurance',
  'wheelset-aurelia-alloy-24': 'wheelset-veloce-alloy-24',
  'handlebar-aurelia-aero-40': 'handlebar-veloce-aero-40',
  'handlebar-aurelia-endurance-42': 'handlebar-veloce-endurance-42',
  'saddle-aurelia-race-143': 'saddle-veloce-race-143',
  'accessory-aurelia-bottle-cage': 'accessory-veloce-bottle-cage',
};

export function normalizeProductId(id: string): string {
  return legacyProductIdAliases[id] ?? id;
}

export function findProductById(source: Catalog, id: string): Component | undefined {
  const normalizedId = normalizeProductId(id);
  return allProducts(source).find((product) => product.id === normalizedId);
}

/** Number of products in a category, useful for empty states. */
export function countByCategory(source: Catalog, category: ComponentCategory): number {
  return productsByCategory(source, category).length;
}

/* ------------------------------------------------------------------ *
 * Type guards
 * ------------------------------------------------------------------ */

/**
 * The products a configuration points at, resolved against the catalog.
 *
 * The configuration stores ids; this turns them into typed products. Unknown
 * or absent ids resolve to `undefined`, which every consumer already has to
 * handle — the scene falls back to demonstrative geometry and the price engine
 * reports the build as incomplete.
 */
export type ConfigurationSelection = {
  readonly frame: BikeFrame | undefined;
  readonly wheelset: Wheelset | undefined;
  readonly groupset: Groupset | undefined;
  readonly crankset: Crankset | undefined;
  readonly handlebar: Handlebar | undefined;
  readonly saddle: Saddle | undefined;
  readonly tire: Tire | undefined;
  readonly accessories: readonly Accessory[];
};

export function findSelection(
  source: Catalog,
  configuration: BikeConfiguration,
): ConfigurationSelection {
  const accessories: Accessory[] = [];

  for (const selected of configuration.accessories) {
    const accessory = source.accessories.find(
      (item) => item.id === (legacyProductIdAliases[selected.id] ?? selected.id),
    );

    if (accessory !== undefined) accessories.push(accessory);
  }

  return {
    frame: findProductById(source, configuration.frameId ?? '') as BikeFrame | undefined,
    wheelset: findProductById(source, configuration.wheelsetId ?? '') as Wheelset | undefined,
    groupset: findProductById(source, configuration.groupsetId ?? '') as Groupset | undefined,
    crankset: findProductById(source, configuration.cranksetId ?? '') as Crankset | undefined,
    handlebar: findProductById(source, configuration.handlebarId ?? '') as Handlebar | undefined,
    saddle: findProductById(source, configuration.saddleId ?? '') as Saddle | undefined,
    tire: findProductById(source, configuration.tireId ?? '') as Tire | undefined,
    accessories,
  };
}

export function isFrame(component: Component): component is BikeFrame {
  return component.category === 'quadro';
}

export function isWheelset(component: Component): component is Wheelset {
  return component.category === 'rodas';
}

export function isGroupset(component: Component): component is Groupset {
  return component.category === 'grupo';
}

export function isCrankset(component: Component): component is Crankset {
  return component.category === 'pedaleiro';
}

export function isHandlebar(component: Component): component is Handlebar {
  return component.category === 'guiador';
}

export function isSaddle(component: Component): component is Saddle {
  return component.category === 'selim';
}

export function isTire(component: Component): component is Tire {
  return component.category === 'pneus';
}

export function isAccessory(component: Component): component is Accessory {
  return component.category === 'extras';
}

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
export function findProductById(source: Catalog, id: string): Component | undefined {
  return allProducts(source).find((product) => product.id === id);
}

/** Number of products in a category, useful for empty states. */
export function countByCategory(source: Catalog, category: ComponentCategory): number {
  return productsByCategory(source, category).length;
}

/* ------------------------------------------------------------------ *
 * Type guards
 * ------------------------------------------------------------------ */

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

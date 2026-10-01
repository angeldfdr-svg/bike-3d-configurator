import type { Catalog, CatalogKey } from '@/types/components';

import { rawAccessories } from './accessories';
import { rawCranksets } from './cranksets';
import { rawFrames } from './frames';
import { rawGroupsets } from './groupsets';
import { rawHandlebars } from './handlebars';
import { rawSaddles } from './saddles';
import { rawTires } from './tires';
import { rawWheelsets } from './wheelsets';

export type { Catalog, CatalogKey };

/**
 * The catalog as shipped to the interface.
 *
 * Every array is compile-time checked against its domain type (`satisfies` in
 * each data file), so this module stays free of runtime dependencies and does
 * not pull the validation library into the client bundle.
 *
 * Runtime validation is available through `validateCatalog()`, used by the
 * test suite today and by the API boundary once a backend exists.
 */
export const catalog = {
  frames: rawFrames,
  wheelsets: rawWheelsets,
  groupsets: rawGroupsets,
  cranksets: rawCranksets,
  handlebars: rawHandlebars,
  saddles: rawSaddles,
  tires: rawTires,
  accessories: rawAccessories,
} as const satisfies Catalog;

/**
 * Validate the catalog against the runtime schemas.
 *
 * The validator is imported dynamically so Zod stays out of the initial client
 * bundle: the interface consumes the typed data, while tests and future API
 * boundaries call this explicitly.
 */
export async function validateCatalog(): Promise<Catalog> {
  const { parseCatalog } = await import('@/lib/validation/catalog-schema');
  return parseCatalog(catalog);
}

import { describe, expect, it } from 'vitest';

import { catalog, validateCatalog } from '@/data/catalog';
import { safeParseCatalog } from '@/lib/validation/catalog-schema';
import {
  allProducts,
  countByCategory,
  findProductById,
  isFrame,
  productsByCategory,
} from '@/lib/catalog';
import type { Component, ComponentCategory } from '@/types/components';

/**
 * Catalog integrity.
 *
 * These are the invariants the pricing, weight and compatibility engines will
 * rely on. If any of them breaks, the later phases would produce wrong totals
 * or impossible configurations.
 */

const categories: readonly ComponentCategory[] = [
  'quadro',
  'rodas',
  'grupo',
  'pedaleiro',
  'guiador',
  'selim',
  'pneus',
  'extras',
];

/** Labels the interface must show for each category. */
const requiredLabels: Record<ComponentCategory, readonly string[]> = {
  quadro: ['Material', 'Tamanhos disponíveis', 'Largura máx. de pneus', 'Movimento pedaleiro', 'Travão', 'Eixos'],
  rodas: ['Modelo', 'Material', 'Perfil', 'Núcleo', 'Eixo traseiro', 'Travão'],
  grupo: ['Fabricante', 'Modelo', 'Velocidades', 'Mudanças', 'Travão', 'Núcleo'],
  pedaleiro: ['Comprimento', 'Pratos', 'Relação', 'Movimento pedaleiro', 'Velocidades'],
  guiador: ['Tipo', 'Largura', 'Material', 'Abraçadeira', 'Alcance', 'Drop'],
  selim: ['Modelo', 'Calhas', 'Largura'],
  pneus: ['Largura', 'Tipo', 'TPI', 'Roda'],
  extras: ['Local de montagem'],
};

describe('catalog', () => {
  it('validates against the runtime schemas', async () => {
    await expect(validateCatalog()).resolves.toBeDefined();
  });

  it('has products in every category', () => {
    for (const category of categories) {
      expect(countByCategory(catalog, category), `categoria ${category}`).toBeGreaterThan(0);
    }
  });

  it('exposes the expected number of catalog products', () => {
    expect(allProducts(catalog)).toHaveLength(90);
  });

  it('uses unique ids across the whole catalog', () => {
    const ids = allProducts(catalog).map((product) => product.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);

    expect(duplicates).toEqual([]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses url-safe ids', () => {
    for (const product of allProducts(catalog)) {
      expect(product.id, product.name).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('keeps prices and weights as non-negative integers', () => {
    for (const product of allProducts(catalog)) {
      expect(Number.isInteger(product.price), `${product.id} price`).toBe(true);
      expect(Number.isInteger(product.weight), `${product.id} weight`).toBe(true);
      expect(product.price).toBeGreaterThan(0);
      expect(product.weight).toBeGreaterThan(0);
    }
  });

  it('declares the category that matches where the product lives', () => {
    for (const category of categories) {
      for (const product of productsByCategory(catalog, category)) {
        expect(product.category).toBe(category);
      }
    }
  });

  it('shows the required specification labels for every product', () => {
    for (const category of categories) {
      for (const product of productsByCategory(catalog, category)) {
        const labels = product.specifications.map((specification) => specification.label);

        for (const required of requiredLabels[category]) {
          expect(labels, `${product.id} → ${required}`).toContain(required);
        }
      }
    }
  });

  it('has unique, non-empty specification labels per product', () => {
    for (const product of allProducts(catalog)) {
      const labels = product.specifications.map((specification) => specification.label);

      expect(labels.length).toBeGreaterThan(0);
      expect(new Set(labels).size).toBe(labels.length);

      for (const specification of product.specifications) {
        expect(specification.value.trim()).not.toBe('');
      }
    }
  });

  it('keeps descriptions meaningful', () => {
    for (const product of allProducts(catalog)) {
      expect(product.description.length, product.id).toBeGreaterThan(40);
    }
  });
});

describe('structured attributes', () => {
  it('mirrors the frame technical values in the specification rows', () => {
    for (const frame of catalog.frames) {
      const values = frame.specifications.map((specification) => specification.value).join(' | ');

      expect(values).toContain(`${frame.maxTireWidth} mm`);
      expect(values).toContain(frame.bottomBracket);
      expect(frame.sizes.length).toBeGreaterThan(0);
      expect(new Set(frame.sizes).size).toBe(frame.sizes.length);
    }
  });

  it('mirrors the wheelset technical values in the specification rows', () => {
    for (const wheelset of catalog.wheelsets) {
      const values = wheelset.specifications.map((specification) => specification.value).join(' | ');

      expect(values).toContain(`${wheelset.rimDepth} mm`);
      expect(values).toContain(wheelset.freehub);
      expect(wheelset.rearAxle).toBe(wheelset.frontAxle);
    }
  });

  it('mirrors the groupset technical values in the specification rows', () => {
    for (const groupset of catalog.groupsets) {
      const speeds = groupset.specifications.find(
        (specification) => specification.label === 'Velocidades',
      );

      expect(speeds?.value).toBe(String(groupset.speeds));
    }
  });

  it('mirrors the crankset technical values in the specification rows', () => {
    for (const crankset of catalog.cranksets) {
      const length = crankset.specifications.find(
        (specification) => specification.label === 'Comprimento',
      );

      expect(length?.value).toContain(crankset.length.toLocaleString('pt-PT'));
    }
  });

  it('mirrors the handlebar and saddle widths in the specification rows', () => {
    for (const handlebar of catalog.handlebars) {
      const width = handlebar.specifications.find(
        (specification) => specification.label === 'Largura',
      );

      expect(width?.value).toContain(`${handlebar.width} mm`);
    }

    for (const saddle of catalog.saddles) {
      const width = saddle.specifications.find(
        (specification) => specification.label === 'Largura',
      );

      expect(width?.value).toContain(`${saddle.width} mm`);
    }
  });

  it('mirrors the tyre width in the specification rows', () => {
    for (const tire of catalog.tires) {
      const width = tire.specifications.find(
        (specification) => specification.label === 'Largura',
      );

      expect(width?.value).toContain(`${tire.width} mm`);
    }
  });

  it('declares a slot and a usable quantity for every accessory', () => {
    for (const accessory of catalog.accessories) {
      expect(accessory.slot).not.toBe('');
      expect(accessory.quantity).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('accessors', () => {
  it('returns products for a category', () => {
    const frames = productsByCategory(catalog, 'quadro');

    expect(frames.length).toBe(catalog.frames.length);
    expect(frames.every(isFrame)).toBe(true);
  });

  it('finds a product by id', () => {
    const product = findProductById(catalog, 'frame-veloce-aero-sl');

    expect(product).toBeDefined();
    expect(isFrame(product as Component)).toBe(true);
  });

  it('returns undefined for an unknown id', () => {
    expect(findProductById(catalog, 'nao-existe')).toBeUndefined();
  });

  it('parses a single frame payload', () => {
    const frame = catalog.frames[0];

    expect(frame).toBeDefined();
    expect(findProductById(catalog, frame?.id ?? '')).toBe(frame);
  });
});

describe('runtime validation', () => {
  const validFrame = catalog.frames[0];

  const payloadWith = (mutation: (frame: Record<string, unknown>) => void) => {
    const frame: Record<string, unknown> = { ...validFrame };
    mutation(frame);

    return {
      frames: [frame],
      wheelsets: catalog.wheelsets,
      groupsets: catalog.groupsets,
      cranksets: catalog.cranksets,
      handlebars: catalog.handlebars,
      saddles: catalog.saddles,
      tires: catalog.tires,
      accessories: catalog.accessories,
    };
  };

  it('accepts the shipped catalog', () => {
    expect(safeParseCatalog(catalog).success).toBe(true);
  });

  it('rejects a negative price', () => {
    const result = safeParseCatalog(payloadWith((frame) => { frame.price = -1; }));

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['frames', 0, 'price']);
  });

  it('rejects a non integer weight', () => {
    const result = safeParseCatalog(payloadWith((frame) => { frame.weight = 12.5; }));

    expect(result.success).toBe(false);
  });

  it('rejects a category that does not match the array', () => {
    const result = safeParseCatalog(payloadWith((frame) => { frame.category = 'rodas'; }));

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['frames', 0, 'category']);
  });

  it('rejects an id that is not url safe', () => {
    const result = safeParseCatalog(payloadWith((frame) => { frame.id = 'Frame Veloce!'; }));

    expect(result.success).toBe(false);
  });

  it('rejects a frame without sizes', () => {
    const result = safeParseCatalog(payloadWith((frame) => { frame.sizes = []; }));

    expect(result.success).toBe(false);
  });

  it('rejects an unknown bottom bracket standard', () => {
    const result = safeParseCatalog(payloadWith((frame) => { frame.bottomBracket = 'BSA-threaded'; }));

    expect(result.success).toBe(false);
  });

  it('rejects a payload with a missing category', () => {
    const result = safeParseCatalog({ frames: [validFrame] });

    expect(result.success).toBe(false);
  });
});

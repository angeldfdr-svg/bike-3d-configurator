import { describe, expect, it } from 'vitest';

import { catalog } from '@/data/catalog';
import { costBuild, slotQuantities } from '@/lib/pricing';
import { emptyConfiguration } from '@/lib/configuration';
import type { BikeConfiguration, ComponentSlot } from '@/types/configuration';

/**
 * Price and weight engine.
 *
 * These tests pin the decisions that would otherwise be invisible in the UI:
 * how many units a bicycle needs, what happens to an incomplete build, and the
 * guarantee that nothing is counted twice.
 */

function ids(slots: Partial<Record<ComponentSlot, string>>): BikeConfiguration {
  return { ...emptyConfiguration(), ...slots };
}

const sample = {
  frameId: 'frame-veloce-aero-sl',
  wheelsetId: 'wheelset-ardent-carbon-45',
  groupsetId: 'groupset-northwind-di2-12',
  cranksetId: 'crankset-northwind-172-52-36',
  handlebarId: 'handlebar-veloce-aero-40',
  saddleId: 'saddle-veloce-race-143',
  tireId: 'tire-meridian-gravel-40',
};

describe('costBuild', () => {
  it('reports an empty configuration as incomplete and worth nothing', () => {
    const cost = costBuild(catalog, emptyConfiguration());

    expect(cost.complete).toBe(false);
    expect(cost.price).toBe(0);
    expect(cost.weight).toBe(0);
    expect(cost.lines).toHaveLength(0);
    expect(cost.accessories).toHaveLength(0);
  });

  it('lists every missing slot, in interface order', () => {
    const cost = costBuild(catalog, ids({ frameId: sample.frameId }));

    expect(cost.complete).toBe(false);
    expect(cost.missing).toEqual([
      'wheelsetId',
      'groupsetId',
      'cranksetId',
      'handlebarId',
      'saddleId',
      'tireId',
    ]);
  });

  it('is complete once every slot resolves', () => {
    const cost = costBuild(catalog, ids(sample));

    expect(cost.complete).toBe(true);
    expect(cost.missing).toEqual([]);
    expect(cost.lines).toHaveLength(7);
  });

  it('adds every selected component exactly once', () => {
    const cost = costBuild(catalog, ids(sample));

    const sumOfLines = cost.lines.reduce((total, line) => total + line.linePrice, 0);

    expect(sumOfLines).toBe(cost.price);
  });

  it('multiplies the tire by two, because a bicycle has two wheels', () => {
    const cost = costBuild(catalog, ids(sample));
    const tire = cost.lines.find((line) => line.slot === 'tireId');

    expect(slotQuantities.tireId).toBe(2);
    expect(tire?.quantity).toBe(2);
    expect(tire?.linePrice).toBe(tire?.unitPrice ? tire.unitPrice * 2 : 0);
    expect(tire?.lineWeight).toBe(tire?.unitWeight ? tire.unitWeight * 2 : 0);
  });

  it('counts the wheelset once, because it is sold per pair', () => {
    const cost = costBuild(catalog, ids(sample));
    const wheelset = cost.lines.find((line) => line.slot === 'wheelsetId');

    expect(slotQuantities.wheelsetId).toBe(1);
    expect(wheelset?.quantity).toBe(1);
    expect(wheelset?.linePrice).toBe(wheelset?.unitPrice);
  });

  it('changes the total by exactly the difference between two groupsets', () => {
    const first = costBuild(catalog, ids(sample));
    const second = costBuild(
      catalog,
      ids({ ...sample, groupsetId: 'groupset-northwind-mechanic-11' }),
    );

    const priceOf = (id: string) =>
      catalog.groupsets.find((product) => product.id === id)?.price ?? 0;

    expect(second.price - first.price).toBe(priceOf('groupset-northwind-mechanic-11') - priceOf(sample.groupsetId));
    expect(second.weight - first.weight).toBe(
      (catalog.groupsets.find((product) => product.id === 'groupset-northwind-mechanic-11')?.weight ?? 0) -
        (catalog.groupsets.find((product) => product.id === sample.groupsetId)?.weight ?? 0),
    );
  });

  it('multiplies an accessory by its configured quantity', () => {
    const cost = costBuild(catalog, {
      ...ids(sample),
      accessories: [{ id: 'accessory-cinder-cycle-computer', quantity: 2 }],
    });

    const accessory = cost.accessories[0];

    expect(cost.accessories).toHaveLength(1);
    expect(accessory?.quantity).toBe(2);
    expect(accessory?.linePrice).toBe(24900 * 2);
    expect(accessory?.lineWeight).toBe(85 * 2);
    expect(cost.price).toBe(
      costBuild(catalog, ids(sample)).price + 24900 * 2,
    );
  });

  it('adds accessories on top of the components, not instead of them', () => {
    const bare = costBuild(catalog, ids(sample));
    const withExtras = costBuild(catalog, {
      ...ids(sample),
      accessories: [
        { id: 'accessory-cinder-light-set', quantity: 1 },
        { id: 'accessory-veloce-bottle-cage', quantity: 2 },
      ],
    });

    expect(withExtras.price).toBe(bare.price + 5900 + 2900 * 2);
    expect(withExtras.weight).toBe(bare.weight + 190 + 60 * 2);
    expect(withExtras.complete).toBe(true);
  });

  it('treats an id that is no longer in the catalog as missing', () => {
    const cost = costBuild(catalog, ids({ ...sample, tireId: 'tire-does-not-exist' }));

    expect(cost.complete).toBe(false);
    expect(cost.missing).toContain('tireId');
    expect(cost.lines.some((line) => line.slot === 'tireId')).toBe(false);
  });

  it('ignores an accessory that is no longer in the catalog', () => {
    const cost = costBuild(catalog, {
      ...ids(sample),
      accessories: [{ id: 'accessory-gone', quantity: 1 }],
    });

    expect(cost.accessories).toHaveLength(0);
    expect(cost.price).toBe(costBuild(catalog, ids(sample)).price);
  });

  it('clamps a stale or hand edited quantity to at least one', () => {
    const cost = costBuild(catalog, {
      ...ids(sample),
      accessories: [{ id: 'accessory-cinder-light-set', quantity: 0 }],
    });

    expect(cost.accessories[0]?.quantity).toBe(1);
    expect(cost.accessories[0]?.linePrice).toBe(5900);
  });

  it('never returns a fractional cent or gram', () => {
    const cost = costBuild(catalog, {
      ...ids(sample),
      accessories: [
        { id: 'accessory-cinder-cycle-computer', quantity: 2 },
        { id: 'accessory-northwind-saddle-bag', quantity: 1 },
      ],
    });

    expect(Number.isInteger(cost.price)).toBe(true);
    expect(Number.isInteger(cost.weight)).toBe(true);
    for (const line of cost.lines) {
      expect(Number.isInteger(line.linePrice)).toBe(true);
      expect(Number.isInteger(line.lineWeight)).toBe(true);
    }
  });

  it('labels every line with its category', () => {
    const cost = costBuild(catalog, ids(sample));

    expect(cost.lines.map((line) => line.label)).toEqual([
      'Quadro',
      'Rodas',
      'Grupo',
      'Pedaleiro',
      'Guiador',
      'Selim',
      'Pneus',
    ]);
  });
});

describe('slotQuantities', () => {
  it('gives every slot a positive whole number of units', () => {
    for (const [slot, quantity] of Object.entries(slotQuantities)) {
      expect(quantity, slot).toBeGreaterThan(0);
      expect(Number.isInteger(quantity), slot).toBe(true);
    }
  });

  it('needs more than one unit only where the catalog sells a single wheel', () => {
    const plural = Object.entries(slotQuantities)
      .filter(([, quantity]) => quantity > 1)
      .map(([slot]) => slot);

    expect(plural).toEqual(['tireId']);
  });
});

import { describe, expect, it } from 'vitest';

import { catalog } from '@/data/catalog';
import {
  addAccessory,
  configurationIds,
  danglingIds,
  emptyConfiguration,
  hasAccessory,
  isConfigurationComplete,
  removeAccessory,
  resolveFrameSize,
  setAccessoryQuantity,
} from '@/lib/configuration';
import {
  parseConfiguration,
  parseSavedConfiguration,
  serializeConfiguration,
  serializeSavedConfiguration,
} from '@/lib/validation/configuration-schema';
import type { BikeConfiguration } from '@/types/configuration';

/**
 * Configuration logic.
 *
 * These helpers decide what a valid build looks like, so they are tested
 * before any store or component depends on them.
 */

describe('emptyConfiguration', () => {
  it('starts with every slot empty', () => {
    const configuration = emptyConfiguration();

    expect(configuration).toEqual({
      frameId: null,
      frameSize: null,
      wheelsetId: null,
      groupsetId: null,
      cranksetId: null,
      handlebarId: null,
      saddleId: null,
      tireId: null,
      accessories: [],
    });
    expect(isConfigurationComplete(configuration)).toBe(false);
  });
});

describe('configurationIds', () => {
  it('collects single components and accessories', () => {
    const configuration: BikeConfiguration = {
      ...emptyConfiguration(),
      frameId: 'frame-veloce-aero-sl',
      tireId: 'tire-voltaic-cotton-28',
      accessories: [
        { id: 'accessory-cinder-cycle-computer', quantity: 1 },
        { id: 'accessory-veloce-bottle-cage', quantity: 2 },
      ],
    };

    expect(configurationIds(configuration)).toEqual([
      'frame-veloce-aero-sl',
      'tire-voltaic-cotton-28',
      'accessory-cinder-cycle-computer',
      'accessory-veloce-bottle-cage',
    ]);
  });

  it('ignores empty ids', () => {
    expect(configurationIds(emptyConfiguration())).toEqual([]);
  });
});

describe('resolveFrameSize', () => {
  it('keeps a size the frame offers', () => {
    expect(resolveFrameSize(['S', 'M', 'L'], 'M')).toBe('M');
  });

  it('falls back to the first available size', () => {
    expect(resolveFrameSize(['S', 'M', 'L'], 'XL')).toBe('S');
  });

  it('returns null when the frame has no sizes', () => {
    expect(resolveFrameSize([], 'M')).toBeNull();
  });
});

describe('accessories', () => {
  it('adds an accessory with a clamped quantity', () => {
    const result = addAccessory([], 'accessory-cinder-light-set', 0);

    expect(result).toEqual([{ id: 'accessory-cinder-light-set', quantity: 1 }]);
  });

  it('bumps the quantity of an accessory already selected', () => {
    const first = addAccessory([], 'accessory-veloce-bottle-cage', 1);
    const second = addAccessory(first, 'accessory-veloce-bottle-cage', 2);

    expect(second).toEqual([{ id: 'accessory-veloce-bottle-cage', quantity: 3 }]);
  });

  it('updates the quantity of a selected accessory', () => {
    const selected = addAccessory([], 'accessory-cinder-cycle-computer', 1);

    expect(setAccessoryQuantity(selected, 'accessory-cinder-cycle-computer', 4)).toEqual([
      { id: 'accessory-cinder-cycle-computer', quantity: 4 },
    ]);
  });

  it('removes an accessory when the quantity drops to zero', () => {
    const selected = addAccessory([], 'accessory-cinder-cycle-computer', 1);

    expect(setAccessoryQuantity(selected, 'accessory-cinder-cycle-computer', 0)).toEqual([]);
  });

  it('ignores a quantity change for an accessory that is not selected', () => {
    expect(setAccessoryQuantity([], 'accessory-cinder-cycle-computer', 3)).toEqual([]);
  });

  it('removes an accessory', () => {
    const selected = addAccessory([], 'accessory-cinder-cycle-computer', 1);

    expect(removeAccessory(selected, 'accessory-cinder-cycle-computer')).toEqual([]);
    expect(hasAccessory(selected, 'accessory-cinder-cycle-computer')).toBe(true);
  });
});

describe('danglingIds', () => {
  it('reports ids that are not in the catalog', () => {
    const configuration: BikeConfiguration = {
      ...emptyConfiguration(),
      frameId: 'frame-inexistente',
      accessories: [{ id: 'accessory-inexistente', quantity: 1 }],
    };

    expect(danglingIds(configuration, catalog)).toEqual([
      'frame-inexistente',
      'accessory-inexistente',
    ]);
  });

  it('returns nothing for a configuration built from the catalog', () => {
    const configuration: BikeConfiguration = {
      ...emptyConfiguration(),
      frameId: catalog.frames[0]?.id ?? null,
      accessories: [{ id: catalog.accessories[0]?.id ?? '', quantity: 1 }],
    };

    expect(danglingIds(configuration, catalog)).toEqual([]);
  });
});

describe('serialization', () => {
  it('round-trips a configuration', () => {
    const configuration: BikeConfiguration = {
      ...emptyConfiguration(),
      frameId: 'frame-veloce-endurance',
      frameSize: 'L',
      wheelsetId: 'wheelset-ardent-carbon-45',
      accessories: [{ id: 'accessory-cinder-light-set', quantity: 2 }],
    };

    const parsed = parseConfiguration(JSON.parse(serializeConfiguration(configuration)));

    expect(parsed).toEqual(configuration);
  });

  it('round-trips a saved configuration', () => {
    const configuration = emptyConfiguration();
    const saved = { configuration, savedAt: '2026-10-01T10:00:00.000Z' };

    const parsed = parseSavedConfiguration(
      JSON.parse(serializeSavedConfiguration(saved)),
    );

    expect(parsed).toEqual(saved);
  });

  it('rejects a payload with the wrong version', () => {
    expect(
      parseConfiguration({ version: 99, configuration: emptyConfiguration() }),
    ).toBeNull();
  });

  it('rejects a payload with an invalid accessory quantity', () => {
    expect(
      parseConfiguration({
        version: 1,
        configuration: {
          ...emptyConfiguration(),
          accessories: [{ id: 'accessory-cinder-light-set', quantity: 0 }],
        },
      }),
    ).toBeNull();
  });

  it('rejects a payload with an unknown frame size', () => {
    expect(
      parseConfiguration({
        version: 1,
        configuration: { ...emptyConfiguration(), frameSize: 'XXL' },
      }),
    ).toBeNull();
  });

  it('rejects a payload that is not an object', () => {
    expect(parseConfiguration('nope')).toBeNull();
    expect(parseSavedConfiguration(null)).toBeNull();
  });
});

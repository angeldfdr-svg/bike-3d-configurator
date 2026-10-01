import { beforeEach, describe, expect, it, vi } from 'vitest';

import { catalog } from '@/data/catalog';
import { createBikeStore } from '@/store/bike-store';
import {
  createMemoryRepository,
  type ConfigurationRepository,
} from '@/store/repositories';
import type { BikeConfiguration } from '@/types/configuration';

/**
 * Store behaviour.
 *
 * The store is created with an injected repository, so no DOM, no
 * `localStorage` and no React are involved.
 */

const frameId = 'frame-veloce-aero-sl';
const otherFrameId = 'frame-meridian-ti-gravel';
const wheelsetId = 'wheelset-ardent-carbon-45';
const groupsetId = 'groupset-northwind-di2-12';
const cranksetId = 'crankset-northwind-170-48-31';
const handlebarId = 'handlebar-veloce-aero-40';
const saddleId = 'saddle-veloce-race-143';
const tireId = 'tire-voltaic-cotton-28';
const accessoryId = 'accessory-cinder-cycle-computer';

function setup(repository: ConfigurationRepository = createMemoryRepository()) {
  const store = createBikeStore({ repository });

  return { store, repository };
}

describe('initial state', () => {
  it('starts empty, idle and without a saved configuration', () => {
    const { store } = setup();

    expect(store.getState().configuration.frameId).toBeNull();
    expect(store.getState().configuration.accessories).toEqual([]);
    expect(store.getState().status).toBe('idle');
    expect(store.getState().saved).toBeNull();
    expect(store.getState().camera).toEqual({ view: 'lateral', autoRotate: false });
  });
});

describe('selection', () => {
  it('stores the id of the chosen component', () => {
    const { store } = setup();

    store.getState().selectWheelset(wheelsetId);
    store.getState().selectGroupset(groupsetId);
    store.getState().selectCrankset(cranksetId);
    store.getState().selectHandlebar(handlebarId);
    store.getState().selectSaddle(saddleId);
    store.getState().selectTire(tireId);

    const { configuration } = store.getState();

    expect(configuration.wheelsetId).toBe(wheelsetId);
    expect(configuration.groupsetId).toBe(groupsetId);
    expect(configuration.cranksetId).toBe(cranksetId);
    expect(configuration.handlebarId).toBe(handlebarId);
    expect(configuration.saddleId).toBe(saddleId);
    expect(configuration.tireId).toBe(tireId);
  });

  it('ignores an id that is not in the catalog', () => {
    const { store } = setup();

    store.getState().selectFrame('frame-inexistente');
    store.getState().selectWheelset('wheelset-inexistente');

    expect(store.getState().configuration.frameId).toBeNull();
    expect(store.getState().configuration.wheelsetId).toBeNull();
  });

  it('replaces a previous selection', () => {
    const { store } = setup();

    store.getState().selectWheelset(wheelsetId);
    store.getState().selectWheelset('wheelset-northwind-xdr-50');

    expect(store.getState().configuration.wheelsetId).toBe('wheelset-northwind-xdr-50');
  });
});

describe('frame size', () => {
  it('selects a size the frame offers', () => {
    const { store } = setup();

    store.getState().selectFrame(frameId);

    expect(store.getState().configuration.frameId).toBe(frameId);
    expect(store.getState().configuration.frameSize).toBe('XS');
  });

  it('keeps the size when the new frame also offers it', () => {
    const { store } = setup();

    store.getState().selectFrame(frameId);
    store.getState().setFrameSize('L');
    store.getState().selectFrame('frame-veloce-endurance');

    expect(store.getState().configuration.frameSize).toBe('L');
  });

  it('falls back when the new frame does not offer the current size', () => {
    const { store } = setup();

    store.getState().selectFrame(frameId);
    store.getState().setFrameSize('XL');
    store.getState().selectFrame(otherFrameId);

    expect(store.getState().configuration.frameSize).toBe('S');
  });

  it('accepts an explicit size change', () => {
    const { store } = setup();

    store.getState().selectFrame(frameId);
    store.getState().setFrameSize('M');

    expect(store.getState().configuration.frameSize).toBe('M');
  });
});

describe('accessories', () => {
  it('adds and removes an accessory', () => {
    const { store } = setup();

    store.getState().toggleAccessory(accessoryId);
    expect(store.getState().configuration.accessories).toEqual([
      { id: accessoryId, quantity: 1 },
    ]);

    store.getState().toggleAccessory(accessoryId);
    expect(store.getState().configuration.accessories).toEqual([]);
  });

  it('adds an accessory with a custom quantity', () => {
    const { store } = setup();

    store.getState().toggleAccessory('accessory-veloce-bottle-cage', 2);

    expect(store.getState().configuration.accessories).toEqual([
      { id: 'accessory-veloce-bottle-cage', quantity: 2 },
    ]);
  });

  it('ignores an accessory that is not in the catalog', () => {
    const { store } = setup();

    store.getState().toggleAccessory('accessory-inexistente');

    expect(store.getState().configuration.accessories).toEqual([]);
  });

  it('updates and removes quantities', () => {
    const { store } = setup();

    store.getState().toggleAccessory(accessoryId);
    store.getState().setAccessoryQuantity(accessoryId, 3);
    expect(store.getState().configuration.accessories[0]?.quantity).toBe(3);

    store.getState().setAccessoryQuantity(accessoryId, 0);
    expect(store.getState().configuration.accessories).toEqual([]);

    store.getState().toggleAccessory(accessoryId);
    store.getState().removeAccessory(accessoryId);
    expect(store.getState().configuration.accessories).toEqual([]);
  });
});

describe('camera', () => {
  it('changes the preset view', () => {
    const { store } = setup();

    store.getState().setCameraView('superior');

    expect(store.getState().camera.view).toBe('superior');
  });

  it('toggles auto rotation', () => {
    const { store } = setup();

    store.getState().toggleAutoRotate();

    expect(store.getState().camera.autoRotate).toBe(true);
  });
});

describe('reset', () => {
  it('clears the configuration but keeps the camera', () => {
    const { store } = setup();

    store.getState().selectFrame(frameId);
    store.getState().setCameraView('frontal');
    store.getState().resetConfiguration();

    expect(store.getState().configuration.frameId).toBeNull();
    expect(store.getState().configuration.accessories).toEqual([]);
    expect(store.getState().camera.view).toBe('frontal');
  });
});

describe('persistence', () => {
  let repository: ConfigurationRepository;

  beforeEach(() => {
    repository = createMemoryRepository();
  });

  it('hydrates an empty configuration when nothing is stored', async () => {
    const { store } = setup(repository);

    await store.getState().hydrate();

    expect(store.getState().status).toBe('ready');
    expect(store.getState().configuration.frameId).toBeNull();
  });

  it('hydrates a stored configuration', async () => {
    const stored: BikeConfiguration = {
      frameId,
      frameSize: 'M',
      wheelsetId,
      groupsetId,
      cranksetId,
      handlebarId,
      saddleId,
      tireId,
      accessories: [{ id: accessoryId, quantity: 1 }],
    };
    repository = createMemoryRepository({
      configuration: stored,
      savedAt: '2026-10-01T10:00:00.000Z',
    });
    const { store } = setup(repository);

    await store.getState().hydrate();

    expect(store.getState().configuration).toEqual(stored);
    expect(store.getState().saved?.savedAt).toBe('2026-10-01T10:00:00.000Z');
  });

  it('saves and restores the current configuration', async () => {
    const { store } = setup(repository);

    store.getState().selectFrame(frameId);
    store.getState().setFrameSize('L');
    await store.getState().saveConfiguration();

    expect(store.getState().saved?.configuration.frameId).toBe(frameId);
    expect(await repository.load()).toEqual(store.getState().saved);

    store.getState().resetConfiguration();
    expect(store.getState().configuration.frameId).toBeNull();

    store.getState().restoreSavedConfiguration();
    expect(store.getState().configuration.frameId).toBe(frameId);
    expect(store.getState().configuration.frameSize).toBe('L');
  });

  it('ignores a restore when nothing was saved', () => {
    const { store } = setup(repository);

    store.getState().selectFrame(frameId);
    store.getState().restoreSavedConfiguration();

    expect(store.getState().configuration.frameId).toBe(frameId);
  });

  it('clears the stored configuration and the current build', async () => {
    const { store } = setup(repository);

    store.getState().selectFrame(frameId);
    await store.getState().saveConfiguration();
    await store.getState().clearSavedConfiguration();

    expect(store.getState().saved).toBeNull();
    expect(store.getState().configuration.frameId).toBeNull();
    expect(await repository.load()).toBeNull();
  });
});

describe('error handling', () => {
  it('reports a failing load without losing the empty configuration', async () => {
    const repository: ConfigurationRepository = {
      load: vi.fn().mockRejectedValue(new Error('storage indisponível')),
      save: vi.fn().mockRejectedValue(new Error('storage indisponível')),
      clear: vi.fn().mockResolvedValue(undefined),
    };
    const { store } = setup(repository);

    await store.getState().hydrate();

    expect(store.getState().status).toBe('error');
    expect(store.getState().error).toBe('storage indisponível');
    expect(store.getState().configuration.frameId).toBeNull();
  });

  it('reports a failing save', async () => {
    const repository: ConfigurationRepository = {
      load: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockRejectedValue(new Error('quota excedida')),
      clear: vi.fn().mockResolvedValue(undefined),
    };
    const { store } = setup(repository);

    store.getState().selectFrame(frameId);
    await store.getState().saveConfiguration();

    expect(store.getState().status).toBe('error');
    expect(store.getState().error).toBe('quota excedida');
    expect(store.getState().saved).toBeNull();
  });
});

describe('catalog injection', () => {
  it('works against a different catalog', () => {
    const store = createBikeStore({
      repository: createMemoryRepository(),
      catalog: {
        frames: [catalog.frames[0]!],
        wheelsets: [],
        groupsets: [],
        cranksets: [],
        handlebars: [],
        saddles: [],
        tires: [],
        accessories: [],
      },
    });

    store.getState().selectFrame(frameId);
    store.getState().selectWheelset(wheelsetId);

    expect(store.getState().configuration.frameId).toBe(frameId);
    expect(store.getState().configuration.wheelsetId).toBeNull();
  });
});

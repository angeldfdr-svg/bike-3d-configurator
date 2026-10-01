import { createStore, useStore, type StateCreator, type StoreApi } from 'zustand';

import { catalog } from '@/data/catalog';
import {
  addAccessory,
  emptyConfiguration,
  hasAccessory,
  removeAccessory,
  resolveFrameSize,
  setAccessoryQuantity as applyAccessoryQuantity,
} from '@/lib/configuration';
import { createBrowserRepository, type ConfigurationRepository } from '@/store/repositories';
import type {
  BikeConfiguration,
  CameraState,
  CameraView,
  ConfigurationStatus,
  SavedConfiguration,
} from '@/types/configuration';
import type { Catalog, FrameSize } from '@/types/components';

/**
 * Global state for the configurator.
 *
 * The store owns *what* the user chose and *where the interface is*. Every
 * calculation (price, weight, compatibility) is a pure function that reads the
 * configuration and will be attached as a selector when its engine lands, so
 * no business rule ever lives here.
 */

export type BikeState = {
  readonly configuration: BikeConfiguration;
  readonly status: ConfigurationStatus;
  readonly error: string | null;
  readonly camera: CameraState;
  readonly saved: SavedConfiguration | null;
};

export type BikeActions = {
  selectFrame(frameId: string): void;
  selectWheelset(wheelsetId: string): void;
  selectGroupset(groupsetId: string): void;
  selectCrankset(cranksetId: string): void;
  selectHandlebar(handlebarId: string): void;
  selectSaddle(saddleId: string): void;
  selectTire(tireId: string): void;
  setFrameSize(size: FrameSize): void;
  toggleAccessory(accessoryId: string, quantity?: number): void;
  setAccessoryQuantity(accessoryId: string, quantity: number): void;
  removeAccessory(accessoryId: string): void;
  setCameraView(view: CameraView): void;
  toggleAutoRotate(): void;
  resetConfiguration(): void;
  hydrate(): Promise<void>;
  saveConfiguration(): Promise<void>;
  restoreSavedConfiguration(): void;
  clearSavedConfiguration(): Promise<void>;
};

export type BikeStore = BikeState & BikeActions;

export type CreateBikeStoreOptions = {
  repository: ConfigurationRepository;
  catalog?: Catalog;
};

const initialCamera: CameraState = { view: 'lateral', autoRotate: false };

const initialState: BikeState = {
  configuration: emptyConfiguration(),
  status: 'idle',
  error: null,
  camera: initialCamera,
  saved: null,
};

/** Ids the store is allowed to write into the configuration. */
function knownIds(source: Catalog): ReadonlySet<string> {
  const products = [
    ...source.frames,
    ...source.wheelsets,
    ...source.groupsets,
    ...source.cranksets,
    ...source.handlebars,
    ...source.saddles,
    ...source.tires,
    ...source.accessories,
  ];

  return new Set(products.map((product) => product.id));
}

export function createBikeStoreState({
  repository,
  catalog: source = catalog,
}: CreateBikeStoreOptions): StateCreator<BikeStore, [], []> {
  const ids = knownIds(source);

  return (set, get) => ({
    ...initialState,

    selectFrame(frameId) {
      const frame = source.frames.find((candidate) => candidate.id === frameId);
      if (frame === undefined) return;

      set((state) => ({
        configuration: {
          ...state.configuration,
          frameId: frame.id,
          frameSize: resolveFrameSize(frame.sizes, state.configuration.frameSize),
        },
      }));
    },

    selectWheelset(wheelsetId) {
      if (!ids.has(wheelsetId)) return;
      set((state) => ({ configuration: { ...state.configuration, wheelsetId } }));
    },

    selectGroupset(groupsetId) {
      if (!ids.has(groupsetId)) return;
      set((state) => ({ configuration: { ...state.configuration, groupsetId } }));
    },

    selectCrankset(cranksetId) {
      if (!ids.has(cranksetId)) return;
      set((state) => ({ configuration: { ...state.configuration, cranksetId } }));
    },

    selectHandlebar(handlebarId) {
      if (!ids.has(handlebarId)) return;
      set((state) => ({ configuration: { ...state.configuration, handlebarId } }));
    },

    selectSaddle(saddleId) {
      if (!ids.has(saddleId)) return;
      set((state) => ({ configuration: { ...state.configuration, saddleId } }));
    },

    selectTire(tireId) {
      if (!ids.has(tireId)) return;
      set((state) => ({ configuration: { ...state.configuration, tireId } }));
    },

    setFrameSize(size) {
      set((state) => ({ configuration: { ...state.configuration, frameSize: size } }));
    },

    toggleAccessory(accessoryId, quantity = 1) {
      if (!ids.has(accessoryId)) return;

      set((state) => {
        const accessories = state.configuration.accessories;

        return {
          configuration: {
            ...state.configuration,
            accessories: hasAccessory(accessories, accessoryId)
              ? removeAccessory(accessories, accessoryId)
              : addAccessory(accessories, accessoryId, quantity),
          },
        };
      });
    },

    setAccessoryQuantity(accessoryId, quantity) {
      set((state) => ({
        configuration: {
          ...state.configuration,
          accessories: applyAccessoryQuantity(
            state.configuration.accessories,
            accessoryId,
            quantity,
          ),
        },
      }));
    },

    removeAccessory(accessoryId) {
      set((state) => ({
        configuration: {
          ...state.configuration,
          accessories: removeAccessory(state.configuration.accessories, accessoryId),
        },
      }));
    },

    setCameraView(view) {
      set((state) => ({ camera: { ...state.camera, view } }));
    },

    toggleAutoRotate() {
      set((state) => ({ camera: { ...state.camera, autoRotate: !state.camera.autoRotate } }));
    },

    resetConfiguration() {
      set({ configuration: emptyConfiguration(), error: null });
    },

    async hydrate() {
      set({ status: 'loading', error: null });

      try {
        const saved = await repository.load();
        set({
          saved,
          configuration: saved?.configuration ?? emptyConfiguration(),
          status: 'ready',
        });
      } catch (error) {
        set({
          status: 'error',
          error:
            error instanceof Error
              ? error.message
              : 'Não foi possível carregar a configuração guardada.',
        });
      }
    },

    async saveConfiguration() {
      try {
        const saved = await repository.save(get().configuration);
        set({ saved, error: null });
      } catch (error) {
        set({
          status: 'error',
          error:
            error instanceof Error
              ? error.message
              : 'Não foi possível guardar a configuração.',
        });
      }
    },

    restoreSavedConfiguration() {
      const { saved } = get();
      if (saved === null) return;

      set({ configuration: saved.configuration, error: null });
    },

    async clearSavedConfiguration() {
      try {
        await repository.clear();
        set({ saved: null, configuration: emptyConfiguration(), error: null });
      } catch (error) {
        set({
          status: 'error',
          error:
            error instanceof Error
              ? error.message
              : 'Não foi possível limpar a configuração guardada.',
        });
      }
    },
  });
}

export type BikeStoreApi = StoreApi<BikeStore>;

/** Create an isolated store. Used by tests and, later, by SSR-safe providers. */
export function createBikeStore(options: CreateBikeStoreOptions): BikeStoreApi {
  return createStore<BikeStore>()(createBikeStoreState(options));
}

let singleton: BikeStoreApi | undefined;

/**
 * Application store.
 *
 * Created lazily so importing this module never touches `localStorage` during
 * server rendering.
 */
export function getBikeStore(): BikeStoreApi {
  singleton ??= createBikeStore({ repository: createBrowserRepository() });

  return singleton;
}

/** Subscribe a component to a slice of the store. */
export function useBikeStore<T>(selector: (state: BikeStore) => T): T {
  return useStore(getBikeStore(), selector);
}

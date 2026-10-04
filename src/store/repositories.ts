import type { BikeConfiguration, SavedConfiguration } from '@/types/configuration';

/**
 * Persistence boundary for configurations.
 *
 * The interface is asynchronous on purpose: today it is backed by
 * `localStorage`, tomorrow by an API, without the store changing shape.
 *
 * The (de)serialisation helpers are imported dynamically so the validation
 * library stays out of the initial client bundle: it is only needed when a
 * configuration is actually read from or written to storage.
 */

export type ConfigurationRepository = {
  /** Load the stored configuration, or `null` when there is nothing usable. */
  load(): Promise<SavedConfiguration | null>;
  /** Persist a configuration and return the record that was stored. */
  save(configuration: BikeConfiguration): Promise<SavedConfiguration>;
  /** Remove the stored configuration. */
  clear(): Promise<void>;
};

export const CONFIGURATION_STORAGE_KEY = 'veloce:configuration:v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * In-memory repository.
 *
 * Used by tests and as the fallback when storage is unavailable (SSR, private
 * modes, blocked storage).
 */
export function createMemoryRepository(
  initial: SavedConfiguration | null = null,
): ConfigurationRepository {
  let stored = initial;

  return {
    async load() {
      return stored;
    },
    async save(configuration) {
      stored = { configuration, savedAt: new Date().toISOString() };
      return stored;
    },
    async clear() {
      stored = null;
    },
  };
}

/** `localStorage` backed repository. Storage failures are returned to the store. */
export function createLocalStorageRepository(
  key: string = CONFIGURATION_STORAGE_KEY,
): ConfigurationRepository {
  if (!isBrowser()) return createMemoryRepository();

  return {
    async load() {
      try {
        const raw = window.localStorage.getItem(key);
        if (raw === null) return null;

        const { parseSavedConfiguration } = await import('@/lib/validation/configuration-schema');
        const saved = parseSavedConfiguration(JSON.parse(raw) as unknown);

        if (saved === null) {
          throw new Error('A configuração guardada tem um formato inválido.');
        }

        return saved;
      } catch (error) {
        throw new Error(
          `Não foi possível carregar a configuração guardada: ${
            error instanceof Error ? error.message : 'erro desconhecido'
          }`,
        );
      }
    },
    async save(configuration) {
      const saved: SavedConfiguration = {
        configuration,
        savedAt: new Date().toISOString(),
      };

      try {
        const { serializeSavedConfiguration } = await import(
          '@/lib/validation/configuration-schema'
        );

        window.localStorage.setItem(key, serializeSavedConfiguration(saved));
      } catch (error) {
        throw new Error(
          `Não foi possível guardar a configuração: ${
            error instanceof Error ? error.message : 'erro desconhecido'
          }`,
        );
      }

      return saved;
    },
    async clear() {
      try {
        window.localStorage.removeItem(key);
      } catch (error) {
        throw new Error(
          `Não foi possível limpar a configuração guardada: ${
            error instanceof Error ? error.message : 'erro desconhecido'
          }`,
        );
      }
    },
  };
}

/** Repository used by the application: storage when possible, memory otherwise. */
export function createBrowserRepository(): ConfigurationRepository {
  return createLocalStorageRepository();
}

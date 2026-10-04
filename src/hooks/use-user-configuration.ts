/**
 * Per-user configuration persistence.
 *
 * When a user logs in, their last saved build is restored from localStorage.
 * When they make changes, the build is auto-saved (debounced 1 s) under a
 * key scoped to their user ID so different accounts never share data.
 *
 * Schema:
 *   `veloce:config:<userId>` → JSON-serialised BikeConfiguration
 *
 * This hook is mounted once inside the configurator layout; it has no visible
 * UI of its own.
 */

'use client';

import { useEffect, useRef } from 'react';

import { emptyConfiguration } from '@/lib/configuration';
import { useAuthStore } from '@/store/auth-store';
import { useBikeStore } from '@/store/bike-store';
import type { BikeConfiguration } from '@/types/configuration';

const PREFIX = 'veloce:config:';
const DEBOUNCE_MS = 1000;

function storageKey(userId: string): string {
  return `${PREFIX}${userId}`;
}

async function saveConfiguration(userId: string, config: BikeConfiguration): Promise<void> {
  const { bikeConfigurationSchema } = await import('@/lib/validation/configuration-schema');
  const parsed = bikeConfigurationSchema.safeParse(config);

  if (!parsed.success) {
    throw new Error('A configuração tem dados inválidos e não foi guardada.');
  }

  localStorage.setItem(storageKey(userId), JSON.stringify(parsed.data));
}

async function loadConfiguration(userId: string): Promise<BikeConfiguration | null> {
  const raw = localStorage.getItem(storageKey(userId));
  if (raw === null) return null;

  const { bikeConfigurationSchema } = await import('@/lib/validation/configuration-schema');
  const parsed = bikeConfigurationSchema.safeParse(JSON.parse(raw) as unknown);

  if (!parsed.success) {
    throw new Error('A configuração guardada está inválida e não pôde ser restaurada.');
  }

  return parsed.data;
}

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Não foi possível carregar ou guardar a configuração da conta.';
}

/**
 * Mount this hook in a client component inside the configurator layout.
 * It has no return value — its only purpose is the side-effect of reading
 * and writing per-user builds.
 */
export function useUserConfiguration(): void {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const configuration = useBikeStore((s) => s.configuration);
  const replaceConfiguration = useBikeStore((s) => s.replaceConfiguration);
  const reportPersistenceError = useBikeStore((s) => s.reportPersistenceError);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (userId === null) {
      loadedForUser.current = null;
      return;
    }

    const activeUserId = userId;
    if (loadedForUser.current === activeUserId) return;
    let cancelled = false;

    async function restoreUserConfiguration() {
      try {
        const saved = await loadConfiguration(activeUserId);
        if (cancelled) return;

        replaceConfiguration(saved ?? emptyConfiguration());
        loadedForUser.current = activeUserId;
      } catch (error) {
        if (cancelled) return;

        replaceConfiguration(emptyConfiguration());
        reportPersistenceError(errorMessage(error));
        loadedForUser.current = activeUserId;
      }
    }

    void restoreUserConfiguration();

    return () => {
      cancelled = true;
    };
  }, [userId, replaceConfiguration, reportPersistenceError]);

  useEffect(() => {
    if (userId === null || loadedForUser.current !== userId) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void saveConfiguration(userId, configuration).catch((error: unknown) => {
        reportPersistenceError(errorMessage(error));
      });
    }, DEBOUNCE_MS);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [userId, configuration, reportPersistenceError]);
}

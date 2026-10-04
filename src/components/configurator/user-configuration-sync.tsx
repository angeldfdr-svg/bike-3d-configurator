'use client';

import { useUserConfiguration } from '@/hooks/use-user-configuration';

/**
 * Invisible component that mounts the per-user configuration persistence hook.
 * Placed inside the configurator so the hook is only active when the
 * configurator is rendered — it has no server-side footprint.
 */
export function UserConfigurationSync() {
  useUserConfiguration();
  return null;
}

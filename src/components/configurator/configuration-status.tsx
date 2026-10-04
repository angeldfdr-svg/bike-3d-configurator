'use client';

import { useEffect } from 'react';

import { useBikeStore } from '@/store/bike-store';
import { useAuthStore } from '@/store/auth-store';
import { componentSlots } from '@/types/configuration';

/**
 * Live readout of the configuration state.
 *
 * Reads the store and triggers hydration on mount. It does not calculate
 * anything: price, weight and compatibility arrive with their own engines.
 */
export function ConfigurationStatus() {
  const status = useBikeStore((state) => state.status);
  const error = useBikeStore((state) => state.error);
  const configuration = useBikeStore((state) => state.configuration);
  const hydrate = useBikeStore((state) => state.hydrate);
  const authStatus = useAuthStore((state) => state.status);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      void hydrate();
    }
  }, [authStatus, hydrate]);

  const selected = componentSlots.filter((slot) => configuration[slot] !== null).length;
  const accessories = configuration.accessories.length;

  return (
    <div>
      <p className="num text-[0.6875rem] tracking-[0.12em] text-fog-500 uppercase">
        <span className="text-fog-200">{selected}</span>
        {`/${componentSlots.length} componentes`}
        {accessories > 0 ? ` · ${accessories} extras` : ''}
        {` · ${status}`}
      </p>
      {error ? (
        <p role="alert" className="mt-1 max-w-64 text-xs text-rose-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

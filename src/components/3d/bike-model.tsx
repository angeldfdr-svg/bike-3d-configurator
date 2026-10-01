'use client';

import { useMemo } from 'react';

import { Crankset } from '@/components/3d/parts/crankset';
import { Frame } from '@/components/3d/parts/frame';
import { Groupset } from '@/components/3d/parts/groupset';
import { Handlebar, Levers } from '@/components/3d/parts/handlebar';
import { Saddle } from '@/components/3d/parts/saddle';
import { Wheels } from '@/components/3d/parts/wheels';
import { createShadowTexture } from '@/components/3d/parts/tires';
import { catalog } from '@/data/catalog';
import { resolveBikeGeometry } from '@/lib/3d/bike-geometry';
import { useBikeStore } from '@/store/bike-store';

/**
 * The procedural bicycle.
 *
 * Geometry is derived from the current configuration, so a different tyre,
 * crankset or handlebar already changes the silhouette. Phase 5 adds the
 * interchangeable part shapes on top of these anchor points.
 */
export function BikeModel() {
  const configuration = useBikeStore((state) => state.configuration);
  const geometry = useMemo(
    () => resolveBikeGeometry(configuration, catalog),
    [configuration],
  );

  const shadow = useMemo(() => createShadowTexture(), []);

  return (
    <group name="bike">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.6, 1.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.9} />
      </mesh>

      <Wheels geometry={geometry} />
      <Frame geometry={geometry} />
      <Groupset geometry={geometry} />
      <Crankset geometry={geometry} />
      <Handlebar geometry={geometry} />
      <Levers geometry={geometry} />
      <Saddle geometry={geometry} />
    </group>
  );
}

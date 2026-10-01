'use client';

import { Rim, Tire } from '@/components/3d/parts/tires';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';

/**
 * Both wheels: rim, tyre and hub assembly at the anchor points of the geometry.
 *
 * Rim depth and tyre width come from the selected products, so a deeper rim or
 * a wider tyre changes the silhouette without any new code.
 */
export function Wheels({ geometry }: { geometry: BikeGeometry }) {
  const { rearAxle, frontAxle, wheelRadius, tireWidth, rimDepth } = geometry;

  return (
    <group name="wheels">
      <group name="wheel-rear">
        <Rim center={rearAxle} wheelRadius={wheelRadius} tireWidth={tireWidth} rimDepth={rimDepth} />
        <Tire center={rearAxle} wheelRadius={wheelRadius} tireWidth={tireWidth} />
      </group>
      <group name="wheel-front">
        <Rim center={frontAxle} wheelRadius={wheelRadius} tireWidth={tireWidth} rimDepth={rimDepth} />
        <Tire center={frontAxle} wheelRadius={wheelRadius} tireWidth={tireWidth} />
      </group>
    </group>
  );
}

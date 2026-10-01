'use client';

import { Cassette } from '@/components/3d/parts/tires';
import { Tube } from '@/components/3d/tube';
import { bikeMaterials } from '@/components/3d/materials';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';

/**
 * Groupset: cassette, rear derailleur, chain runs and brake calipers.
 *
 * Phase 5 differentiates mechanical from electronic and rim from disc brakes;
 * the anchor points already follow the frame geometry.
 */
export function Groupset({ geometry }: { geometry: BikeGeometry }) {
  const { rearAxle, bottomBracket, chainringRadius, frontAxle } = geometry;

  const chainringCenter = bottomBracket;
  const cassetteCenter: [number, number, number] = [rearAxle[0], rearAxle[1], 0];

  const topRun = {
    from: [chainringCenter[0], chainringCenter[1] + chainringRadius, 0.035] as const,
    to: [cassetteCenter[0], cassetteCenter[1] + 0.05, 0.035] as const,
  };
  const bottomRun = {
    from: [chainringCenter[0], chainringCenter[1] - chainringRadius, 0.035] as const,
    to: [cassetteCenter[0] + 0.01, cassetteCenter[1] - 0.045, 0.035] as const,
  };

  return (
    <group name="groupset">
      <Cassette center={cassetteCenter} />

      {/* Rear derailleur */}
      <mesh position={[cassetteCenter[0] + 0.015, cassetteCenter[1] - 0.075, 0.04]}>
        <boxGeometry args={[0.05, 0.075, 0.028]} />
        <meshStandardMaterial {...bikeMaterials.darkMetal} />
      </mesh>
      <mesh position={[cassetteCenter[0] + 0.005, cassetteCenter[1] - 0.115, 0.04]}>
        <cylinderGeometry args={[0.018, 0.018, 0.012, 14]} />
        <meshStandardMaterial {...bikeMaterials.darkMetal} />
      </mesh>

      {/* Chain runs */}
      <Tube from={topRun.from} to={topRun.to} radius={0.004} material="steel" radialSegments={6} />
      <Tube from={bottomRun.from} to={bottomRun.to} radius={0.004} material="steel" radialSegments={6} />

      {/* Brake calipers */}
      <mesh position={[frontAxle[0], frontAxle[1] - 0.045, 0.055]}>
        <boxGeometry args={[0.045, 0.06, 0.03]} />
        <meshStandardMaterial {...bikeMaterials.darkMetal} />
      </mesh>
      <mesh position={[rearAxle[0], rearAxle[1] - 0.045, 0.055]}>
        <boxGeometry args={[0.04, 0.055, 0.03]} />
        <meshStandardMaterial {...bikeMaterials.darkMetal} />
      </mesh>
    </group>
  );
}

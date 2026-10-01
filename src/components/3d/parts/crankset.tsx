'use client';

import { useMemo } from 'react';

import { bikeMaterials } from '@/components/3d/materials';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';

/**
 * Crankset: chainrings, arms and pedals, on the drive side of the bike.
 */
export function Crankset({ geometry }: { geometry: BikeGeometry }) {
  const { bottomBracket, chainringRadius, crankLength } = geometry;

  const arms = useMemo(
    () =>
      [
        { key: 'right', angle: 0 },
        { key: 'left', angle: Math.PI },
      ].map((arm) => {
        const x = bottomBracket[0] + Math.cos(arm.angle) * crankLength;
        const y = bottomBracket[1] + Math.sin(arm.angle) * crankLength;

        return { key: arm.key, x, y, angle: arm.angle };
      }),
    [bottomBracket, crankLength],
  );

  return (
    <group name="crankset">
      {/* Outer chainring */}
      <mesh position={[bottomBracket[0], bottomBracket[1], 0.062]}>
        <torusGeometry args={[chainringRadius, 0.004, 8, 48]} />
        <meshStandardMaterial {...bikeMaterials.alloy} />
      </mesh>
      {/* Inner chainring */}
      <mesh position={[bottomBracket[0], bottomBracket[1], 0.05]}>
        <torusGeometry args={[chainringRadius * 0.72, 0.0035, 8, 40]} />
        <meshStandardMaterial {...bikeMaterials.alloy} />
      </mesh>

      {/* Spider and arms */}
      {arms.map((arm) => (
        <group key={arm.key}>
          <mesh
            position={[arm.x / 2 + bottomBracket[0] / 2, arm.y / 2 + bottomBracket[1] / 2, 0.058]}
            rotation={[0, 0, arm.angle - Math.PI / 2]}
          >
            <boxGeometry args={[0.026, crankLength, 0.014]} />
            <meshStandardMaterial {...bikeMaterials.carbon} />
          </mesh>
          <mesh position={[arm.x, arm.y, 0.058]}>
            <boxGeometry args={[0.075, 0.036, 0.012]} />
            <meshStandardMaterial {...bikeMaterials.darkMetal} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

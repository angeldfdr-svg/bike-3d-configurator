'use client';

import { useMemo } from 'react';

import { Tube } from '@/components/3d/tube';
import { torus, unitBox, unitCylinder } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';
import type { CrankVariant } from '@/lib/3d/part-variants';

type CranksetProps = {
  geometry: BikeGeometry;
  variant: CrankVariant;
};

/**
 * Crankset: chainrings, arms and pedals, on the drive side of the bike.
 *
 * A mono-plate crankset draws a single chainring and no spider; a double draws
 * both rings. Arm length and ring size come from the selected product.
 */
export function Crankset({ geometry, variant }: CranksetProps) {
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

  const [bx, by] = bottomBracket;

  return (
    <group name="crankset">
      {/* Spider, only when there is more than one ring to bolt on */}
      {variant.chainringCount > 1 ? (
        <mesh position={[bx, by, 0.058]} scale={[0.036, 0.036, 0.004]}>
          <primitive object={unitCylinder(20)} attach="geometry" />
          <primitive object={standardMaterial('alloy')} attach="material" />
        </mesh>
      ) : null}

      {/* Outer chainring */}
      <mesh position={[bx, by, 0.062]}>
        <primitive object={torus(chainringRadius, 0.004, 8, 48)} attach="geometry" />
        <primitive object={standardMaterial('alloy')} attach="material" />
      </mesh>

      {/* Inner chainring */}
      {variant.chainringCount > 1 ? (
        <mesh position={[bx, by, 0.05]}>
          <primitive object={torus(chainringRadius * variant.innerRatio, 0.0035, 8, 40)} attach="geometry" />
          <primitive object={standardMaterial('alloy')} attach="material" />
        </mesh>
      ) : null}

      {/* Arms and pedals */}
      {arms.map((arm) => (
        <group key={arm.key}>
          <mesh
            position={[arm.x / 2 + bx / 2, arm.y / 2 + by / 2, 0.058]}
            rotation={[0, 0, arm.angle - Math.PI / 2]}
            scale={[variant.armWidth, crankLength, 0.014]}
          >
            <primitive object={unitBox()} attach="geometry" />
            <primitive object={standardMaterial('carbon')} attach="material" />
          </mesh>
          <mesh position={[arm.x, arm.y, 0.058]} scale={[variant.pedalLength, 0.036, 0.012]}>
            <primitive object={unitBox()} attach="geometry" />
            <primitive object={standardMaterial('darkMetal')} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Spindle, sized by the bottom bracket standard */}
      <Tube
        from={[bx, by, 0.05]}
        to={[bx, by, -0.05]}
        radius={0.016}
        material={variant.spindleMaterial}
        radialSegments={10}
      />
    </group>
  );
}

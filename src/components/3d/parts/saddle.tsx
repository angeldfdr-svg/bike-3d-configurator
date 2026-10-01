'use client';

import { unitBox, unitSphere } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';
import type { SaddleVariant } from '@/lib/3d/part-variants';

type SaddleProps = {
  geometry: BikeGeometry;
  variant: SaddleVariant;
};

/**
 * Saddle: shell, nose and rails.
 *
 * A narrow shell is a short-nose race saddle; a wider one is an endurance shape
 * with a longer body and steel rails instead of carbon.
 */
export function Saddle({ geometry, variant }: SaddleProps) {
  const { saddleCenter } = geometry;
  const [x, y] = saddleCenter;

  const shellHeight = variant.profile === 'race' ? 0.026 : 0.032;

  return (
    <group name="saddle">
      {/* Shell */}
      <mesh position={[x, y, 0]} scale={[variant.shellLength / 2, shellHeight, variant.shellWidth / 2]}>
        <primitive object={unitSphere(20, 14)} attach="geometry" />
        <primitive object={standardMaterial('barTape')} attach="material" />
      </mesh>

      {/* Nose */}
      <mesh
        position={[x + variant.shellLength / 2 + variant.noseLength / 2 - 0.01, y - 0.004, 0]}
        scale={[variant.noseLength / 2, shellHeight * 0.55, variant.shellWidth / 6]}
      >
        <primitive object={unitSphere(14, 10)} attach="geometry" />
        <primitive object={standardMaterial('barTape')} attach="material" />
      </mesh>

      {/* Rails */}
      {[0.016, -0.016].map((offset) => (
        <mesh key={offset} position={[x, y - 0.024, offset]} rotation={[Math.PI / 2, 0, 0]} scale={[0.0035, variant.shellLength * 0.8, 0.0035]}>
          <primitive object={unitBox()} attach="geometry" />
          <primitive object={standardMaterial(variant.railMaterial)} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

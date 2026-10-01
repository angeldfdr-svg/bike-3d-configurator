'use client';

import { bikeMaterials } from '@/components/3d/materials';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';

/**
 * Saddle: shell and rails at the top of the seatpost.
 */
export function Saddle({ geometry }: { geometry: BikeGeometry }) {
  const { saddleCenter } = geometry;
  const [x, y] = saddleCenter;

  return (
    <group name="saddle">
      <mesh position={[x, y, 0]} scale={[0.135, 0.026, 0.055]}>
        <sphereGeometry args={[1, 20, 14]} />
        <meshStandardMaterial {...bikeMaterials.barTape} />
      </mesh>

      {/* Nose */}
      <mesh position={[x + 0.115, y - 0.004, 0]} scale={[0.06, 0.014, 0.018]}>
        <sphereGeometry args={[1, 14, 10]} />
        <meshStandardMaterial {...bikeMaterials.barTape} />
      </mesh>

      {/* Rails */}
      <mesh position={[x, y - 0.022, 0.016]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, 0.2, 8]} />
        <meshStandardMaterial {...bikeMaterials.steel} />
      </mesh>
      <mesh position={[x, y - 0.022, -0.016]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, 0.2, 8]} />
        <meshStandardMaterial {...bikeMaterials.steel} />
      </mesh>
    </group>
  );
}

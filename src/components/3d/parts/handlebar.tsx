'use client';

import { useMemo } from 'react';
import { MathUtils } from 'three';

import { Tube } from '@/components/3d/tube';
import { bikeMaterials } from '@/components/3d/materials';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';

const DROP_RADIUS = 0.085;

/**
 * Handlebar: stem, tops and drops.
 *
 * Width comes from the selected handlebar, so a 40 cm bar is visibly narrower
 * than a 44 cm gravel bar.
 */
export function Handlebar({ geometry }: { geometry: BikeGeometry }) {
  const { handlebarCenter, headTubeTop, handlebarWidth } = geometry;

  const drops = useMemo(
    () =>
      [-1, 1].map((side) => {
        const z = side * (handlebarWidth / 2);
        const bend = 0.075;

        return { key: side, z, bend };
      }),
    [handlebarWidth],
  );

  return (
    <group name="handlebar">
      {/* Stem */}
      <Tube
        from={headTubeTop}
        to={[handlebarCenter[0], handlebarCenter[1], 0]}
        radius={0.013}
        material="carbon"
      />

      {/* Tops */}
      <mesh position={[handlebarCenter[0], handlebarCenter[1], 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.0125, 0.0125, handlebarWidth, 14]} />
        <meshStandardMaterial {...bikeMaterials.barTape} />
      </mesh>

      {/* Drops */}
      {drops.map((drop) => (
        <group key={drop.key} position={[handlebarCenter[0], handlebarCenter[1], drop.z]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[DROP_RADIUS, 0.0125, 8, 24, Math.PI]} />
            <meshStandardMaterial {...bikeMaterials.barTape} />
          </mesh>
          {/* Hoods */}
          <mesh position={[DROP_RADIUS * 0.55, DROP_RADIUS * 0.45, 0]}>
            <boxGeometry args={[0.075, 0.05, 0.032]} />
            <meshStandardMaterial {...bikeMaterials.barTape} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Brake/shift levers, mounted on the hoods. */
export function Levers({ geometry }: { geometry: BikeGeometry }) {
  const { handlebarCenter, handlebarWidth } = geometry;

  const sides = useMemo(() => [-1, 1], []);

  return (
    <group name="levers">
      {sides.map((side) => (
        <mesh
          key={side}
          position={[
            handlebarCenter[0] + DROP_RADIUS * 0.62,
            handlebarCenter[1] + DROP_RADIUS * 0.3,
            side * (handlebarWidth / 2),
          ]}
          rotation={[0, 0, MathUtils.degToRad(-12)]}
        >
          <boxGeometry args={[0.03, 0.11, 0.022]} />
          <meshStandardMaterial {...bikeMaterials.darkMetal} />
        </mesh>
      ))}
    </group>
  );
}

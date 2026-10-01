'use client';

import { Tube } from '@/components/3d/tube';
import { torus, unitBox, unitCylinder } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';
import type { HandlebarVariant } from '@/lib/3d/part-variants';

type HandlebarProps = {
  geometry: BikeGeometry;
  variant: HandlebarVariant;
};

/**
 * Handlebar: stem, tops and drops.
 *
 * Width, drop and reach come from the selected bar, and a gravel bar flares
 * outwards towards the drops, so it is visibly wider at the bottom than at the
 * top.
 */
export function Handlebar({ geometry, variant }: HandlebarProps) {
  const { handlebarCenter, headTubeTop, handlebarWidth } = geometry;
  const { flare, dropRadius, bodyMaterial, tapeMaterial } = variant;

  const drops = dropOffsets(handlebarWidth, flare);

  return (
    <group name="handlebar">
      {/* Stem */}
      <Tube from={headTubeTop} to={[handlebarCenter[0], handlebarCenter[1], 0]} radius={0.013} material="carbon" />

      {/* Bar clamp */}
      <mesh position={[handlebarCenter[0], handlebarCenter[1], 0]} scale={[0.03, 0.03, handlebarWidth + 0.01]}>
        <primitive object={unitCylinder(14)} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>

      {/* Tops */}
      <mesh
        position={[handlebarCenter[0], handlebarCenter[1], 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.0125, handlebarWidth, 0.0125]}
      >
        <primitive object={unitCylinder(14)} attach="geometry" />
        <primitive object={standardMaterial(tapeMaterial)} attach="material" />
      </mesh>

      {/* Drops, flared outwards on gravel bars */}
      {drops.map((drop) => (
        <group key={drop.key} position={[handlebarCenter[0], handlebarCenter[1], drop.z]}>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <primitive object={torus(dropRadius, 0.0125, 8, 24, Math.PI)} attach="geometry" />
            <primitive object={standardMaterial(bodyMaterial)} attach="material" />
          </mesh>
          {/* Hoods */}
          <mesh position={[dropRadius * 0.55, dropRadius * 0.45, 0]} scale={[0.075, 0.05, 0.032]}>
            <primitive object={unitBox()} attach="geometry" />
            <primitive object={standardMaterial(tapeMaterial)} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Brake/shift levers, mounted on the hoods. */
export function Levers({ geometry, variant }: HandlebarProps) {
  const { handlebarCenter, handlebarWidth } = geometry;
  const { flare, dropRadius, reach } = variant;

  const sides = [-1, 1];

  return (
    <group name="levers">
      {sides.map((side) => (
        <mesh
          key={side}
          position={[
            handlebarCenter[0] + dropRadius * 0.62 + reach * 0.2,
            handlebarCenter[1] + dropRadius * 0.3,
            side * (handlebarWidth / 2 + flare),
          ]}
          rotation={[0, 0, -0.21]}
          scale={[0.03, 0.11, 0.022]}
        >
          <primitive object={unitBox()} attach="geometry" />
          <primitive object={standardMaterial('darkMetal')} attach="material" />
        </mesh>
      ))}
    </group>
  );
}

/** Where each drop sits: half the width, plus the flare on gravel bars. */
function dropOffsets(width: number, flare: number): readonly { key: string; z: number }[] {
  return [
    { key: 'left', z: -(width / 2 + flare) },
    { key: 'right', z: width / 2 + flare },
  ];
}

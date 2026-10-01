'use client';

import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';

import type { Vec3 } from '@/lib/3d/bike-geometry';
import { bikeMaterials, type MaterialName } from '@/components/3d/materials';

const UP = new Vector3(0, 1, 0);

type TubeProps = {
  from: Vec3;
  to: Vec3;
  radius?: number;
  material?: MaterialName;
  radialSegments?: number;
};

/**
 * A cylinder spanning two points.
 *
 * The whole procedural bike is built from these, which keeps tube diameters
 * and orientation in one place.
 */
export function Tube({
  from,
  to,
  radius = 0.011,
  material = 'framePaint',
  radialSegments = 12,
}: TubeProps) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new Vector3(from[0], from[1], from[2]);
    const end = new Vector3(to[0], to[1], to[2]);
    const direction = end.clone().sub(start);
    const middle = start.clone().add(end).multiplyScalar(0.5);
    const orientation = new Quaternion().setFromUnitVectors(
      UP,
      direction.clone().normalize(),
    );

    return {
      position: [middle.x, middle.y, middle.z] as Vec3,
      quaternion: [orientation.x, orientation.y, orientation.z, orientation.w] as const,
      length: Math.max(direction.length(), 0.0001),
    };
  }, [from, to]);

  const preset = bikeMaterials[material];

  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, radialSegments]} />
      <meshStandardMaterial
        color={preset.color}
        metalness={preset.metalness}
        roughness={preset.roughness}
      />
    </mesh>
  );
}

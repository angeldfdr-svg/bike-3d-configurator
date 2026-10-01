'use client';

import { useMemo } from 'react';
import { Quaternion, Vector3 } from 'three';

import { unitCylinder } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import type { MaterialName } from '@/lib/3d/material-palette';
import type { Vec3 } from '@/lib/3d/bike-geometry';

const UP = new Vector3(0, 1, 0);

type TubeProps = {
  from: Vec3;
  to: Vec3;
  radius?: number;
  material?: MaterialName;
  radialSegments?: number;
  /**
   * Flattening of the tube cross-section, used for aerodynamic profiles. The
   * entries scale the local axes of the tube: `[1, 1, 1.35]` is a deep aero
   * section, `[1, 1, 1]` a round one.
   */
  scale?: readonly [number, number, number];
};

/**
 * A cylinder spanning two points.
 *
 * The whole procedural bike is built from these. The geometry is one shared
 * unit cylinder scaled to the span, so twenty tubes cost a single buffer, and
 * the finish comes from the shared material cache.
 */
export function Tube({
  from,
  to,
  radius = 0.011,
  material = 'framePaint',
  radialSegments = 12,
  scale,
}: TubeProps) {
  const { position, quaternion, meshScale } = useMemo(() => {
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
      // Unit cylinder: radius on the cross-section, span along the axis.
      meshScale: [
        radius * (scale?.[0] ?? 1),
        Math.max(direction.length(), 0.0001) * (scale?.[1] ?? 1),
        radius * (scale?.[2] ?? 1),
      ] as Vec3,
    };
  }, [from, to, radius, scale]);

  return (
    <mesh position={position} quaternion={quaternion} scale={meshScale}>
      <primitive object={unitCylinder(radialSegments)} attach="geometry" />
      <primitive object={standardMaterial(material)} attach="material" />
    </mesh>
  );
}

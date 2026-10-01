'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Euler, InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';
import type { BufferGeometry, Material } from 'three';

import { unitBox, unitCylinder } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import type { InstancePlacement } from '@/lib/3d/instances';
import type { MaterialName } from '@/lib/3d/material-palette';

type InstancedPartsProps = {
  placements: readonly InstancePlacement[];
  /** Shared geometry to repeat. */
  geometry?: BufferGeometry;
  material?: MaterialName | Material;
  name?: string;
};

/**
 * Many copies of one shape, drawn in a single call.
 *
 * Spokes and tread blocks repeat dozens of times per wheel: instancing them
 * keeps the draw calls flat and the buffers shared.
 */
export function InstancedParts({
  placements,
  geometry,
  material = 'steel',
  name,
}: InstancedPartsProps) {
  const ref = useRef<InstancedMesh>(null);
  const shared = useMemo(
    () => geometry ?? unitBox(),
    [geometry],
  );
  const resolved = typeof material === 'string' ? standardMaterial(material) : material;

  useEffect(() => {
    const mesh = ref.current;

    if (mesh === null) return;

    const matrix = new Matrix4();
    const position = new Vector3();
    const rotation = new Euler();
    const quaternion = new Quaternion();
    const scale = new Vector3();

    placements.forEach((placement, index) => {
      position.set(placement.position[0], placement.position[1], placement.position[2]);
      rotation.set(placement.rotation[0], placement.rotation[1], placement.rotation[2]);
      quaternion.setFromEuler(rotation);
      scale.set(placement.scale[0], placement.scale[1], placement.scale[2]);

      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.count = placements.length;
  }, [placements]);

  if (placements.length === 0) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[shared, resolved, placements.length]}
      name={name}
      frustumCulled={false}
    />
  );
}

/** A ring of thin cylinders, used for spokes. */
export function InstancedSpokes({
  placements,
  material = 'steel',
}: {
  placements: readonly InstancePlacement[];
  material?: MaterialName;
}) {
  return (
    <InstancedParts
      placements={placements}
      geometry={unitCylinder(5)}
      material={material}
      name="spokes"
    />
  );
}

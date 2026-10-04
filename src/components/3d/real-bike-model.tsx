'use client';

import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import type { Group } from 'three';

import type { GlbModelRef } from '@/components/3d/parts/glb-models';

export type RealBikeModelProps = {
  readonly model: GlbModelRef;
  readonly target?: {
    readonly position: readonly [number, number, number];
    readonly rotation?: readonly [number, number, number];
  };
};

export function RealBikeModel({ model, target }: RealBikeModelProps) {
  const { scene } = useGLTF(model.url);

  const displayPosition = target?.position ?? [0, 0.2, 0] as const;
  const displayRotation = target?.rotation ?? model.rotation ?? [0, 0, 0] as const;

  const clone = useMemo(() => {
    const root = scene.clone(true) as Group;
    root.traverse((child) => {
      if ('castShadow' in child) child.castShadow = true;
      if ('receiveShadow' in child) child.receiveShadow = true;
    });
    return root;
  }, [scene]);

  return (
    <group
      position={displayPosition}
      rotation={displayRotation}
      scale={model.scale ?? 1}
      name="real-bike-model"
    >
      <primitive object={clone} dispose={null} />
    </group>
  );
}

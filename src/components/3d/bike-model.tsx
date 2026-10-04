'use client';

import { useMemo } from 'react';

import { RealBikeModel } from '@/components/3d/real-bike-model';
import { resolvePartModel } from '@/components/3d/parts/glb-models';
import { Levers } from '@/components/3d/parts/handlebar';
import { partRegistry } from '@/components/3d/parts/registry';
import { createShadowTexture } from '@/components/3d/shadow';
import { catalog } from '@/data/catalog';
import { findSelection } from '@/lib/catalog';
import { resolveBikeGeometry } from '@/lib/3d/bike-geometry';
import {
  mountedQuantity,
  resolveCrankVariant,
  resolveFrameVariant,
  resolveGroupsetVariant,
  resolveHandlebarVariant,
  resolveSaddleVariant,
  resolveTireVariant,
  resolveWheelVariant,
} from '@/lib/3d/part-variants';
import { useBikeStore } from '@/store/bike-store';

/**
 * The procedural bicycle.
 *
 * Every part is resolved from the current configuration through the variant
 * resolvers and drawn by the registry, so the bike on screen is always the bike
 * that was configured — including parts that are simply not there, like the
 * second chainring of a mono-plate crankset.
 */
export function BikeModel() {
  const configuration = useBikeStore((state) => state.configuration);

  const parts = useMemo(() => {
    const selection = findSelection(catalog, configuration);

    return {
      geometry: resolveBikeGeometry(configuration, catalog),
      frame: resolveFrameVariant(selection.frame),
      wheel: resolveWheelVariant(selection.wheelset),
      tire: resolveTireVariant(selection.tire),
      groupset: resolveGroupsetVariant(selection.groupset),
      crankset: resolveCrankVariant(selection.crankset),
      handlebar: resolveHandlebarVariant(selection.handlebar),
      saddle: resolveSaddleVariant(selection.saddle),
      accessories: selection.accessories.filter(
        (accessory) => mountedQuantity(accessory) > 0,
      ),
    };
  }, [configuration]);

  const shadow = useMemo(() => createShadowTexture(), []);
  const selectedFrameId = configuration.frameId ?? '';
  const realModel = resolvePartModel(selectedFrameId);

  if (realModel !== undefined) {
    return (
      <group name="bike">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[2.6, 1.2]} />
          <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.9} />
        </mesh>

        <RealBikeModel
          model={realModel}
          target={{ position: realModel.position ?? [0, 0.2, 0], rotation: realModel.rotation ?? [0, 0, 0] }}
        />
      </group>
    );
  }

  return (
    <group name="bike">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={[2.6, 1.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} opacity={0.9} />
      </mesh>

      <partRegistry.rodas geometry={parts.geometry} wheel={parts.wheel} tire={parts.tire} />
      <partRegistry.quadro geometry={parts.geometry} variant={parts.frame} />
      <partRegistry.grupo geometry={parts.geometry} variant={parts.groupset} />
      <partRegistry.pedaleiro geometry={parts.geometry} variant={parts.crankset} />
      <partRegistry.guiador geometry={parts.geometry} variant={parts.handlebar} />
      <Levers geometry={parts.geometry} variant={parts.handlebar} />
      <partRegistry.selim geometry={parts.geometry} variant={parts.saddle} />
      <partRegistry.extras geometry={parts.geometry} accessories={parts.accessories} />
    </group>
  );
}

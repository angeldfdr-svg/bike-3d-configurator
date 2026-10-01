'use client';

import { Tube } from '@/components/3d/tube';
import { bikeMaterials } from '@/components/3d/materials';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';

/**
 * Frame: main triangle, rear triangle, seatpost and fork.
 *
 * Phase 5 will swap the tube profile and the paint per selected frame; the
 * anchor points it draws between are already driven by the geometry.
 */
export function Frame({ geometry }: { geometry: BikeGeometry }) {
  const { bottomBracket, seatCluster, headTubeTop, headTubeBottom, rearAxle, frontAxle, saddleCenter } =
    geometry;

  const seatpostTop: [number, number, number] = [saddleCenter[0], saddleCenter[1] - 0.03, 0];

  return (
    <group name="frame">
      {/* Main triangle */}
      <Tube from={bottomBracket} to={seatCluster} radius={0.016} material="framePaint" />
      <Tube from={seatCluster} to={headTubeTop} radius={0.014} material="framePaint" />
      <Tube from={headTubeTop} to={headTubeBottom} radius={0.019} material="framePaint" />
      <Tube from={headTubeBottom} to={bottomBracket} radius={0.018} material="framePaint" />

      {/* Rear triangle */}
      <Tube from={bottomBracket} to={rearAxle} radius={0.012} material="framePaint" />
      <Tube from={seatCluster} to={rearAxle} radius={0.011} material="framePaint" />

      {/* Bottom bracket shell */}
      <mesh position={[bottomBracket[0], bottomBracket[1], 0]}>
        <cylinderGeometry args={[0.024, 0.024, 0.075, 16]} />
        <meshStandardMaterial {...bikeMaterials.darkMetal} />
      </mesh>

      {/* Seatpost */}
      <Tube from={seatCluster} to={seatpostTop} radius={0.0135} material="carbon" />

      {/* Fork */}
      <Tube from={headTubeBottom} to={frontAxle} radius={0.013} material="carbon" />

      {/* Dropouts */}
      <mesh position={[rearAxle[0], rearAxle[1], 0]}>
        <boxGeometry args={[0.05, 0.05, 0.11]} />
        <meshStandardMaterial {...bikeMaterials.darkMetal} />
      </mesh>
      <mesh position={[frontAxle[0], frontAxle[1], 0]}>
        <boxGeometry args={[0.05, 0.05, 0.11]} />
        <meshStandardMaterial {...bikeMaterials.darkMetal} />
      </mesh>
    </group>
  );
}

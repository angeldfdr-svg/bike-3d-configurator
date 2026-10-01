'use client';

import { Tube } from '@/components/3d/tube';
import { cylinder, unitBox } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import type { FrameVariant } from '@/lib/3d/part-variants';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';

type FrameProps = {
  geometry: BikeGeometry;
  variant: FrameVariant;
};

/**
 * Frame: main triangle, rear triangle, seatpost and fork.
 *
 * The variant decides the tube profile and the finish: an aero carbon frame has
 * deep flattened tubes and internal cable routing, a titanium gravel frame has
 * round tubes and bare metal.
 */
export function Frame({ geometry, variant }: FrameProps) {
  const { bottomBracket, seatCluster, headTubeTop, headTubeBottom, rearAxle, frontAxle, saddleCenter } =
    geometry;

  const seatpostTop: [number, number, number] = [saddleCenter[0], saddleCenter[1] - 0.03, 0];
  const paint = variant.paint;
  const { tubeScale } = variant;

  return (
    <group name="frame">
      {/* Main triangle */}
      <Tube from={bottomBracket} to={seatCluster} radius={0.016} material={paint} scale={tubeScale} />
      <Tube from={seatCluster} to={headTubeTop} radius={0.014} material={paint} scale={tubeScale} />
      <Tube from={headTubeTop} to={headTubeBottom} radius={0.019} material={paint} />
      <Tube from={headTubeBottom} to={bottomBracket} radius={0.018} material={paint} scale={tubeScale} />

      {/* Rear triangle */}
      <Tube from={bottomBracket} to={rearAxle} radius={0.012} material={paint} />
      <Tube from={seatCluster} to={rearAxle} radius={0.011} material={paint} />

      {/* Internal cable routing, visible along the down tube */}
      {variant.internalRouting ? (
        <Tube
          from={[headTubeBottom[0] - 0.01, headTubeBottom[1] - 0.01, 0.028]}
          to={[bottomBracket[0] + 0.01, bottomBracket[1] + 0.01, 0.028]}
          radius={0.0022}
          material="darkMetal"
          radialSegments={6}
        />
      ) : null}

      {/* Bottom bracket shell */}
      <mesh position={[bottomBracket[0], bottomBracket[1], 0]} scale={[0.048, 0.075, 0.075]}>
        <primitive object={cylinder(0.024, 0.024, 0.075, 16)} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>

      {/* Seatpost */}
      <Tube from={seatCluster} to={seatpostTop} radius={0.0135} material="carbon" />

      {/* Fork */}
      <Tube from={headTubeBottom} to={frontAxle} radius={0.013} material="carbon" scale={tubeScale} />

      {/* Dropouts */}
      <mesh position={[rearAxle[0], rearAxle[1], 0]} scale={[0.05, 0.05, 0.11]}>
        <primitive object={unitBox()} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>
      <mesh position={[frontAxle[0], frontAxle[1], 0]} scale={[0.05, 0.05, 0.11]}>
        <primitive object={unitBox()} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>
    </group>
  );
}

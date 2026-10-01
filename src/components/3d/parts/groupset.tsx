'use client';

import { useMemo } from 'react';

import { InstancedParts } from '@/components/3d/instanced-parts';
import { Tube } from '@/components/3d/tube';
import { unitBox, unitCylinder } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import { cassettePlacements, type InstancePlacement } from '@/lib/3d/instances';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';
import type { GroupsetVariant } from '@/lib/3d/part-variants';

type GroupsetProps = {
  geometry: BikeGeometry;
  variant: GroupsetVariant;
};

/**
 * Groupset: cassette, derailleur, chain and brakes.
 *
 * The variant decides what is drawn at all: a rim brake group has calipers on
 * the rim and no rotors, an electronic group has a battery instead of cables,
 * and the cassette grows a sprocket per speed.
 */
export function Groupset({ geometry, variant }: GroupsetProps) {
  const { rearAxle, bottomBracket, chainringRadius, frontAxle } = geometry;

  const cassetteCenter = useMemo<[number, number, number]>(
    () => [rearAxle[0], rearAxle[1], 0],
    [rearAxle],
  );
  const sprockets = useMemo(
    () =>
      cassettePlacements(variant.sprocketCount, cassetteCenter, {
        largestRadius: 0.056,
        radiusStep: 0.0042,
        innerOffset: 0.016,
        offsetStep: variant.cassetteWidth / Math.max(variant.sprocketCount - 1, 1),
        thickness: 0.0022,
      }),
    [variant.sprocketCount, variant.cassetteWidth, cassetteCenter],
  );

  const topRun = {
    from: [bottomBracket[0], bottomBracket[1] + chainringRadius, 0.035] as const,
    to: [cassetteCenter[0], cassetteCenter[1] + 0.05, 0.035] as const,
  };
  const bottomRun = {
    from: [bottomBracket[0], bottomBracket[1] - chainringRadius, 0.035] as const,
    to: [cassetteCenter[0] + 0.01, cassetteCenter[1] - 0.045, 0.035] as const,
  };

  return (
    <group name="groupset">
      <Cassette placements={sprockets} />

      {/* Rear derailleur */}
      <mesh position={[cassetteCenter[0] + 0.015, cassetteCenter[1] - 0.075, 0.04]} scale={[0.05, 0.075, 0.028]}>
        <primitive object={unitBox()} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>
      <mesh position={[cassetteCenter[0] + 0.005, cassetteCenter[1] - 0.115, 0.04]} scale={[0.018, 0.012, 0.018]}>
        <primitive object={unitCylinder(14)} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>

      {/* Chain runs */}
      <Tube from={topRun.from} to={topRun.to} radius={0.004} material="steel" radialSegments={6} />
      <Tube from={bottomRun.from} to={bottomRun.to} radius={0.004} material="steel" radialSegments={6} />

      {variant.brake === 'disco' ? (
        <DiscBrakes frontAxle={frontAxle} rearAxle={rearAxle} />
      ) : (
        <RimBrakes frontAxle={frontAxle} rearAxle={rearAxle} wheelRadius={geometry.wheelRadius} />
      )}

      {variant.shifting === 'mecanico' ? (
        <Cables geometry={geometry} />
      ) : (
        <BatteryPack geometry={geometry} />
      )}
    </group>
  );
}

/** Sprocket stack, one instance per speed. */
function Cassette({ placements }: { placements: readonly InstancePlacement[] }) {
  return (
    <group name="cassette">
      <InstancedParts placements={placements} material="steel" name="cassette" />
    </group>
  );
}

function DiscBrakes({
  frontAxle,
  rearAxle,
}: {
  frontAxle: BikeGeometry['frontAxle'];
  rearAxle: BikeGeometry['rearAxle'];
}) {
  return (
    <group name="disc-brakes">
      {[frontAxle, rearAxle].map((axle, index) => (
        <group key={index} name={index === 0 ? 'rotor-front' : 'rotor-rear'}>
          <mesh position={[axle[0], axle[1], 0.028]} scale={[0.082, 0.082, 0.082]}>
            <primitive object={unitCylinder(28)} attach="geometry" />
            <primitive object={standardMaterial('steel')} attach="material" />
          </mesh>
          {/* Carrier and caliper */}
          <mesh position={[axle[0], axle[1] - 0.045, 0.055]} scale={[0.045, 0.06, 0.03]}>
            <primitive object={unitBox()} attach="geometry" />
            <primitive object={standardMaterial('darkMetal')} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RimBrakes({
  frontAxle,
  rearAxle,
  wheelRadius,
}: {
  frontAxle: BikeGeometry['frontAxle'];
  rearAxle: BikeGeometry['rearAxle'];
  wheelRadius: number;
}) {
  return (
    <group name="rim-brakes">
      {[frontAxle, rearAxle].map((axle, index) => (
        <group key={index} name={index === 0 ? 'caliper-front' : 'caliper-rear'}>
          {/* Caliper sits on the rim, at the top of the wheel */}
          <mesh position={[axle[0], axle[1] + wheelRadius - 0.012, 0]} scale={[0.04, 0.055, 0.026]}>
            <primitive object={unitBox()} attach="geometry" />
            <primitive object={standardMaterial('darkMetal')} attach="material" />
          </mesh>
          {/* Brake pads */}
          <mesh position={[axle[0], axle[1] + wheelRadius - 0.012, 0.014]} scale={[0.03, 0.02, 0.008]}>
            <primitive object={unitBox()} attach="geometry" />
            <primitive object={standardMaterial('rubber')} attach="material" />
          </mesh>
          <mesh position={[axle[0], axle[1] + wheelRadius - 0.012, -0.014]} scale={[0.03, 0.02, 0.008]}>
            <primitive object={unitBox()} attach="geometry" />
            <primitive object={standardMaterial('rubber')} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Mechanical groupsets run housing along the down tube and the seatstay. */
function Cables({ geometry }: { geometry: BikeGeometry }) {
  const { headTubeBottom, bottomBracket, seatCluster, rearAxle } = geometry;

  return (
    <group name="cables">
      <Tube
        from={[headTubeBottom[0] - 0.005, headTubeBottom[1] - 0.005, 0.03]}
        to={[bottomBracket[0] + 0.005, bottomBracket[1] + 0.005, 0.03]}
        radius={0.0032}
        material="darkMetal"
        radialSegments={6}
      />
      <Tube
        from={[seatCluster[0] - 0.005, seatCluster[1] - 0.005, 0.03]}
        to={[rearAxle[0] + 0.005, rearAxle[1] + 0.005, 0.03]}
        radius={0.0032}
        material="darkMetal"
        radialSegments={6}
      />
    </group>
  );
}

/** Electronic groupsets carry a battery on the seatpost instead. */
function BatteryPack({ geometry }: { geometry: BikeGeometry }) {
  const { seatCluster, saddleCenter } = geometry;
  const midY = (seatCluster[1] + saddleCenter[1]) / 2;

  return (
    <group name="battery">
      <mesh position={[seatCluster[0] + 0.012, midY, 0]} scale={[0.05, 0.03, 0.022]}>
        <primitive object={unitBox()} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>
    </group>
  );
}

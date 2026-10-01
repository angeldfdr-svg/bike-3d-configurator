'use client';

import { useMemo } from 'react';

import { InstancedParts, InstancedSpokes } from '@/components/3d/instanced-parts';
import { torus, unitCylinder } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import { ringPlacements, spokePlacements } from '@/lib/3d/instances';
import type { BikeGeometry, Vec3 } from '@/lib/3d/bike-geometry';
import type { TireVariant, WheelVariant } from '@/lib/3d/part-variants';

type WheelProps = {
  center: Vec3;
  wheelRadius: number;
  tireWidth: number;
  rimDepth: number;
  wheelVariant: WheelVariant;
  tireVariant: TireVariant;
};

/**
 * One wheel: rim, spokes, hub and tyre.
 *
 * Everything that repeats is instanced, so a wheel costs four draw calls
 * regardless of the spoke count.
 */
export function Wheel({
  center,
  wheelRadius,
  tireWidth,
  rimDepth,
  wheelVariant,
  tireVariant,
}: WheelProps) {
  const spokes = useMemo(
    () =>
      spokePlacements(
        wheelVariant.spokeCount,
        center,
        0.024,
        Math.max(wheelRadius - tireWidth - rimDepth / 2 - 0.01, 0.03),
        wheelVariant.spokeRadius,
      ),
    [center, wheelRadius, tireWidth, rimDepth, wheelVariant],
  );

  return (
    <group name="wheel">
      <Rim
        center={center}
        wheelRadius={wheelRadius}
        tireWidth={tireWidth}
        rimDepth={rimDepth}
        variant={wheelVariant}
      />
      <InstancedSpokes placements={spokes} material="steel" />
      <Hub center={center} variant={wheelVariant} />
      <Tire
        center={center}
        wheelRadius={wheelRadius}
        tireWidth={tireWidth}
        variant={tireVariant}
      />
    </group>
  );
}

/**
 * Both wheels at the anchor points of the geometry.
 *
 * Rim depth, tyre width, spoke count and tread all come from the selected
 * products, so a deeper rim or a wider tyre changes the silhouette without any
 * new code.
 */
export function Wheels({
  geometry,
  wheel,
  tire,
}: {
  geometry: BikeGeometry;
  wheel: WheelVariant;
  tire: TireVariant;
}) {
  const { rearAxle, frontAxle, wheelRadius, tireWidth, rimDepth } = geometry;

  return (
    <group name="wheels">
      <Wheel
        center={rearAxle}
        wheelRadius={wheelRadius}
        tireWidth={tireWidth}
        rimDepth={rimDepth}
        wheelVariant={wheel}
        tireVariant={tire}
      />
      <Wheel
        center={frontAxle}
        wheelRadius={wheelRadius}
        tireWidth={tireWidth}
        rimDepth={rimDepth}
        wheelVariant={wheel}
        tireVariant={tire}
      />
    </group>
  );
}

/** Rim ring: depth and finish come from the selected wheelset. */
export function Rim({
  center,
  wheelRadius,
  tireWidth,
  rimDepth,
  variant,
}: {
  center: Vec3;
  wheelRadius: number;
  tireWidth: number;
  rimDepth: number;
  variant: WheelVariant;
}) {
  const innerRadius = wheelRadius - tireWidth;
  const [cx, cy] = center;

  return (
    <group name="rim">
      <mesh position={[cx, cy, 0]}>
        <primitive object={torus(innerRadius - rimDepth / 2, rimDepth / 2, 8, 56)} attach="geometry" />
        <primitive object={standardMaterial(variant.rimMaterial)} attach="material" />
      </mesh>

      {/* Machined braking surface on alloy rims */}
      {variant.machinedSurface ? (
        <mesh position={[cx, cy, 0]}>
          <primitive
            object={torus(innerRadius - rimDepth / 2, rimDepth / 2 - 0.004, 8, 56)}
            attach="geometry"
          />
          <primitive object={standardMaterial('rawAlloy')} attach="material" />
        </mesh>
      ) : null}
    </group>
  );
}

/** Hub shell, end caps and the rotor or the rim brake track. */
export function Hub({ center, variant }: { center: Vec3; variant: WheelVariant }) {
  const [cx, cy] = center;

  return (
    <group name="hub">
      <mesh position={[cx, cy, 0]} scale={[0.022, variant.hubWidth, 0.022]}>
        <primitive object={unitCylinder(16)} attach="geometry" />
        <primitive object={standardMaterial('alloy')} attach="material" />
      </mesh>
      <mesh position={[cx, cy, 0]} scale={[0.03, 0.012, 0.03]}>
        <primitive object={unitCylinder(16)} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>
    </group>
  );
}

/**
 * Tyre casing with a tread pattern derived from the casing density.
 *
 * A 320 tpi cotton casing is a slick racing tyre; a 60 tpi all-weather casing
 * carries visible blocks.
 */
export function Tire({
  center,
  wheelRadius,
  tireWidth,
  variant,
}: {
  center: Vec3;
  wheelRadius: number;
  tireWidth: number;
  variant: TireVariant;
}) {
  const knobs = useMemo(
    () =>
      ringPlacements(
        variant.treadCount,
        center,
        wheelRadius - variant.knobSize,
        [variant.knobSize, variant.knobSize, Math.max(tireWidth - 0.006, 0.006)],
      ),
    [center, wheelRadius, tireWidth, variant],
  );

  const [cx, cy] = center;
  const treadRadius = wheelRadius - 0.002;

  return (
    <group name="tire">
      {/* Casing */}
      <mesh position={[cx, cy, 0]}>
        <primitive object={torus(wheelRadius - tireWidth / 2, tireWidth / 2, 10, 64)} attach="geometry" />
        <primitive object={standardMaterial(variant.sidewall)} attach="material" />
      </mesh>

      {/* Tread line */}
      <mesh position={[cx, cy, 0]}>
        <primitive object={torus(treadRadius, 0.0045, 8, 64)} attach="geometry" />
        <primitive object={standardMaterial('rubber')} attach="material" />
      </mesh>

      {/* Tread blocks */}
      <InstancedParts placements={knobs} material="rubber" name="tread" />

      {/* Bead: a glued tubular casing hides it */}
      {variant.bead === 'visible' ? (
        <mesh position={[cx, cy, 0]}>
          <primitive object={torus(wheelRadius - tireWidth, 0.0022, 6, 56)} attach="geometry" />
          <primitive object={standardMaterial('darkMetal')} attach="material" />
        </mesh>
      ) : null}
    </group>
  );
}

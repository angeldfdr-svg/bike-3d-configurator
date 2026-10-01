'use client';

import { useMemo } from 'react';
import { CanvasTexture, RepeatWrapping, type Texture } from 'three';

import { bikeMaterials } from '@/components/3d/materials';
import type { Vec3 } from '@/lib/3d/bike-geometry';

/**
 * Tyres: tread plus tan sidewalls, mounted on a hub with spokes.
 *
 * The wheel is a disc in the XY plane, so a `TorusGeometry` needs no rotation
 * and spins around Z.
 */
export function Tire({
  center,
  wheelRadius,
  tireWidth,
}: {
  center: Vec3;
  wheelRadius: number;
  tireWidth: number;
}) {
  const spokes = useMemo(() => {
    const hubRadius = 0.024;
    const rimInner = Math.max(wheelRadius - tireWidth - 0.03, hubRadius + 0.01);
    const count = 10;

    return Array.from({ length: count }, (_, index) => {
      const angle = (index / count) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      return {
        key: index,
        from: [center[0] + hubRadius * cos, center[1] + hubRadius * sin, 0] as Vec3,
        to: [center[0] + rimInner * cos, center[1] + rimInner * sin, 0] as Vec3,
      };
    });
  }, [center, wheelRadius, tireWidth]);

  const [cx, cy] = center;

  return (
    <group name="tire">
      {/* Casing */}
      <mesh position={[cx, cy, 0]}>
        <torusGeometry args={[wheelRadius - tireWidth / 2, tireWidth / 2, 10, 64]} />
        <meshStandardMaterial {...bikeMaterials.tanWall} />
      </mesh>

      {/* Tread line */}
      <mesh position={[cx, cy, 0]}>
        <torusGeometry args={[wheelRadius - 0.003, 0.0045, 8, 64]} />
        <meshStandardMaterial {...bikeMaterials.rubber} />
      </mesh>

      {/* Hub */}
      <mesh position={[cx, cy, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.095, 16]} />
        <meshStandardMaterial {...bikeMaterials.alloy} />
      </mesh>

      {/* Spokes */}
      {spokes.map((spoke) => (
        <mesh
          key={spoke.key}
          position={[
            (spoke.from[0] + spoke.to[0]) / 2,
            (spoke.from[1] + spoke.to[1]) / 2,
            0,
          ]}
          rotation={[0, 0, Math.atan2(spoke.to[1] - spoke.from[1], spoke.to[0] - spoke.from[0]) - Math.PI / 2]}
        >
          <cylinderGeometry args={[0.0016, 0.0016, Math.hypot(spoke.to[0] - spoke.from[0], spoke.to[1] - spoke.from[1]), 5]} />
          <meshStandardMaterial {...bikeMaterials.steel} />
        </mesh>
      ))}
    </group>
  );
}

/** Rim ring: depth comes from the selected wheelset. */
export function Rim({
  center,
  wheelRadius,
  tireWidth,
  rimDepth,
}: {
  center: Vec3;
  wheelRadius: number;
  tireWidth: number;
  rimDepth: number;
}) {
  const innerRadius = wheelRadius - tireWidth;
  const [cx, cy] = center;

  return (
    <mesh position={[cx, cy, 0]}>
      <torusGeometry args={[innerRadius - rimDepth / 2, rimDepth / 2, 8, 56]} />
      <meshStandardMaterial {...bikeMaterials.carbon} />
    </mesh>
  );
}

/** Cassette stack, part of the groupset. */
export function Cassette({ center }: { center: Vec3 }) {
  const sprockets = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        key: index,
        radius: 0.052 - index * 0.0035,
        offset: 0.021 + index * 0.0045,
      })),
    [],
  );

  const [cx, cy] = center;

  return (
    <group name="cassette">
      {sprockets.map((sprocket) => (
        <mesh key={sprocket.key} position={[cx, cy, sprocket.offset]}>
          <cylinderGeometry args={[sprocket.radius, sprocket.radius, 0.0022, 20]} />
          <meshStandardMaterial {...bikeMaterials.steel} />
        </mesh>
      ))}
    </group>
  );
}

/** Soft contact shadow, generated at runtime so no asset is needed. */
export function createShadowTexture(): Texture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');

  if (context !== null) {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,0.55)');
    gradient.addColorStop(0.45, 'rgba(0,0,0,0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return texture;
}

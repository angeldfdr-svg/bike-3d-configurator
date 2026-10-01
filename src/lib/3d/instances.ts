import type { Vec3 } from '@/lib/3d/bike-geometry';

/**
 * Placement of instanced parts.
 *
 * Pure tuples, no Three.js: the scene turns these into instance matrices, so
 * "a 28 spoke wheel has 28 spokes" is a fact about the domain that can be
 * tested without a renderer.
 */

export type InstancePlacement = {
  readonly position: Vec3;
  /** Euler angles in radians, applied in XYZ order. */
  readonly rotation: Vec3;
  readonly scale: Vec3;
};

const IDENTITY_ROTATION: Vec3 = [0, 0, 0];

/** `count` copies of a part evenly spread around a circle. */
export function ringPlacements(
  count: number,
  center: Vec3,
  radius: number,
  scale: Vec3,
  phase = 0,
): readonly InstancePlacement[] {
  if (count <= 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + phase;

    return {
      position: [center[0] + radius * Math.cos(angle), center[1] + radius * Math.sin(angle), center[2]],
      rotation: [0, 0, angle] as Vec3,
      scale,
    };
  });
}

/**
 * Spokes of a wheel: thin cylinders from the hub flange to the rim.
 *
 * The cylinder axis is Y, so a spoke at angle `phi` needs a rotation of
 * `phi - 90°` to point outwards.
 */
export function spokePlacements(
  count: number,
  center: Vec3,
  hubRadius: number,
  rimRadius: number,
  spokeRadius: number,
  phase = 0,
): readonly InstancePlacement[] {
  if (count <= 0) return [];

  const mid = (hubRadius + rimRadius) / 2;
  const length = Math.max(rimRadius - hubRadius, 0.001);

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + phase;

    return {
      position: [center[0] + mid * Math.cos(angle), center[1] + mid * Math.sin(angle), center[2]],
      rotation: [0, 0, angle - Math.PI / 2] as Vec3,
      scale: [spokeRadius, length, spokeRadius] as Vec3,
    };
  });
}

/** Sprockets of a cassette: a stack that shrinks as it moves outboard. */
export function cassettePlacements(
  count: number,
  center: Vec3,
  options: {
    readonly largestRadius: number;
    readonly radiusStep: number;
    readonly innerOffset: number;
    readonly offsetStep: number;
    readonly thickness: number;
  },
): readonly InstancePlacement[] {
  if (count <= 0) return [];

  return Array.from({ length: count }, (_, index) => {
    const radius = Math.max(options.largestRadius - index * options.radiusStep, 0.018);

    return {
      position: [center[0], center[1], center[2] + options.innerOffset + index * options.offsetStep],
      rotation: [Math.PI / 2, 0, 0] as Vec3,
      scale: [radius, options.thickness, radius] as Vec3,
    };
  });
}

/** Bottle cages and other parts mounted on the down tube and the seat tube. */
export function tubeMountPlacements(
  count: number,
  from: Vec3,
  to: Vec3,
  offset: Vec3,
  spacing: number,
): readonly InstancePlacement[] {
  if (count <= 0) return [];

  const [x1, y1, z1] = from;
  const [x2, y2, z2] = to;
  const length = Math.hypot(x2 - x1, y2 - y1, z2 - z1);

  if (length < 0.0001) return [];

  const usable = Math.max(length - spacing * 2, 0);
  const step = count > 1 ? usable / (count - 1) : 0;

  return Array.from({ length: count }, (_, index) => {
    const t = count > 1 ? (spacing + index * step) / length : 0.5;

    return {
      position: [
        x1 + (x2 - x1) * t + offset[0],
        y1 + (y2 - y1) * t + offset[1],
        z1 + (z2 - z1) * t + offset[2],
      ] as Vec3,
      rotation: IDENTITY_ROTATION,
      scale: [0.014, 0.075, 0.055] as Vec3,
    };
  });
}

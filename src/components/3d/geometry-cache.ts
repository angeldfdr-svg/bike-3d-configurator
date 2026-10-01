import {
  BoxGeometry,
  CylinderGeometry,
  PlaneGeometry,
  SphereGeometry,
  TorusGeometry,
  type BufferGeometry,
} from 'three';

/**
 * Shared geometry cache.
 *
 * The procedural bike needs about sixty shapes, but only a handful of distinct
 * ones: every tube is a unit cylinder scaled to its span, every box is a unit
 * box, every rounded part is a unit sphere. Sharing the buffers keeps the GPU
 * memory and the draw-call state changes down, and it means a change to the
 * tessellation happens in exactly one place.
 *
 * Geometries are never disposed: they live as long as the scene, which is the
 * lifetime of the page.
 */

const cache = new Map<string, BufferGeometry>();

function cached<T extends BufferGeometry>(key: string, create: () => T): T {
  const existing = cache.get(key);

  if (existing !== undefined) return existing as T;

  const created = create();
  cache.set(key, created);

  return created;
}

function key(prefix: string, values: readonly number[]): string {
  return `${prefix}:${values.map((value) => value.toFixed(5)).join(',')}`;
}

/** Cylinder of radius 1 and height 1, centred on the origin. */
export function unitCylinder(radialSegments = 12): CylinderGeometry {
  return cached(key('cylinder', [radialSegments]), () => new CylinderGeometry(1, 1, 1, radialSegments));
}

/** Cylinder with explicit radii, for cones and tapered parts. */
export function cylinder(
  radiusTop: number,
  radiusBottom: number,
  height: number,
  radialSegments = 12,
): CylinderGeometry {
  return cached(
    key('cylinderTapered', [radiusTop, radiusBottom, height, radialSegments]),
    () => new CylinderGeometry(radiusTop, radiusBottom, height, radialSegments),
  );
}

/** Torus of major radius `radius` and tube radius `tube`. */
export function torus(
  radius: number,
  tube: number,
  radialSegments = 8,
  tubularSegments = 48,
  arc = Math.PI * 2,
): TorusGeometry {
  return cached(
    key('torus', [radius, tube, radialSegments, tubularSegments, arc]),
    () => new TorusGeometry(radius, tube, radialSegments, tubularSegments, arc),
  );
}

/** Box with sides of one unit, centred on the origin. */
export function unitBox(): BoxGeometry {
  return cached(key('box', []), () => new BoxGeometry(1, 1, 1));
}

/** Sphere of radius 1, centred on the origin. */
export function unitSphere(widthSegments = 20, heightSegments = 14): SphereGeometry {
  return cached(
    key('sphere', [widthSegments, heightSegments]),
    () => new SphereGeometry(1, widthSegments, heightSegments),
  );
}

/** Plane with sides of one unit, facing +Z. */
export function unitPlane(): PlaneGeometry {
  return cached(key('plane', []), () => new PlaneGeometry(1, 1));
}

/** Number of geometries currently shared, exposed for tests. */
export function geometryCacheSize(): number {
  return cache.size;
}

/** Drops every cached geometry. Only safe when no scene is mounted. */
export function clearGeometryCache(): void {
  for (const geometry of cache.values()) geometry.dispose();
  cache.clear();
}

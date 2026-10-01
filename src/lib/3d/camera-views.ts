import type { Vec3 } from '@/lib/3d/bike-geometry';
import { bikeCenter, bikeHeight } from '@/lib/3d/bike-geometry';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';
import type { CameraView } from '@/types/configuration';

/**
 * Preset camera views.
 *
 * Pure so the framing can be tested without a renderer: the scene only has to
 * move the camera to `position` and aim it at `target`.
 */

export type CameraPreset = {
  readonly position: Vec3;
  readonly target: Vec3;
};

/** Half of the vertical field of view of the stage camera, in radians. */
const VERTICAL_HALF_FOV = ((35 / 2) * Math.PI) / 180;
/** Aspect ratio the stage is designed around (16:10). */
const STAGE_ASPECT = 16 / 10;
/** Empty margin left around the bike. */
const FIT_PADDING = 1.2;
/** Extra room the tilted top view needs. */
const TOP_VIEW_FACTOR = 1.3;
const TOP_ELEVATION = (52 * Math.PI) / 180;
const TOP_AZIMUTH = (30 * Math.PI) / 180;

/** Distance at which a box of that size fills the stage. */
function fitDistance(horizontalExtent: number, verticalExtent: number): number {
  const forHeight = verticalExtent / 2 / Math.tan(VERTICAL_HALF_FOV);
  const forWidth = horizontalExtent / 2 / Math.tan(VERTICAL_HALF_FOV) / STAGE_ASPECT;

  return Math.max(forHeight, forWidth) * FIT_PADDING;
}

/**
 * True when the whole bike sits inside the frame at that view.
 *
 * The tilted top view compresses the bike length into the vertical axis, so it
 * is checked against a stricter requirement.
 */
export function framingFits(view: CameraView, geometry: BikeGeometry): boolean {
  const preset = resolveCameraPreset(view, geometry);
  const distance = Math.hypot(
    preset.position[0] - preset.target[0],
    preset.position[1] - preset.target[1],
    preset.position[2] - preset.target[2],
  );
  const verticalHalf = Math.tan(VERTICAL_HALF_FOV) * distance;
  const horizontalHalf = verticalHalf * STAGE_ASPECT;
  const length = geometry.wheelbase + geometry.wheelRadius * 2;

  // What actually spans the screen at each view: from the front the bike is as
  // wide as its handlebar, from the side as long as its wheelbase, and from
  // above the length is foreshortened into the vertical axis.
  const horizontalExtent =
    view === 'frontal' || view === 'traseira' ? geometry.handlebarWidth : length;
  const verticalExtent = view === 'superior' ? length * 0.75 : bikeHeight(geometry);

  return horizontalHalf >= horizontalExtent / 2 && verticalHalf >= verticalExtent / 2;
}

export function resolveCameraPreset(
  view: CameraView,
  geometry: BikeGeometry,
): CameraPreset {
  const height = bikeHeight(geometry);
  const length = geometry.wheelbase + geometry.wheelRadius * 2;
  const target = bikeCenter(geometry);
  const [tx, ty, tz] = target;

  const sideDistance = fitDistance(length, height);
  const frontDistance = fitDistance(geometry.handlebarWidth, height);

  switch (view) {
    case 'frontal':
      return { position: [tx + frontDistance, ty + 0.1, tz], target };
    case 'traseira':
      return { position: [tx - frontDistance, ty + 0.1, tz], target };
    case 'superior': {
      // Tilted on purpose: looking straight down leaves the camera up vector
      // parallel to the view direction, which is undefined.
      const distance = sideDistance * TOP_VIEW_FACTOR;

      return {
        position: [
          tx + Math.sin(TOP_AZIMUTH) * Math.cos(TOP_ELEVATION) * distance,
          ty + Math.sin(TOP_ELEVATION) * distance,
          tz + Math.cos(TOP_AZIMUTH) * Math.cos(TOP_ELEVATION) * distance,
        ],
        target: [tx, ty - 0.3, tz],
      };
    }
    case 'lateral':
    default:
      return { position: [tx, ty + 0.1, tz + sideDistance], target };
  }
}

export const cameraViewLabels: Record<CameraView, string> = {
  frontal: 'Frontal',
  lateral: 'Lateral',
  traseira: 'Traseira',
  superior: 'Superior',
};

/** Short description used by the accessible fallback and the UI. */
export const cameraViewDescriptions: Record<CameraView, string> = {
  frontal: 'bicicleta vista de frente',
  lateral: 'bicicleta vista de lado',
  traseira: 'bicicleta vista de trás',
  superior: 'bicicleta vista de cima',
};

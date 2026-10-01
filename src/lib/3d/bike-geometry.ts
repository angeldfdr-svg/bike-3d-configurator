import type { BikeConfiguration } from '@/types/configuration';
import type { Catalog, FrameSize } from '@/types/components';

/**
 * Procedural bike geometry.
 *
 * Pure maths, no Three.js: the scene renders whatever this returns, so the
 * shape of the bike can be unit tested and reused by a future GLB pipeline.
 *
 * Everything is expressed in metres, the unit Three.js expects. Products are
 * declared in millimetres, so conversion happens exactly once, here.
 */

export type Vec3 = readonly [number, number, number];

export type BikeGeometry = {
  readonly wheelRadius: number;
  readonly wheelbase: number;
  readonly rearAxle: Vec3;
  readonly frontAxle: Vec3;
  readonly bottomBracket: Vec3;
  readonly seatCluster: Vec3;
  readonly headTubeTop: Vec3;
  readonly headTubeBottom: Vec3;
  readonly handlebarCenter: Vec3;
  readonly saddleCenter: Vec3;
  readonly crankLength: number;
  readonly chainringRadius: number;
  readonly handlebarWidth: number;
  readonly tireWidth: number;
  readonly rimDepth: number;
};

/** Bead seat diameter of the rim sizes the catalog supports. */
const RIM_DIAMETER: Record<'700c' | '650b', number> = {
  '700c': 0.622,
  '650b': 0.572,
};

/** Relative frame proportions by size label. */
const FRAME_SIZE_SCALE: Record<FrameSize, number> = {
  XS: 0.86,
  S: 0.93,
  M: 1,
  L: 1.07,
  XL: 1.14,
};

const WHEELBASE = 0.995;
const BB_DROP = 0.07;
const BB_OFFSET = -0.075;
const SEAT_TUBE_ANGLE = (73.5 * Math.PI) / 180;
const HEAD_TUBE_ANGLE = (73 * Math.PI) / 180;
/**
 * Fork: axle to crown, measured along the blade.
 *
 * The blade is nearly vertical — the head angle belongs to the steerer axis,
 * not to the fork. Tilting the fork by the head angle would put the crown half
 * a metre too low, which is exactly the mistake this constant avoids.
 */
const FORK_LENGTH = 0.373;
const FORK_RAKE_ANGLE = (7 * Math.PI) / 180;
const HEAD_TUBE_LENGTH = 0.16;
const STEM_LENGTH = 0.1;
const SEATPOST_HEIGHT = 0.07;
const SADDLE_HEIGHT = 0.03;
/** Chain pitch in metres, used to size chainrings. */
const CHAIN_PITCH = 0.0127;

/** Largest chainring tooth count of a ratio such as `52/36`. */
function chainringTeeth(ratio: string): number {
  const [primary] = ratio.split('/');
  const teeth = Number.parseInt(primary ?? '', 10);

  return Number.isFinite(teeth) && teeth > 0 ? teeth : 50;
}

/** Chainring radius in metres: circumference = teeth x pitch. */
export function chainringRadius(ratio: string): number {
  return (chainringTeeth(ratio) * CHAIN_PITCH) / (2 * Math.PI);
}

/** Geometry of a bike built from `configuration`, with sane defaults. */
export function resolveBikeGeometry(
  configuration: BikeConfiguration,
  source: Catalog,
): BikeGeometry {
  const frame = source.frames.find((item) => item.id === configuration.frameId);
  const wheelset = source.wheelsets.find((item) => item.id === configuration.wheelsetId);
  const tire = source.tires.find((item) => item.id === configuration.tireId);
  const crankset = source.cranksets.find((item) => item.id === configuration.cranksetId);
  const handlebar = source.handlebars.find((item) => item.id === configuration.handlebarId);

  // The frame caps the tyre: a wider tyre than the frame admits cannot be drawn.
  const frameMaxTireWidth = frame?.maxTireWidth ?? 40;
  const requestedTireWidth = tire?.width ?? 28;
  const tireWidth = Math.min(requestedTireWidth, frameMaxTireWidth) / 1000;
  const rimDepth = (wheelset?.rimDepth ?? 45) / 1000;
  const wheelSize = wheelset?.wheelSize ?? '700c';
  const wheelRadius = (RIM_DIAMETER[wheelSize] + 2 * tireWidth) / 2;

  const sizeScale = FRAME_SIZE_SCALE[configuration.frameSize ?? 'M'] ?? 1;
  const seatTubeLength = 0.52 * sizeScale;

  const rearAxle: Vec3 = [-WHEELBASE / 2, wheelRadius, 0];
  const frontAxle: Vec3 = [WHEELBASE / 2, wheelRadius, 0];
  const bottomBracket: Vec3 = [BB_OFFSET, wheelRadius - BB_DROP, 0];

  const seatCluster: Vec3 = [
    bottomBracket[0] - seatTubeLength * Math.cos(SEAT_TUBE_ANGLE),
    bottomBracket[1] + seatTubeLength * Math.sin(SEAT_TUBE_ANGLE),
    0,
  ];

  const headTubeBottom: Vec3 = [
    frontAxle[0] - FORK_LENGTH * Math.sin(FORK_RAKE_ANGLE),
    frontAxle[1] + FORK_LENGTH * Math.cos(FORK_RAKE_ANGLE),
    0,
  ];

  const headTubeTop: Vec3 = [
    headTubeBottom[0] - HEAD_TUBE_LENGTH * Math.sin(HEAD_TUBE_ANGLE),
    headTubeBottom[1] + HEAD_TUBE_LENGTH * Math.cos(HEAD_TUBE_ANGLE),
    0,
  ];

  const handlebarCenter: Vec3 = [
    headTubeTop[0] + STEM_LENGTH,
    headTubeTop[1],
    0,
  ];

  const saddleCenter: Vec3 = [
    seatCluster[0],
    seatCluster[1] + SEATPOST_HEIGHT + SADDLE_HEIGHT,
    0,
  ];

  return {
    wheelRadius,
    wheelbase: WHEELBASE,
    rearAxle,
    frontAxle,
    bottomBracket,
    seatCluster,
    headTubeTop,
    headTubeBottom,
    handlebarCenter,
    saddleCenter,
    crankLength: (crankset?.length ?? 172.5) / 1000,
    chainringRadius: chainringRadius(crankset?.ratio ?? '52/36'),
    handlebarWidth: (handlebar?.width ?? 400) / 1000,
    tireWidth,
    rimDepth,
  };
}

/** Vertical extent of the bike, used to frame the camera. */
export function bikeHeight(geometry: BikeGeometry): number {
  return Math.max(
    geometry.saddleCenter[1],
    geometry.handlebarCenter[1],
    geometry.headTubeTop[1],
  );
}

/** Centre of the bike in the XZ plane, at saddle height. */
export function bikeCenter(geometry: BikeGeometry): Vec3 {
  return [0, bikeHeight(geometry) * 0.55, 0];
}

/** Every anchor point of the frame, useful for bounding volumes. */
export function frameAnchors(geometry: BikeGeometry): readonly Vec3[] {
  return [
    geometry.rearAxle,
    geometry.frontAxle,
    geometry.bottomBracket,
    geometry.seatCluster,
    geometry.headTubeTop,
    geometry.headTubeBottom,
    geometry.handlebarCenter,
    geometry.saddleCenter,
  ];
}

import type {
  Accessory,
  BikeFrame,
  Crankset,
  Groupset,
  Handlebar,
  Saddle,
  Tire,
  Wheelset,
} from '@/types/components';
import type { MaterialName } from '@/lib/3d/material-palette';

/**
 * Visual variants derived from the catalog.
 *
 * Pure data, no React and no Three.js: the scene renders what these functions
 * return, so "a 1x crankset draws one chainring" and "a rim brake group puts
 * its calipers on the rim" are unit-testable facts about the domain, not
 * assertions about JSX.
 *
 * Every resolver is total: an unknown or missing product falls back to a
 * demonstrative value, never to a crash.
 */

export type FrameVariant = {
  /** Aerodynamic frames have deep, flattened tubes; round tubes otherwise. */
  readonly profile: 'aero' | 'round';
  readonly paint: MaterialName;
  /** Flattening of the main tubes, as a scale on the local axes. */
  readonly tubeScale: readonly [number, number, number];
  /** Tyre clearance behind the seat tube, in metres. */
  readonly clearance: number;
  /** Internal cable routing, drawn as a line along the down tube. */
  readonly internalRouting: boolean;
};

export type WheelVariant = {
  readonly rimMaterial: MaterialName;
  readonly spokeCount: number;
  readonly spokeRadius: number;
  /** Hub width across the dropouts, in metres. */
  readonly hubWidth: number;
  /** Brake track: a machined band on alloy rims. */
  readonly machinedSurface: boolean;
};

export type TireVariant = {
  readonly tread: 'slick' | 'all-weather' | 'gravel';
  /** Number of tread blocks around the circumference. */
  readonly treadCount: number;
  readonly knobSize: number;
  readonly sidewall: MaterialName;
  /** A tubular tyre is glued on: no visible bead. */
  readonly bead: 'hidden' | 'visible';
};

export type CrankVariant = {
  readonly chainringCount: number;
  /** Radius of the inner ring relative to the outer one. */
  readonly innerRatio: number;
  readonly armWidth: number;
  readonly pedalLength: number;
  readonly spindleMaterial: MaterialName;
};

export type GroupsetVariant = {
  readonly shifting: 'mecanico' | 'eletronico';
  readonly brake: 'disco' | 'aro';
  readonly sprocketCount: number;
  readonly freehubBody: 'HG' | 'XDR' | 'MicroSpline' | 'Campagnolo';
  /** Cassette stack depth, in metres. */
  readonly cassetteWidth: number;
};

export type HandlebarVariant = {
  /** Extra width the gravel flare adds at the drops, in metres. */
  readonly flare: number;
  readonly bodyMaterial: MaterialName;
  readonly tapeMaterial: MaterialName;
  readonly dropRadius: number;
  /** Lever reach in metres, from the bar centre. */
  readonly reach: number;
};

export type SaddleVariant = {
  readonly profile: 'race' | 'endurance';
  readonly shellLength: number;
  readonly shellWidth: number;
  readonly noseLength: number;
  readonly railMaterial: MaterialName;
};

export type AccessoryVariant = {
  readonly slot: string;
  readonly quantity: number;
  /** How many of this accessory the bike can physically carry. */
  readonly capacity: number;
};

/** Every slot the procedural bike knows how to draw. */
export const accessorySlots = ['computador', 'iluminacao', 'bidao', 'bolsa'] as const;
export type AccessorySlot = (typeof accessorySlots)[number];

/** Capacity of each slot: two bottles fit, one computer, one bag, two lights. */
const ACCESSORY_CAPACITY: Record<AccessorySlot, number> = {
  computador: 1,
  iluminacao: 2,
  bidao: 2,
  bolsa: 1,
};

export function isAccessorySlot(slot: string): slot is AccessorySlot {
  return (accessorySlots as readonly string[]).includes(slot);
}

// ---------------------------------------------------------------------------
// Frame
// ---------------------------------------------------------------------------

export function resolveFrameVariant(frame: BikeFrame | undefined): FrameVariant {
  if (frame === undefined) {
    return {
      profile: 'aero',
      paint: 'framePaint',
      tubeScale: [1, 1, 1.35],
      clearance: 0.032,
      internalRouting: true,
    };
  }

  // Frames built for 40 mm and wider tyres are round-tubed gravel frames;
  // anything narrower gets an aerodynamic profile.
  const gravel = frame.maxTireWidth >= 40;
  const paint = resolveFramePaint(frame);

  return {
    profile: gravel ? 'round' : 'aero',
    paint,
    tubeScale: gravel ? [1, 1, 1] : [1, 1, 1.35],
    clearance: frame.maxTireWidth / 1000,
    internalRouting: frame.material === 'carbono',
  };
}

function resolveFramePaint(frame: BikeFrame): MaterialName {
  if (frame.material === 'titanio') return 'rawTitanium';
  if (frame.material === 'aluminio' || frame.material === 'aco') return 'rawAlloy';

  switch (frame.id) {
    case 'frame-aurelian-tarmac-sl8':
    case 'frame-altiro-r5':
      return 'frameRed';
    case 'frame-northwind-tcr-advanced-sl':
    case 'frame-altiro-caledonia-5':
      return 'frameBlue';
    case 'frame-velora-madone-slr':
      return 'frameWhite';
    case 'frame-solstice-dogma-x':
    case 'frame-aether-ultimate-cfg':
      return 'frameBlack';
    case 'frame-velora-emonda-slr':
      return 'frameOrange';
    case 'frame-aurelian-diverge-stix':
      return 'frameBronze';
    case 'frame-veloce-aero-sl':
    case 'frame-veloce-endurance':
    default:
      return 'framePaint';
  }
}

// ---------------------------------------------------------------------------
// Wheels
// ---------------------------------------------------------------------------

export function resolveWheelVariant(wheelset: Wheelset | undefined): WheelVariant {
  if (wheelset === undefined) {
    return {
      rimMaterial: 'carbon',
      spokeCount: 20,
      spokeRadius: 0.0018,
      hubWidth: 0.095,
      machinedSurface: false,
    };
  }

  // Deep carbon rims are laced with fewer, thicker spokes; shallow alloy rims
  // use a classic high count.
  const deep = wheelset.rimDepth >= 45;
  const carbon = wheelset.material === 'carbono';

  return {
    rimMaterial: carbon ? 'carbon' : 'rawAlloy',
    spokeCount: carbon ? (deep ? 20 : 24) : 28,
    spokeRadius: carbon ? 0.0018 : 0.0014,
    hubWidth: wheelset.brakeSystem === 'aro' ? 0.09 : 0.095,
    machinedSurface: !carbon,
  };
}

// ---------------------------------------------------------------------------
// Tyres
// ---------------------------------------------------------------------------

export function resolveTireVariant(tire: Tire | undefined): TireVariant {
  if (tire === undefined) {
    return { tread: 'slick', treadCount: 0, knobSize: 0, sidewall: 'tanWall', bead: 'visible' };
  }

  // Tread aggressiveness follows intended use, which the casing width states
  // better than the thread count: a 40 mm casing is a gravel tyre with blocks,
  // a low tpi road casing is an all-weather tyre with a fine pattern, and a
  // high tpi cotton casing is a slick racing tyre.
  if (tire.width >= 36) {
    return {
      tread: 'gravel',
      treadCount: 26,
      knobSize: 0.0055,
      sidewall: 'tanWall',
      bead: 'visible',
    };
  }

  if (tire.tpi <= 90) {
    return {
      tread: 'all-weather',
      treadCount: 44,
      knobSize: 0.0028,
      sidewall: 'tanWall',
      bead: 'visible',
    };
  }

  return {
    tread: 'slick',
    treadCount: 0,
    knobSize: 0,
    sidewall: 'tanWall',
    bead: tire.type === 'tubular' ? 'hidden' : 'visible',
  };
}

// ---------------------------------------------------------------------------
// Crankset
// ---------------------------------------------------------------------------

export function resolveCrankVariant(crankset: Crankset | undefined): CrankVariant {
  if (crankset === undefined) {
    return {
      chainringCount: 2,
      innerRatio: 0.72,
      armWidth: 0.026,
      pedalLength: 0.075,
      spindleMaterial: 'alloy',
    };
  }

  return {
    chainringCount: crankset.chainrings,
    innerRatio: crankset.chainrings === 1 ? 0 : 0.72,
    armWidth: 0.026,
    pedalLength: 0.075,
    spindleMaterial: crankset.bottomBracket === 'DUB' ? 'alloy' : 'steel',
  };
}

// ---------------------------------------------------------------------------
// Groupset
// ---------------------------------------------------------------------------

export function resolveGroupsetVariant(groupset: Groupset | undefined): GroupsetVariant {
  if (groupset === undefined) {
    return {
      shifting: 'mecanico',
      brake: 'disco',
      sprocketCount: 11,
      freehubBody: 'HG',
      cassetteWidth: 0.042,
    };
  }

  return {
    shifting: groupset.shifting,
    brake: groupset.brakeSystem === 'aro' ? 'aro' : 'disco',
    sprocketCount: groupset.speeds,
    freehubBody: groupset.freehub,
    // XDR cogs are thinner than Hyperglide, so the stack is narrower.
    cassetteWidth: groupset.freehub === 'XDR' ? 0.038 : 0.045,
  };
}

// ---------------------------------------------------------------------------
// Handlebar
// ---------------------------------------------------------------------------

export function resolveHandlebarVariant(handlebar: Handlebar | undefined): HandlebarVariant {
  if (handlebar === undefined) {
    return {
      flare: 0,
      bodyMaterial: 'carbon',
      tapeMaterial: 'barTape',
      dropRadius: 0.085,
      reach: 0.08,
    };
  }

  const gravel = handlebar.type === 'gravel-drop';

  return {
    // A gravel bar flares outwards towards the drops.
    flare: gravel ? Math.min(handlebar.width / 1000, 0.06) : 0,
    bodyMaterial: handlebar.material === 'carbono' ? 'carbon' : 'rawAlloy',
    tapeMaterial: 'barTape',
    dropRadius: Math.max(handlebar.drop / 1000, 0.06),
    reach: handlebar.reach / 1000,
  };
}

// ---------------------------------------------------------------------------
// Saddle
// ---------------------------------------------------------------------------

export function resolveSaddleVariant(saddle: Saddle | undefined): SaddleVariant {
  if (saddle === undefined) {
    return {
      profile: 'race',
      shellLength: 0.26,
      shellWidth: 0.135,
      noseLength: 0.05,
      railMaterial: 'steel',
    };
  }

  // Narrow shells are short-nose race saddles; wider ones are endurance shapes
  // with a longer, more padded body.
  const race = saddle.width < 146;

  return {
    profile: race ? 'race' : 'endurance',
    shellLength: race ? 0.26 : 0.28,
    shellWidth: saddle.width / 1000,
    noseLength: race ? 0.05 : 0.065,
    railMaterial: saddle.railMaterial === 'carbono' ? 'carbon' : 'steel',
  };
}

// ---------------------------------------------------------------------------
// Accessories
// ---------------------------------------------------------------------------

export function resolveAccessoryVariant(accessory: Accessory | undefined): AccessoryVariant {
  if (accessory === undefined) {
    return { slot: 'bidao', quantity: 0, capacity: 2 };
  }

  const capacity = isAccessorySlot(accessory.slot) ? ACCESSORY_CAPACITY[accessory.slot] : 1;

  return { slot: accessory.slot, quantity: accessory.quantity, capacity };
}

/** How many of an accessory can actually be mounted, given its quantity. */
export function mountedQuantity(accessory: Accessory | undefined): number {
  const variant = resolveAccessoryVariant(accessory);

  return Math.min(variant.quantity, variant.capacity);
}

import { describe, expect, it } from 'vitest';

import { catalog } from '@/data/catalog';
import {
  bikeCenter,
  bikeHeight,
  chainringRadius,
  frameAnchors,
  resolveBikeGeometry,
} from '@/lib/3d/bike-geometry';
import {
  framingFits,
  presetSettled,
  resolveCameraPreset,
  SETTLE_DISTANCE,
} from '@/lib/3d/camera-views';
import { emptyConfiguration } from '@/lib/configuration';
import type { BikeConfiguration } from '@/types/configuration';

/**
 * Procedural geometry and camera framing.
 *
 * These are pure functions, so the shape of the bike and the framing of every
 * preset view can be verified without a renderer.
 */

const empty = emptyConfiguration();

function withConfiguration(patch: Partial<BikeConfiguration>): BikeConfiguration {
  return { ...empty, ...patch };
}

describe('resolveBikeGeometry', () => {
  it('derives the wheel radius from the rim and the tyre', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    // 700c bead seat diameter (622 mm) plus two 28 mm tyres.
    expect(geometry.wheelRadius).toBeCloseTo((0.622 + 2 * 0.028) / 2, 6);
    expect(geometry.wheelRadius).toBeCloseTo(0.339, 3);
  });

  it('keeps the axles symmetric and on the ground plane', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    expect(geometry.rearAxle[0]).toBeCloseTo(-geometry.wheelbase / 2, 6);
    expect(geometry.frontAxle[0]).toBeCloseTo(geometry.wheelbase / 2, 6);
    expect(geometry.rearAxle[1]).toBeCloseTo(geometry.wheelRadius, 6);
    expect(geometry.frontAxle[1]).toBeCloseTo(geometry.wheelRadius, 6);
    expect(geometry.rearAxle[2]).toBe(0);
  });

  it('places every anchor above the ground and in the bike plane', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    for (const anchor of frameAnchors(geometry)) {
      expect(anchor[1]).toBeGreaterThan(0);
      expect(anchor[2]).toBe(0);
    }
  });

  it('builds a plausible frame: BB below the axles, saddle on top', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    expect(geometry.bottomBracket[1]).toBeLessThan(geometry.rearAxle[1]);
    expect(geometry.seatCluster[1]).toBeGreaterThan(geometry.bottomBracket[1]);
    expect(geometry.seatCluster[0]).toBeLessThan(geometry.bottomBracket[0]);
    expect(geometry.headTubeBottom[1]).toBeGreaterThan(geometry.frontAxle[1]);
    expect(geometry.headTubeTop[1]).toBeGreaterThan(geometry.headTubeBottom[1]);
    expect(geometry.headTubeTop[0]).toBeLessThan(geometry.headTubeBottom[0]);
    expect(geometry.saddleCenter[1]).toBeGreaterThan(geometry.seatCluster[1]);
    expect(geometry.handlebarCenter[0]).toBeGreaterThan(geometry.headTubeTop[0]);
    expect(geometry.handlebarCenter[1]).toBeCloseTo(geometry.headTubeTop[1], 6);
  });

  it('keeps the saddle within a realistic height range', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    expect(geometry.saddleCenter[1]).toBeGreaterThan(0.8);
    expect(geometry.saddleCenter[1]).toBeLessThan(1.05);
  });

  it('puts the handlebar just below the saddle, not half a metre down', () => {
    const geometry = resolveBikeGeometry(empty, catalog);
    const drop = geometry.saddleCenter[1] - geometry.handlebarCenter[1];

    // A road bike drops 5 to 15 cm from saddle to bar tops.
    expect(drop).toBeGreaterThan(0.03);
    expect(drop).toBeLessThan(0.2);
  });

  it('raises the fork crown to a plausible height', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    // The crown sits above the axle by roughly the fork length, and the
    // steerer axis is what carries the head angle.
    expect(geometry.headTubeBottom[1] - geometry.frontAxle[1]).toBeGreaterThan(0.3);
    expect(geometry.headTubeBottom[1]).toBeGreaterThan(0.65);
    expect(geometry.headTubeBottom[0]).toBeLessThan(geometry.frontAxle[0]);
  });

  it('keeps the top tube roughly level with the saddle', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    expect(geometry.headTubeTop[1]).toBeGreaterThan(geometry.seatCluster[1] - 0.05);
    expect(geometry.headTubeTop[1]).toBeLessThan(geometry.saddleCenter[1]);
  });

  it('caps the tyre width at what the frame admits', () => {
    const wideTire = catalog.tires.find((tire) => tire.width === 40);
    const aeroFrame = catalog.frames.find((frame) => frame.maxTireWidth === 32);

    expect(wideTire).toBeDefined();
    expect(aeroFrame).toBeDefined();

    const capped = resolveBikeGeometry(
      withConfiguration({ frameId: aeroFrame?.id ?? null, tireId: wideTire?.id ?? null }),
      catalog,
    );
    const allowed = resolveBikeGeometry(
      withConfiguration({ frameId: 'frame-meridian-ti-gravel', tireId: wideTire?.id ?? null }),
      catalog,
    );

    expect(capped.tireWidth).toBeCloseTo(0.032, 6);
    expect(allowed.tireWidth).toBeCloseTo(0.04, 6);
  });

  it('scales the frame with the selected size', () => {
    const small = resolveBikeGeometry(withConfiguration({ frameSize: 'XS' }), catalog);
    const large = resolveBikeGeometry(withConfiguration({ frameSize: 'XL' }), catalog);

    expect(large.seatCluster[1]).toBeGreaterThan(small.seatCluster[1]);
    expect(large.saddleCenter[1]).toBeGreaterThan(small.saddleCenter[1]);
  });

  it('reads the crankset and handlebar from the selection', () => {
    const geometry = resolveBikeGeometry(
      withConfiguration({
        cranksetId: 'crankset-meridian-dub-172-50-34',
        handlebarId: 'handlebar-meridian-gravel-44',
      }),
      catalog,
    );

    expect(geometry.crankLength).toBeCloseTo(0.1725, 6);
    expect(geometry.handlebarWidth).toBeCloseTo(0.44, 6);
    expect(geometry.chainringRadius).toBeCloseTo(0.101, 3);
  });

  it('falls back to demonstrative values for an empty configuration', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    expect(geometry.crankLength).toBeCloseTo(0.1725, 6);
    expect(geometry.handlebarWidth).toBeCloseTo(0.4, 6);
    expect(geometry.rimDepth).toBeCloseTo(0.045, 6);
  });
});

describe('chainringRadius', () => {
  it('derives the radius from the tooth count and the chain pitch', () => {
    // 52 teeth x 12.7 mm pitch / (2 pi) = 105 mm.
    expect(chainringRadius('52/36')).toBeCloseTo(0.105, 3);
    expect(chainringRadius('40')).toBeCloseTo(0.0808, 3);
  });

  it('survives a malformed ratio', () => {
    expect(chainringRadius('')).toBeGreaterThan(0);
    expect(chainringRadius('abc')).toBeGreaterThan(0);
  });
});

describe('bike extents', () => {
  it('measures the height at the highest point', () => {
    const geometry = resolveBikeGeometry(empty, catalog);

    expect(bikeHeight(geometry)).toBeCloseTo(
      Math.max(geometry.saddleCenter[1], geometry.handlebarCenter[1]),
      6,
    );
  });

  it('centres the bike horizontally', () => {
    const geometry = resolveBikeGeometry(empty, catalog);
    const center = bikeCenter(geometry);

    expect(center[0]).toBe(0);
    expect(center[1]).toBeGreaterThan(0);
    expect(center[1]).toBeLessThan(bikeHeight(geometry));
  });
});

describe('resolveCameraPreset', () => {
  const geometry = resolveBikeGeometry(empty, catalog);

  it('frames the bike from the side by default', () => {
    const preset = resolveCameraPreset('lateral', geometry);

    expect(preset.position[0]).toBeCloseTo(0, 6);
    expect(preset.position[2]).toBeGreaterThan(1.5);
    expect(preset.position[1]).toBeGreaterThan(0);
    expect(preset.target[1]).toBeGreaterThan(0);
  });

  it('frames the bike from the front and from the back', () => {
    const front = resolveCameraPreset('frontal', geometry);
    const back = resolveCameraPreset('traseira', geometry);

    expect(front.position[0]).toBeGreaterThan(1.5);
    expect(front.position[2]).toBeCloseTo(0, 6);
    expect(back.position[0]).toBeLessThan(-1.5);
    expect(back.position[2]).toBeCloseTo(0, 6);
  });

  it('frames the bike from above without a degenerate up vector', () => {
    const preset = resolveCameraPreset('superior', geometry);

    expect(preset.position[1]).toBeGreaterThan(2);
    // Never straight up: that would leave lookAt without an up direction.
    expect(Math.hypot(preset.position[0], preset.position[2])).toBeGreaterThan(0.5);
    expect(preset.target[1]).toBeLessThan(preset.position[1]);
  });

  it('keeps every view aimed at the bike', () => {
    for (const view of ['frontal', 'lateral', 'traseira', 'superior'] as const) {
      const preset = resolveCameraPreset(view, geometry);

      expect(preset.target[1]).toBeGreaterThan(0);
      expect(preset.position[1]).toBeGreaterThan(0);
    }
  });

  it('frames the whole bike in every view', () => {
    for (const view of ['frontal', 'lateral', 'traseira', 'superior'] as const) {
      expect(framingFits(view, geometry), `${view} crops the bike`).toBe(true);
    }
  });

  it('backs off for a bigger bike', () => {
    const wideTire = catalog.tires.find((tire) => tire.width === 40);
    const gravelFrame = catalog.frames.find((frame) => frame.maxTireWidth >= 40);
    const small = resolveCameraPreset('lateral', resolveBikeGeometry(empty, catalog));
    const large = resolveCameraPreset(
      'lateral',
      resolveBikeGeometry(
        withConfiguration({ frameId: gravelFrame?.id ?? null, tireId: wideTire?.id ?? null }),
        catalog,
      ),
    );

    expect(large.position[2]).toBeGreaterThan(small.position[2]);
  });

  it('moves closer for the front view than for the side view', () => {
    // The bike is much longer than it is wide, so the side view needs more room.
    const front = resolveCameraPreset('frontal', geometry);
    const side = resolveCameraPreset('lateral', geometry);

    expect(front.position[0]).toBeLessThan(side.position[2]);
  });
});

describe('presetSettled', () => {
  it('waits for the orbit target even when the camera is already home', () => {
    // The camera can be parked exactly on its preset while the orbit target is
    // still wherever the scene left it. Stopping on the camera alone froze the
    // framing off centre, because the camera then aimed at the stale target.
    expect(presetSettled(0, 0.4)).toBe(false);
    expect(presetSettled(0.4, 0)).toBe(false);
    expect(presetSettled(0, 0)).toBe(true);
  });

  it('treats a missing target as nothing to wait for', () => {
    expect(presetSettled(0, null)).toBe(true);
    expect(presetSettled(0.5, null)).toBe(false);
  });

  it('needs both inside the tolerance', () => {
    expect(presetSettled(SETTLE_DISTANCE, 0)).toBe(false);
    expect(presetSettled(0, SETTLE_DISTANCE)).toBe(false);
    expect(presetSettled(SETTLE_DISTANCE - 1e-6, SETTLE_DISTANCE - 1e-6)).toBe(true);
  });
});

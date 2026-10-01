import { describe, expect, it } from 'vitest';

import { catalog } from '@/data/catalog';
import { findSelection } from '@/lib/catalog';
import {
  accessorySlots,
  isAccessorySlot,
  mountedQuantity,
  resolveAccessoryVariant,
  resolveCrankVariant,
  resolveFrameVariant,
  resolveGroupsetVariant,
  resolveHandlebarVariant,
  resolveSaddleVariant,
  resolveTireVariant,
  resolveWheelVariant,
} from '@/lib/3d/part-variants';
import {
  cassettePlacements,
  ringPlacements,
  spokePlacements,
  tubeMountPlacements,
} from '@/lib/3d/instances';
import { glbModels, glbModelIds, resolvePartModel } from '@/components/3d/parts/glb-models';
import { emptyConfiguration } from '@/lib/configuration';
import type { BikeConfiguration } from '@/types/configuration';

/**
 * Visual variants and instance placement.
 *
 * These decide what the scene draws, so the rules that make a bike look like
 * the bike that was configured are verified as domain facts.
 */

function withConfiguration(patch: Partial<BikeConfiguration>): BikeConfiguration {
  return { ...emptyConfiguration(), ...patch };
}

function selected(patch: Partial<BikeConfiguration>) {
  return findSelection(catalog, withConfiguration(patch));
}

describe('resolveFrameVariant', () => {
  it('gives an aerodynamic profile to a narrow-tyre road frame', () => {
    const frame = selected({ frameId: 'frame-veloce-aero-sl' }).frame;

    expect(frame).toBeDefined();

    const variant = resolveFrameVariant(frame);

    expect(variant.profile).toBe('aero');
    expect(variant.tubeScale[2]).toBeGreaterThan(1);
    expect(variant.internalRouting).toBe(true);
    expect(variant.paint).toBe('framePaint');
  });

  it('gives round tubes and bare metal to a gravel titanium frame', () => {
    const frame = selected({ frameId: 'frame-meridian-ti-gravel' }).frame;

    expect(frame).toBeDefined();

    const variant = resolveFrameVariant(frame);

    expect(variant.profile).toBe('round');
    expect(variant.tubeScale).toEqual([1, 1, 1]);
    expect(variant.paint).toBe('rawTitanium');
    expect(variant.clearance).toBeCloseTo(0.045, 6);
  });

  it('paints alloy frames in bare aluminium, not in paint', () => {
    const variant = resolveFrameVariant(selected({ frameId: 'frame-ardent-alloy-pro' }).frame);

    expect(variant.paint).toBe('rawAlloy');
  });

  it('falls back to a demonstrative frame when nothing is selected', () => {
    const variant = resolveFrameVariant(undefined);

    expect(variant.profile).toBe('aero');
    expect(variant.paint).toBe('framePaint');
    expect(variant.clearance).toBeGreaterThan(0);
  });
});

describe('resolveWheelVariant', () => {
  it('laces deep carbon rims with fewer spokes than shallow alloy rims', () => {
    const deep = resolveWheelVariant(selected({ wheelsetId: 'wheelset-ardent-carbon-45' }).wheelset);
    const shallow = resolveWheelVariant(selected({ wheelsetId: 'wheelset-veloce-alloy-24' }).wheelset);

    expect(deep.rimMaterial).toBe('carbon');
    expect(deep.spokeCount).toBe(20);
    expect(shallow.rimMaterial).toBe('rawAlloy');
    expect(shallow.spokeCount).toBe(28);
    expect(shallow.machinedSurface).toBe(true);
    expect(deep.machinedSurface).toBe(false);
  });

  it('narrows the hub for rim brake wheels', () => {
    const disc = resolveWheelVariant(selected({ wheelsetId: 'wheelset-ardent-carbon-30' }).wheelset);

    expect(disc.hubWidth).toBeGreaterThan(0.09);
  });

  it('falls back to a demonstrative wheel', () => {
    expect(resolveWheelVariant(undefined).spokeCount).toBeGreaterThan(0);
  });
});

describe('resolveTireVariant', () => {
  it('makes a high tpi casing slick and a low tpi casing knobbly', () => {
    const cotton = resolveTireVariant(selected({ tireId: 'tire-voltaic-cotton-28' }).tire);
    const allWeather = resolveTireVariant(selected({ tireId: 'tire-voltaic-allweather-30' }).tire);
    const gravel = resolveTireVariant(selected({ tireId: 'tire-meridian-gravel-40' }).tire);

    expect(cotton.tread).toBe('slick');
    expect(cotton.treadCount).toBe(0);
    expect(allWeather.tread).toBe('all-weather');
    expect(allWeather.treadCount).toBeGreaterThan(cotton.treadCount);
    expect(gravel.tread).toBe('gravel');
    // A gravel tyre has fewer, larger blocks than a fine all-weather pattern.
    expect(gravel.knobSize).toBeGreaterThan(allWeather.knobSize);
    expect(gravel.treadCount).toBeLessThan(allWeather.treadCount);
  });

  it('hides the bead of a glued tubular casing', () => {
    const variant = resolveTireVariant({
      ...(selected({ tireId: 'tire-voltaic-cotton-28' }).tire as object),
      type: 'tubular',
    } as never);

    expect(variant.bead).toBe('hidden');
  });

  it('falls back to a slick demonstrative tyre', () => {
    expect(resolveTireVariant(undefined).tread).toBe('slick');
  });
});

describe('resolveCrankVariant', () => {
  it('draws one chainring for a mono-plate crankset', () => {
    const variant = resolveCrankVariant(selected({ cranksetId: 'crankset-voltaic-168-40' }).crankset);

    expect(variant.chainringCount).toBe(1);
    expect(variant.innerRatio).toBe(0);
  });

  it('draws two chainrings for a double', () => {
    const variant = resolveCrankVariant(
      selected({ cranksetId: 'crankset-northwind-172-52-36' }).crankset,
    );

    expect(variant.chainringCount).toBe(2);
    expect(variant.innerRatio).toBeGreaterThan(0);
    expect(variant.innerRatio).toBeLessThan(1);
  });

  it('uses a different spindle finish per bottom bracket standard', () => {
    const dub = resolveCrankVariant(selected({ cranksetId: 'crankset-meridian-dub-172-50-34' }).crankset);
    const bsa = resolveCrankVariant(selected({ cranksetId: 'crankset-voltaic-168-40' }).crankset);

    expect(dub.spindleMaterial).not.toBe(bsa.spindleMaterial);
  });
});

describe('resolveGroupsetVariant', () => {
  it('moves the calipers to the rim for a rim brake group', () => {
    const variant = resolveGroupsetVariant(selected({ groupsetId: 'groupset-voltaic-classic-10' }).groupset);

    expect(variant.brake).toBe('aro');
  });

  it('keeps discs for a hydraulic group', () => {
    const variant = resolveGroupsetVariant(
      selected({ groupsetId: 'groupset-northwind-mechanic-11' }).groupset,
    );

    expect(variant.brake).toBe('disco');
  });

  it('adds a sprocket per speed', () => {
    const ten = resolveGroupsetVariant(selected({ groupsetId: 'groupset-voltaic-classic-10' }).groupset);
    const twelve = resolveGroupsetVariant(selected({ groupsetId: 'groupset-northwind-di2-12' }).groupset);

    expect(ten.sprocketCount).toBe(10);
    expect(twelve.sprocketCount).toBe(12);
  });

  it('narrows the cassette for XDR', () => {
    const xdr = resolveGroupsetVariant(
      selected({ groupsetId: 'groupset-meridian-force-xdr-12' }).groupset,
    );
    const hg = resolveGroupsetVariant(selected({ groupsetId: 'groupset-northwind-di2-12' }).groupset);

    expect(xdr.cassetteWidth).toBeLessThan(hg.cassetteWidth);
    expect(xdr.freehubBody).toBe('XDR');
  });

  it('distinguishes electronic from mechanical shifting', () => {
    expect(resolveGroupsetVariant(selected({ groupsetId: 'groupset-northwind-di2-12' }).groupset).shifting)
      .toBe('eletronico');
    expect(resolveGroupsetVariant(selected({ groupsetId: 'groupset-northwind-mechanic-11' }).groupset).shifting)
      .toBe('mecanico');
  });
});

describe('resolveHandlebarVariant', () => {
  it('flares a gravel bar outwards', () => {
    const gravel = resolveHandlebarVariant(
      selected({ handlebarId: 'handlebar-meridian-gravel-44' }).handlebar,
    );
    const road = resolveHandlebarVariant(
      selected({ handlebarId: 'handlebar-veloce-aero-40' }).handlebar,
    );

    expect(gravel.flare).toBeGreaterThan(0);
    expect(road.flare).toBe(0);
  });

  it('reads reach and drop from the product', () => {
    const aero = resolveHandlebarVariant(
      selected({ handlebarId: 'handlebar-veloce-aero-40' }).handlebar,
    );
    const endurance = resolveHandlebarVariant(
      selected({ handlebarId: 'handlebar-veloce-endurance-42' }).handlebar,
    );

    expect(aero.reach).toBeCloseTo(0.08, 6);
    expect(endurance.dropRadius).toBeGreaterThan(aero.dropRadius);
  });

  it('paints alloy bars bare and carbon bars dark', () => {
    expect(
      resolveHandlebarVariant(selected({ handlebarId: 'handlebar-veloce-aero-40' }).handlebar)
        .bodyMaterial,
    ).toBe('carbon');
    expect(
      resolveHandlebarVariant(selected({ handlebarId: 'handlebar-meridian-gravel-44' }).handlebar)
        .bodyMaterial,
    ).toBe('rawAlloy');
  });
});

describe('resolveSaddleVariant', () => {
  it('makes a narrow shell a race saddle and a wide one endurance', () => {
    const race = resolveSaddleVariant(selected({ saddleId: 'saddle-veloce-race-143' }).saddle);
    const endurance = resolveSaddleVariant(
      selected({ saddleId: 'saddle-meridian-endurance-148' }).saddle,
    );

    expect(race.profile).toBe('race');
    expect(race.shellWidth).toBeLessThan(endurance.shellWidth);
    expect(endurance.profile).toBe('endurance');
    expect(endurance.shellLength).toBeGreaterThan(race.shellLength);
  });

  it('reads the rail material from the product', () => {
    expect(resolveSaddleVariant(selected({ saddleId: 'saddle-veloce-race-143' }).saddle).railMaterial)
      .toBe('carbon');
    expect(
      resolveSaddleVariant(selected({ saddleId: 'saddle-northwind-gravel-145' }).saddle).railMaterial,
    ).toBe('steel');
  });
});

describe('accessories', () => {
  it('never mounts more than the bike can carry', () => {
    const cage = catalog.accessories.find((item) => item.id === 'accessory-veloce-bottle-cage');

    expect(cage).toBeDefined();
    expect(mountedQuantity(cage)).toBe(2);
    expect(mountedQuantity({ ...(cage as object), quantity: 9 } as never)).toBe(2);
  });

  it('reports a capacity for every known slot', () => {
    for (const slot of accessorySlots) {
      expect(isAccessorySlot(slot)).toBe(true);

      const variant = resolveAccessoryVariant({
        ...(catalog.accessories[0] as object),
        slot,
        quantity: 1,
      } as never);

      expect(variant.capacity).toBeGreaterThan(0);
    }
  });

  it('treats an unknown slot as a single mount', () => {
    const variant = resolveAccessoryVariant({
      ...(catalog.accessories[0] as object),
      slot: 'porta-bagagens',
    } as never);

    expect(variant.capacity).toBe(1);
  });
});

describe('instance placement', () => {
  it('spreads a ring evenly around the circle', () => {
    const placements = ringPlacements(8, [0, 0, 0], 0.3, [0.01, 0.01, 0.01]);

    expect(placements).toHaveLength(8);

    for (const placement of placements) {
      expect(Math.hypot(placement.position[0], placement.position[1])).toBeCloseTo(0.3, 6);
      expect(placement.position[2]).toBe(0);
    }
  });

  it('returns nothing for a count of zero', () => {
    expect(ringPlacements(0, [0, 0, 0], 0.3, [1, 1, 1])).toHaveLength(0);
    expect(spokePlacements(0, [0, 0, 0], 0.02, 0.3, 0.002)).toHaveLength(0);
    expect(cassettePlacements(0, [0, 0, 0], {
      largestRadius: 0.05,
      radiusStep: 0.004,
      innerOffset: 0.016,
      offsetStep: 0.004,
      thickness: 0.002,
    })).toHaveLength(0);
  });

  it('points every spoke outwards from the hub', () => {
    const placements = spokePlacements(6, [0, 0, 0], 0.024, 0.3, 0.0018);

    expect(placements).toHaveLength(6);

    for (const placement of placements) {
      // The cylinder axis is Y, so a radial spoke needs a -90 degree rotation.
      const angle = placement.rotation[2] + Math.PI / 2;
      const radial = Math.atan2(placement.position[1], placement.position[0]);

      expect(Math.cos(angle)).toBeCloseTo(Math.cos(radial), 6);
      expect(Math.sin(angle)).toBeCloseTo(Math.sin(radial), 6);
      // Spokes sit between the hub and the rim.
      expect(placement.scale[1]).toBeCloseTo(0.3 - 0.024, 6);
    }
  });

  it('shrinks the cassette as it moves outboard', () => {
    const placements = cassettePlacements(5, [0, 0, 0], {
      largestRadius: 0.056,
      radiusStep: 0.004,
      innerOffset: 0.016,
      offsetStep: 0.004,
      thickness: 0.0022,
    });

    expect(placements).toHaveLength(5);

    for (let index = 1; index < placements.length; index += 1) {
      const previous = placements[index - 1];
      const current = placements[index];

      expect(previous).toBeDefined();
      expect(current).toBeDefined();

      if (previous === undefined || current === undefined) continue;

      expect(current.scale[0]).toBeLessThan(previous.scale[0]);
      expect(current.position[2]).toBeGreaterThan(previous.position[2]);
    }
  });

  it('spaces bottle cages along the tube', () => {
    const placements = tubeMountPlacements(2, [-0.3, 0.3, 0], [0.3, 0.7, 0], [0, 0, 0], 0.1);

    expect(placements).toHaveLength(2);

    const first = placements[0];
    const second = placements[1];

    expect(first).toBeDefined();
    expect(second).toBeDefined();

    if (first === undefined || second === undefined) return;

    const distance = Math.hypot(
      second.position[0] - first.position[0],
      second.position[1] - first.position[1],
    );

    expect(distance).toBeGreaterThan(0.1);
  });
});

describe('glb extension point', () => {
  it('has no model yet, so the procedural path is the only path', () => {
    expect(glbModelIds()).toHaveLength(0);
    expect(Object.keys(glbModels)).toHaveLength(0);
    expect(resolvePartModel('frame-veloce-aero-sl')).toBeUndefined();
  });
});

describe('catalog selection', () => {
  it('resolves every id of a configuration into a typed product', () => {
    const selection = selected({
      frameId: 'frame-veloce-aero-sl',
      wheelsetId: 'wheelset-ardent-carbon-45',
      groupsetId: 'groupset-northwind-di2-12',
      cranksetId: 'crankset-northwind-172-52-36',
      handlebarId: 'handlebar-veloce-aero-40',
      saddleId: 'saddle-veloce-race-143',
      tireId: 'tire-voltaic-cotton-28',
    });

    expect(selection.frame?.id).toBe('frame-veloce-aero-sl');
    expect(selection.wheelset?.id).toBe('wheelset-ardent-carbon-45');
    expect(selection.groupset?.id).toBe('groupset-northwind-di2-12');
    expect(selection.crankset?.id).toBe('crankset-northwind-172-52-36');
    expect(selection.handlebar?.id).toBe('handlebar-veloce-aero-40');
    expect(selection.saddle?.id).toBe('saddle-veloce-race-143');
    expect(selection.tire?.id).toBe('tire-voltaic-cotton-28');
  });

  it('ignores unknown ids instead of throwing', () => {
    const selection = selected({ frameId: 'nao-existe', tireId: 'tambem-nao' });

    expect(selection.frame).toBeUndefined();
    expect(selection.tire).toBeUndefined();
  });

  it('resolves every product in the catalog to a variant', () => {
    // Nothing in the catalog may be invisible: each product must resolve to a
    // variant that draws something.
    for (const frame of catalog.frames) {
      expect(resolveFrameVariant(frame).profile).toBeDefined();
    }

    for (const wheelset of catalog.wheelsets) {
      expect(resolveWheelVariant(wheelset).spokeCount).toBeGreaterThan(0);
    }

    for (const tire of catalog.tires) {
      expect(resolveTireVariant(tire).sidewall).toBeDefined();
    }

    for (const crankset of catalog.cranksets) {
      expect(resolveCrankVariant(crankset).chainringCount).toBeGreaterThan(0);
    }

    for (const groupset of catalog.groupsets) {
      expect(resolveGroupsetVariant(groupset).sprocketCount).toBeGreaterThan(0);
    }

    for (const handlebar of catalog.handlebars) {
      expect(resolveHandlebarVariant(handlebar).dropRadius).toBeGreaterThan(0);
    }

    for (const saddle of catalog.saddles) {
      expect(resolveSaddleVariant(saddle).shellWidth).toBeGreaterThan(0);
    }

    for (const accessory of catalog.accessories) {
      expect(resolveAccessoryVariant(accessory).capacity).toBeGreaterThan(0);
    }
  });
});

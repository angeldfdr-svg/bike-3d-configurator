import { describe, expect, it } from 'vitest';

import { catalog } from '@/data/catalog';
import {
  availableSizes,
  canSaveBuild,
  conflictsWithBuild,
  evaluateCompatibility,
  slotOfCategory,
} from '@/lib/compatibility';
import { emptyConfiguration } from '@/lib/configuration';
import type { Component, ComponentCategory } from '@/types/components';
import type { BikeConfiguration, ComponentSlot } from '@/types/configuration';

/**
 * Compatibility engine.
 *
 * The assertions use the real products of the catalog, so a rule is only
 * considered covered when it fires on a pair that genuinely clashes and stays
 * quiet on a pair that genuinely fits.
 */

function build(slots: Partial<Record<ComponentSlot, string>>): BikeConfiguration {
  return { ...emptyConfiguration(), ...slots };
}

const products = Object.values(catalog).flat() as Component[];

function product(id: string): Component {
  const found = products.find((item) => item.id === id);

  if (found === undefined) throw new Error(`fixture is missing ${id}`);

  return found;
}

/* Real pairs drawn from the catalog. */
const AERO_SL = 'frame-veloce-aero-sl'; // T47 · disco · 32 mm · 27,2 mm · thru 12
const ALLOY_PRO = 'frame-ardent-alloy-pro'; // BSA · disco mecânico · 30 mm · 30,9 mm
const TI_GRAVEL = 'frame-meridian-ti-gravel'; // T47 · disco · 45 mm · 31,6 mm

const MECHANIC_11 = 'groupset-northwind-mechanic-11'; // 11 v · T47 · HG · disco
const DI2_12 = 'groupset-northwind-di2-12'; // 12 v · T47 · HG · disco
const FORCE_XDR_12 = 'groupset-meridian-force-xdr-12'; // 12 v · DUB · XDR · disco
const CLASSIC_10 = 'groupset-voltaic-classic-10'; // 10 v · BSA · HG · aro

const CARBON_45 = 'wheelset-ardent-carbon-45'; // HG · thru 12 · disco · tubeless
const XDR_50 = 'wheelset-northwind-xdr-50'; // XDR · thru 12 · disco · tubeless

const COMPACT_172 = 'crankset-northwind-172-52-36'; // 11 v · T47
const SUB_COMPACT_170 = 'crankset-northwind-170-48-31'; // 12 v · T47
const MONO_168 = 'crankset-voltaic-168-40'; // 11 v · BSA

const RACE_143 = 'saddle-veloce-race-143'; // carris 27,2
const GRAVEL_145 = 'saddle-northwind-gravel-145'; // carris 31,6

const COTTON_28 = 'tire-voltaic-cotton-28'; // 28 mm · clincher
const COTTON_32 = 'tire-voltaic-cotton-32'; // 32 mm · tubeless
const GRAVEL_40 = 'tire-meridian-gravel-40'; // 40 mm · tubeless

describe('evaluateCompatibility', () => {
  it('finds nothing wrong in an empty build', () => {
    const report = evaluateCompatibility(catalog, emptyConfiguration());

    expect(report.errors).toEqual([]);
    expect(report.warnings).toEqual([]);
    expect(report.compatible).toBe(true);
  });

  it('stays silent while a slot is still unselected', () => {
    // A frame and a tire that would clash, but no frame chosen yet.
    const report = evaluateCompatibility(catalog, build({ tireId: GRAVEL_40 }));

    expect(report.compatible).toBe(true);
    expect(report.errors).toEqual([]);
  });

  it('accepts a fully coherent build', () => {
    const report = evaluateCompatibility(
      catalog,
      build({
        frameId: TI_GRAVEL,
        wheelsetId: CARBON_45,
        groupsetId: DI2_12,
        cranksetId: SUB_COMPACT_170,
        saddleId: GRAVEL_145,
        tireId: GRAVEL_40,
      }),
    );

    expect(report.errors).toEqual([]);
    expect(report.compatible).toBe(true);
  });
});

describe('movimento pedaleiro', () => {
  it('rejects a groupset whose bottom bracket differs from the frame', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: AERO_SL, groupsetId: FORCE_XDR_12 }),
    );

    expect(report.compatible).toBe(false);
    expect(report.errors[0]?.rule).toBe('movimento-pedaleiro');
    expect(report.errors[0]?.detail).toContain('T47');
    expect(report.errors[0]?.detail).toContain('DUB');
    expect(report.errors[0]?.slots).toEqual(['frameId', 'groupsetId']);
  });

  it('rejects a crankset whose bottom bracket differs from the frame', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: AERO_SL, cranksetId: MONO_168 }),
    );

    expect(report.errors[0]?.rule).toBe('movimento-pedaleiro');
    expect(report.errors[0]?.slots).toEqual(['frameId', 'cranksetId']);
  });

  it('accepts a groupset and crankset that match the frame', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: AERO_SL, groupsetId: DI2_12, cranksetId: SUB_COMPACT_170 }),
    );

    expect(report.errors).toEqual([]);
  });

  it('names real alternatives in the resolution', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: ALLOY_PRO, groupsetId: DI2_12 }),
    );
    const issue = report.errors.find((item) => item.rule === 'movimento-pedaleiro');

    // The only BSA groupset in the catalog.
    expect(issue?.resolution).toContain('Classic 10');
  });
});

describe('núcleo de cassete', () => {
  it('rejects an XDR wheelset with an HG groupset', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ wheelsetId: XDR_50, groupsetId: MECHANIC_11 }),
    );

    expect(report.errors[0]?.rule).toBe('nucleo-cassete');
    expect(report.errors[0]?.slots).toEqual(['wheelsetId', 'groupsetId']);
  });

  it('rejects an HG wheelset with an XDR groupset', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ wheelsetId: CARBON_45, groupsetId: FORCE_XDR_12 }),
    );

    expect(report.errors[0]?.rule).toBe('nucleo-cassete');
  });

  it('accepts matching freehubs', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ wheelsetId: XDR_50, groupsetId: FORCE_XDR_12 }),
    );

    expect(report.errors).toEqual([]);
  });
});

describe('travagem', () => {
  it('rejects a rim brake groupset on a disc frame', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: AERO_SL, groupsetId: CLASSIC_10 }),
    );

    expect(report.errors.some((issue) => issue.rule === 'travagem')).toBe(true);
    expect(report.errors.find((issue) => issue.rule === 'travagem')?.slots).toEqual([
      'frameId',
      'groupsetId',
    ]);
  });

  it('rejects a rim brake groupset on disc wheels', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ wheelsetId: CARBON_45, groupsetId: CLASSIC_10 }),
    );

    expect(report.errors.find((issue) => issue.rule === 'travagem')?.slots).toEqual([
      'wheelsetId',
      'groupsetId',
    ]);
  });

  it('treats hydraulic and mechanical disc as the same family', () => {
    // The alloy frame is mechanical disc, the groupset is hydraulic disc.
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: ALLOY_PRO, groupsetId: DI2_12 }),
    );

    expect(report.errors.filter((issue) => issue.rule === 'travagem')).toEqual([]);
  });
});

describe('largura de pneu', () => {
  it('rejects a tyre wider than the frame admits', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: AERO_SL, tireId: GRAVEL_40 }),
    );

    expect(report.errors[0]?.rule).toBe('largura-pneu');
    expect(report.errors[0]?.detail).toContain('32 mm');
    expect(report.errors[0]?.detail).toContain('40 mm');
  });

  it('accepts a tyre exactly at the frame limit', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: AERO_SL, tireId: COTTON_32 }),
    );

    expect(report.errors).toEqual([]);
  });

  it('accepts a wide tyre on a frame with room for it', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: TI_GRAVEL, tireId: GRAVEL_40 }),
    );

    expect(report.errors).toEqual([]);
  });
});

describe('tamanho de roda', () => {
  it('rejects a 650b tyre on 700c wheels', () => {
    const mismatched = {
      ...catalog,
      tires: catalog.tires.map((tire) =>
        tire.id === GRAVEL_40 ? { ...tire, wheelSize: '650b' as const } : tire,
      ),
    };

    const report = evaluateCompatibility(
      mismatched,
      build({ wheelsetId: CARBON_45, tireId: GRAVEL_40 }),
    );

    expect(report.errors[0]?.rule).toBe('tamanho-roda');
  });

  it('accepts matching wheel sizes', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ wheelsetId: CARBON_45, tireId: COTTON_28 }),
    );

    expect(report.errors).toEqual([]);
  });
});

describe('velocidades', () => {
  it('rejects an eleven speed crankset with a twelve speed groupset', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ groupsetId: DI2_12, cranksetId: MONO_168 }),
    );

    expect(report.errors[0]?.rule).toBe('velocidades');
    expect(report.errors[0]?.detail).toContain('12');
    expect(report.errors[0]?.detail).toContain('11');
  });

  it('accepts matching speeds', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ groupsetId: MECHANIC_11, cranksetId: COMPACT_172 }),
    );

    expect(report.errors).toEqual([]);
  });
});

describe('espigão do selim', () => {
  it('rejects a saddle whose rails do not match the frame', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: TI_GRAVEL, saddleId: RACE_143 }),
    );

    expect(report.errors[0]?.rule).toBe('espigao-selim');
    expect(report.errors[0]?.detail).toContain('31,6 mm');
  });

  it('rejects every saddle against the alloy frame, whose 30,9 mm has no match', () => {
    for (const saddle of catalog.saddles) {
      const report = evaluateCompatibility(
        catalog,
        build({ frameId: ALLOY_PRO, saddleId: saddle.id }),
      );

      expect(report.errors.some((issue) => issue.rule === 'espigao-selim'), saddle.id).toBe(
        true,
      );
    }
  });

  it('accepts matching rail diameters', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: AERO_SL, saddleId: RACE_143 }),
    );

    expect(report.errors).toEqual([]);
  });
});

describe('eixos', () => {
  it('rejects a thru-axle frame with quick release wheels', () => {
    const mismatched = {
      ...catalog,
      wheelsets: catalog.wheelsets.map((wheelset) =>
        wheelset.id === CARBON_45
          ? {
              ...wheelset,
              frontAxle: 'quick-release' as const,
              rearAxle: 'quick-release' as const,
            }
          : wheelset,
      ),
    };

    const report = evaluateCompatibility(
      mismatched,
      build({ frameId: AERO_SL, wheelsetId: CARBON_45 }),
    );

    expect(report.errors.filter((issue) => issue.rule === 'eixos')).toHaveLength(2);
  });

  it('accepts matching axles', () => {
    const report = evaluateCompatibility(
      catalog,
      build({ frameId: AERO_SL, wheelsetId: CARBON_45 }),
    );

    expect(report.errors).toEqual([]);
  });
});

describe('tubeless', () => {
  it('warns instead of blocking when the rim is not tubeless ready', () => {
    const mismatched = {
      ...catalog,
      wheelsets: catalog.wheelsets.map((wheelset) =>
        wheelset.id === CARBON_45 ? { ...wheelset, tubelessReady: false } : wheelset,
      ),
    };

    const report = evaluateCompatibility(
      mismatched,
      build({ wheelsetId: CARBON_45, tireId: GRAVEL_40 }),
    );

    expect(report.compatible).toBe(true);
    expect(report.warnings).toHaveLength(1);
    expect(report.warnings[0]?.severity).toBe('aviso');
    expect(report.warnings[0]?.rule).toBe('tubeless');
  });

  it('stays silent for a clincher tyre on a rim that is not tubeless ready', () => {
    const mismatched = {
      ...catalog,
      wheelsets: catalog.wheelsets.map((wheelset) =>
        wheelset.id === CARBON_45 ? { ...wheelset, tubelessReady: false } : wheelset,
      ),
    };

    const report = evaluateCompatibility(
      mismatched,
      build({ wheelsetId: CARBON_45, tireId: COTTON_28 }),
    );

    expect(report.warnings).toEqual([]);
  });
});

describe('multiple issues at once', () => {
  it('reports every clash of a badly assembled build', () => {
    const report = evaluateCompatibility(
      catalog,
      build({
        frameId: AERO_SL, // T47 · disco · 32 mm
        wheelsetId: XDR_50, // XDR
        groupsetId: FORCE_XDR_12, // DUB · XDR · 12 v
        cranksetId: MONO_168, // BSA · 11 v
        saddleId: GRAVEL_145, // 31,6 mm
        tireId: GRAVEL_40, // 40 mm
      }),
    );

    const rules = report.errors.map((issue) => issue.rule);

    expect(rules).toContain('movimento-pedaleiro');
    expect(rules).toContain('largura-pneu');
    expect(rules).toContain('espigao-selim');
    expect(rules).toContain('velocidades');
    // The XDR wheels and the XDR groupset agree, and both are disc.
    expect(rules).not.toContain('nucleo-cassete');
    expect(rules).not.toContain('travagem');
  });
});

describe('conflictsWithBuild', () => {
  it('names the issues a product would introduce', () => {
    const issues = conflictsWithBuild(
      catalog,
      build({ frameId: AERO_SL }),
      product(FORCE_XDR_12),
    );

    expect(issues.map((issue) => issue.rule)).toContain('movimento-pedaleiro');
  });

  it('returns nothing for a product that fits the build', () => {
    const issues = conflictsWithBuild(catalog, build({ frameId: AERO_SL }), product(DI2_12));

    expect(issues).toEqual([]);
  });

  it('ignores accessories, which have no slot', () => {
    const issues = conflictsWithBuild(
      catalog,
      build({ frameId: AERO_SL }),
      product('accessory-cinder-cycle-computer'),
    );

    expect(issues).toEqual([]);
  });

  it('agrees with the report about the build it just created', () => {
    const configuration = build({ frameId: AERO_SL });
    const issues = conflictsWithBuild(catalog, configuration, product(GRAVEL_40));
    const report = evaluateCompatibility(catalog, { ...configuration, tireId: GRAVEL_40 });

    expect(issues).toHaveLength(report.errors.length);
    expect(issues[0]?.rule).toBe(report.errors[0]?.rule);
  });
});

describe('canSaveBuild', () => {
  it('blocks a build with a blocking issue', () => {
    const result = canSaveBuild(catalog, build({ frameId: AERO_SL, tireId: GRAVEL_40 }));

    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('Pneu demasiado largo para o quadro');
  });

  it('allows a coherent build', () => {
    const result = canSaveBuild(
      catalog,
      build({ frameId: AERO_SL, tireId: COTTON_32, saddleId: RACE_143 }),
    );

    expect(result.allowed).toBe(true);
    expect(result.reason).toBeNull();
  });

  it('allows a build that only carries a warning', () => {
    const mismatched = {
      ...catalog,
      wheelsets: catalog.wheelsets.map((wheelset) =>
        wheelset.id === CARBON_45 ? { ...wheelset, tubelessReady: false } : wheelset,
      ),
    };

    const result = canSaveBuild(
      mismatched,
      build({ wheelsetId: CARBON_45, tireId: GRAVEL_40 }),
    );

    expect(result.allowed).toBe(true);
  });
});

describe('slotOfCategory', () => {
  it('maps every category to its slot', () => {
    const expected: Record<Exclude<ComponentCategory, 'extras'>, ComponentSlot> = {
      quadro: 'frameId',
      rodas: 'wheelsetId',
      grupo: 'groupsetId',
      pedaleiro: 'cranksetId',
      guiador: 'handlebarId',
      selim: 'saddleId',
      pneus: 'tireId',
    };

    for (const [category, slot] of Object.entries(expected)) {
      expect(slotOfCategory(category as ComponentCategory)).toBe(slot);
    }
  });

  it('has no slot for extras', () => {
    expect(slotOfCategory('extras')).toBeNull();
  });
});

describe('availableSizes', () => {
  it('returns the sizes the chosen frame is offered in', () => {
    expect(availableSizes(catalog, TI_GRAVEL)).toEqual(['S', 'M', 'L']);
    expect(availableSizes(catalog, AERO_SL)).toEqual(['XS', 'S', 'M', 'L', 'XL']);
  });

  it('returns nothing without a frame', () => {
    expect(availableSizes(catalog, null)).toEqual([]);
    expect(availableSizes(catalog, 'frame-does-not-exist')).toEqual([]);
  });
});

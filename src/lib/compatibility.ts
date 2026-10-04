import type {
  BrakeSystem,
  Catalog,
  Component,
  ComponentCategory,
  Crankset,
  FrameSize,
  Groupset,
  Tire,
  WheelSize,
} from '@/types/components';
import type { BikeConfiguration, ComponentSlot } from '@/types/configuration';

import { findSelection, normalizeProductId } from './catalog';
import { formatLength, formatList } from './format';

/**
 * Compatibility engine.
 *
 * Rules are declared once, as data, over the structured attributes the catalog
 * already carries. Nothing here reads the store or renders: it turns a build
 * into a list of issues, each with the reason in Portuguese and the way de a
 * resolver.
 *
 * A rule only fires when both products are actually selected. An incomplete
 * build has no conflicts — it is incomplete, which is the pricing engine's
 * business, not this one's.
 */

/* ------------------------------------------------------------------ *
 * Vocabulary
 * ------------------------------------------------------------------ */

export type CompatibilityRuleId =
  | 'movimento-pedaleiro'
  | 'nucleo-cassete'
  | 'travagem'
  | 'largura-pneu'
  | 'tamanho-roda'
  | 'velocidades'
  | 'eixos'
  | 'tubeless';

/**
 * `erro` blocks the build: the bicycle cannot be assembled as chosen.
 * `aviso` is allowed but worth saying out loud.
 */
export type CompatibilitySeverity = 'erro' | 'aviso';

export type CompatibilityIssue = {
  readonly rule: CompatibilityRuleId;
  readonly severity: CompatibilitySeverity;
  /** Short headline, in Portuguese. */
  readonly title: string;
  /** Why it clashes, with the real values of both products. */
  readonly detail: string;
  /** How to get out of it, naming real alternatives from the catalog. */
  readonly resolution: string;
  /** The slots the user has to change. */
  readonly slots: readonly ComponentSlot[];
};

export type CompatibilityReport = {
  /** True when there is no blocking issue. */
  readonly compatible: boolean;
  readonly errors: readonly CompatibilityIssue[];
  readonly warnings: readonly CompatibilityIssue[];
};

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** The slot a category fills, or `null` for extras. */
export function slotOfCategory(category: ComponentCategory): ComponentSlot | null {
  switch (category) {
    case 'quadro':
      return 'frameId';
    case 'rodas':
      return 'wheelsetId';
    case 'grupo':
      return 'groupsetId';
    case 'pedaleiro':
      return 'cranksetId';
    case 'guiador':
      return 'handlebarId';
    case 'selim':
      return 'saddleId';
    case 'pneus':
      return 'tireId';
    case 'extras':
      return null;
  }
}

/** True when two values are both present and different. */
function clashes<T>(left: T | undefined, right: T | undefined): boolean {
  return left !== undefined && right !== undefined && left !== right;
}

/** Both disc standards share the same mounting, so they are one family. */
function brakeFamily(system: BrakeSystem): 'disco' | 'aro' {
  return system === 'aro' ? 'aro' : 'disco';
}

/** The names of the catalog options that satisfy a predicate. */
function namesOf<K extends keyof Catalog>(
  source: Catalog,
  key: K,
  matches: (product: Catalog[K][number]) => boolean,
): string {
  const names = source[key].filter(matches).map((product) => product.name);

  return names.length > 0 ? formatList(names) : 'nenhuma opção actual do catálogo';
}

/* ------------------------------------------------------------------ *
 * Rules
 * ------------------------------------------------------------------ */

type Selection = ReturnType<typeof findSelection>;

function bottomBracketRule(source: Catalog, selection: Selection): CompatibilityIssue[] {
  const { frame, groupset, crankset } = selection;
  const issues: CompatibilityIssue[] = [];

  if (frame === undefined) return issues;

  const frameStandard = frame.bottomBracket;
  const compatibleGroupsets = namesOf(source, 'groupsets', (g: Groupset) => g.bottomBracket === frameStandard);
  const compatibleCranksets = namesOf(source, 'cranksets', (c: Crankset) => c.bottomBracket === frameStandard);

  if (clashes(frameStandard, groupset?.bottomBracket)) {
    issues.push({
      rule: 'movimento-pedaleiro',
      severity: 'erro',
      title: 'Movimento pedaleiro incompatível',
      detail: `O quadro ${frame.name} é ${frameStandard} e o grupo ${groupset?.name} é ${groupset?.bottomBracket}.`,
      resolution: `Escolhe um grupo ${frameStandard} — ${compatibleGroupsets} — ou um quadro ${groupset?.bottomBracket}.`,
      slots: ['frameId', 'groupsetId'],
    });
  }

  if (clashes(frameStandard, crankset?.bottomBracket)) {
    issues.push({
      rule: 'movimento-pedaleiro',
      severity: 'erro',
      title: 'Movimento pedaleiro incompatível',
      detail: `O quadro ${frame.name} é ${frameStandard} e o pedaleiro ${crankset?.name} é ${crankset?.bottomBracket}.`,
      resolution: `Escolhe um pedaleiro ${frameStandard} — ${compatibleCranksets} — ou um quadro ${crankset?.bottomBracket}.`,
      slots: ['frameId', 'cranksetId'],
    });
  }

  return issues;
}

function freehubRule(source: Catalog, selection: Selection): CompatibilityIssue[] {
  const { wheelset, groupset } = selection;

  if (!clashes(wheelset?.freehub, groupset?.freehub)) return [];

  const wheelStandard = wheelset?.freehub;
  const groupStandard = groupset?.freehub;

  return [
    {
      rule: 'nucleo-cassete',
      severity: 'erro',
      title: 'Núcleo de cassete incompatível',
      detail: `As rodas ${wheelset?.name} têm núcleo ${wheelStandard} e o grupo ${groupset?.name} é ${groupStandard}.`,
      resolution: `Escolhe um grupo ${wheelStandard} — ${namesOf(source, 'groupsets', (g: Groupset) => g.freehub === wheelStandard)} — ou umas rodas ${groupStandard}.`,
      slots: ['wheelsetId', 'groupsetId'],
    },
  ];
}

function brakeRule(source: Catalog, selection: Selection): CompatibilityIssue[] {
  const { frame, wheelset, groupset } = selection;
  const issues: CompatibilityIssue[] = [];

  if (groupset === undefined) return issues;

  const groupFamily = brakeFamily(groupset.brakeSystem);

  if (frame !== undefined && brakeFamily(frame.brakeSystem) !== groupFamily) {
    issues.push({
      rule: 'travagem',
      severity: 'erro',
      title: 'Sistema de travagem incompatível',
      detail: `O quadro ${frame.name} é ${frame.brakeSystem} e o grupo ${groupset.name} trava a ${groupset.brakeSystem}.`,
      resolution: `Escolhe um grupo de ${groupFamily === 'aro' ? 'aro' : 'disco'} — ${namesOf(source, 'groupsets', (g: Groupset) => brakeFamily(g.brakeSystem) === groupFamily)}.`,
      slots: ['frameId', 'groupsetId'],
    });
  }

  if (wheelset !== undefined && brakeFamily(wheelset.brakeSystem) !== groupFamily) {
    issues.push({
      rule: 'travagem',
      severity: 'erro',
      title: 'Sistema de travagem incompatível',
      detail: `As rodas ${wheelset.name} são ${wheelset.brakeSystem} e o grupo ${groupset.name} trava a ${groupset.brakeSystem}.`,
      resolution: `Escolhe umas rodas de ${groupFamily === 'aro' ? 'aro' : 'disco'} ou um grupo de ${brakeFamily(wheelset.brakeSystem) === 'aro' ? 'aro' : 'disco'}.`,
      slots: ['wheelsetId', 'groupsetId'],
    });
  }

  return issues;
}

function tireWidthRule(source: Catalog, selection: Selection): CompatibilityIssue[] {
  const { frame, tire } = selection;

  if (frame === undefined || tire === undefined) return [];
  if (tire.width <= frame.maxTireWidth) return [];

  return [
    {
      rule: 'largura-pneu',
      severity: 'erro',
      title: 'Pneu demasiado largo para o quadro',
      detail: `O quadro ${frame.name} admite pneus até ${formatLength(frame.maxTireWidth)} e o pneu ${tire.name} tem ${formatLength(tire.width)}.`,
      resolution: `Escolhe um pneu até ${formatLength(frame.maxTireWidth)} — ${namesOf(source, 'tires', (t: Tire) => t.width <= frame.maxTireWidth)}.`,
      slots: ['frameId', 'tireId'],
    },
  ];
}

function wheelSizeRule(source: Catalog, selection: Selection): CompatibilityIssue[] {
  const { wheelset, tire } = selection;

  if (!clashes(wheelset?.wheelSize, tire?.wheelSize)) return [];

  const size: WheelSize = wheelset?.wheelSize ?? tire?.wheelSize ?? '700c';

  return [
    {
      rule: 'tamanho-roda',
      severity: 'erro',
      title: 'Tamanho de roda incompatível',
      detail: `As rodas ${wheelset?.name} são ${wheelset?.wheelSize} e o pneu ${tire?.name} é ${tire?.wheelSize}.`,
      resolution: `Escolhe um pneu ${size} — ${namesOf(source, 'tires', (t: Tire) => t.wheelSize === size)}.`,
      slots: ['wheelsetId', 'tireId'],
    },
  ];
}

function speedsRule(source: Catalog, selection: Selection): CompatibilityIssue[] {
  const { groupset, crankset } = selection;

  if (!clashes(groupset?.speeds, crankset?.speeds)) return [];

  const speeds = groupset?.speeds ?? crankset?.speeds ?? 0;

  return [
    {
      rule: 'velocidades',
      severity: 'erro',
      title: 'Número de velocidades incompatível',
      detail: `O grupo ${groupset?.name} tem ${groupset?.speeds} velocidades e o pedaleiro ${crankset?.name} é feito para ${crankset?.speeds}.`,
      resolution: `Escolhe um pedaleiro de ${speeds} velocidades — ${namesOf(source, 'cranksets', (c: Crankset) => c.speeds === speeds)}.`,
      slots: ['groupsetId', 'cranksetId'],
    },
  ];
}

function axleRule(selection: Selection): CompatibilityIssue[] {
  const { frame, wheelset } = selection;
  const issues: CompatibilityIssue[] = [];

  if (frame === undefined || wheelset === undefined) return issues;

  if (clashes(frame.frontAxle, wheelset.frontAxle)) {
    issues.push({
      rule: 'eixos',
      severity: 'erro',
      title: 'Eixo dianteiro incompatível',
      detail: `O quadro ${frame.name} é ${frame.frontAxle} e as rodas ${wheelset.name} são ${wheelset.frontAxle}.`,
      resolution: 'Escolhe umas rodas com o mesmo padrão de eixo do quadro.',
      slots: ['frameId', 'wheelsetId'],
    });
  }

  if (clashes(frame.rearAxle, wheelset.rearAxle)) {
    issues.push({
      rule: 'eixos',
      severity: 'erro',
      title: 'Eixo traseiro incompatível',
      detail: `O quadro ${frame.name} é ${frame.rearAxle} e as rodas ${wheelset.name} são ${wheelset.rearAxle}.`,
      resolution: 'Escolhe umas rodas com o mesmo padrão de eixo do quadro.',
      slots: ['frameId', 'wheelsetId'],
    });
  }

  return issues;
}

function tubelessRule(selection: Selection): CompatibilityIssue[] {
  const { wheelset, tire } = selection;

  if (wheelset === undefined || tire === undefined) return [];
  if (tire.type !== 'tubeless' || wheelset.tubelessReady) return [];

  return [
    {
      rule: 'tubeless',
      severity: 'aviso',
      title: 'Pneu tubeless em aro não preparado',
      detail: `O pneu ${tire.name} é tubeless e as rodas ${wheelset.name} não são tubeless ready.`,
      resolution: 'Monta com câmara interna, ou escolhe umas rodas tubeless ready.',
      slots: ['wheelsetId', 'tireId'],
    },
  ];
}

/* ------------------------------------------------------------------ *
 * Engine
 * ------------------------------------------------------------------ */

/**
 * Every issue a build has, split by severity.
 *
 * `compatible` is about blocking issues only: a warning never stops the build,
 * it just has to be said.
 */
export function evaluateCompatibility(
  source: Catalog,
  configuration: BikeConfiguration,
): CompatibilityReport {
  const selection = findSelection(source, configuration);

  const issues = [
    ...bottomBracketRule(source, selection),
    ...freehubRule(source, selection),
    ...brakeRule(source, selection),
    ...tireWidthRule(source, selection),
    ...wheelSizeRule(source, selection),
    ...speedsRule(source, selection),
    ...axleRule(selection),
    ...tubelessRule(selection),
  ];

  const errors = issues.filter((issue) => issue.severity === 'erro');
  const warnings = issues.filter((issue) => issue.severity === 'aviso');

  return { compatible: errors.length === 0, errors, warnings };
}

/**
 * The blocking issues a product would bring into a build.
 *
 * This is what the product picker uses to mark an option before the user
 * commits to it: the answer is computed on a candidate build, so the picker and
 * the summary can never disagree about what is compatible.
 */
export function conflictsWithBuild(
  source: Catalog,
  configuration: BikeConfiguration,
  product: Component,
): readonly CompatibilityIssue[] {
  const slot = slotOfCategory(product.category);

  if (slot === null) return [];

  const candidate: BikeConfiguration = { ...configuration, [slot]: product.id };

  return evaluateCompatibility(source, candidate).errors.filter((issue) =>
    issue.slots.includes(slot),
  );
}

/**
 * Whether a configuration can be kept.
 *
 * An incomplete build cannot be saved either: there is nothing to keep yet.
 * The caller decides what to do about it — this only states the fact.
 */
export function canSaveBuild(
  source: Catalog,
  configuration: BikeConfiguration,
): { readonly allowed: boolean; readonly reason: string | null } {
  const report = evaluateCompatibility(source, configuration);

  if (report.errors.length > 0) {
    return { allowed: false, reason: report.errors[0]?.title ?? 'Configuração incompatível' };
  }

  return { allowed: true, reason: null };
}

/** Sizes a frame is actually offered in, for the size picker. */
export function availableSizes(source: Catalog, frameId: string | null): readonly FrameSize[] {
  if (frameId === null) return [];

  const normalizedId = normalizeProductId(frameId);
  return source.frames.find((frame) => frame.id === normalizedId)?.sizes ?? [];
}

/**
 * GLB model references.
 *
 * Empty on purpose. Every part of the bike is procedural today, so there is no
 * unexercised loader to maintain and no binary asset to licence.
 *
 * When real models exist, an entry here is all it takes:
 *
 * ```ts
 * export const glbModels = {
 *   'wheelset-ardent-carbon-45': { url: '/models/carbon-45.glb', anchor: 'rearAxle' },
 * };
 * ```
 *
 * The part then renders the GLB at the same anchor the procedural version used,
 * which is why the anchors live in `src/lib/3d/bike-geometry.ts` and not in a
 * component. Until an entry exists, `resolvePartModel` returns `undefined` and
 * the procedural path is the only path.
 */

export type GlbModelRef = {
  readonly url: string;
  /** Anchor point of the geometry the model is mounted on. */
  readonly anchor: 'rearAxle' | 'frontAxle' | 'bottomBracket' | 'handlebarCenter' | 'saddleCenter';
  /** Optional placement offset in scene space. */
  readonly position?: readonly [number, number, number];
  /** Optional rotation applied to the loaded GLB. */
  readonly rotation?: readonly [number, number, number];
  /** Optional uniform scale for the asset. */
  readonly scale?: number;
};

export const glbModels: Readonly<Record<string, GlbModelRef>> = {};

export function resolvePartModel(productId: string): GlbModelRef | undefined {
  return glbModels[productId];
}

/** Every product id that currently has a GLB model. */
export function glbModelIds(): readonly string[] {
  return Object.keys(glbModels);
}

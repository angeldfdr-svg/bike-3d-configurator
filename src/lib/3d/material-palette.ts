/**
 * Material palette for the procedural bike.
 *
 * Kept as data, in the logic layer, so the variant resolvers can name a finish
 * without importing React or Three.js, and a future GLB pipeline can reuse the
 * same colours.
 */

export const materialPalette = {
  /** Frame paint: metallic olive, matching the editorial photography. */
  framePaint: { color: '#82a034', metalness: 0.55, roughness: 0.34 },
  frameAccent: { color: '#c3dd7c', metalness: 0.4, roughness: 0.3 },
  /** Bare titanium: warm grey, lightly brushed. */
  rawTitanium: { color: '#8e8b84', metalness: 0.75, roughness: 0.42 },
  /** Bare aluminium: bright, machined. */
  rawAlloy: { color: '#b6bcc4', metalness: 0.88, roughness: 0.24 },
  carbon: { color: '#14160f', metalness: 0.35, roughness: 0.42 },
  alloy: { color: '#3c424a', metalness: 0.85, roughness: 0.28 },
  darkMetal: { color: '#1c2024', metalness: 0.7, roughness: 0.42 },
  steel: { color: '#8d949c', metalness: 0.9, roughness: 0.32 },
  rubber: { color: '#0c0d0b', metalness: 0, roughness: 0.92 },
  /** Tan sidewall of a cotton-cased tyre. */
  tanWall: { color: '#c9a468', metalness: 0.05, roughness: 0.78 },
  barTape: { color: '#15170f', metalness: 0.1, roughness: 0.78 },
} as const;

export type MaterialName = keyof typeof materialPalette;

export const materialNames = Object.keys(materialPalette) as readonly MaterialName[];

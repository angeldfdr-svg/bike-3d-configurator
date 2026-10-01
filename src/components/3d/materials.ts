/**
 * Material palette for the procedural bike.
 *
 * Kept as data so the 3D parts stay declarative and a future GLB pipeline can
 * reuse the same colours.
 */

export const bikeMaterials = {
  /** Frame paint: metallic olive, matching the editorial photography. */
  framePaint: { color: '#82a034', metalness: 0.55, roughness: 0.34 },
  frameAccent: { color: '#c3dd7c', metalness: 0.4, roughness: 0.3 },
  carbon: { color: '#14160f', metalness: 0.35, roughness: 0.42 },
  alloy: { color: '#3c424a', metalness: 0.85, roughness: 0.28 },
  darkMetal: { color: '#1c2024', metalness: 0.7, roughness: 0.42 },
  steel: { color: '#8d949c', metalness: 0.9, roughness: 0.32 },
  rubber: { color: '#0c0d0b', metalness: 0, roughness: 0.92 },
  tanWall: { color: '#c9a468', metalness: 0.05, roughness: 0.78 },
  barTape: { color: '#15170f', metalness: 0.1, roughness: 0.78 },
} as const;

export type MaterialName = keyof typeof bikeMaterials;

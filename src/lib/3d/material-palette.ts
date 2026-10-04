/**
 * Material palette for the procedural bike.
 *
 * Kept as data, in the logic layer, so the variant resolvers can name a finish
 * without importing React or Three.js, and a future GLB pipeline can reuse the
 * same colours.
 */

export const materialPalette = {
  /** Frame paint: premium deep green with a glossy metallic finish. */
  framePaint: {
    color: '#5c8b2f',
    metalness: 0.72,
    roughness: 0.18,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
  },
  frameRed: {
    color: '#c91f37',
    metalness: 0.65,
    roughness: 0.22,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
  },
  frameBlue: {
    color: '#1a4c8a',
    metalness: 0.75,
    roughness: 0.18,
    clearcoat: 0.92,
    clearcoatRoughness: 0.1,
  },
  frameWhite: {
    color: '#e8edf0',
    metalness: 0.35,
    roughness: 0.25,
    clearcoat: 0.95,
    clearcoatRoughness: 0.08,
  },
  frameBlack: {
    color: '#181b1c',
    metalness: 0.5,
    roughness: 0.45,
    clearcoat: 0.3,
    clearcoatRoughness: 0.35,
  },
  frameOrange: {
    color: '#e65c00',
    metalness: 0.6,
    roughness: 0.2,
    clearcoat: 0.88,
    clearcoatRoughness: 0.14,
  },
  frameBronze: {
    color: '#9e7b56',
    metalness: 0.7,
    roughness: 0.32,
    clearcoat: 0.6,
    clearcoatRoughness: 0.22,
  },
  frameAccent: {
    color: '#cfe98c',
    metalness: 0.5,
    roughness: 0.2,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
  },
  /** Bare titanium: warm grey, lightly brushed with a satin finish. */
  rawTitanium: {
    color: '#8b8e8b',
    metalness: 0.85,
    roughness: 0.4,
    clearcoat: 0.45,
    clearcoatRoughness: 0.28,
  },
  /** Bare aluminium: bright, machined. */
  rawAlloy: {
    color: '#bcc4c9',
    metalness: 0.95,
    roughness: 0.15,
    clearcoat: 0.48,
    clearcoatRoughness: 0.14,
  },
  carbon: {
    color: '#0f1713',
    metalness: 0.48,
    roughness: 0.28,
    clearcoat: 0.26,
    clearcoatRoughness: 0.2,
  },
  alloy: {
    color: '#39454d',
    metalness: 0.92,
    roughness: 0.2,
    clearcoat: 0.55,
    clearcoatRoughness: 0.18,
  },
  darkMetal: {
    color: '#171d20',
    metalness: 0.82,
    roughness: 0.25,
    clearcoat: 0.38,
    clearcoatRoughness: 0.2,
  },
  steel: {
    color: '#7d8790',
    metalness: 0.96,
    roughness: 0.2,
    clearcoat: 0.4,
    clearcoatRoughness: 0.18,
  },
  rubber: {
    color: '#08090d',
    metalness: 0.08,
    roughness: 0.88,
    clearcoat: 0.1,
    clearcoatRoughness: 0.7,
  },
  /** Tan sidewall of a cotton-cased tyre. */
  tanWall: {
    color: '#d1a76c',
    metalness: 0.12,
    roughness: 0.7,
    clearcoat: 0.25,
    clearcoatRoughness: 0.58,
  },
  barTape: {
    color: '#161b17',
    metalness: 0.16,
    roughness: 0.68,
    clearcoat: 0.18,
    clearcoatRoughness: 0.7,
  },
} as const;

export type MaterialName = keyof typeof materialPalette;

export const materialNames = Object.keys(materialPalette) as readonly MaterialName[];

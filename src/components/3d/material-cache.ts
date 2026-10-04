import { MeshBasicMaterial, MeshPhysicalMaterial } from 'three';

import { materialPalette, type MaterialName } from '@/lib/3d/material-palette';

/**
 * Shared material cache.
 *
 * The palette is data, so two meshes that name the same finish must share one
 * material instance: fewer programs to compile and fewer state changes per
 * frame. Parts that genuinely need their own settings (transparency, a texture
 * map) create a material locally and say why.
 */

const standard = new Map<MaterialName, MeshPhysicalMaterial>();
const basic = new Map<MaterialName, MeshBasicMaterial>();

export function standardMaterial(name: MaterialName): MeshPhysicalMaterial {
  const existing = standard.get(name);

  if (existing !== undefined) return existing;

  const preset = materialPalette[name];
  const material = new MeshPhysicalMaterial({
    color: preset.color,
    metalness: preset.metalness,
    roughness: preset.roughness,
    envMapIntensity: 1.6,
    clearcoat: preset.clearcoat ?? 0,
    clearcoatRoughness: preset.clearcoatRoughness ?? 0.2,
  });

  standard.set(name, material);

  return material;
}

export function basicMaterial(name: MaterialName): MeshBasicMaterial {
  const existing = basic.get(name);

  if (existing !== undefined) return existing;

  const preset = materialPalette[name];
  const material = new MeshBasicMaterial({ color: preset.color });

  basic.set(name, material);

  return material;
}

/** Number of material instances currently shared, exposed for tests. */
export function materialCacheSize(): number {
  return standard.size + basic.size;
}

/** Drops every cached material. Only safe when no scene is mounted. */
export function clearMaterialCache(): void {
  for (const material of standard.values()) material.dispose();
  for (const material of basic.values()) material.dispose();
  standard.clear();
  basic.clear();
}

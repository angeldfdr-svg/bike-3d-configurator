import type { ReactNode } from 'react';

import { Frame } from '@/components/3d/parts/frame';
import { Groupset } from '@/components/3d/parts/groupset';
import { Crankset } from '@/components/3d/parts/crankset';
import { Handlebar } from '@/components/3d/parts/handlebar';
import { Saddle } from '@/components/3d/parts/saddle';
import { Accessories } from '@/components/3d/parts/accessories';
import { Wheels } from '@/components/3d/parts/wheels';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';
import type { Accessory } from '@/types/components';
import type {
  CrankVariant,
  FrameVariant,
  GroupsetVariant,
  HandlebarVariant,
  SaddleVariant,
  TireVariant,
  WheelVariant,
} from '@/lib/3d/part-variants';

/**
 * Part registry.
 *
 * One place that maps a catalog category to the component that draws it, so
 * adding a category, or later swapping a procedural part for a GLB model,
 * touches a single file instead of the whole scene.
 */

export type PartRenderers = {
  readonly quadro: (props: {
    geometry: BikeGeometry;
    variant: FrameVariant;
  }) => ReactNode;
  readonly rodas: (props: {
    geometry: BikeGeometry;
    wheel: WheelVariant;
    tire: TireVariant;
  }) => ReactNode;
  readonly grupo: (props: {
    geometry: BikeGeometry;
    variant: GroupsetVariant;
  }) => ReactNode;
  readonly pedaleiro: (props: {
    geometry: BikeGeometry;
    variant: CrankVariant;
  }) => ReactNode;
  readonly guiador: (props: {
    geometry: BikeGeometry;
    variant: HandlebarVariant;
  }) => ReactNode;
  readonly selim: (props: {
    geometry: BikeGeometry;
    variant: SaddleVariant;
  }) => ReactNode;
  readonly extras: (props: {
    geometry: BikeGeometry;
    accessories: readonly Accessory[];
  }) => ReactNode;
};

export const partRegistry: PartRenderers = {
  quadro: Frame,
  rodas: Wheels,
  grupo: Groupset,
  pedaleiro: Crankset,
  guiador: Handlebar,
  selim: Saddle,
  extras: Accessories,
};

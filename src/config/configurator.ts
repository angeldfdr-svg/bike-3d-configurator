import {
  Bike,
  CircleDot,
  Cog,
  Disc3,
  Gauge,
  Layers,
  Ruler,
  type LucideIcon,
} from 'lucide-react';

import type { CameraView } from '@/types/configuration';

/**
 * Structural outline of the configurator.
 *
 * This is intentionally NOT a product catalog: it describes the shape of the
 * experience and the attributes each category will expose once the catalog
 * lands in Phase 2. No prices, weights or products are invented here.
 */
export type ConfiguratorCategory = {
  id: string;
  label: string;
  icon: LucideIcon;
  summary: string;
  attributes: readonly string[];
  deliveredInPhase: number;
};

export const configuratorCategories: readonly ConfiguratorCategory[] = [
  {
    id: 'quadro',
    label: 'Quadro',
    icon: Bike,
    summary: 'Material, geometria e tamanho. Define a base de tudo o resto.',
    attributes: ['Nome', 'Material', 'Tamanhos disponíveis', 'Peso', 'Preço', 'Descrição'],
    deliveredInPhase: 2,
  },
  {
    id: 'rodas',
    label: 'Rodas',
    icon: CircleDot,
    summary: 'Perfil, material e compatibilidade com o grupo escolhido.',
    attributes: ['Modelo', 'Material', 'Perfil', 'Peso', 'Preço'],
    deliveredInPhase: 2,
  },
  {
    id: 'grupo',
    label: 'Grupo',
    icon: Cog,
    summary: 'Transmissão, travagem e número de velocidades.',
    attributes: ['Fabricante', 'Modelo', 'Número de velocidades', 'Peso', 'Preço'],
    deliveredInPhase: 2,
  },
  {
    id: 'pedaleiro',
    label: 'Pedaleiro',
    icon: Cog,
    summary: 'Comprimento, pratos e relação de desenvolvemento.',
    attributes: ['Comprimento', 'Número de pratos', 'Relação', 'Peso', 'Preço'],
    deliveredInPhase: 2,
  },
  {
    id: 'guiador',
    label: 'Guiador',
    icon: Ruler,
    summary: 'Tipo, largura e material do conjunto de direção.',
    attributes: ['Tipo', 'Largura', 'Material', 'Peso', 'Preço'],
    deliveredInPhase: 2,
  },
  {
    id: 'selim',
    label: 'Selim',
    icon: Layers,
    summary: 'Modelo e peso do ponto de contacto.',
    attributes: ['Modelo', 'Peso', 'Preço'],
    deliveredInPhase: 2,
  },
  {
    id: 'pneus',
    label: 'Pneus',
    icon: Disc3,
    summary: 'Largura, tipo e limite máximo admitido pelo quadro.',
    attributes: ['Largura', 'Tipo', 'Peso', 'Preço'],
    deliveredInPhase: 2,
  },
  {
    id: 'extras',
    label: 'Extras',
    icon: Gauge,
    summary: 'Acessórios e opções de personalização do conjunto final.',
    attributes: ['Catálogo a definir com o parceiro de produto'],
    deliveredInPhase: 2,
  },
] as const;

/** Preset camera views of the 3D stage. */
export const cameraViews: readonly { id: CameraView; label: string }[] = [
  { id: 'frontal', label: 'Frontal' },
  { id: 'lateral', label: 'Lateral' },
  { id: 'traseira', label: 'Traseira' },
  { id: 'superior', label: 'Superior' },
] as const;

/**
 * Compatibility rules the engine will enforce (Phase 7).
 * Documented up front so the data model can carry the required attributes.
 */
export const plannedCompatibilityRules = [
  'Quadro compatível com determinados grupos',
  'Rodas compatíveis com a cassete do grupo',
  'Largura máxima de pneus suportada pelo quadro',
  'Movimento pedaleiro compatível com o quadro',
  'Guiador compatível com a potência',
  'Diâmetro do espigão do selim',
  'Número de velocidades da transmissão',
  'Tipo de eixo e sistema de travagem',
] as const;

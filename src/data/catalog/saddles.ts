import type { Saddle } from '@/types/components';

/** Demonstrative catalog — see the note in `frames.ts`. */
export const rawSaddles = [
  {
    id: 'saddle-veloce-race-143',
    name: 'Race 143',
    brand: 'VELOCE',
    category: 'selim',
    model: 'VLC-SD143',
    price: 15900,
    weight: 145,
    description:
      'Selim curto de competição com calhas em carbono e canal central alargado. Indicado para posição agressiva.',
    specifications: [
      { label: 'Modelo', value: 'VELOCE Race 143' },
      { label: 'Calhas', value: 'Carbono' },
      { label: 'Largura', value: '143 mm' },
      { label: 'Espigão do selim', value: '27,2 mm' },
      { label: 'Peso', value: '145 g' },
    ],
    railMaterial: 'carbono',
    width: 143,
    seatpostDiameter: 27.2,
  },
  {
    id: 'saddle-meridian-endurance-148',
    name: 'Endurance 148',
    brand: 'Meridian',
    category: 'selim',
    model: 'MER-SD148',
    price: 7900,
    weight: 230,
    description:
      'Selim com base mais larga e espuma de densidade média para conforto em distância longa.',
    specifications: [
      { label: 'Modelo', value: 'Meridian Endurance 148' },
      { label: 'Calhas', value: 'Aço' },
      { label: 'Largura', value: '148 mm' },
      { label: 'Espigão do selim', value: '27,2 mm' },
      { label: 'Peso', value: '230 g' },
    ],
    railMaterial: 'aco',
    width: 148,
    seatpostDiameter: 27.2,
  },
  {
    id: 'saddle-northwind-gravel-145',
    name: 'Gravel 145',
    brand: 'Northwind',
    category: 'selim',
    model: 'NRW-SD145',
    price: 8900,
    weight: 245,
    description:
      'Selim com nariz reforçado e capa antiderrapante para uso fora de estrada, com movimentos frequentes sobre o selim.',
    specifications: [
      { label: 'Modelo', value: 'Northwind Gravel 145' },
      { label: 'Calhas', value: 'Aço' },
      { label: 'Largura', value: '145 mm' },
      { label: 'Espigão do selim', value: '31,6 mm' },
      { label: 'Peso', value: '245 g' },
    ],
    railMaterial: 'aco',
    width: 145,
    seatpostDiameter: 31.6,
  },
] as const satisfies readonly Saddle[];

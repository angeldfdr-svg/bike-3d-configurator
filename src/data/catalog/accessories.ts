import type { Accessory } from '@/types/components';

/** Demonstrative catalog — see the note in `frames.ts`. */
export const rawAccessories = [
  {
    id: 'accessory-cinder-cycle-computer',
    name: 'Cycle Computer',
    brand: 'Cinder',
    category: 'extras',
    model: 'CND-CC01',
    price: 24900,
    weight: 85,
    description:
      'Computador de ciclismo com GPS, medição de potência opcional e autonomia de 20 horas.',
    specifications: [
      { label: 'Local de montagem', value: 'Guiador' },
      { label: 'Conectividade', value: 'GPS · Bluetooth · ANT+' },
      { label: 'Autonomia', value: '20 h' },
      { label: 'Peso', value: '85 g' },
    ],
    slot: 'computador',
    quantity: 1,
  },
  {
    id: 'accessory-cinder-light-set',
    name: 'Light Set',
    brand: 'Cinder',
    category: 'extras',
    model: 'CND-LS02',
    price: 5900,
    weight: 190,
    description:
      'Conjunto de luzes dianteira e traseira com bateria integrada e carregamento USB-C.',
    specifications: [
      { label: 'Local de montagem', value: 'Guiador e espigão' },
      { label: 'Fluxo', value: '400 lm / 40 lm' },
      { label: 'Autonomia', value: '6 h' },
      { label: 'Peso do conjunto', value: '190 g' },
    ],
    slot: 'iluminacao',
    quantity: 1,
  },
  {
    id: 'accessory-veloce-bottle-cage',
    name: 'Bottle Cage',
    brand: 'VELOCE',
    category: 'extras',
    model: 'VLC-BC01',
    price: 2900,
    weight: 60,
    description:
      'Suporte de bidão em carbono com fixação universal para quadros com dois ou três pontos de montagem.',
    specifications: [
      { label: 'Local de montagem', value: 'Triângulo frontal' },
      { label: 'Material', value: 'Carbono' },
      { label: 'Quantidade', value: '2' },
      { label: 'Peso unitário', value: '30 g' },
    ],
    slot: 'bidao',
    quantity: 2,
  },
  {
    id: 'accessory-northwind-saddle-bag',
    name: 'Saddle Bag',
    brand: 'Northwind',
    category: 'extras',
    model: 'NRW-SB03',
    price: 3900,
    weight: 120,
    description:
      'Bolsa de selim impermeável com fixação por velcro, capacidade para câmara de ar e ferramentas essenciais.',
    specifications: [
      { label: 'Local de montagem', value: 'Selim' },
      { label: 'Capacidade', value: '1,2 L' },
      { label: 'Material', value: 'Nylon balístico' },
      { label: 'Peso', value: '120 g' },
    ],
    slot: 'bolsa',
    quantity: 1,
  },
] as const satisfies readonly Accessory[];

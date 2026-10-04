import type { Saddle } from '@/types/components';

/** Mixed demonstration and market-reference data; verify values before commercial use. */
export const rawSaddles = [
  // -----------------------------------------------------------------------
  // Produtos ilustrativos originais (mantidos para compatibilidade com testes)
  // -----------------------------------------------------------------------
  {
    id: 'saddle-veloce-race-143',
    name: 'Race 143',
    brand: 'Veloce',
    category: 'selim',
    model: 'VLC-SD143',
    price: 15900,
    weight: 145,
    description:
      'Selim curto de competição com calhas em carbono e canal central alargado. Indicado para posição agressiva.',
    specifications: [
      { label: 'Modelo', value: 'Veloce Race 143' },
      { label: 'Calhas', value: 'Carbono' },
      { label: 'Largura', value: '143 mm' },
      { label: 'Peso', value: '145 g' },
    ],
    railMaterial: 'carbono',
    width: 143,
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
      { label: 'Peso', value: '230 g' },
    ],
    railMaterial: 'aco',
    width: 148,
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
      { label: 'Peso', value: '245 g' },
    ],
    railMaterial: 'aco',
    width: 145,
  },
  // -----------------------------------------------------------------------
  // Fizik
  // -----------------------------------------------------------------------
  {
    id: 'saddle-fizik-argo-vento-r1-135',
    name: 'Argo Vento R1 135',
    brand: 'Fizik',
    category: 'selim',
    model: 'FIZ-ARGO-VENTO-R1-135',
    price: 34900,
    weight: 134,
    description:
      'O selim curto de corrida mais leve da Fizik: nariz flat para posições aerodimâmicas, calhas em carbono K:ium e superfície em microfibra. Escolhido por escaladores de elite.',
    specifications: [
      { label: 'Modelo', value: 'Fizik Argo Vento R1' },
      { label: 'Calhas', value: 'Carbono K:ium' },
      { label: 'Largura', value: '135 mm' },
      { label: 'Perfil', value: 'Flat (nariz curto)' },
      { label: 'Capa', value: 'Microfibra' },
      { label: 'Peso', value: '134 g' },
    ],
    railMaterial: 'carbono',
    width: 135,
  },
  {
    id: 'saddle-fizik-argo-vento-r1-143',
    name: 'Argo Vento R1 143',
    brand: 'Fizik',
    category: 'selim',
    model: 'FIZ-ARGO-VENTO-R1-143',
    price: 34900,
    weight: 138,
    description:
      'Versão de 143 mm do Argo Vento R1 para maior suporte das estruturas ósseas sem sacrificar o desempenho de corrida. Calhas em carbono K:ium.',
    specifications: [
      { label: 'Modelo', value: 'Fizik Argo Vento R1' },
      { label: 'Calhas', value: 'Carbono K:ium' },
      { label: 'Largura', value: '143 mm' },
      { label: 'Perfil', value: 'Flat (nariz curto)' },
      { label: 'Capa', value: 'Microfibra' },
      { label: 'Peso', value: '138 g' },
    ],
    railMaterial: 'carbono',
    width: 143,
  },
  {
    id: 'saddle-fizik-antares-r1-regular-143',
    name: 'Antares R1 Regular 143',
    brand: 'Fizik',
    category: 'selim',
    model: 'FIZ-ANT-R1-REG-143',
    price: 28900,
    weight: 148,
    description:
      'O clássico selim de corrida da Fizik com curvatura regular e nariz comprido para ciclistas que pedalam com rotação de ancas. Calhas K:ium de titânio, o equilíbrio perfeito entre peso e conforto.',
    specifications: [
      { label: 'Modelo', value: 'Fizik Antares R1 Regular' },
      { label: 'Calhas', value: 'K:ium (titânio)' },
      { label: 'Largura', value: '143 mm' },
      { label: 'Curvatura', value: 'Regular' },
      { label: 'Capa', value: 'Microfibra' },
      { label: 'Peso', value: '148 g' },
    ],
    railMaterial: 'carbono',
    width: 143,
  },
  // -----------------------------------------------------------------------
  // Aster
  // -----------------------------------------------------------------------
  {
    id: 'saddle-selle-italia-slr-boost-145',
    name: 'SLR Boost Kit Carbonio 145',
    brand: 'Aster',
    category: 'selim',
    model: 'SI-SLR-BOOST-C-145',
    price: 31900,
    weight: 143,
    description:
      'Selim de competição da Aster com canal de alívio central longo, calhas em carbono e espuma de alta densidade Idmatch. Ergonomia italiana para distância longa e curta.',
    specifications: [
      { label: 'Modelo', value: 'Aster SLR Boost' },
      { label: 'Calhas', value: 'Carbono' },
      { label: 'Largura', value: '145 mm' },
      { label: 'Canal', value: 'Central alargado' },
      { label: 'Peso', value: '143 g' },
    ],
    railMaterial: 'carbono',
    width: 145,
  },
  // -----------------------------------------------------------------------
  // Aurelian
  // -----------------------------------------------------------------------
  {
    id: 'saddle-aurelian-power-expert-143',
    name: 'Power Expert 143',
    brand: 'Aurelian',
    category: 'selim',
    model: 'SPZ-POWER-EXP-143',
    price: 19900,
    weight: 205,
    description:
      'O selim de nariz curto que popularizou o formato short-nose. Canal MIMIC de alta resolução para alívio de pressão, calhas em cromo-molibdénio. Excelente para posições agressivas.',
    specifications: [
      { label: 'Modelo', value: 'Aurelian Power Expert' },
      { label: 'Calhas', value: 'Cromo-molibdénio' },
      { label: 'Largura', value: '143 mm' },
      { label: 'Canal', value: 'MIMIC' },
      { label: 'Peso', value: '205 g' },
    ],
    railMaterial: 'aco',
    width: 143,
  },
  {
    id: 'saddle-aurelian-power-arc-expert-155',
    name: 'Power Arc Expert 155',
    brand: 'Aurelian',
    category: 'selim',
    model: 'SPZ-POWER-ARC-EXP-155',
    price: 19900,
    weight: 215,
    description:
      'Versão mais larga com formato Power Arc: o arco de 155 mm confere maior suporte e a geometria adaptativa muda de formato conforme a posição de pedalagem.',
    specifications: [
      { label: 'Modelo', value: 'Aurelian Power Arc Expert' },
      { label: 'Calhas', value: 'Cromo-molibdénio' },
      { label: 'Largura', value: '155 mm' },
      { label: 'Canal', value: 'MIMIC Arc' },
      { label: 'Peso', value: '215 g' },
    ],
    railMaterial: 'aco',
    width: 155,
  },
  // -----------------------------------------------------------------------
  // Brooks
  // -----------------------------------------------------------------------
  {
    id: 'saddle-brooks-cambium-c13-145',
    name: 'Cambium C13 145',
    brand: 'Brooks',
    category: 'selim',
    model: 'BRK-C13-145',
    price: 14900,
    weight: 280,
    description:
      'Selim leve e moderno da Brooks em borracha natural vulcanizada, sem almofada e sem break-in. A versão C13 é em carbono natural — conforto natural Brooks para ciclistas modernos.',
    specifications: [
      { label: 'Modelo', value: 'Brooks Cambium C13' },
      { label: 'Calhas', value: 'Aço' },
      { label: 'Largura', value: '145 mm' },
      { label: 'Material', value: 'Borracha natural vulcanizada' },
      { label: 'Peso', value: '280 g' },
    ],
    railMaterial: 'aco',
    width: 145,
  },
  // -----------------------------------------------------------------------
  // Ergon
  // -----------------------------------------------------------------------
  {
    id: 'saddle-ergon-sr-allroad-core-pro-145',
    name: 'SR Allroad Core Pro 145',
    brand: 'Ergon',
    category: 'selim',
    model: 'ERG-SRACP-145',
    price: 21900,
    weight: 238,
    description:
      'Selim gravel/endurance da Ergon com geometria SR adaptada para ciclistas em posição mais vertical. Canal de alívio largo e calhas de carbono. Ideal para dias longos no gravel.',
    specifications: [
      { label: 'Modelo', value: 'Ergon SR Allroad Core Pro' },
      { label: 'Calhas', value: 'Carbono' },
      { label: 'Largura', value: '145 mm' },
      { label: 'Uso', value: 'Gravel / Endurance' },
      { label: 'Peso', value: '238 g' },
    ],
    railMaterial: 'carbono',
    width: 145,
  },
] as const satisfies readonly Saddle[];

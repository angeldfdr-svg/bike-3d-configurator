/**
 * Global product and marketing copy.
 * Kept as data so pages, metadata and navigation stay in sync.
 */

export const site = {
  brand: 'VELOCE',
  productName: 'Bike Configurator 3D',
  locale: 'pt-PT',
  heroTitle: 'BUILD YOUR BIKE',
  heroSubtitle:
    'Cria a tua bicicleta. Escolhe cada componente. Constrói algo único.',
  heroCta: 'Começar a configurar',
  heroSecondaryCta: 'Ver categorias',
} as const;

export const navigation = [
  { label: 'Categorias', href: '/#categorias' },
  { label: 'Processo', href: '/#processo' },
  { label: 'Compatibilidade', href: '/#compatibilidade' },
  { label: 'Configurador', href: '/configurator' },
] as const;

export const heroFacts = [
  { value: '8', label: 'categorias de componentes' },
  { value: '3D', label: 'atualização visual em tempo real' },
  { value: 'Regras', label: 'de compatibilidade explícitas' },
] as const;

export const processSteps = [
  {
    step: '01',
    title: 'Escolhe o quadro',
    description:
      'Material, geometria e tamanho definem a base da bicicleta e condicionam os restantes componentes.',
  },
  {
    step: '02',
    title: 'Seleciona cada componente',
    description:
      'Rodas, grupo, pedaleiro, guiador, selim e pneus. A vista 3D acompanha cada escolha.',
  },
  {
    step: '03',
    title: 'Valida e conclui',
    description:
      'Preço, peso, especificações e compatibilidade são recalculados antes de qualquer decisão.',
  },
] as const;

export const footerLinks = [
  { label: 'Configurador', href: '/configurator' },
  { label: 'Categorias', href: '/#categorias' },
  { label: 'Processo', href: '/#processo' },
] as const;

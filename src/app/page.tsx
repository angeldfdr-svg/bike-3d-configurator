import type { Metadata } from 'next';

import { CategoryGrid } from '@/components/home/category-grid';
import { ClosingCta } from '@/components/home/closing-cta';
import { CompatibilitySection } from '@/components/home/compatibility-section';
import { Hero } from '@/components/home/hero';
import { ProcessSection } from '@/components/home/process-section';

export const metadata: Metadata = {
  title: 'BUILD YOUR BIKE',
  description:
    'Cria a tua bicicleta. Escolhe cada componente. Constrói algo único. Configurador 3D com preço, peso e compatibilidade em tempo real.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <ProcessSection />
      <CompatibilitySection />
      <ClosingCta />
    </>
  );
}

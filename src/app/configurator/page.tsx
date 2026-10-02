import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { ConfiguratorView } from '@/components/configurator/configurator-view';
import { Badge } from '@/components/ui/badge';
import { site } from '@/config/site';

export const metadata: Metadata = {
  title: 'Configurador',
  description:
    'Constrói a tua bicicleta componente a componente: quadro, rodas, grupo, pedaleiro, guiador, selim e pneus, com preço, peso e compatibilidade em tempo real.',
  alternates: { canonical: '/configurator' },
};

export default function ConfiguratorPage() {
  return (
    <>
      <div className="border-b border-line bg-ink-900/40">
        <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex size-9 items-center justify-center rounded-md border border-line text-fog-300 transition-colors duration-200 hover:border-line-strong hover:text-fog-50"
              aria-label="Voltar à página inicial"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>
            <div>
              <h1 className="text-base font-bold tracking-[-0.01em] text-fog-50">
                {site.productName}
              </h1>
              <p className="mt-0.5 text-xs text-fog-500">
                Estrutura do configurador. Catálogo, 3D, preço, peso e compatibilidade nas
                fases seguintes.
              </p>
            </div>
          </div>

          <Badge variant="neutral" className="num shrink-0 self-start lg:self-auto">
            Fase 7 de 11
          </Badge>
        </div>
      </div>

      <ConfiguratorView />
    </>
  );
}

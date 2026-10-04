import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { ConfiguratorView } from '@/components/configurator/configurator-view';
import { Breadcrumb } from '@/components/ui/breadcrumb';
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
        <div className="mx-auto flex w-full max-w-[100rem] flex-col gap-3 px-5 py-5 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[{ label: 'Configurador', href: '/configurator' }]}
          />

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-line text-fog-300 transition-colors duration-200 hover:border-line-strong hover:text-fog-50"
                aria-label="Voltar à página inicial"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
              <div>
                <h1 className="text-base font-bold tracking-[-0.01em] text-fog-50">
                  {site.productName}
                </h1>
                <p className="mt-0.5 text-xs text-fog-500">
                  Constrói a tua bicicleta de raiz — componente a componente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfiguratorView />
    </>
  );
}

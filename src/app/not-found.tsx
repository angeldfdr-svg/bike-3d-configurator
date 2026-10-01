import type { Metadata } from 'next';
import Link from 'next/link';

import { LinkButton } from '@/components/ui/link-button';

export const metadata: Metadata = {
  title: 'Página não encontrada',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col items-start px-5 py-24 sm:px-8 lg:py-32">
      <p className="num label-eyebrow">Erro 404</p>
      <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
        Esta página saiu do pelotão.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-fog-400">
        O endereço indicado não existe. Volta ao início ou entra diretamente no
        configurador.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton href="/">Voltar ao início</LinkButton>
        <Link
          href="/configurator"
          className="inline-flex h-11 items-center rounded-md border border-line-strong px-5 text-sm font-semibold text-fog-100 transition-colors duration-200 hover:border-fog-500"
        >
          Ir para o configurador
        </Link>
      </div>
    </section>
  );
}

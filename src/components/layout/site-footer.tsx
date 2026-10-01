import Link from 'next/link';

import { BrandMark } from '@/components/layout/brand-mark';
import { footerLinks, site } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink-950">
      <div className="mx-auto w-full max-w-[100rem] px-5 py-12 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm space-y-4">
            <div className="flex items-center gap-2.5 text-fog-50">
              <BrandMark className="size-5 text-lime-400" />
              <span className="text-[0.9375rem] font-extrabold tracking-[0.34em]">
                {site.brand}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-fog-400">
              {site.productName} — construção de bicicletas componente a componente, com vista
              3D, preço e peso atualizados em tempo real.
            </p>
          </div>

          <nav aria-label="Navegação de rodapé">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rounded-sm text-[0.8125rem] font-medium text-fog-300 transition-colors duration-200 hover:text-fog-50"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-xs text-fog-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Projeto de demonstração. Marca fictícia, componentes ilustrativos e sem preços ou
            pesos reais.
          </p>
          <p className="num">Fase 1 de 11 · arquitetura e interface inicial</p>
        </div>
      </div>
    </footer>
  );
}

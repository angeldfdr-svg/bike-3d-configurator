'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

import { BrandMark } from '@/components/layout/brand-mark';
import { LinkButton } from '@/components/ui/link-button';
import { navigation, site } from '@/config/site';

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-ink-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[100rem] items-center justify-between gap-6 px-5 sm:px-8 lg:h-18 lg:px-12">
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-sm text-fog-50"
          aria-label={`${site.brand} — página inicial`}
        >
          <BrandMark className="size-5 text-lime-400 transition-transform duration-300 group-hover:rotate-90" />
          <span className="text-[0.9375rem] font-extrabold tracking-[0.34em]">
            {site.brand}
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm text-[0.8125rem] font-medium text-fog-300 transition-colors duration-200 hover:text-fog-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LinkButton href="/configurator" size="sm" className="hidden sm:inline-flex">
            {site.heroCta}
          </LinkButton>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-md border border-line text-fog-200 transition-colors duration-200 hover:border-line-strong hover:text-fog-50 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Navegação principal (mobile)"
        hidden={!menuOpen}
        className="border-t border-line bg-ink-950/95 px-5 py-4 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {navigation.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-sm px-2 py-2.5 text-sm font-medium text-fog-200 transition-colors duration-200 hover:bg-ink-850 hover:text-fog-50"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

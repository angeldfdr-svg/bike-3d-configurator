import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { site } from '@/config/site';
import { siteUrl } from '@/lib/site-url';

import './globals.css';

/**
 * Self-hosted display face. Bundled locally so builds never depend on a
 * third-party font CDN at build or run time.
 */
const manrope = localFont({
  variable: '--font-manrope',
  display: 'swap',
  preload: true,
  fallback: ['ui-sans-serif', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
  src: [
    { path: '../assets/fonts/manrope/Manrope-400.ttf', weight: '400', style: 'normal' },
    { path: '../assets/fonts/manrope/Manrope-500.ttf', weight: '500', style: 'normal' },
    { path: '../assets/fonts/manrope/Manrope-600.ttf', weight: '600', style: 'normal' },
    { path: '../assets/fonts/manrope/Manrope-700.ttf', weight: '700', style: 'normal' },
    { path: '../assets/fonts/manrope/Manrope-800.ttf', weight: '800', style: 'normal' },
  ],
});

const description =
  'Configurador de bicicletas em 3D. Escolhe quadro, rodas, grupo, pedaleiro, guiador, selim e pneus, e vê o preço, o peso e a compatibilidade atualizados em tempo real.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.brand} · ${site.productName}`,
    template: `%s · ${site.brand}`,
  },
  description,
  applicationName: site.productName,
  authors: [{ name: site.brand, url: siteUrl }],
  creator: site.brand,
  publisher: site.brand,
  keywords: [
    'configurador de bicicletas',
    'bicicleta 3D',
    'bike configurator',
    'componentes de bicicleta',
    'quadro carbono',
    'rodas carbono',
    'grupo Northwind',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.productName,
    title: `${site.brand} · ${site.productName}`,
    description,
    url: siteUrl,
    images: [
      {
        url: '/images/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Bicicleta de estrada em estúdio sobre fundo escuro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.brand} · ${site.productName}`,
    description,
    images: ['/images/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
  themeColor: '#07080a',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={site.locale} className={manrope.variable}>
      <body className="flex min-h-dvh flex-col bg-ink-950">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-lime-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
        >
          Saltar para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { LinkButton } from '@/components/ui/link-button';
import { heroFacts, site } from '@/config/site';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden lg:min-h-[calc(100svh-4.5rem)]"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/bike-hero.webp"
          alt="Bicicleta de estrada em carbono, fotografia de estúdio sobre fundo escuro"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] lg:object-right"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-ink-950/70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/55 to-transparent"
        />
      </div>

      <div className="mx-auto w-full max-w-[100rem] px-5 pt-20 pb-14 sm:px-8 lg:px-12 lg:pb-20">
        <p className="label-eyebrow animate-rise">Configurador de bicicletas</p>

        <h1
          id="hero-title"
          className="mt-5 text-[clamp(2.75rem,9vw,6.75rem)] leading-[0.9] font-extrabold tracking-[-0.035em] animate-rise"
          style={{ animationDelay: '90ms' }}
        >
          BUILD
          <br />
          YOUR BIKE
        </h1>

        <p
          className="mt-7 max-w-md text-base leading-relaxed text-fog-300 sm:text-lg animate-rise"
          style={{ animationDelay: '170ms' }}
        >
          {site.heroSubtitle}
        </p>

        <div
          className="mt-9 flex flex-wrap items-center gap-3 animate-rise"
          style={{ animationDelay: '250ms' }}
        >
          <LinkButton href="/configurator" size="lg">
            {site.heroCta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
          <LinkButton href="#categorias" variant="secondary" size="lg">
            {site.heroSecondaryCta}
          </LinkButton>
        </div>

        <dl
          className="mt-14 grid max-w-2xl grid-cols-1 gap-6 border-t border-line/80 pt-8 sm:grid-cols-3 sm:gap-8 animate-rise"
          style={{ animationDelay: '330ms' }}
        >
          {heroFacts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-1 pr-6">
              <dt className="label-eyebrow">{fact.label}</dt>
              <dd className="num text-2xl font-bold tracking-[-0.02em] text-fog-50">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

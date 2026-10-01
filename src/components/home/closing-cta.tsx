import { ArrowRight } from 'lucide-react';

import { LinkButton } from '@/components/ui/link-button';
import { site } from '@/config/site';

export function ClosingCta() {
  return (
    <section
      aria-labelledby="cta-title"
      className="border-t border-line bg-ink-900/40"
    >
      <div className="mx-auto flex w-full max-w-[100rem] flex-col items-start gap-8 px-5 py-20 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-24">
        <div>
          <h2
            id="cta-title"
            className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] font-extrabold tracking-[-0.03em]"
          >
            Constrói algo único.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-fog-400">
            Entra no configurador e começa pelo quadro. O resto é escolha tua.
          </p>
        </div>

        <LinkButton href="/configurator" size="lg" className="shrink-0">
          {site.heroCta}
          <ArrowRight className="size-4" aria-hidden="true" />
        </LinkButton>
      </div>
    </section>
  );
}

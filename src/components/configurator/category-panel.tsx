'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { configuratorCategories } from '@/config/configurator';
import { cn } from '@/lib/utils';

/**
 * Category navigation for the configurator.
 *
 * Phase 1 exposes the structure and the attributes each category will show.
 * Product lists, prices and weights arrive with the catalog in Phase 2.
 */
export function CategoryPanel() {
  const [openId, setOpenId] = useState<string | null>(configuratorCategories[0]?.id ?? null);

  return (
    <section
      aria-labelledby="categories-title"
      className="overflow-hidden rounded-lg border border-line bg-ink-900/50"
    >
      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <h2
          id="categories-title"
          className="text-[0.8125rem] font-bold tracking-[0.18em] text-fog-100 uppercase"
        >
          Componentes
        </h2>
        <Badge variant="muted">Fase 2</Badge>
      </header>

      <ul className="divide-y divide-line">
        {configuratorCategories.map((category) => {
          const Icon = category.icon;
          const expanded = openId === category.id;
          const panelId = `categoria-${category.id}`;

          return (
            <li key={category.id}>
              <h3>
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpenId(expanded ? null : category.id)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-ink-850/60"
                >
                  <Icon className="size-4 shrink-0 text-lime-400" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-fog-50">
                      {category.label}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-fog-500">
                      {category.summary}
                    </span>
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'size-4 shrink-0 text-fog-500 transition-transform duration-300',
                      expanded && 'rotate-180 text-lime-400',
                    )}
                  />
                </button>
              </h3>

              <div id={panelId} hidden={!expanded} className="px-5 pb-5 pl-13">
                <p className="text-xs leading-relaxed text-fog-400">
                  Atributos apresentados em cada produto:
                </p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {category.attributes.map((attribute) => (
                    <li
                      key={attribute}
                      className="rounded-xs border border-line bg-ink-850/70 px-2 py-1 text-[0.6875rem] text-fog-300"
                    >
                      {attribute}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

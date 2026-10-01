'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { FrameSizePicker, ProductList } from '@/components/configurator/product-picker';
import { Badge } from '@/components/ui/badge';
import { configuratorCategories } from '@/config/configurator';
import { cn } from '@/lib/utils';

/**
 * Category navigation for the configurator.
 *
 * Each category expands into the real product list from the catalog, so the
 * choice written into the store is what the 3D scene draws.
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
        <Badge variant="muted">A selecionar</Badge>
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
                <p className="text-xs leading-relaxed text-fog-400">{category.summary}</p>
                <ProductList categoryId={category.id} />
                {category.id === 'quadro' ? <FrameSizePicker /> : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

/**
 * Accessible breadcrumb navigation.
 *
 * Uses <nav aria-label="Localização"> and a structured list so screen readers
 * announce the full path. The last item is always current (aria-current=page).
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Localização" className="animate-fade">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-fog-500">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors duration-150 hover:text-fog-200"
            aria-label="Início"
          >
            <Home className="size-3" aria-hidden="true" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1">
              <ChevronRight className="size-3 shrink-0 text-fog-700" aria-hidden="true" />
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'font-medium text-fog-200' : ''}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors duration-150 hover:text-fog-200"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

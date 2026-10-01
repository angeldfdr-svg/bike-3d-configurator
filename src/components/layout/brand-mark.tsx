import type { SVGProps } from 'react';

import { cn } from '@/lib/utils';

/** Geometric brand mark: a wheel seen head-on. */
export function BrandMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn('size-6', className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 2.75v6.15M12 15.1v6.15" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.6 8.4 9.2 10.6M14.8 13.4l5.6 2.2" stroke="currentColor" strokeWidth="1.1" opacity="0.55" />
    </svg>
  );
}

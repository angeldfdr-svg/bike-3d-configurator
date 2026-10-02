import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-xs border px-2 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] uppercase',
  {
    variants: {
      variant: {
        neutral: 'border-line bg-ink-850/80 text-fog-300',
        accent: 'border-lime-400/35 bg-lime-400/10 text-lime-300',
        muted: 'border-transparent bg-ink-800 text-fog-500',
        danger: 'border-rose-400/35 bg-rose-400/10 text-rose-300',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps): ReactNode {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Shared visual contract for every call to action.
 * Exported so `LinkButton` can reuse the exact same styling without a
 * polymorphic slot dependency.
 */
export const buttonVariants = cva(
  cn(
    'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap',
    'rounded-md font-semibold tracking-[-0.01em]',
    'transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-out',
    'active:translate-y-px',
    'disabled:pointer-events-none disabled:opacity-45',
  ),
  {
    variants: {
      variant: {
        primary:
          'bg-lime-400 text-ink-950 hover:bg-lime-300 hover:shadow-[0_12px_34px_-14px_rgba(191,227,92,0.6)]',
        secondary:
          'border border-line-strong bg-ink-850/80 text-fog-100 hover:border-fog-500 hover:bg-ink-800',
        ghost: 'text-fog-300 hover:bg-ink-850 hover:text-fog-50',
      },
      size: {
        sm: 'h-9 px-3.5 text-[0.8125rem]',
        md: 'h-11 px-5 text-sm',
        lg: 'h-13 px-7 text-[0.9375rem]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonVariantProps;

export function Button({
  className,
  variant,
  size,
  type = 'button',
  ...props
}: ButtonProps): ReactNode {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

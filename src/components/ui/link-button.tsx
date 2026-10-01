import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import {
  buttonVariants,
  type ButtonVariantProps,
} from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type LinkButtonProps = Omit<ComponentProps<typeof Link>, 'className'> &
  ButtonVariantProps & {
    className?: string;
    children?: ReactNode;
  };

/** Anchor styled exactly like `Button`, for navigational calls to action. */
export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps): ReactNode {
  return (
    <Link className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

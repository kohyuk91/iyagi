'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelBadgeVariants = cva(
  'inline-block px-2 py-0.5 text-xs font-medium leading-[18px] rounded-[var(--ds-radius-pill)] border',
  {
    variants: {
      variant: {
        default:
          'text-[var(--ds-text-secondary)] border-[var(--ds-border-default)]',
        primary:
          'text-[var(--ds-accent-primary-contrastText)] bg-[var(--ds-accent-primary)] border-[var(--ds-accent-primary-border)]',
        danger:
          'text-[var(--ds-accent-danger-contrastText)] bg-[var(--ds-accent-danger)] border-[var(--ds-accent-danger-border)]',
        warning:
          'text-[var(--ds-accent-warning-contrastText)] bg-[var(--ds-accent-warning)]',
        info: 'text-[var(--ds-accent-info-contrastText)] bg-[var(--ds-accent-info)]',
        success:
          'text-[var(--ds-accent-success-contrastText)] bg-[var(--ds-accent-success)]',
        merged:
          'text-[var(--ds-accent-merged-contrastText)] bg-[var(--ds-accent-merged)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface LabelBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof labelBadgeVariants> {}

const LabelBadge = React.forwardRef<HTMLSpanElement, LabelBadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(labelBadgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
LabelBadge.displayName = 'LabelBadge';

export { LabelBadge, labelBadgeVariants };


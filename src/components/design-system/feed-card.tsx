'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FeedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'danger';
}

const FeedCard = React.forwardRef<HTMLDivElement, FeedCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-[var(--ds-bg-secondary)] border border-[var(--ds-border-default)] rounded-[var(--ds-radius-medium)] p-[var(--ds-spacing-md)] mb-[var(--ds-spacing-md)]',
          variant === 'danger' && 'border-[var(--ds-accent-danger-border)]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FeedCard.displayName = 'FeedCard';

export { FeedCard };


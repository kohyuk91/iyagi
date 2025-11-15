'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  isLast?: boolean;
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, isLast = false, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn(
          'flex items-center px-[var(--ds-spacing-md)] py-[var(--ds-spacing-sm)] border-b border-[var(--ds-border-default)] hover:bg-[var(--ds-bg-tertiary)] transition-colors',
          isLast && 'border-b-0',
          className
        )}
        {...props}
      >
        {children}
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';

export { ListItem };


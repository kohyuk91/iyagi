'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface NavigationItemProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  active?: boolean;
  asChild?: boolean;
}

const NavigationItem = React.forwardRef<HTMLAnchorElement, NavigationItemProps>(
  ({ className, href, active = false, children, asChild, ...props }, ref) => {
    const baseClasses = cn(
      'block px-[var(--ds-spacing-md)] py-[var(--ds-spacing-sm)] rounded-[var(--ds-radius-medium)] transition-colors',
      active
        ? 'text-[var(--ds-text-primary)] font-semibold bg-[rgba(110,118,129,0.1)] border-l-[3px] border-l-[var(--ds-accent-info)]'
        : 'text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]',
      className
    );

    if (asChild) {
      return (
        <span ref={ref} className={baseClasses} {...props}>
          {children}
        </span>
      );
    }

    return (
      <Link ref={ref} href={href} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }
);
NavigationItem.displayName = 'NavigationItem';

export { NavigationItem };


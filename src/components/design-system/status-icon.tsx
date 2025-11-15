'use client';

import * as React from 'react';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 'open' | 'closed' | 'merged';

export interface StatusIconProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  size?: number;
}

const statusColors = {
  open: 'var(--ds-accent-open)',
  closed: 'var(--ds-accent-closed)',
  merged: 'var(--ds-accent-merged-icon)',
} as const;

const StatusIcon = React.forwardRef<HTMLDivElement, StatusIconProps>(
  ({ className, status, size = 16, ...props }, ref) => {
    const color = statusColors[status];
    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center', className)}
        {...props}
      >
        <Circle
          size={size}
          style={{ fill: color, color: 'transparent' }}
        />
      </div>
    );
  }
);
StatusIcon.displayName = 'StatusIcon';

export { StatusIcon };


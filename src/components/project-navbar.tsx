'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProjectNavbarProps {
  projectId: string;
  projectTitle?: string;
  className?: string;
}

export function ProjectNavbar({
  projectId,
  projectTitle,
  className,
}: ProjectNavbarProps) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/workspace/projects');
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b border-[var(--ds-border-default)] bg-[var(--ds-bg-primary)]',
        className,
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <span className="text-sm text-[var(--ds-text-primary)] font-medium truncate">
              {projectTitle || 'Project'}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}


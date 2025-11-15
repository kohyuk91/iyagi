'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ArrowLeft, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Shot {
  id: string;
  sceneId: string;
  title: string;
  displayOrder: string;
}

async function fetchShots(sceneId: string): Promise<Shot[]> {
  const response = await fetch(`/api/scenes/${sceneId}/shots`);
  if (!response.ok) {
    throw new Error('Failed to fetch shots');
  }
  return response.json();
}

interface ShotNavbarProps {
  projectId: string;
  sceneId: string;
  shotId: string;
  projectTitle?: string;
  sceneTitle?: string;
  shotTitle?: string;
  className?: string;
}

export function ShotNavbar({
  projectId,
  sceneId,
  shotId,
  projectTitle,
  sceneTitle,
  shotTitle,
  className,
}: ShotNavbarProps) {
  const router = useRouter();

  const { data: shots = [] } = useQuery({
    queryKey: ['shots', sceneId],
    queryFn: () => fetchShots(sceneId),
    enabled: !!sceneId,
  });

  const currentShotIndex = shots.findIndex((shot) => shot.id === shotId);
  const previousShot = currentShotIndex > 0 ? shots[currentShotIndex - 1] : null;
  const nextShot = currentShotIndex >= 0 && currentShotIndex < shots.length - 1 ? shots[currentShotIndex + 1] : null;

  const handleBack = () => {
    router.push(`/workspace/projects/${projectId}`);
  };

  const handlePreviousShot = () => {
    if (previousShot) {
      router.push(`/workspace/projects/${projectId}/scenes/${sceneId}/shots/${previousShot.id}`);
    }
  };

  const handleNextShot = () => {
    if (nextShot) {
      router.push(`/workspace/projects/${projectId}/scenes/${sceneId}/shots/${nextShot.id}`);
    }
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

            <div className="flex items-center gap-2 text-sm text-[var(--ds-text-tertiary)] overflow-hidden">
              <span className="truncate">
                {projectTitle || 'Project'}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {sceneTitle || 'Scene'}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0" />
              <span className="text-[var(--ds-text-primary)] font-medium truncate">
                {shotTitle || 'Shot'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handlePreviousShot}
              variant="ghost"
              size="icon"
              disabled={!previousShot}
              className="text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Shot"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleNextShot}
              variant="ghost"
              size="icon"
              disabled={!nextShot}
              className="text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Shot"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}


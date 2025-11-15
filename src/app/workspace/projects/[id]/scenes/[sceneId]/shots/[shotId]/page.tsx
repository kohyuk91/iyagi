'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { ShotNavbar } from '@/components/shot-navbar';
import { ShotBottomNavbar } from '@/components/shot-bottom-navbar';
import { ShotImageViewer } from '@/components/shot-image-viewer';
import { ShotImageSidebar } from '@/components/shot-image-sidebar';

interface Shot {
  id: string;
  sceneId: string;
  title: string;
  description: string | null;
  displayOrder: string;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  scene?: {
    id: string;
    title: string;
  };
  project?: {
    id: string;
    title: string;
  };
}

async function fetchShot(shotId: string): Promise<Shot> {
  const response = await fetch(`/api/shots/${shotId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch shot');
  }
  return response.json();
}

export default function ShotDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const projectId = params.id as string;
  const sceneId = params.sceneId as string;
  const shotId = params.shotId as string;

  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data: shot, isLoading } = useQuery({
    queryKey: ['shot', shotId],
    queryFn: () => fetchShot(shotId),
    enabled: !!shotId,
  });

  const displayImageUrl = selectedImageUrl || shot?.imageUrl;

  return (
    <div className="h-screen bg-[var(--ds-bg-primary)] w-full flex flex-col overflow-hidden">
      <ShotNavbar
        projectId={projectId}
        sceneId={sceneId}
        shotId={shotId}
        projectTitle={shot?.project?.title}
        sceneTitle={shot?.scene?.title}
        shotTitle={shot?.title}
      />
      <div className="flex-1 pt-16 pb-[100px] overflow-hidden flex">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center text-[var(--ds-text-secondary)]">
            Loading shot...
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-hidden">
              <ShotImageViewer imageUrl={displayImageUrl} />
            </div>
            <ShotImageSidebar
              shotId={shotId}
              sceneId={sceneId}
              refreshTrigger={refreshTrigger}
              currentMainImageUrl={shot?.imageUrl}
              onImageSelect={(url) => {
                setSelectedImageUrl(url);
              }}
            />
          </>
        )}
      </div>
      <ShotBottomNavbar
        shotId={shotId}
        onImageGenerated={(imageUrl) => {
          setSelectedImageUrl(imageUrl);
          setRefreshTrigger((prev) => prev + 1);
          queryClient.invalidateQueries({ queryKey: ['shot-images', shotId] });
          queryClient.invalidateQueries({ queryKey: ['shots', sceneId] });
        }}
      />
    </div>
  );
}


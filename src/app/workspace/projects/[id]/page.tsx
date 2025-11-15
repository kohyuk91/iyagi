'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectNavbar } from '@/components/project-navbar';
import { SceneCard } from './scene-card';

interface Project {
  id: string;
  userId: string;
  title: string;
  aspectRatio: string;
  artStyle: string;
  artStyleImage: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Scene {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  displayOrder: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchProject(projectId: string): Promise<Project> {
  const response = await fetch(`/api/projects/${projectId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch project');
  }
  return response.json();
}

async function fetchScenes(projectId: string): Promise<Scene[]> {
  const response = await fetch(`/api/projects/${projectId}/scenes`);
  if (!response.ok) {
    throw new Error('Failed to fetch scenes');
  }
  return response.json();
}

async function createScene(projectId: string, data: {
  title: string;
  displayOrder: string;
  description?: string | null;
}): Promise<Scene> {
  const response = await fetch(`/api/projects/${projectId}/scenes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create scene');
  }
  return response.json();
}

export default function ProjectDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const projectId = params.id as string;

  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId,
  });

  const { data: scenes = [], isLoading: isScenesLoading } = useQuery({
    queryKey: ['scenes', projectId],
    queryFn: () => fetchScenes(projectId),
    enabled: !!projectId,
  });

  const createSceneMutation = useMutation({
    mutationFn: (data: { title: string; displayOrder: string; description?: string | null }) =>
      createScene(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scenes', projectId] });
    },
  });

  const handleAddScene = () => {
    const nextSceneNumber = scenes.length + 1;
    createSceneMutation.mutate({
      title: `Scene ${nextSceneNumber}`,
      displayOrder: String(nextSceneNumber),
      description: null,
    });
  };

  const isLoading = isProjectLoading || isScenesLoading;

  return (
    <div className="min-h-screen bg-[var(--ds-bg-primary)] w-full">
      <ProjectNavbar projectId={projectId} projectTitle={project?.title} />
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-[var(--ds-text-secondary)]">
              Loading scenes...
            </div>
          ) : (
            <>
              {scenes.map((scene) => (
                <SceneCard key={scene.id} scene={scene} projectId={projectId} />
              ))}
              <Button
                onClick={handleAddScene}
                variant="ghost"
                className="w-full border-0 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] hover:bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add a scene
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


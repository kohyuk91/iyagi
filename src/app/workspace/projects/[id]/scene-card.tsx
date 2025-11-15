'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Shot {
  id: string;
  sceneId: string;
  title: string;
  description: string | null;
  displayOrder: string;
  imageUrl: string | null;
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

async function fetchShots(sceneId: string): Promise<Shot[]> {
  const response = await fetch(`/api/scenes/${sceneId}/shots`);
  if (!response.ok) {
    throw new Error('Failed to fetch shots');
  }
  return response.json();
}

async function createShot(sceneId: string, title: string, displayOrder: string): Promise<Shot> {
  const response = await fetch(`/api/scenes/${sceneId}/shots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      displayOrder,
      description: null,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to create shot');
  }
  return response.json();
}

async function deleteShot(shotId: string): Promise<void> {
  const response = await fetch(`/api/shots/${shotId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete shot');
  }
}

interface SceneCardProps {
  scene: Scene;
  projectId: string;
}

export function SceneCard({ scene, projectId }: SceneCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shotToDelete, setShotToDelete] = useState<Shot | null>(null);

  const { data: shots = [], isLoading } = useQuery({
    queryKey: ['shots', scene.id],
    queryFn: () => fetchShots(scene.id),
    enabled: !!scene.id,
  });

  const createShotMutation = useMutation({
    mutationFn: () => {
      const nextDisplayOrder = String((shots?.length || 0) + 1);
      const nextTitle = `Shot ${nextDisplayOrder}`;
      return createShot(scene.id, nextTitle, nextDisplayOrder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shots', scene.id] });
    },
  });

  const deleteShotMutation = useMutation({
    mutationFn: deleteShot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shots', scene.id] });
      setDeleteDialogOpen(false);
      setShotToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting shot:', error);
      alert('Failed to delete shot');
    },
  });

  const handleShotClick = (shotId: string) => {
    router.push(`/workspace/projects/${projectId}/scenes/${scene.id}/shots/${shotId}`);
  };

  const handleAddShot = () => {
    createShotMutation.mutate();
  };

  const handleDeleteClick = (e: React.MouseEvent, shot: Shot) => {
    e.stopPropagation();
    setShotToDelete(shot);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (shotToDelete) {
      deleteShotMutation.mutate(shotToDelete.id);
    }
  };

  return (
    <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)] hover:border-[var(--ds-accent-info)]/50 transition-colors">
      <CardHeader>
        <CardTitle className="text-[var(--ds-text-primary)]">{scene.title}</CardTitle>
        {scene.description && (
          <CardDescription className="text-[var(--ds-text-secondary)]">
            {scene.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
          {isLoading ? (
            <div className="col-span-full text-center py-4 text-[var(--ds-text-secondary)] text-sm">
              Loading shots...
            </div>
          ) : (
            <>
              {shots.map((shot) => (
                <Card
                  key={shot.id}
                  onClick={() => handleShotClick(shot.id)}
                  className="group relative bg-[var(--ds-bg-primary)] border-[var(--ds-border-default)] hover:border-[var(--ds-accent-info)]/50 transition-colors cursor-pointer overflow-hidden flex flex-col"
                >
                  {shot.imageUrl && (
                    <div className="w-full aspect-video bg-[var(--ds-bg-secondary)] flex items-center justify-center overflow-hidden relative">
                      <img
                        src={shot.imageUrl}
                        alt={shot.title}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-2 right-2 z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                'h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70 text-white',
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                              onClick={(e) => handleDeleteClick(e, shot)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
              <Card
                className="border-dashed border-2 hover:border-[var(--ds-accent-info)] hover:bg-[var(--ds-bg-secondary)] transition-all duration-300 cursor-pointer flex bg-[var(--ds-bg-primary)] hover:shadow-lg group"
                onClick={handleAddShot}
              >
                <CardContent className="flex flex-col items-center justify-center min-h-[120px] w-full p-4 text-center">
                  <Plus className="h-8 w-8 text-[var(--ds-text-secondary)] mb-2 group-hover:text-[var(--ds-accent-info)] transition-all duration-300" />
                  <p className="text-xs font-medium text-[var(--ds-text-secondary)] group-hover:text-[var(--ds-accent-info)] transition-colors duration-300">
                    Add a shot
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </CardContent>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--ds-text-primary)]">Delete Shot</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[var(--ds-text-secondary)]">
              Are you sure you want to delete "{shotToDelete?.title}"? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteDialogOpen(false);
                setShotToDelete(null);
              }}
              className="text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteShotMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteShotMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}


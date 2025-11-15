'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Crown, MoreVertical, Trash2 } from 'lucide-react';
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

interface ShotImageSidebarProps {
  shotId?: string;
  sceneId?: string;
  images?: Array<{
    id: string;
    url: string;
    title?: string;
  }>;
  onImageSelect?: (imageUrl: string) => void;
  className?: string;
  refreshTrigger?: number;
  currentMainImageUrl?: string | null;
}

async function fetchImages(shotId: string) {
  const response = await fetch(`/api/shots/images?shotId=${shotId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }
  return response.json();
}

async function setMainImage(shotId: string, imageUrl: string) {
  const response = await fetch(`/api/shots/${shotId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageUrl }),
  });
  if (!response.ok) {
    throw new Error('Failed to set main image');
  }
  return response.json();
}

async function deleteImage(imageId: string, shotId: string): Promise<void> {
  const response = await fetch(`/api/shots/images?imageId=${encodeURIComponent(imageId)}&shotId=${shotId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
}

export function ShotImageSidebar({
  shotId,
  sceneId,
  images: propImages,
  onImageSelect,
  className,
  refreshTrigger,
  currentMainImageUrl,
}: ShotImageSidebarProps) {
  const queryClient = useQueryClient();
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [isSettingMain, setIsSettingMain] = useState<string | null>(null);
  const [hasAutoSetMain, setHasAutoSetMain] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ id: string; url: string } | null>(null);

  const { data: imagesData, refetch, error } = useQuery({
    queryKey: ['shot-images', shotId],
    queryFn: () => (shotId ? fetchImages(shotId) : Promise.resolve({ images: [] })),
    enabled: !!shotId,
    retry: false,
  });

  React.useEffect(() => {
    if (error) {
      console.error('Error fetching images:', error);
    }
  }, [error]);

  const images = imagesData?.images || propImages || [];

  React.useEffect(() => {
    if (shotId) {
      refetch();
      setHasAutoSetMain(false);
    }
  }, [shotId, refetch, refreshTrigger]);

  React.useEffect(() => {
    const autoSetMainImage = async () => {
      if (
        !shotId ||
        hasAutoSetMain ||
        currentMainImageUrl ||
        images.length === 0 ||
        !images[0]?.url
      ) {
        return;
      }

      const firstImage = images[0];
      setHasAutoSetMain(true);
      setIsSettingMain(firstImage.url);

      try {
        await setMainImage(shotId, firstImage.url);
        queryClient.invalidateQueries({ queryKey: ['shot', shotId] });
        if (sceneId) {
          queryClient.invalidateQueries({ queryKey: ['shots', sceneId] });
        }
        if (onImageSelect) {
          onImageSelect(firstImage.url);
        }
      } catch (error) {
        console.error('Error auto-setting main image:', error);
        setHasAutoSetMain(false);
      } finally {
        setIsSettingMain(null);
      }
    };

    autoSetMainImage();
  }, [shotId, images, currentMainImageUrl, hasAutoSetMain, queryClient, onImageSelect]);

  const handleSetMainImage = async (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    if (!shotId) return;

    setIsSettingMain(imageUrl);
    try {
      await setMainImage(shotId, imageUrl);
      queryClient.invalidateQueries({ queryKey: ['shot', shotId] });
      if (sceneId) {
        queryClient.invalidateQueries({ queryKey: ['shots', sceneId] });
      }
      if (onImageSelect) {
        onImageSelect(imageUrl);
      }
    } catch (error) {
      console.error('Error setting main image:', error);
      alert('Failed to set main image');
    } finally {
      setIsSettingMain(null);
    }
  };

  const deleteImageMutation = useMutation({
    mutationFn: ({ imageId, shotId, imageUrl }: { imageId: string; shotId: string; imageUrl: string }) =>
      deleteImage(imageId, shotId).then(() => ({ imageId, imageUrl })),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shot-images', shotId] });
      queryClient.invalidateQueries({ queryKey: ['shot', shotId] });
      if (sceneId) {
        queryClient.invalidateQueries({ queryKey: ['shots', sceneId] });
      }
      setDeleteDialogOpen(false);
      if (data && currentMainImageUrl === data.imageUrl && onImageSelect) {
        const remainingImages = images.filter((img) => img.id !== data.imageId);
        if (remainingImages.length > 0) {
          onImageSelect(remainingImages[0].url);
        } else {
          onImageSelect('');
        }
      }
      setImageToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    },
  });

  const handleDeleteClick = (e: React.MouseEvent, image: { id: string; url: string }) => {
    e.stopPropagation();
    setImageToDelete(image);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (imageToDelete && shotId) {
      deleteImageMutation.mutate({
        imageId: imageToDelete.id,
        shotId,
        imageUrl: imageToDelete.url,
      });
    }
  };

  return (
    <div
      className={cn(
        'w-[200px] bg-transparent border-l border-[var(--ds-border-default)] flex flex-col h-full',
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto p-4 bg-transparent">
        <div className="grid grid-cols-1 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              role="button"
              tabIndex={0}
              onClick={() => onImageSelect?.(image.url)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onImageSelect?.(image.url);
                }
              }}
              onMouseEnter={() => setHoveredImageId(image.id)}
              onMouseLeave={() => setHoveredImageId(null)}
              className="group relative w-full overflow-hidden rounded-lg border border-[var(--ds-border-default)] hover:border-[var(--ds-accent-info)] transition-colors bg-[var(--ds-bg-secondary)] cursor-pointer"
            >
              <img
                src={image.url}
                alt={image.title || 'Image'}
                className="w-full h-auto object-contain"
              />
              {(hoveredImageId === image.id || currentMainImageUrl === image.url) && (
                <Button
                  type="button"
                  size="icon"
                  onClick={(e) => handleSetMainImage(e, image.url)}
                  disabled={isSettingMain === image.url || currentMainImageUrl === image.url}
                  className={cn(
                    'absolute top-2 right-2 h-7 w-7 bg-[var(--ds-accent-info)] hover:bg-[var(--ds-accent-info)]/90 text-white shadow-lg transition-opacity',
                    currentMainImageUrl === image.url
                      ? '!opacity-100'
                      : isSettingMain === image.url
                        ? 'opacity-50 cursor-not-allowed'
                        : 'opacity-50 hover:opacity-100',
                  )}
                >
                  <Crown className="h-4 w-4" />
                </Button>
              )}
              <div className="absolute bottom-2 right-2 z-10">
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
                      onClick={(e) => handleDeleteClick(e, image)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--ds-text-primary)]">Delete Image</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[var(--ds-text-secondary)]">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteDialogOpen(false);
                setImageToDelete(null);
              }}
              className="text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteImageMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteImageMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


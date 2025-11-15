'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, ChevronLeft, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  aspectRatio: string;
  artStyle: string;
  artStyleImage?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

const aspectRatios = [
  { value: '16:9', label: '16:9 Landscape' },
  { value: '1:1', label: '1:1 Square' },
  { value: '9:16', label: '9:16 Portrait' },
];

const artStyles = [
  { id: 'cinematic', name: 'Cinematic', image: 'https://picsum.photos/200/150?random=1' },
  { id: 'sketch', name: 'Sketch', image: 'https://picsum.photos/200/150?random=2' },
  { id: 'pencil', name: 'Pencil Drawing', image: 'https://picsum.photos/200/150?random=3' },
  { id: 'ink', name: 'Japanese Ink Painting', image: 'https://picsum.photos/200/150?random=4' },
  { id: 'animation', name: 'Computer Animation', image: 'https://picsum.photos/200/150?random=5' },
  { id: 'vintage', name: 'Vintage Black and White', image: 'https://picsum.photos/200/150?random=6' },
  { id: 'anime', name: 'Anime', image: 'https://picsum.photos/200/150?random=7' },
  { id: 'pixel', name: 'Pixel Art', image: 'https://picsum.photos/200/150?random=8' },
];

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects');
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  return response.json();
}

async function createProject(data: {
  title: string;
  aspectRatio: string;
  artStyle: string;
  artStyleImage?: string;
}): Promise<Project> {
  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create project');
  }
  return response.json();
}

async function deleteProject(projectId: string): Promise<void> {
  const response = await fetch(`/api/projects/${projectId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
}

export default function ProjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [selectedArtStyle, setSelectedArtStyle] = useState('cinematic');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsOpen(false);
      setProjectName('');
      setSelectedAspectRatio('16:9');
      setSelectedArtStyle('cinematic');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    },
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(artStyles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentArtStyles = artStyles.slice(startIndex, startIndex + itemsPerPage);

  const handleAddProject = () => {
    setIsOpen(true);
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      return;
    }

    const selectedArtStyleData = artStyles.find((style) => style.id === selectedArtStyle);

    createMutation.mutate({
      title: projectName,
      aspectRatio: selectedAspectRatio,
      artStyle: selectedArtStyleData?.name || selectedArtStyle,
      artStyleImage: selectedArtStyleData?.image,
    });
  };

  const handleDeleteClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete.id);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects here. Create, edit, and organize your work.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Card
            className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer flex"
            onClick={handleAddProject}
          >
            <CardContent className="flex flex-col items-center justify-center min-h-[200px] w-full p-6 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm font-medium text-muted-foreground">Add Project</p>
            </CardContent>
          </Card>
          {isLoading ? (
            <div className="col-span-full text-center py-8 text-[var(--ds-text-secondary)]">
              Loading projects...
            </div>
          ) : (
            projects.map((project) => {
              const aspectRatioLabel = aspectRatios.find(
                (r) => r.value === project.aspectRatio || r.label === project.aspectRatio,
              )?.label || project.aspectRatio;

              return (
                <Card
                  key={project.id}
                  onClick={() => router.push(`/workspace/projects/${project.id}`)}
                  className="group relative transition-all duration-300 cursor-pointer overflow-hidden border-[var(--ds-border-default)] hover:scale-105 hover:border-[var(--ds-accent-info)] hover:shadow-[0_0_20px_rgba(56,139,253,0.3)] flex flex-col min-h-[200px]"
                >
                  {project.imageUrl && (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 z-20">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            'h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity',
                            project.imageUrl
                              ? 'text-white hover:bg-white/20'
                              : 'text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-tertiary)]',
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
                          onClick={(e) => handleDeleteClick(e, project)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardHeader className="relative z-10">
                    <CardTitle
                      className={cn(
                        'line-clamp-1',
                        project.imageUrl ? 'text-white drop-shadow-lg' : 'text-[var(--ds-text-primary)]',
                      )}
                    >
                      {project.title}
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1">
                      <span
                        className={cn(
                          'text-xs',
                          project.imageUrl
                            ? 'text-white/90 drop-shadow-md'
                            : 'text-[var(--ds-text-secondary)]',
                        )}
                      >
                        {aspectRatioLabel}
                      </span>
                      <span
                        className={cn(
                          'text-xs',
                          project.imageUrl
                            ? 'text-white/90 drop-shadow-md'
                            : 'text-[var(--ds-text-secondary)]',
                        )}
                      >
                        {project.artStyle}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0 relative z-10">
                    <p
                      className={cn(
                        'text-xs',
                        project.imageUrl
                          ? 'text-white/80 drop-shadow-md'
                          : 'text-[var(--ds-text-tertiary)]',
                      )}
                    >
                      Created{' '}
                      {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
          <DialogHeader>
            <DialogTitle className="text-[24px] font-semibold text-[var(--ds-text-primary)]">
              Create a new project
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-[var(--ds-spacing-xl)] mt-[var(--ds-spacing-md)]">
            <div className="space-y-[var(--ds-spacing-sm)]">
              <Label htmlFor="project-name" className="text-[var(--ds-text-primary)]">
                Project Name
              </Label>
              <Input
                id="project-name"
                placeholder="New Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-[var(--ds-bg-primary)] border-[var(--ds-border-default)] text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-tertiary)] focus-visible:ring-[var(--ds-accent-info)]"
              />
            </div>

            <div className="space-y-[var(--ds-spacing-md)]">
              <Label className="text-[var(--ds-text-primary)]">Aspect Ratio</Label>
              <div className="flex gap-[var(--ds-spacing-md)]">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setSelectedAspectRatio(ratio.value)}
                    className={`
                      flex items-center gap-[var(--ds-spacing-sm)] px-[var(--ds-spacing-md)] py-[var(--ds-spacing-md)] rounded-[var(--ds-radius-medium)] border-2 transition-colors
                      ${
                        selectedAspectRatio === ratio.value
                          ? 'border-[var(--ds-accent-info)] bg-[rgba(56,139,253,0.1)]'
                          : 'border-[var(--ds-border-default)] hover:border-[var(--ds-accent-info)]/50 hover:bg-[var(--ds-bg-tertiary)]'
                      }
                    `}
                  >
                    <div
                      className={`
                        w-3 h-3 rounded-[var(--ds-radius-small)]
                        ${
                          selectedAspectRatio === ratio.value
                            ? 'bg-[var(--ds-accent-info)]'
                            : 'bg-[var(--ds-text-tertiary)]'
                        }
                      `}
                    />
                    <span className="text-sm font-medium text-[var(--ds-text-primary)]">
                      {ratio.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-[var(--ds-spacing-md)]">
              <Label className="text-[var(--ds-text-primary)]">Select Art Style</Label>
              <div className="grid grid-cols-4 gap-[var(--ds-spacing-md)]">
                {currentArtStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setSelectedArtStyle(style.id)}
                    className={`
                      relative rounded-[var(--ds-radius-medium)] overflow-hidden border-2 transition-all
                      ${
                        selectedArtStyle === style.id
                          ? 'border-[var(--ds-accent-info)] ring-2 ring-[var(--ds-accent-info)]/20'
                          : 'border-[var(--ds-border-default)] hover:border-[var(--ds-accent-info)]/50'
                      }
                    `}
                  >
                    <img
                      src={style.image}
                      alt={style.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-[var(--ds-spacing-sm)] bg-[var(--ds-bg-primary)]">
                      <p className="text-xs font-medium text-center text-[var(--ds-text-primary)]">
                        {style.name}
                      </p>
                    </div>
                    {selectedArtStyle === style.id && (
                      <div className="absolute top-[var(--ds-spacing-sm)] right-[var(--ds-spacing-sm)] w-4 h-4 bg-[var(--ds-accent-info)] rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[var(--ds-spacing-sm)]">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-[var(--ds-spacing-xs)] rounded-[var(--ds-radius-small)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--ds-bg-tertiary)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`
                        w-8 h-8 rounded-[var(--ds-radius-small)] text-sm font-medium transition-colors
                        ${
                          currentPage === page
                            ? 'bg-[var(--ds-accent-info)] text-white'
                            : 'text-[var(--ds-text-secondary)] hover:bg-[var(--ds-bg-tertiary)] hover:text-[var(--ds-text-primary)]'
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-[var(--ds-spacing-xs)] rounded-[var(--ds-radius-small)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--ds-bg-tertiary)] text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)] transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-[var(--ds-spacing-md)]">
              <Button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="bg-[var(--ds-accent-primary)] text-white border border-[var(--ds-accent-primary-border)] hover:bg-[#2ea043] px-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--ds-text-primary)]">
              Delete Project
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-[var(--ds-text-secondary)]">
              Are you sure you want to delete "{projectToDelete?.title}"? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProjectToDelete(null);
              }}
              className="text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


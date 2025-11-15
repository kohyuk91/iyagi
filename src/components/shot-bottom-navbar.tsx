'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Send, Loader2 } from 'lucide-react';

interface ShotBottomNavbarProps {
  className?: string;
  shotId?: string;
  onImageGenerated?: (imageUrl: string) => void;
}

const TOOLS = [
  'Create New Image',
  'Generative Fill Tool',
  'Object Removal Tool',
] as const;

export function ShotBottomNavbar({ className, shotId, onImageGenerated }: ShotBottomNavbarProps) {
  const [selectedTool, setSelectedTool] = useState<string>(TOOLS[0]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || !shotId || isGenerating) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/shots/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shotId,
          prompt: prompt.trim(),
          tool: selectedTool,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to generate image' }));
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      if (data.imageUrl && onImageGenerated) {
        onImageGenerated(data.imageUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate image';
      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--ds-border-default)] bg-[var(--ds-bg-primary)]',
        className,
      )}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-[var(--ds-border-default)] bg-[var(--ds-bg-secondary)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
              >
                {selectedTool}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-[var(--ds-bg-primary)] border-[var(--ds-border-default)]"
            >
              <DropdownMenuItem
                className="text-[var(--ds-text-primary)] focus:bg-[var(--ds-bg-secondary)]"
                onClick={() => setSelectedTool(TOOLS[0])}
              >
                Create New Image
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-[var(--ds-text-primary)] focus:bg-[var(--ds-bg-secondary)]"
                onClick={() => setSelectedTool(TOOLS[1])}
              >
                Generative Fill Tool
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-[var(--ds-text-primary)] focus:bg-[var(--ds-bg-secondary)]"
                onClick={() => setSelectedTool(TOOLS[2])}
              >
                Object Removal Tool
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 flex justify-center">
            <div className="relative max-w-md w-full">
              <Textarea
                placeholder="Enter prompt..."
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
                disabled={isGenerating}
                className="w-full pr-12 border-[var(--ds-border-default)] bg-[var(--ds-bg-secondary)] text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-tertiary)] focus-visible:ring-[var(--ds-accent-info)] resize-none"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="absolute bottom-2 right-2 h-8 w-8 bg-[var(--ds-accent-info)] hover:bg-[var(--ds-accent-info)]/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="w-[120px]"></div>
        </div>
      </div>
    </nav>
  );
}


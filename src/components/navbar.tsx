'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-3xl font-extrabold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent hover:from-primary hover:to-primary/80 transition-all tracking-wide drop-shadow-sm"
          >
            IYAGI
          </Link>
          <div className="flex items-center gap-4">
            <SignedIn>
              <Button asChild variant="ghost">
                <Link href="/workspace">Workspace</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <Button asChild variant="ghost">
                <Link href="/authentication">Sign In</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}


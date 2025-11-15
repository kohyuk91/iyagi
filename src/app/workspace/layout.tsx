'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { NavigationItem } from '@/components/design-system/navigation-item';
import { FolderKanban, Users, MapPin, Package, Settings } from 'lucide-react';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isProjectDetailPage = /^\/workspace\/projects\/[^/]+$/.test(pathname || '');
  const isShotDetailPage = /^\/workspace\/projects\/[^/]+\/scenes\/[^/]+\/shots\/[^/]+$/.test(
    pathname || '',
  );

  if (isProjectDetailPage || isShotDetailPage) {
    return <>{children}</>;
  }

  const navigationItems = [
    {
      href: '/workspace/projects',
      label: 'Projects',
      icon: FolderKanban,
    },
    {
      href: '/workspace/characters',
      label: 'Characters',
      icon: Users,
    },
    {
      href: '/workspace/locations',
      label: 'Locations',
      icon: MapPin,
    },
    {
      href: '/workspace/props',
      label: 'Props',
      icon: Package,
    },
    {
      href: '/workspace/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden pt-16">
        <aside className="w-64 h-full border-r border-border bg-background flex-shrink-0">
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <NavigationItem key={item.href} href={item.href} active={isActive}>
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                </NavigationItem>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}


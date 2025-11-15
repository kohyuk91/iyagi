'use client';

import { FeedCard } from '@/components/design-system/feed-card';
import { LabelBadge } from '@/components/design-system/label-badge';
import { ListItem } from '@/components/design-system/list-item';
import { NavigationItem } from '@/components/design-system/navigation-item';
import { StatusIcon } from '@/components/design-system/status-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  GitMerge,
  Github,
  Settings,
  Home,
  Search,
  Bell,
  MessageSquare,
  GitBranch,
  Star,
  Eye,
  GitFork,
  TrendingUp,
  Users,
  Filter,
  ThumbsUp,
  Share2,
  Bookmark,
  MoreHorizontal,
  AlertCircle,
  CheckCircle2,
  Plus,
  Download,
  Upload,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export default function ComponentsPage() {
  const mockDate = new Date(Date.now() - 2 * 60 * 60 * 1000);
  const [activeTab, setActiveTab] = useState<'issues' | 'prs' | 'discussions'>('issues');

  return (
    <div className="dark min-h-screen bg-[var(--ds-bg-primary)] text-[var(--ds-text-primary)]">
      <div className="max-w-[1280px] mx-auto px-[var(--ds-spacing-md)] py-[var(--ds-spacing-xl)]">
        <div className="mb-[var(--ds-spacing-xl)]">
          <h1 className="text-[24px] font-semibold mb-2">Design System Components</h1>
          <p className="text-[var(--ds-text-secondary)]">
            재사용 가능한 컴포넌트 데모 및 사용 예시
          </p>
        </div>

        <div className="space-y-[var(--ds-spacing-xl)]">
          {/* Buttons Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Buttons
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
              <CardHeader>
                <CardTitle className="text-[var(--ds-text-primary)]">
                  Button Variants
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-[var(--ds-spacing-md)]">
                <Button
                  className="bg-[var(--ds-accent-primary)] text-[var(--ds-accent-primary-contrastText)] border border-[var(--ds-accent-primary-border)] hover:bg-[#2ea043]"
                >
                  Primary
                </Button>
                <Button
                  variant="secondary"
                  className="bg-[var(--ds-accent-default-main)] text-[var(--ds-accent-default-contrastText)] border border-[var(--ds-accent-default-border)] hover:bg-[var(--ds-bg-tertiary)]"
                >
                  Default
                </Button>
                <Button
                  variant="destructive"
                  className="bg-[var(--ds-accent-danger)] text-[var(--ds-accent-danger-contrastText)] border border-[var(--ds-accent-danger-border)] hover:bg-[#c93c37]"
                >
                  Danger
                </Button>
                <Button
                  variant="outline"
                  className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                >
                  Outline
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Feed Cards Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Feed Cards
            </h2>
            <div className="space-y-[var(--ds-spacing-md)]">
              <FeedCard>
                <div className="flex items-start gap-[var(--ds-spacing-md)]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://picsum.photos/40/40?random=1"
                      alt="User"
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                      <span className="font-semibold text-[var(--ds-text-primary)]">
                        user123
                      </span>
                      <span className="text-[var(--ds-text-secondary)] text-xs">
                        opened this issue
                      </span>
                      <span className="text-[var(--ds-text-tertiary)] text-xs">
                        {formatDistanceToNow(mockDate, { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-semibold mb-1 text-[var(--ds-text-link)] hover:underline cursor-pointer">
                      Feature: Add new authentication system
                    </h3>
                    <p className="text-[var(--ds-text-secondary)] text-sm mb-2">
                      This PR adds a new authentication system with support for
                      OAuth2 and JWT tokens.
                    </p>
                    <div className="flex items-center gap-[var(--ds-spacing-sm)] flex-wrap">
                      <StatusIcon status="open" />
                      <LabelBadge variant="primary">enhancement</LabelBadge>
                      <LabelBadge variant="info">frontend</LabelBadge>
                      <LabelBadge>good first issue</LabelBadge>
                    </div>
                  </div>
                </div>
              </FeedCard>

              <FeedCard>
                <div className="flex items-start gap-[var(--ds-spacing-md)]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://picsum.photos/40/40?random=2"
                      alt="User"
                    />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                      <span className="font-semibold text-[var(--ds-text-primary)]">
                        developer456
                      </span>
                      <span className="text-[var(--ds-text-secondary)] text-xs">
                        merged pull request
                      </span>
                      <span className="text-[var(--ds-text-tertiary)] text-xs">
                        {formatDistanceToNow(mockDate, { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-semibold mb-1 text-[var(--ds-text-link)] hover:underline cursor-pointer">
                      Fix: Resolve memory leak in data processing
                    </h3>
                    <p className="text-[var(--ds-text-secondary)] text-sm mb-2">
                      Fixed memory leak that occurred during large dataset
                      processing.
                    </p>
                    <div className="flex items-center gap-[var(--ds-spacing-sm)] flex-wrap">
                      <StatusIcon status="merged" />
                      <LabelBadge variant="merged">bug</LabelBadge>
                      <LabelBadge variant="success">backend</LabelBadge>
                    </div>
                  </div>
                </div>
              </FeedCard>

              <FeedCard variant="danger">
                <div className="flex items-start gap-[var(--ds-spacing-md)]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://picsum.photos/40/40?random=3"
                      alt="User"
                    />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                      <span className="font-semibold text-[var(--ds-text-primary)]">
                        admin789
                      </span>
                      <span className="text-[var(--ds-text-secondary)] text-xs">
                        closed this issue
                      </span>
                      <span className="text-[var(--ds-text-tertiary)] text-xs">
                        {formatDistanceToNow(mockDate, { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-semibold mb-1 text-[var(--ds-text-link)] hover:underline cursor-pointer">
                      Security: Critical vulnerability in authentication
                    </h3>
                    <p className="text-[var(--ds-text-secondary)] text-sm mb-2">
                      This issue has been resolved and the security patch has
                      been deployed.
                    </p>
                    <div className="flex items-center gap-[var(--ds-spacing-sm)] flex-wrap">
                      <StatusIcon status="closed" />
                      <LabelBadge variant="danger">security</LabelBadge>
                      <LabelBadge variant="warning">critical</LabelBadge>
                    </div>
                  </div>
                </div>
              </FeedCard>
            </div>
          </section>

          {/* Label Badges Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Label Badges
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
              <CardHeader>
                <CardTitle className="text-[var(--ds-text-primary)]">
                  Badge Variants
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-[var(--ds-spacing-sm)]">
                <LabelBadge>default</LabelBadge>
                <LabelBadge variant="primary">primary</LabelBadge>
                <LabelBadge variant="danger">danger</LabelBadge>
                <LabelBadge variant="warning">warning</LabelBadge>
                <LabelBadge variant="info">info</LabelBadge>
                <LabelBadge variant="success">success</LabelBadge>
                <LabelBadge variant="merged">merged</LabelBadge>
              </CardContent>
            </Card>
          </section>

          {/* List Items Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              List Items
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)] overflow-hidden">
              <CardHeader>
                <CardTitle className="text-[var(--ds-text-primary)]">
                  Interactive List
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="list-none">
                  <ListItem>
                    <div className="flex items-center gap-[var(--ds-spacing-md)] flex-1">
                      <Github className="h-5 w-5 text-[var(--ds-text-secondary)]" />
                      <div className="flex-1">
                        <div className="font-medium text-[var(--ds-text-primary)]">
                          Repository Settings
                        </div>
                        <div className="text-sm text-[var(--ds-text-secondary)]">
                          Manage repository configuration
                        </div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="flex items-center gap-[var(--ds-spacing-md)] flex-1">
                      <Settings className="h-5 w-5 text-[var(--ds-text-secondary)]" />
                      <div className="flex-1">
                        <div className="font-medium text-[var(--ds-text-primary)]">
                          General Settings
                        </div>
                        <div className="text-sm text-[var(--ds-text-secondary)]">
                          Configure general preferences
                        </div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="flex items-center gap-[var(--ds-spacing-md)] flex-1">
                      <Bell className="h-5 w-5 text-[var(--ds-text-secondary)]" />
                      <div className="flex-1">
                        <div className="font-medium text-[var(--ds-text-primary)]">
                          Notifications
                        </div>
                        <div className="text-sm text-[var(--ds-text-secondary)]">
                          Manage notification preferences
                        </div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem isLast>
                    <div className="flex items-center gap-[var(--ds-spacing-md)] flex-1">
                      <Search className="h-5 w-5 text-[var(--ds-text-secondary)]" />
                      <div className="flex-1">
                        <div className="font-medium text-[var(--ds-text-primary)]">
                          Search Settings
                        </div>
                        <div className="text-sm text-[var(--ds-text-secondary)]">
                          Configure search options
                        </div>
                      </div>
                    </div>
                  </ListItem>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Navigation Items Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Navigation Items
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
              <CardHeader>
                <CardTitle className="text-[var(--ds-text-primary)]">
                  Sidebar Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <NavigationItem href="/components" active>
                  <div className="flex items-center gap-[var(--ds-spacing-sm)]">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </div>
                </NavigationItem>
                <NavigationItem href="/components">
                  <div className="flex items-center gap-[var(--ds-spacing-sm)]">
                    <Github className="h-4 w-4" />
                    <span>Repositories</span>
                  </div>
                </NavigationItem>
                <NavigationItem href="/components">
                  <div className="flex items-center gap-[var(--ds-spacing-sm)]">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </NavigationItem>
                <NavigationItem href="/components">
                  <div className="flex items-center gap-[var(--ds-spacing-sm)]">
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </div>
                </NavigationItem>
              </CardContent>
            </Card>
          </section>

          {/* Status Icons Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Status Icons
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
              <CardHeader>
                <CardTitle className="text-[var(--ds-text-primary)]">
                  Status Indicators
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-[var(--ds-spacing-md)] items-center">
                <div className="flex items-center gap-[var(--ds-spacing-sm)]">
                  <StatusIcon status="open" />
                  <span className="text-[var(--ds-text-secondary)]">Open</span>
                </div>
                <div className="flex items-center gap-[var(--ds-spacing-sm)]">
                  <StatusIcon status="closed" />
                  <span className="text-[var(--ds-text-secondary)]">Closed</span>
                </div>
                <div className="flex items-center gap-[var(--ds-spacing-sm)]">
                  <StatusIcon status="merged" />
                  <span className="text-[var(--ds-text-secondary)]">Merged</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Search and Filter Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Search & Filter
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
              <CardHeader>
                <CardTitle className="text-[var(--ds-text-primary)]">
                  Search Interface
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-[var(--ds-spacing-md)]">
                <div className="flex gap-[var(--ds-spacing-sm)]">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--ds-text-tertiary)]" />
                    <Input
                      placeholder="Search repositories, issues, pull requests..."
                      className="pl-9 bg-[var(--ds-bg-primary)] border-[var(--ds-border-default)] text-[var(--ds-text-primary)] placeholder:text-[var(--ds-text-tertiary)]"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>
                <div className="flex flex-wrap gap-[var(--ds-spacing-sm)]">
                  <LabelBadge variant="info" className="cursor-pointer">
                    is:open
                  </LabelBadge>
                  <LabelBadge variant="info" className="cursor-pointer">
                    author:user123
                  </LabelBadge>
                  <LabelBadge variant="info" className="cursor-pointer">
                    label:bug
                  </LabelBadge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                  >
                    Clear all
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Tab Navigation Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Tab Navigation
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
              <CardHeader>
                <CardTitle className="text-[var(--ds-text-primary)]">
                  Repository Tabs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex border-b border-[var(--ds-border-default)] -mx-6 -mt-6 mb-6">
                  <button
                    onClick={() => setActiveTab('issues')}
                    className={`px-4 py-3 border-b-2 transition-colors ${
                      activeTab === 'issues'
                        ? 'border-[var(--ds-accent-info)] text-[var(--ds-text-primary)] font-semibold'
                        : 'border-transparent text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>Issues</span>
                      <LabelBadge variant="default" className="ml-1">
                        12
                      </LabelBadge>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('prs')}
                    className={`px-4 py-3 border-b-2 transition-colors ${
                      activeTab === 'prs'
                        ? 'border-[var(--ds-accent-info)] text-[var(--ds-text-primary)] font-semibold'
                        : 'border-transparent text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GitMerge className="h-4 w-4" />
                      <span>Pull Requests</span>
                      <LabelBadge variant="default" className="ml-1">
                        5
                      </LabelBadge>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('discussions')}
                    className={`px-4 py-3 border-b-2 transition-colors ${
                      activeTab === 'discussions'
                        ? 'border-[var(--ds-accent-info)] text-[var(--ds-text-primary)] font-semibold'
                        : 'border-transparent text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>Discussions</span>
                      <LabelBadge variant="default" className="ml-1">
                        8
                      </LabelBadge>
                    </div>
                  </button>
                </div>
                <div className="text-[var(--ds-text-secondary)]">
                  Active tab: <span className="text-[var(--ds-text-primary)] font-medium">{activeTab}</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Issue/PR List View Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Issue/PR List View
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)] overflow-hidden">
              <CardHeader className="border-b border-[var(--ds-border-default)]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[var(--ds-text-primary)]">
                    Repository Issues
                  </CardTitle>
                  <Button
                    size="sm"
                    className="bg-[var(--ds-accent-primary)] text-[var(--ds-accent-primary-contrastText)] border border-[var(--ds-accent-primary-border)] hover:bg-[#2ea043]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Issue
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="list-none">
                  <ListItem>
                    <div className="flex items-start gap-[var(--ds-spacing-md)] flex-1">
                      <StatusIcon status="open" className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                          <a
                            href="#"
                            className="text-[16px] font-semibold text-[var(--ds-text-link)] hover:underline"
                          >
                            Add support for dark mode theme
                          </a>
                          <div className="flex gap-[var(--ds-spacing-xs)] flex-wrap">
                            <LabelBadge variant="primary">enhancement</LabelBadge>
                            <LabelBadge variant="info">frontend</LabelBadge>
                          </div>
                        </div>
                        <p className="text-sm text-[var(--ds-text-secondary)] mb-2">
                          #1234 opened {formatDistanceToNow(mockDate, { addSuffix: true })} by{' '}
                          <a href="#" className="text-[var(--ds-text-link)] hover:underline">
                            user123
                          </a>
                        </p>
                        <div className="flex items-center gap-[var(--ds-spacing-md)] text-xs text-[var(--ds-text-tertiary)]">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>5 comments</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>12 reactions</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="flex items-start gap-[var(--ds-spacing-md)] flex-1">
                      <StatusIcon status="closed" className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                          <a
                            href="#"
                            className="text-[16px] font-semibold text-[var(--ds-text-link)] hover:underline"
                          >
                            Fix memory leak in data processing module
                          </a>
                          <div className="flex gap-[var(--ds-spacing-xs)] flex-wrap">
                            <LabelBadge variant="danger">bug</LabelBadge>
                            <LabelBadge variant="success">backend</LabelBadge>
                          </div>
                        </div>
                        <p className="text-sm text-[var(--ds-text-secondary)] mb-2">
                          #1233 closed {formatDistanceToNow(mockDate, { addSuffix: true })} by{' '}
                          <a href="#" className="text-[var(--ds-text-link)] hover:underline">
                            developer456
                          </a>
                        </p>
                        <div className="flex items-center gap-[var(--ds-spacing-md)] text-xs text-[var(--ds-text-tertiary)]">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>8 comments</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Fixed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem isLast>
                    <div className="flex items-start gap-[var(--ds-spacing-md)] flex-1">
                      <StatusIcon status="merged" className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                          <a
                            href="#"
                            className="text-[16px] font-semibold text-[var(--ds-text-link)] hover:underline"
                          >
                            Implement new authentication system
                          </a>
                          <div className="flex gap-[var(--ds-spacing-xs)] flex-wrap">
                            <LabelBadge variant="merged">feature</LabelBadge>
                            <LabelBadge variant="info">security</LabelBadge>
                          </div>
                        </div>
                        <p className="text-sm text-[var(--ds-text-secondary)] mb-2">
                          #1232 merged {formatDistanceToNow(mockDate, { addSuffix: true })} by{' '}
                          <a href="#" className="text-[var(--ds-text-link)] hover:underline">
                            admin789
                          </a>
                        </p>
                        <div className="flex items-center gap-[var(--ds-spacing-md)] text-xs text-[var(--ds-text-tertiary)]">
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            <span>feature/auth-system</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Merged</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListItem>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Statistics Cards Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Statistics Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--ds-spacing-md)]">
              <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--ds-text-secondary)]">Stars</span>
                    <Star className="h-4 w-4 text-[var(--ds-text-secondary)]" />
                  </div>
                  <div className="text-2xl font-semibold text-[var(--ds-text-primary)] mb-1">
                    1,234
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--ds-accent-success)]">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--ds-text-secondary)]">Forks</span>
                    <GitFork className="h-4 w-4 text-[var(--ds-text-secondary)]" />
                  </div>
                  <div className="text-2xl font-semibold text-[var(--ds-text-primary)] mb-1">
                    567
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--ds-accent-success)]">
                    <TrendingUp className="h-3 w-3" />
                    <span>+8% from last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--ds-text-secondary)]">Watchers</span>
                    <Eye className="h-4 w-4 text-[var(--ds-text-secondary)]" />
                  </div>
                  <div className="text-2xl font-semibold text-[var(--ds-text-primary)] mb-1">
                    89
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--ds-text-tertiary)]">
                    <span>No change</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--ds-text-secondary)]">Contributors</span>
                    <Users className="h-4 w-4 text-[var(--ds-text-secondary)]" />
                  </div>
                  <div className="text-2xl font-semibold text-[var(--ds-text-primary)] mb-1">
                    42
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[var(--ds-accent-success)]">
                    <TrendingUp className="h-3 w-3" />
                    <span>+3 this month</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Profile Card Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Profile Card
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)] max-w-md">
              <CardContent className="pt-6">
                <div className="flex items-start gap-[var(--ds-spacing-md)]">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src="https://picsum.photos/80/80?random=10"
                      alt="Profile"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[20px] font-semibold text-[var(--ds-text-primary)] mb-1">
                      John Doe
                    </h3>
                    <p className="text-sm text-[var(--ds-text-secondary)] mb-3">
                      @johndoe
                    </p>
                    <p className="text-sm text-[var(--ds-text-secondary)] mb-4">
                      Full-stack developer passionate about open source. Building amazing
                      products with React, TypeScript, and Node.js.
                    </p>
                    <div className="flex items-center gap-[var(--ds-spacing-md)] text-sm text-[var(--ds-text-secondary)] mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>24 followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>·</span>
                        <span>12 following</span>
                      </div>
                    </div>
                    <div className="flex gap-[var(--ds-spacing-sm)]">
                      <Button
                        size="sm"
                        className="bg-[var(--ds-accent-primary)] text-[var(--ds-accent-primary-contrastText)] border border-[var(--ds-accent-primary-border)] hover:bg-[#2ea043]"
                      >
                        Follow
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Comment Thread Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Comment Thread
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
              <CardHeader>
                <CardTitle className="text-[var(--ds-text-primary)]">
                  Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-[var(--ds-spacing-md)]">
                <div className="flex gap-[var(--ds-spacing-md)]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://picsum.photos/40/40?random=11"
                      alt="User"
                    />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-[var(--ds-bg-primary)] border border-[var(--ds-border-default)] rounded-[var(--ds-radius-medium)] p-[var(--ds-spacing-md)]">
                      <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-2">
                        <span className="font-semibold text-[var(--ds-text-primary)]">
                          alicebrown
                        </span>
                        <span className="text-xs text-[var(--ds-text-tertiary)]">
                          {formatDistanceToNow(mockDate, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--ds-text-primary)] mb-3">
                        This is a great feature! I think we should also consider adding
                        support for custom themes. What do you think?
                      </p>
                      <div className="flex items-center gap-[var(--ds-spacing-md)]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>12</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="bg-[var(--ds-border-default)]" />
                <div className="flex gap-[var(--ds-spacing-md)]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://picsum.photos/40/40?random=12"
                      alt="User"
                    />
                    <AvatarFallback>CD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-[var(--ds-bg-primary)] border border-[var(--ds-border-default)] rounded-[var(--ds-radius-medium)] p-[var(--ds-spacing-md)]">
                      <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-2">
                        <span className="font-semibold text-[var(--ds-text-primary)]">
                          charliedavis
                        </span>
                        <span className="text-xs text-[var(--ds-text-tertiary)]">
                          {formatDistanceToNow(mockDate, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--ds-text-primary)] mb-3">
                        I agree! Custom themes would be a great addition. I can help
                        implement this if needed.
                      </p>
                      <div className="flex items-center gap-[var(--ds-spacing-md)]">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          <span>5</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Action Button Groups Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Action Button Groups
            </h2>
            <div className="space-y-[var(--ds-spacing-md)]">
              <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ds-text-primary)]">
                    Primary Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-[var(--ds-spacing-sm)]">
                  <Button
                    className="bg-[var(--ds-accent-primary)] text-[var(--ds-accent-primary-contrastText)] border border-[var(--ds-accent-primary-border)] hover:bg-[#2ea043]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </CardContent>
              </Card>
              <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
                <CardHeader>
                  <CardTitle className="text-[var(--ds-text-primary)]">
                    Icon Button Group
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-[var(--ds-spacing-sm)]">
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-[var(--ds-border-default)] text-[var(--ds-text-primary)] hover:bg-[var(--ds-bg-tertiary)]"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Code Snippet Card Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Code Snippet Card
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[var(--ds-text-primary)]">
                    Example Code
                  </CardTitle>
                  <div className="flex gap-[var(--ds-spacing-sm)]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-[var(--ds-bg-primary)] border border-[var(--ds-border-default)] rounded-[var(--ds-radius-medium)] p-[var(--ds-spacing-md)] overflow-x-auto">
                  <pre className="text-sm text-[var(--ds-text-primary)] font-mono">
                    <code>{`import { FeedCard } from '@/components/design-system';

export function Example() {
  return (
    <FeedCard>
      <p>This is a reusable component</p>
    </FeedCard>
  );
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Notification List Section */}
          <section>
            <h2 className="text-[20px] font-semibold mb-[var(--ds-spacing-md)]">
              Notification List
            </h2>
            <Card className="bg-[var(--ds-bg-secondary)] border-[var(--ds-border-default)] overflow-hidden">
              <CardHeader className="border-b border-[var(--ds-border-default)]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[var(--ds-text-primary)]">
                    Notifications
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[var(--ds-text-secondary)] hover:text-[var(--ds-text-primary)]"
                  >
                    Mark all as read
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="list-none">
                  <ListItem>
                    <div className="flex items-start gap-[var(--ds-spacing-md)] flex-1">
                      <div className="h-2 w-2 rounded-full bg-[var(--ds-accent-info)] mt-2" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                          <span className="font-semibold text-[var(--ds-text-primary)]">
                            New comment on issue #123
                          </span>
                          <span className="text-xs text-[var(--ds-text-tertiary)]">
                            {formatDistanceToNow(mockDate, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--ds-text-secondary)]">
                          <a href="#" className="text-[var(--ds-text-link)] hover:underline">
                            user123
                          </a>{' '}
                          commented on your issue
                        </p>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem>
                    <div className="flex items-start gap-[var(--ds-spacing-md)] flex-1">
                      <div className="h-2 w-2 rounded-full bg-[var(--ds-accent-success)] mt-2" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                          <span className="font-semibold text-[var(--ds-text-primary)]">
                            Pull request merged
                          </span>
                          <span className="text-xs text-[var(--ds-text-tertiary)]">
                            {formatDistanceToNow(mockDate, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--ds-text-secondary)]">
                          Your pull request{' '}
                          <a href="#" className="text-[var(--ds-text-link)] hover:underline">
                            #456
                          </a>{' '}
                          was merged
                        </p>
                      </div>
                    </div>
                  </ListItem>
                  <ListItem isLast>
                    <div className="flex items-start gap-[var(--ds-spacing-md)] flex-1">
                      <div className="h-2 w-2 rounded-full bg-[var(--ds-accent-primary)] mt-2" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-[var(--ds-spacing-sm)] mb-1">
                          <span className="font-semibold text-[var(--ds-text-primary)]">
                            New follower
                          </span>
                          <span className="text-xs text-[var(--ds-text-tertiary)]">
                            {formatDistanceToNow(mockDate, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--ds-text-secondary)]">
                          <a href="#" className="text-[var(--ds-text-link)] hover:underline">
                            developer456
                          </a>{' '}
                          started following you
                        </p>
                      </div>
                    </div>
                  </ListItem>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}


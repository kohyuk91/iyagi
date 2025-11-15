import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { scenes, projects, shots } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectScenes = await db
      .select()
      .from(scenes)
      .where(eq(scenes.projectId, projectId))
      .orderBy(asc(scenes.displayOrder));

    return NextResponse.json(projectScenes);
  } catch (error) {
    console.error('Error fetching scenes:', error);
    return NextResponse.json({ error: 'Failed to fetch scenes' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, displayOrder } = body;

    if (!title || !displayOrder) {
      return NextResponse.json(
        { error: 'Missing required fields: title, displayOrder' },
        { status: 400 },
      );
    }

    const [newScene] = await db
      .insert(scenes)
      .values({
        projectId,
        title,
        description: description || null,
        displayOrder,
      })
      .returning();

    if (newScene) {
      await db.insert(shots).values({
        sceneId: newScene.id,
        title: 'Shot 1',
        description: null,
        displayOrder: '1',
      });
    }

    return NextResponse.json(newScene, { status: 201 });
  } catch (error) {
    console.error('Error creating scene:', error);
    return NextResponse.json({ error: 'Failed to create scene' }, { status: 500 });
  }
}


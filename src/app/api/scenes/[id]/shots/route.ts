import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { shots, scenes, projects } from '@/lib/db/schema';
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

    const { id: sceneId } = await params;

    const [scene] = await db.select().from(scenes).where(eq(scenes.id, sceneId)).limit(1);

    if (!scene) {
      return NextResponse.json({ error: 'Scene not found' }, { status: 404 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, scene.projectId), eq(projects.userId, userId)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const sceneShots = await db
      .select()
      .from(shots)
      .where(eq(shots.sceneId, sceneId))
      .orderBy(asc(shots.displayOrder));

    return NextResponse.json(sceneShots);
  } catch (error) {
    console.error('Error fetching shots:', error);
    return NextResponse.json({ error: 'Failed to fetch shots' }, { status: 500 });
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

    const { id: sceneId } = await params;

    const [scene] = await db.select().from(scenes).where(eq(scenes.id, sceneId)).limit(1);

    if (!scene) {
      return NextResponse.json({ error: 'Scene not found' }, { status: 404 });
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, scene.projectId), eq(projects.userId, userId)))
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

    const [newShot] = await db
      .insert(shots)
      .values({
        sceneId,
        title,
        description: description || null,
        displayOrder,
      })
      .returning();

    return NextResponse.json(newShot, { status: 201 });
  } catch (error) {
    console.error('Error creating shot:', error);
    return NextResponse.json({ error: 'Failed to create shot' }, { status: 500 });
  }
}


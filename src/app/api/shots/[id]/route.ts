import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { shots, scenes, projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: shotId } = await params;

    const [shot] = await db.select().from(shots).where(eq(shots.id, shotId)).limit(1);

    if (!shot) {
      return NextResponse.json({ error: 'Shot not found' }, { status: 404 });
    }

    const [scene] = await db.select().from(scenes).where(eq(scenes.id, shot.sceneId)).limit(1);

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

    return NextResponse.json({
      ...shot,
      scene: {
        id: scene.id,
        title: scene.title,
      },
      project: {
        id: project.id,
        title: project.title,
      },
    });
  } catch (error) {
    console.error('Error fetching shot:', error);
    return NextResponse.json({ error: 'Failed to fetch shot' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: shotId } = await params;
    const body = await request.json();
    const { imageUrl } = body;

    const [shot] = await db.select().from(shots).where(eq(shots.id, shotId)).limit(1);

    if (!shot) {
      return NextResponse.json({ error: 'Shot not found' }, { status: 404 });
    }

    const [scene] = await db.select().from(scenes).where(eq(scenes.id, shot.sceneId)).limit(1);

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

    const [updatedShot] = await db
      .update(shots)
      .set({
        imageUrl: imageUrl || null,
        updatedAt: sql`NOW()`,
      })
      .where(eq(shots.id, shotId))
      .returning();

    return NextResponse.json(updatedShot);
  } catch (error) {
    console.error('Error updating shot:', error);
    return NextResponse.json({ error: 'Failed to update shot' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: shotId } = await params;

    const [shot] = await db.select().from(shots).where(eq(shots.id, shotId)).limit(1);

    if (!shot) {
      return NextResponse.json({ error: 'Shot not found' }, { status: 404 });
    }

    const [scene] = await db.select().from(scenes).where(eq(scenes.id, shot.sceneId)).limit(1);

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

    await db.delete(shots).where(eq(shots.id, shotId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shot:', error);
    return NextResponse.json({ error: 'Failed to delete shot' }, { status: 500 });
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { projects, scenes, shots } from '@/lib/db/schema';
import { eq, desc, asc } from 'drizzle-orm';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.createdAt));

    const projectsWithImages = await Promise.all(
      userProjects.map(async (project) => {
        const firstScene = await db
          .select()
          .from(scenes)
          .where(eq(scenes.projectId, project.id))
          .orderBy(asc(scenes.displayOrder))
          .limit(1);

        if (firstScene.length === 0) {
          return { ...project, imageUrl: null };
        }

        const firstShot = await db
          .select()
          .from(shots)
          .where(eq(shots.sceneId, firstScene[0].id))
          .orderBy(asc(shots.displayOrder))
          .limit(1);

        return {
          ...project,
          imageUrl: firstShot.length > 0 ? firstShot[0].imageUrl : null,
        };
      }),
    );

    return NextResponse.json(projectsWithImages);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, aspectRatio, artStyle, artStyleImage } = body;

    if (!title || !aspectRatio || !artStyle) {
      return NextResponse.json(
        { error: 'Missing required fields: title, aspectRatio, artStyle' },
        { status: 400 },
      );
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        userId,
        title,
        aspectRatio,
        artStyle,
        artStyleImage: artStyleImage || null,
      })
      .returning();

    if (newProject) {
      const [newScene] = await db
        .insert(scenes)
        .values({
          projectId: newProject.id,
          title: 'Scene 1',
          description: null,
          displayOrder: '1',
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
    }

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}


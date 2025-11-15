import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { db } from '@/lib/db';
import { shots, scenes, projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '';
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
const CLOUDFLARE_R2_BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || '';
const CLOUDFLARE_R2_PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL || '';

let s3Client: S3Client | null = null;

if (
  CLOUDFLARE_ACCOUNT_ID &&
  CLOUDFLARE_R2_ACCESS_KEY_ID &&
  CLOUDFLARE_R2_SECRET_ACCESS_KEY &&
  CLOUDFLARE_R2_BUCKET_NAME
) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shotId = searchParams.get('shotId');

    if (!shotId) {
      return NextResponse.json({ error: 'Missing shotId' }, { status: 400 });
    }

    if (!s3Client) {
      return NextResponse.json({ images: [] });
    }

    const prefix = `images/${shotId}/`;

    const command = new ListObjectsV2Command({
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);

    const images =
      response.Contents?.map((object) => {
        if (!object.Key) return null;
        const fileName = object.Key.split('/').pop() || '';
        return {
          id: object.Key,
          url: `${CLOUDFLARE_R2_PUBLIC_URL}/${object.Key}`,
          title: fileName,
          createdAt: object.LastModified?.toISOString() || new Date().toISOString(),
        };
      })
        .filter(Boolean)
        .sort((a, b) => {
          if (!a || !b) return 0;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }) || [];

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    const shotId = searchParams.get('shotId');

    if (!imageId || !shotId) {
      return NextResponse.json({ error: 'Missing imageId or shotId' }, { status: 400 });
    }

    if (!s3Client) {
      return NextResponse.json({ error: 'S3 client not configured' }, { status: 500 });
    }

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

    const deleteCommand = new DeleteObjectCommand({
      Bucket: CLOUDFLARE_R2_BUCKET_NAME,
      Key: imageId,
    });

    await s3Client.send(deleteCommand);

    if (shot.imageUrl && shot.imageUrl.includes(imageId)) {
      await db
        .update(shots)
        .set({
          imageUrl: null,
          updatedAt: new Date(),
        })
        .where(eq(shots.id, shotId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}


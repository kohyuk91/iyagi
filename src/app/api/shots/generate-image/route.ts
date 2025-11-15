import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { db } from '@/lib/db';
import { shots, scenes, projects } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

const BFL_API_URL = process.env.BFL_API_URL || 'https://api.bfl.ai';
const BFL_API_KEY = process.env.BFL_API_KEY || '';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shotId, prompt, tool } = body;

    if (!shotId || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!BFL_API_KEY) {
      return NextResponse.json({ error: 'BFL_API_KEY is not configured' }, { status: 500 });
    }

    if (!s3Client) {
      return NextResponse.json({ error: 'CloudFlare R2 not configured' }, { status: 500 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    const aspectRatio = project.aspectRatio || '16:9';

    console.log('Project aspectRatio:', project.aspectRatio);
    console.log('Using aspectRatio:', aspectRatio);

    const parseAspectRatio = (ratio: string): { width: number; height: number } => {
      const [w, h] = ratio.split(':').map(Number);
      if (!w || !h) {
        return { width: 1024, height: 768 };
      }

      const aspectRatioValue = w / h;
      const baseSize = 1024;

      let width = baseSize;
      let height = Math.round(baseSize / aspectRatioValue);

      width = Math.round(width / 32) * 32;
      height = Math.round(height / 32) * 32;

      width = Math.max(256, Math.min(1440, width));
      height = Math.max(256, Math.min(1440, height));

      if (width % 32 !== 0) {
        width = Math.floor(width / 32) * 32;
      }
      if (height % 32 !== 0) {
        height = Math.floor(height / 32) * 32;
      }

      return { width, height };
    };

    const { width, height } = parseAspectRatio(aspectRatio);

    console.log('Calculated dimensions:', { width, height });

    const modelEndpoint = `${BFL_API_URL}/v1/flux-dev`;

    const requestBody = {
      prompt: prompt.trim(),
      width,
      height,
    };

    console.log('BFL API request body:', JSON.stringify(requestBody, null, 2));
    console.log('BFL API endpoint:', modelEndpoint);

    const bflResponse = await fetch(modelEndpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-key': BFL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!bflResponse.ok) {
      let errorMessage = 'Failed to generate image';
      try {
        const errorData = await bflResponse.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('BFL API error response:', JSON.stringify(errorData, null, 2));
      } catch {
        const errorText = await bflResponse.text();
        console.error('BFL API error text:', errorText);
        errorMessage = errorText || errorMessage;
      }
      return NextResponse.json({ error: errorMessage }, { status: bflResponse.status });
    }

    const initialData = await bflResponse.json();
    console.log('BFL API initial response:', JSON.stringify(initialData, null, 2));
    const pollingUrl = initialData.polling_url;

    if (!pollingUrl) {
      return NextResponse.json({ error: 'No polling URL received from BFL API' }, { status: 500 });
    }

    let result;
    let attempts = 0;
    const maxAttempts = 120;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const pollResponse = await fetch(pollingUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-key': BFL_API_KEY,
        },
      });

      if (!pollResponse.ok) {
        const errorText = await pollResponse.text();
        console.error('BFL polling error:', errorText);
        return NextResponse.json({ error: 'Failed to poll image status' }, { status: 500 });
      }

      result = await pollResponse.json();

      if (result.status === 'Ready') {
        console.log('BFL API final result:', JSON.stringify(result, null, 2));
        break;
      } else if (result.status === 'Error' || result.status === 'Failed') {
        return NextResponse.json({ error: result.message || 'Image generation failed' }, { status: 500 });
      }

      attempts++;
    }

    if (!result || result.status !== 'Ready' || !result.result?.sample) {
      return NextResponse.json({ error: 'Image generation timeout or failed' }, { status: 500 });
    }

    const bflImageUrl = result.result.sample;

    const imageResponse = await fetch(bflImageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to download generated image' }, { status: 500 });
    }

    const imageBlob = await imageResponse.blob();

    if (!imageBlob || imageBlob.size === 0) {
      return NextResponse.json({ error: 'Empty image received from BFL API' }, { status: 500 });
    }

    const fileName = `${shotId}/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const key = `images/${fileName}`;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: CLOUDFLARE_R2_BUCKET_NAME!,
          Key: key,
          Body: Buffer.from(await imageBlob.arrayBuffer()),
          ContentType: 'image/png',
        }),
      );
    } catch (r2Error) {
      console.error('R2 upload error:', r2Error);
      return NextResponse.json({ error: 'Failed to upload image to R2' }, { status: 500 });
    }

    const imageUrl = `${CLOUDFLARE_R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


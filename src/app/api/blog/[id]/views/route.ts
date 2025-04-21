import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// Increment view count for a post (server-side only)
export async function POST(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const postId = params.id;
  // Optionally, you can use cookies/session/IP to avoid double-counting views per user/session
  await prisma.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });
  return NextResponse.json({ success: true });
}

export function GET(): NextResponse {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

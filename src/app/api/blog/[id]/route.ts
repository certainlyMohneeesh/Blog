import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET handler: fetch a single blog post by id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true },
  });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json({ post });
}

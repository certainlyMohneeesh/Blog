import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET handler: fetch comments for a post
export async function GET(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const postId = params.id;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: 'Post not found', comments: [] }, { status: 404 });
  }
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });
  return NextResponse.json({ comments });
}

// POST handler: add a comment to a post
export async function POST(req: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const postId = params.id;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  const { content } = await req.json();
  const comment = await prisma.comment.create({
    data: {
      content,
      user: { connect: { id: user.id } },
      post: { connect: { id: postId } },
    },
    include: { user: true },
  });
  return NextResponse.json({ success: true, comment });
}

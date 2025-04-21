import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/db';

// Only allow GET for fetching comments and POST for adding comments. All other methods return 405.

// Get comments for a post
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
  return NextResponse.json({ comments });
}

// Add a comment to a post
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const postId = params.id;
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Find user by email to get userId
  const user = await prisma.user.findUnique({ where: { email: session.user.email ?? undefined } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const { content } = await req.json();
  const comment = await prisma.comment.create({
    data: {
      content,
      postId,
      userId: user.id,
    },
    include: { user: true },
  });
  return NextResponse.json({ success: true, comment });
}

export function PUT() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export function DELETE() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

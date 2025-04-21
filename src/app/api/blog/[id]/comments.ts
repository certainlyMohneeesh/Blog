import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/db';

// Only allow POST for adding comments. All other methods return 405.

// Add a comment to a post
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  const postId = params.id;
  const { content } = await req.json();
  if (!content || content.trim().length < 1) {
    return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
  }
  const comment = await prisma.comment.create({
    data: { userId: user.id, postId, content },
    include: { user: true },
  });
  return NextResponse.json({ success: true, comment });
}

export function GET() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export function PUT() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export function DELETE() {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

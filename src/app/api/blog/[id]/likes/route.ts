import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/db';

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
  const { action } = await req.json();
  if (action === 'like') {
    await prisma.like.upsert({
      where: { userId_postId: { userId: user.id, postId } },
      update: {},
      create: { userId: user.id, postId },
    });
  } else if (action === 'unlike') {
    await prisma.like.deleteMany({ where: { userId: user.id, postId } });
  }
  const likes = await prisma.like.count({ where: { postId } });
  await prisma.post.update({ where: { id: postId }, data: { likes } });
  return NextResponse.json({ success: true, likes });
}

export function GET(): NextResponse {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export function PUT(): NextResponse {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

export function DELETE(): NextResponse {
  return new NextResponse('Method Not Allowed', { status: 405 });
}

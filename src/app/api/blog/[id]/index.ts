import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/db';

// Get a single blog post (public)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  
  const postId = params.id;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true },
  });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ post });
}

// Update a blog post (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const postId = params.id;
  const { title, content, published, featured } = await req.json();
  const post = await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      content,
      published: published ?? true,
      featured: featured ?? false,
    },
    include: { author: true },
  });
  return NextResponse.json({ success: true, post });
}

// Delete a blog post (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const postId = params.id;
  await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json({ success: true });
}

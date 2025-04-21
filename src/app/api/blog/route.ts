import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/db';

// Get all blog posts (public)
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ posts });
}

// Create a new blog post (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { title, content, published, featured } = await req.json();
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
  }
  const post = await prisma.post.create({
    data: {
      title,
      content,
      published: published ?? true,
      featured: featured ?? false,
      authorId: user.id,
    },
    include: { author: true },
  });
  return NextResponse.json({ success: true, post });
}

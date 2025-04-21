import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    if ((session.user as any).role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    // First ensure the user exists
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || 'Anonymous',
          image: session.user.image || '',
          role: 'admin',
        }
      });
    }

    const data = await request.json();
    
    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      post,
      redirectTo: '/'
    });

  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create post" },
      { status: 500 }
    );
  }
  finally {
    revalidatePath('/');
  }
}

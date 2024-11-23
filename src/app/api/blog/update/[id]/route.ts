import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 }
      );
    }

    if (!params.id) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await prisma.post.update({
      where: { id: params.id },
      data: { title, content },
    });

    return NextResponse.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Error updating post:", error);
  
    // Ensure error is an instance of Error before accessing its properties
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Failed to update post", error: error.message },
        { status: 500 }
      );
    }
  
    // Handle cases where error is not an instance of Error
    return NextResponse.json(
      { message: "Failed to update post", error: "Unknown error occurred" },
      { status: 500 }
    );
  }
  
}

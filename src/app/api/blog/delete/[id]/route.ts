import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(
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
    if ((session.user as any).role !== 'admin') {
      return NextResponse.json(
        { message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }
    // Access the `id` from the `params` object
    const { id } = params;
    // Check if post exists
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    // Cascade delete related Likes and Comments
    await prisma.like.deleteMany({ where: { postId: id } });
    await prisma.comment.deleteMany({ where: { postId: id } });
    // Try to delete the post
    try {
      await prisma.post.delete({ where: { id } });
      return NextResponse.json({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (deleteError) {
      console.error("Error deleting post (unexpected):", deleteError);
      return NextResponse.json(
        { message: "Failed to delete post (unexpected error)" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error deleting post (outer):", error);
    return NextResponse.json(
      { message: "Failed to delete post (unexpected error)" },
      { status: 500 }
    );
  }
}

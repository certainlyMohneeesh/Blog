import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json();
    
    const post = await prisma.post.update({
      where: { id: params.id },
      data: {
        likes: action === "like" ? { increment: 1 } : { decrement: 1 },
      },
    });

    return NextResponse.json({ success: true, likes: post.likes });
  } catch (error) {
    console.error("Error updating likes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ success: true, views: post.views });
  } catch (error) {
    console.error("Error updating views:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update views" },
      { status: 500 }
    );
  }
}
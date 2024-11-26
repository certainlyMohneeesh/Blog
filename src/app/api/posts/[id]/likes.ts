import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
    const { id, action } = await req.json();
  
    try {
      await prisma.post.update({
        where: { id },
        data: {
          likes: action === "like" ? { increment: 1 } : { decrement: 1 },
        },
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 500 }
      );
    }
  }

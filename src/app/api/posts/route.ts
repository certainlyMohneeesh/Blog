import { NextResponse } from "next/server";
import prisma from "@/lib/db"; // Adjust the import based on your project structureimport { Post } from "@prisma/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "3", 10);

  const posts = await prisma.post.findMany({
    where: { published: true },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, image: true },
      },
    },
  });

  return NextResponse.json(posts);
}
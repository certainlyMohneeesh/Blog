import prisma from "@/lib/db";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";

export default async function BlogsPage() {
  const session = await getServerSession();
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="container mx-auto px-4 py-6 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">All Blog Posts</h1>
        {session && (
          <Button size="sm" className="w-full sm:w-auto" asChild>
            <Link href="/admin/new">Create New Post</Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

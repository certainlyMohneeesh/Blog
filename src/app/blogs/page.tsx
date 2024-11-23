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
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">All Blog Posts</h1>
        {session && (
          <Button asChild>
            <Link href="/admin/new">Create New Post</Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

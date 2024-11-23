import { Post } from "@/types";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import AnimatedSection from "@/components/animations/AnimatedSection";
import { SlideUp } from "@/components/animations/SlideUp";

async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    take: 3,
    orderBy: {
      createdAt: 'desc'
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true
    }
  });

  return posts;
}

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="min-h-screen">
      <AnimatedSection>
        <section className="h-[80vh] flex items-center justify-center">
          <div className="text-center">
          <SlideUp>
            <h1 className="text-6xl font-bold mb-4">Welcome to My Blog</h1>
            <p className="text-xl text-gray-600 mb-8">Sharing thoughts and experiences</p>
            </SlideUp>
            <Button asChild>
              <Link href="/blogs">View All Posts</Link>
            </Button>
          </div>
        </section>
      </AnimatedSection>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Posts</h2>
          {featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <AnimatedSection key={post.id}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {post.content.substring(0, 150)}...
                    </p>
                    <div className="flex justify-between items-center">
                      <Button variant="outline" asChild>
                        <Link href={`/blog/${post.id}`}>Read More</Link>
                      </Button>
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </Card>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection>
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600 mb-4">
                  No blog posts available yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Stay tuned! New content will be published soon.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/blogs">Check All Posts</Link>
                </Button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
}

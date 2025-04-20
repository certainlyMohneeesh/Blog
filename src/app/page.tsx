import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AnimatedSection from "@/components/animations/AnimatedSection";
import { SlideUp } from "@/components/animations/SlideUp";
import BlogCard from "@/components/blog/BlogCard";
import { Post } from "@/types";

export const dynamic = 'force-dynamic'; // Dynamically render on each request

async function getFeaturedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      take: 3,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

        // Add logging to see exact posts
        console.log('Featured Posts:', JSON.stringify(posts, null, 2));

    return posts;
  } catch (error) {
    console.error("Failed to fetch featured posts:", error);
    return [];
  }
}


export default async function HomePage() {
  // Fetch data directly within the component
  const featuredPosts = await getFeaturedPosts();

  console.log('Featured Posts Count:', featuredPosts.length);
  console.log('Featured Posts Details:', JSON.stringify(featuredPosts, null, 2));

  return (
    <div className="min-h-screen">
      <AnimatedSection>
        <section className="h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <SlideUp>
              <h1 className="text-6xl font-bold mb-4">Welcome to My Blog</h1>
              <p className="text-xl text-gray-600 mb-8">Not your typical technical blogpost just sharing my thoughts on tech and life.</p>
            </SlideUp>
            <Button asChild>
              <Link href="/blogs">View All Posts</Link>
            </Button>
          </div>
        </section>
      </AnimatedSection>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Posts</h2>
          {featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post: Post) => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  views={0} // Default views if not fetched yet
                  likes={0} // Default likes if not fetched yet
                />
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

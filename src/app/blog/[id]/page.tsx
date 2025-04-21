import prisma from "@/lib/db";
import BlogContent from "@/components/blog/BlogContent";
import { notFound } from "next/navigation";

export default async function BlogPage(props: { params: { id: string } }) {
  const { params } = await Promise.resolve(props);
  if (!params.id) {
    notFound();
  }
  const views = 0; 
  const likes = 0;
  const post = await prisma.post.findUnique({
    where: { 
      id: params.id 
    },
    include: {
      author: true
    }
  });

  if (!post) {
    notFound();
  }

  const formattedPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    createdAt: post.createdAt,
    author: {
      name: post.author.name || 'Anonymous',
      image: post.author.image || '/default-avatar.png'
    }
  };

  return <BlogContent post={formattedPost} views={views} likes={likes} />;
}

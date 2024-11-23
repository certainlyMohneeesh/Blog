import BlogForm from "@/components/blog/BlogForm";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function EditBlogPage(props: Props) {
  // Explicitly await params to avoid the sync-access issue
  const { id } = await Promise.resolve(props.params); // Explicitly resolving params

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });

  if (!post) {
    notFound();
  }

  const formData = {
    id: post.id,
    title: post.title,
    content: post.content,
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>
      <BlogForm initialData={formData} isEditing />
    </div>
  );
}
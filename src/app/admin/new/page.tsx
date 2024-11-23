import BlogForm from "@/components/blog/BlogForm";

export default function NewBlogPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <BlogForm />
    </div>
  );
}

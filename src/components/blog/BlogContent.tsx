"use client";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface BlogContentProps {
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: {
      name: string;
      image: string;
    };
  };
}

export default function BlogContent({ post }: BlogContentProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/blog/delete/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      
      router.push("/blogs");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post",
      });
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto py-10 max-w-4xl"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center gap-2">
            {post.author.image && (
              <img 
                src={post.author.image} 
                alt={post.author.name} 
                className="w-8 h-8 rounded-full"
              />
            )}
            <span>{post.author.name}</span>
          </div>
          <time>{new Date(post.createdAt).toLocaleDateString()}</time>
        </div>
      </div>

      <div className="prose max-w-none mb-8">
      <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {session && (
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href={`/admin/edit/${post.id}`}>Edit Post</Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Post
          </Button>
        </div>
      )}
    </motion.article>
  );
}

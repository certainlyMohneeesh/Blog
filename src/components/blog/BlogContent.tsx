"use client";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
// import Editor from "../editor/editor";
// import { defaultEditorExtensions } from "@/components/editor/editor"; 

interface BlogContentProps {
  views: number;
  likes: number;
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

export default function BlogContent({ post, views: initialViews, likes: initialLikes }: BlogContentProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [views, setViews] = useState(initialViews);
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

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

  // Increment views on page load
  useEffect(() => {
    const incrementViews = async () => {
      try {
        const response = await fetch(`/api/posts/${post.id}/views`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to increment views");
        }
  
        const data = await response.json();
        if (data.success) {
          // I can use either approach:
          setViews((prev) => prev + 1);  // Client-side increment for faster UI response
          // OR
          // setViews(data.views);       // Server value guarnteed accuracy
        }
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };
  
    incrementViews();
  }, [post.id]);

// Like functionality
const toggleLike = async () => {
  try {
    const response = await fetch(`/api/posts/${post.id}/likes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: liked ? "unlike" : "like",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to toggle like");
    }

    const data = await response.json();
    if (data.success) {
      // I can use either approach:
      setLikes((prev) => (liked ? prev - 1 : prev + 1));  // Client-side calculation
      // OR
      // setLikes(data.likes);                            // Server value
      setLiked(!liked);
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update like status",
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

      <div className="prose max-w-none mb-8 whitespace-pre-wrap">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      <div className="meta flex items-center gap-4 mt-4">
        <span>{views} views</span>
        <Button onClick={toggleLike} variant="outline" size="sm">
          <ThumbsUp className={`mr-2 ${liked ? "text-blue-500" : ""}`} />
          {liked ? "Unlike" : "Like"} ({likes})
        </Button>
      </div>

      {session && (
        <div className="flex gap-4 mt-4">
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
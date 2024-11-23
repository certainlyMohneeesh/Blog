"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BlogActionsProps {
  postId: string;
}

export default function BlogActions({ postId }: BlogActionsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleEdit = () => {
    router.push(`/admin/edit/${postId}`);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    
    if (!confirmed) return;

    try {
      const response = await fetch('/api/blog/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: postId })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Post deleted successfully"
        });
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete post"
      });
    }
  };

  return (
    <div className="flex gap-4">
      <Button onClick={handleEdit}>Edit Post</Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete Post
      </Button>
    </div>
  );
}

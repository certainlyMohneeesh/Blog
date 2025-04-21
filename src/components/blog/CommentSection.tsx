"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
}

export default function CommentSection({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/api/blog/${postId}/comments`)
      .then(res => res.json())
      .then(data => {
        if (data.comments) setComments(data.comments);
        else if (data.error) toast({ variant: 'destructive', title: 'Error', description: data.error });
      })
      .catch(() => {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load comments.' });
      });
  }, [postId, toast]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blog/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments((prev) => [...prev, data.comment]);
        setNewComment('');
      } else if (data.error) {
        toast({ variant: 'destructive', title: 'Error', description: data.error });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to add comment.' });
      }
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add comment.' });
    }
    setLoading(false);
  };

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-lg mb-2">Comments</h3>
      {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
      <ul className="space-y-4 mb-4">
        {comments.map((c) => (
          <li key={c.id} className="flex items-start gap-3">
            <img src={c.user.image || '/default-avatar.png'} alt={c.user.name} className="w-8 h-8 rounded-full border" />
            <div>
              <div className="font-medium">{c.user.name}</div>
              <div className="text-sm text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</div>
              <div className="mt-1">{c.content}</div>
            </div>
          </li>
        ))}
      </ul>
      {session?.user && (
        <form onSubmit={handleAddComment} className="flex gap-2 items-center">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !newComment.trim()}>Comment</Button>
        </form>
      )}
      {!session?.user && <p className="text-sm mt-2">Sign in to comment.</p>}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BlogFormProps } from "@/types";


export default function BlogForm({ initialData, isEditing }: BlogFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: '',
    content: ''
  });
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
  });


  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', content: '' };

    if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
      isValid = false;
    }

    if (formData.content.trim().length < 10) {
      newErrors.content = 'Content must be at least 10 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    } 
    setIsLoading(true);
  
    try {
      const endpoint = isEditing
        ? `/api/blog/update/${initialData?.id}`
        : '/api/blog/create';
  
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),  // Remove authorId as it's handled server-side
      });
  
      if (!response.ok) {
        throw new Error('Failed to save blog post');
      }
  
      const data = await response.json();
      
      toast({
        title: isEditing ? "Blog Updated" : "Blog Created",
        description: isEditing
          ? "Your blog post has been updated successfully."
          : "Your blog post has been published successfully.",
      });
      
      router.push('/');
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-lg font-medium">
            Blog Title
          </label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter your blog title"
            disabled={isLoading}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-lg font-medium">
            Blog Content
          </label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Write your blog content..."
            className="min-h-[300px]"
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              isEditing ? 'Update Post' : 'Publish Post'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

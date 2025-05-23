// import Editor from "../editor/editor";

// export const defaultValue = {
//   type: 'doc',
//   content: [
//     {
//       type: 'paragraph',
//       content: []
//     }
//   ]
// }
// const [content, setContent] = useState<string>('')
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BlogFormProps } from "@/types";
import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import MarkdownPreview from "@uiw/react-markdown-preview";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function BlogForm({ initialData, isEditing }: BlogFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ title: "", content: "" });
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", content: "" };

    if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long";
      isValid = false;
    }

    if (formData.content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      const endpoint = isEditing
        ? `/api/blog/update/${initialData?.id}`
        : "/api/blog/create";
  
      const response = await fetch(endpoint, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error("Failed to save blog post");
  
      toast({
        title: isEditing ? "Blog Updated" : "Blog Created",
        description: isEditing
          ? "Your blog post has been updated successfully."
          : "Your blog post has been published successfully.",
      });
  
      router.push("/");
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
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="text-base sm:text-lg font-medium">
              Blog Title
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter your blog title"
              disabled={isLoading}
              required
            />
            {errors.title && (
              <span className="text-sm text-red-500">{errors.title}</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <label htmlFor="content" className="text-base sm:text-lg font-medium">
                Blog Content
              </label>
              <MDEditor
                id="content"
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value || "" }))}
                preview="edit"
                height={300}
                textareaProps={{
                  placeholder: "Write your blog content using Markdown...",
                  disabled: isLoading,
                  required: true,
                }}
              />
              {errors.content && (
                <span className="text-sm text-red-500">{errors.content}</span>
              )}
            </div>

            <div className="w-full md:w-1/2">
              <label htmlFor="preview" className="text-base sm:text-lg font-medium">
                Markdown Preview
              </label>
              <div id="preview" className="w-full min-h-[200px] sm:min-h-[300px] p-3 border rounded-md bg-gray-50 prose max-w-none">
                <MarkdownPreview source={formData.content || "Start typing..."} />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Processing..." : isEditing ? "Update Post" : "Publish Post"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
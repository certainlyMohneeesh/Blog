"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FadeIn } from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { ThumbsUp } from "lucide-react";
import Editor from "../editor/editor";

interface BlogCardProps {
  views: number;
  likes: number;
  post: {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: {
      name: string | null;
      image: string | null;
    };
  };
}

export default function BlogCard({ post, views, likes }: BlogCardProps) {
  return (
    <div className="w-full p-2 sm:p-4">
      <motion.div className="h-full rounded-lg shadow-md hover:shadow-xl transition-shadow">
        <FadeIn>
          <Card className="p-4 sm:p-6 h-full flex flex-col">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-3">
                {post.author.image && (
                  <img
                    src={post.author.image}
                    alt={post.author.name || 'Author'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-600">
                  {post.author.name || 'Anonymous'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">{post.title}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4">
                {post.content.substring(0, 150)}...
              </p>
            </div>

            <div className="meta flex items-center gap-4 mt-4">
              <span>{views} views</span>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-gray-500" />
                <span>{likes}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" size="sm" className="text-sm sm:text-base" asChild>
                <Link href={`/blog/${post.id}`}>Read More</Link>
              </Button>
              <time className="text-xs sm:text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
            </div>
          </Card>
        </FadeIn>
      </motion.div>
    </div>
  );
}

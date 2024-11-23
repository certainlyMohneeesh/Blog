"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="py-4 px-8 bg-white shadow-md"
    >
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">MyBlog</Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/blogs">All Posts</Link>
          </Button>
          {session ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/admin/new">New Post</Link>
              </Button>
              <Button onClick={() => signOut()}>Sign Out</Button>
            </>
          ) : (
            <Button onClick={() => signIn()}>Sign In</Button>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
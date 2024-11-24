"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="py-4 px-8 bg-white shadow-md sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <nav className="flex flex-col sm:flex-row justify-between items-center p-4">
      <div className="w-full sm:w-auto mb-4 sm:mb-0">
        <Link href="/" className="hidden font-bold sm:inline-block">Cyth Blog</Link>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center space-x-6 text-sm font-medium">
          <Button variant="ghost" asChild>
            <Link href="/blogs">All Posts</Link>
          </Button>

                  {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Button variant="ghost" size="sm" className="mr-2">
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">Cyth</span>
          </Link>
        </div>

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
        </div>
      </nav>
    </motion.header>
  );
}
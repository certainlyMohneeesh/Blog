"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex flex-col md:flex-row justify-between items-center py-4">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <Link href="/" className="font-bold text-xl">
              CythBlog
            </Link>
          </div>

          <div className="flex flex-row items-center gap-2">
            <Button variant="ghost" asChild size="sm">
              <Link href="/blogs">All Posts</Link>
            </Button>
             
        {session?.user && (
          <>
            {(session?.user as any).role === "admin" && (
              <div className="flex flex-row gap-2">
                <Button variant="outline" asChild size="sm">
                  <Link href="/admin/new">New Post</Link>
                </Button>
                <Button size="sm" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </div>
            )}
            </>
          )}
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showAuth, setShowAuth] = useState(false);

  // Secret key combination handler
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Show auth when pressing 'Ctrl + Alt + A'
      if (event.ctrlKey && event.altKey && event.key === 'a') {
        setShowAuth(true);
      }
      // Hide auth when pressing 'Escape'
      if (event.key === 'Escape') {
        setShowAuth(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <Header showAuth={showAuth} />
        <AnimatePresence mode="wait">
          <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
        <Footer />
      </div>
      <Toaster />
    </SessionProvider>
  );
}

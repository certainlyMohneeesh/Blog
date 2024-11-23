"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <AnimatePresence mode="wait">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="flex-grow"
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

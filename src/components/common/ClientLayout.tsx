"use client";

import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { useAuthStore } from '@/store/authStore'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const setShowAuth = useAuthStore((state) => state.setShowAuth)

// Secret key combination handler
useEffect(() => {
  function handleKeyPress(e: KeyboardEvent) {
    console.log('Key pressed:', e.key, 'Ctrl:', e.ctrlKey, 'Alt:', e.altKey)
      // Show auth when pressing 'Ctrl + Alt + A'
      if (e.ctrlKey && e.altKey && (e.key === 'a' || e.key === 'A')) {
        window.alert('🔓 Admin Mode Activated!')
        setShowAuth(true)
      }
      // Hide auth when pressing 'Escape'
      if (e.key === 'Escape') {
        window.alert('🔒 Admin Mode Deactivated!')
        setShowAuth(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [setShowAuth])

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <Header/>
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

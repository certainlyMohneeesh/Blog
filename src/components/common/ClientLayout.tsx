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
    
    // Press Ctrl + Alt or Alt + A to enter secret mode
    // Check for Control key specifically
    if (e.key === 'Control' && e.altKey) {
      window.alert('🔓 Admin Mode Activated!')
      setShowAuth(true)
    }
    // Alternative combination using just Alt + A
    if (e.altKey && (e.key === 'a' || e.key === 'A')) {
      window.alert('🔓 Admin Mode Activated!')
      setShowAuth(true)
    }
    // To deactivate press Esc + Alt
    if (e.key === 'Escape' && e.shiftKey) {
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

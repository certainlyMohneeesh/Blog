"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideUpProps {
  children: ReactNode;
  delay?: number;
}

export function SlideUp({ children, delay = 0 }: SlideUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        type: "spring",
        stiffness: 100
      }}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // When the component mounts horizontally across the app,
    // wait a brief tick then remove the loader to ensure full DOM is ready.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Slight delay for dramatic initial loading effect, max 500ms
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="global-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white dark:bg-slate-950"
        >
          {/* Subtle animated dot pulse */}
          <div className="flex gap-2">
            <motion.div 
              className="w-3 h-3 rounded-full bg-navy dark:bg-slate-100"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="w-3 h-3 rounded-full bg-navy dark:bg-slate-100"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div 
              className="w-3 h-3 rounded-full bg-navy dark:bg-slate-100"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

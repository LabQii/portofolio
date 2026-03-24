"use client";

import { motion } from "framer-motion";

interface AnimatedHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function AnimatedHeader({ title, description, className }: AnimatedHeaderProps) {
  return (
    <div className={`w-full ${className ?? ""}`}>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-5xl md:text-[52px] font-bold text-primary leading-[1.15] mb-6"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="text-muted text-lg md:text-[18px] leading-[1.8] w-full"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

interface AnimatedHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function AnimatedHeader({ title, description, className }: AnimatedHeaderProps) {
  return (
    <div className={`max-w-[768px] ${className ?? ""}`}>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="text-5xl md:text-[52px] font-bold text-navy leading-[1.15] mb-6"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
          className="text-slate-600 text-lg md:text-[20px] leading-[1.7]"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

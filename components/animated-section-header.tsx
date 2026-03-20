"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AnimatedSectionHeaderProps {
  title: string;
  href?: string;
}

export default function AnimatedSectionHeader({ title, href }: AnimatedSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between mb-8"
    >
      <h2 className="text-[2.5rem] md:text-[40px] font-bold text-navy leading-[1.2] mb-0">
        {title}
      </h2>
      {href && (
        <Link href={href} className="flex items-center gap-2 group text-navy hover:text-navy/80 font-medium transition-colors">
          <span className="text-[17px]">View all</span>
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </motion.div>
  );
}

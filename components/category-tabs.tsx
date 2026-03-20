"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface CategoryTabsProps {
  categories: string[];
  activeCategory?: string;
}

export default function CategoryTabs({ categories, activeCategory }: CategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-12 border-b border-slate-200 pb-1">
      {/* "All" Tab */}
      <Link href="/projects" className="relative px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200 hover:bg-slate-50 text-slate-600">
        <span className={!activeCategory ? "text-navy" : ""}>All Projects</span>
        {!activeCategory && (
          <motion.div
            layoutId="activeTab"
            className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-navy"
            initial={false}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </Link>

      {/* Dynamic Tabs */}
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <Link
            key={cat}
            href={`/projects?category=${cat}`}
            className="relative px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors duration-200 hover:bg-slate-50 text-slate-600"
          >
            <span className={isActive ? "text-navy" : ""}>{cat}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute left-0 right-0 bottom-[-1px] h-[2px] bg-navy"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}

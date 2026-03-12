"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Code2, Database, Layout, Smartphone, Server, Paintbrush, Globe, Braces, Terminal } from "lucide-react";

import { motion } from "framer-motion";

// Helper function to map tech stack names to icons and colors
const getTechIconInfo = (tech: string) => {
  const t = tech.toLowerCase();

  if (t.includes('react') || t.includes('next')) {
    return { icon: <Braces className="w-3.5 h-3.5" />, bg: "bg-blue-50/80", text: "text-blue-600", dot: "bg-blue-400" };
  } else if (t.includes('node') || t.includes('express')) {
    return { icon: <Server className="w-3.5 h-3.5" />, bg: "bg-green-50/80", text: "text-green-600", dot: "bg-green-400" };
  } else if (t.includes('tailwind') || t.includes('css')) {
    return { icon: <Paintbrush className="w-3.5 h-3.5" />, bg: "bg-cyan-50/80", text: "text-cyan-600", dot: "bg-cyan-400" };
  } else if (t.includes('ai') || t.includes('openai') || t.includes('gpt')) {
    return { icon: <Globe className="w-3.5 h-3.5" />, bg: "bg-purple-50/80", text: "text-purple-600", dot: "bg-purple-400" };
  } else if (t.includes('database') || t.includes('sql') || t.includes('prisma') || t.includes('mongo')) {
    return { icon: <Database className="w-3.5 h-3.5" />, bg: "bg-orange-50/80", text: "text-orange-600", dot: "bg-orange-400" };
  } else if (t.includes('android') || t.includes('mobile') || t.includes('kotlin')) {
    return { icon: <Smartphone className="w-3.5 h-3.5" />, bg: "bg-emerald-50/80", text: "text-emerald-600", dot: "bg-emerald-400" };
  } else if (t.includes('ui') || t.includes('ux') || t.includes('figma')) {
    return { icon: <Layout className="w-3.5 h-3.5" />, bg: "bg-pink-50/80", text: "text-pink-600", dot: "bg-pink-400" };
  } else {
    return { icon: <Terminal className="w-3.5 h-3.5" />, bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" };
  }
};

export default function ProjectCard({ project }: { project: any }) {
  const isNew = project.createdAt && (new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 3600 * 24) <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group border-b border-slate-100 pb-10 last:border-0 last:pb-0 pt-4 relative"
    >
      <Link href={`/projects/${project.slug}`} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start block">
        <div className="w-full md:w-[45%] flex-shrink-0 relative">
          {isNew && (
            <Badge className="absolute -top-3 -right-3 z-10 bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md px-3 py-1 uppercase text-[11px] font-bold tracking-wider">
              New
            </Badge>
          )}
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-transform duration-300 group-hover:shadow-md">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 pt-2">
          <h3 className="text-[28px] font-bold text-slate-900 mb-4 leading-[1.3] group-hover:text-navy transition-colors">
            {project.title}
          </h3>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <Badge className="bg-navy hover:bg-navy/90 text-white font-medium rounded-full px-5 py-1.5 text-[14px]">
              {project.category}
            </Badge>
            {/* Displaying tags or tech stack minimally as requested */}
            <div className="flex flex-wrap gap-2">
              {project.techStack.slice(0, 4).map((tech: string, i: number) => {
                const { icon } = getTechIconInfo(tech);
                const colors = [
                  "bg-blue-50 border-blue-200/60 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300",
                  "bg-emerald-50 border-emerald-200/60 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800/30 dark:text-emerald-300",
                  "bg-violet-50 border-violet-200/60 text-violet-700 dark:bg-violet-900/20 dark:border-violet-800/30 dark:text-violet-300",
                  "bg-amber-50 border-amber-200/60 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800/30 dark:text-amber-300",
                  "bg-rose-50 border-rose-200/60 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800/30 dark:text-rose-300"
                ];
                const colorClass = colors[i % colors.length];
                return (
                  <div key={tech} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-semibold shadow-sm transition-colors ${colorClass}`}>
                    {icon}
                    <span>{tech}</span>
                  </div>
                );
              })}
              {project.techStack.length > 4 && (
                <div className="flex items-center px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-[13px] font-semibold border border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                  +{project.techStack.length - 4}
                </div>
              )}
            </div>
          </div>

          <p className="text-slate-600 text-[18px] leading-[1.7]">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

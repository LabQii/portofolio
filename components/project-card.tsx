"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getTechLogoDetails } from "@/lib/tech-icons";
import TechLogoImage from "@/components/tech-logo-image";
import { useState } from "react";

export default function ProjectCard({
  project,
  customTechLogos = [],
  index = 0
}: {
  project: any;
  customTechLogos?: any[];
  index?: number;
}) {
  const isNew = project.createdAt && (new Date().getTime() - new Date(project.createdAt).getTime()) / (1000 * 3600 * 24) <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group border border-[#dde4ec] relative shadow-md shadow-slate-700/10 hover:shadow-2xl hover:shadow-slate-700/30 rounded-2xl p-6 md:p-8 transition-shadow bg-[#f4f7fa]"
    >
      <Link href={`/projects/${project.slug}`} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start block">
        <div className="w-full md:w-[45%] flex-shrink-0 relative">
          {isNew && (
            <Badge className="absolute -top-3 -right-3 z-10 bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md px-3 py-1 uppercase text-[11px] font-bold tracking-wider">
              New
            </Badge>
          )}
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-transform duration-300">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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
                const logoDetails = getTechLogoDetails(tech, customTechLogos);

                return (
                  <motion.div
                    key={tech}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[13px] font-semibold shadow-sm transition-colors bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 cursor-default"
                  >
                    {logoDetails.type === 'initial' ? (
                      <div className="w-4 h-4 rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {logoDetails.initial}
                      </div>
                    ) : (
                      <div className="relative w-4 h-4">
                        <TechLogoImage
                          src={logoDetails.url}
                          alt={tech}
                          initial={tech.charAt(0).toUpperCase()}
                        />
                      </div>
                    )}
                    <span>{tech}</span>
                  </motion.div>
                );
              })}
              {project.techStack.length > 4 && (
                <div className="flex items-center px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-[13px] font-semibold border border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
                  +{project.techStack.length - 4}
                </div>
              )}
            </div>
          </div>

          <p className="text-slate-600 text-[18px] leading-[1.7] line-clamp-3">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

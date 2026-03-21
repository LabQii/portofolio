"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { getTechLogoDetails } from "@/lib/tech-icons";
import TechLogoImage from "@/components/tech-logo-image";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Play } from "lucide-react";

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
  const [isHoveringPlay, setIsHoveringPlay] = useState(false);
  const [visibleCount, setVisibleCount] = useState(project.techStack.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = project.videoUrl ? getYoutubeId(project.videoUrl) : null;

  // Logic to handle tech stack overflow
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const calculateOverflow = () => {
      if (!containerRef.current) return;
      
      const categoryBadge = containerRef.current.children[0] as HTMLElement;
      const containerWidth = containerRef.current.offsetWidth;
      let currentWidth = categoryBadge ? categoryBadge.offsetWidth + 12 : 0; // category plus gap-3 (12px)
      let count = 0;
      const badgeWidth = 45; // Approximate width of the +N badge

      // Temporarily unhide all items to measure them accurately
      itemRefs.current.forEach(item => {
        if (item) {
          item.classList.remove('hidden');
          item.classList.remove('sr-only');
          item.classList.remove('invisible');
        }
      });

      for (let i = 0; i < itemRefs.current.length; i++) {
        const item = itemRefs.current[i];
        if (!item) continue;
        
        const itemWidth = item.offsetWidth + 12; // width + gap
        const needsBadge = i < itemRefs.current.length - 1;
        
        if (currentWidth + itemWidth + (needsBadge ? badgeWidth : 0) > containerWidth) {
          break;
        }
        currentWidth += itemWidth;
        count++;
      }

      // Restore hidden states manually to prevent layout break if React skips render
      itemRefs.current.forEach((item, i) => {
        if (item) {
          if (i >= count) {
             item.classList.add('hidden');
          } else {
             item.classList.remove('hidden');
          }
        }
      });

      setVisibleCount(count);
    };

    calculateOverflow();
    
    // Instead of just window resize, use ResizeObserver for any container size changes
    const resizeObserver = new ResizeObserver(() => {
      calculateOverflow();
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [project.techStack]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group border border-[#dde4ec] relative shadow-md shadow-slate-700/10 hover:shadow-2xl hover:shadow-slate-700/30 rounded-2xl p-6 md:p-8 transition-shadow bg-[#f4f7fa]"
    >
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        <div className="w-full md:w-[45%] flex-shrink-0 relative">
          {isNew && (
            <Badge className="absolute -top-3 -right-3 z-10 bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md px-3 py-1 uppercase text-[11px] font-bold tracking-wider">
              New
            </Badge>
          )}
          <Link href={`/projects/${project.slug}`} className="block relative aspect-[16/10] overflow-hidden rounded-xl bg-slate-100 shadow-sm transition-transform duration-300">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Link>

          {project.videoUrl && (
            <div className="absolute bottom-3 right-3 z-20 flex flex-col items-end">
              <AnimatePresence>
                {isHoveringPlay && videoId && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="mb-3 w-[280px] aspect-video bg-black rounded-[10px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.20)] border border-white/10"
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1`}
                      className="w-full h-full pointer-events-none"
                      allow="autoplay"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Link 
                href={`/projects/${project.slug}`}
                title="Video Demo"
                onMouseEnter={() => setIsHoveringPlay(true)}
                onMouseLeave={() => setIsHoveringPlay(false)}
                className="w-10 h-10 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center text-[#ef4444] shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="flex-1 pt-2 overflow-hidden w-full">
          <Link href={`/projects/${project.slug}`}>
            <h3 className="text-[28px] font-bold text-slate-900 mb-4 leading-[1.3] group-hover:text-navy transition-colors">
              {project.title}
            </h3>
          </Link>

          {/* Row of Category + Tech Stack */}
          <div ref={containerRef} className="flex flex-nowrap items-center gap-3 mb-6 overflow-hidden w-full">
            <Badge className="bg-navy hover:bg-navy/90 text-white font-medium rounded-xl px-4 py-1.5 text-[14px] shrink-0">
              {project.category}
            </Badge>

            {/* Tech Stack items in the same row */}
            {project.techStack.map((tech: string, i: number) => {
              const logoDetails = getTechLogoDetails(tech, customTechLogos);
              const isVisible = i < visibleCount;

              return (
                <div
                  key={`${tech}-${i}`}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[13px] font-semibold shadow-sm transition-colors bg-slate-50 border-slate-200 text-slate-700 whitespace-nowrap shrink-0 ${!isVisible ? 'hidden' : ''}`}
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
                </div>
              );
            })}
            {project.techStack.length > visibleCount && (
              <div className="bg-[#1e293b] text-white rounded-full text-[12px] font-bold px-[10px] py-[4px] whitespace-nowrap shrink-0">
                +{project.techStack.length - visibleCount}
              </div>
            )}
          </div>

          <p className="text-slate-600 text-[18px] leading-[1.7] line-clamp-3">
            {project.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

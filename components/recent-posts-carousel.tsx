"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RecentPostsCarousel({ posts: initialPosts }: { posts: any[] }) {
  if (!initialPosts || initialPosts.length === 0) {
    return <p className="text-muted-foreground italic">No posts yet. Check back soon!</p>;
  }

  const displayPosts = initialPosts;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayPosts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered, displayPosts.length]);

  const activePost = displayPosts[currentIndex];

  return (
    <div
      className="flex flex-col md:flex-row gap-8 md:gap-10 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Area: Carousel */}
      <div className="w-full md:w-[55%] lg:max-w-[600px] flex flex-col overflow-hidden">
        {/* Coverflow container */}
        <div className="relative w-full h-[260px] md:h-[300px] flex items-center justify-center overflow-visible">
          {displayPosts.map((post, idx) => {
            const total = displayPosts.length;
            let dist = idx - currentIndex;

            // Normalize distance so that closest side is preferred
            if (dist < -Math.floor(total / 2)) dist += total;
            if (dist > Math.floor(total / 2)) dist -= total;

            const isActive = dist === 0;
            const isRight = dist === 1;
            const isLeft = dist === -1;

            let positioningClass = "opacity-0 scale-95 z-0 pointer-events-none translate-x-0";
            if (isActive) {
              positioningClass = "opacity-100 scale-100 z-30 translate-x-0 pointer-events-auto shadow-2xl shadow-slate-700/40";
            } else if (isRight) {
              positioningClass = "opacity-0 md:opacity-40 scale-90 z-20 translate-x-0 md:translate-x-[60%] pointer-events-none md:pointer-events-auto shadow-lg shadow-slate-700/20 cursor-pointer";
            } else if (isLeft) {
              positioningClass = "opacity-0 md:opacity-40 scale-90 z-20 translate-x-0 md:-translate-x-[60%] pointer-events-none md:pointer-events-auto shadow-lg shadow-slate-700/20 cursor-pointer";
            }

            return (
              <div
                key={`${post.id}-${idx}`}
                className={`absolute w-[80%] md:w-[75%] h-[260px] md:h-[300px] rounded-2xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer ${positioningClass} ${post.imageFit === 'contain' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100'}`}
                style={{ boxShadow: '0 2px 12px rgba(15, 36, 66, 0.08)' }}
                onClick={() => {
                  if (isActive) return;
                  setCurrentIndex(idx);
                }}
              >
                <div className={`absolute inset-0 ${post.imageFit === 'contain' ? 'p-4' : ''}`}>
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className={`
                      absolute inset-0 w-full h-full
                      ${post.imageFit === 'contain' ? 'object-contain' : 'object-cover'}
                      ${post.imagePosition === 'center' ? 'object-center' :
                        post.imagePosition === 'bottom' ? 'object-bottom' : 'object-top'}
                      transition-all duration-500 hover:scale-[1.03]
                      ${isActive ? 'grayscale-0' : 'grayscale'}
                    `}
                    sizes="(max-width: 768px) 100vw, 65vw"
                  />
                </div>
                <div 
                  className="absolute bottom-0 left-0 right-0 p-6 pt-24 pointer-events-none" 
                  style={{ background: "linear-gradient(to top, rgba(15, 36, 66, 0.85) 0%, rgba(15, 36, 66, 0) 100%)" }}
                >
                  <h3 className="font-bold text-white text-lg line-clamp-2 md:text-xl mb-1 drop-shadow-md">{post.title}</h3>
                  <p className="text-white/80 text-sm drop-shadow-md">{formatDate(post.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-2 mt-8 md:mt-10">
          {displayPosts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-navy w-6 h-2" : "bg-slate-300 w-2 h-2 hover:bg-slate-400"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Right Area: Static Detail Panel (Desktop only) */}
      <div className="hidden md:flex flex-1 relative z-10 flex-col h-[340px] my-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl p-8 border flex flex-col h-full relative overflow-hidden"
            style={{
              background: '#ffffff',
              borderColor: '#c8d4e0',
              boxShadow: '0 2px 12px rgba(15, 36, 66, 0.08)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.01] z-0" style={{ backgroundColor: "#1a3a5c" }} />

            <div className="flex justify-between items-start mb-2 relative z-10">
              <span className="uppercase tracking-widest text-sm text-slate-400 font-semibold">{formatDate(activePost.createdAt)}</span>
              {activePost.category && (
                <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  {activePost.category}
                </span>
              )}
            </div>

            <h2 className="text-[28px] font-bold text-slate-900 mt-2 mb-4 leading-tight line-clamp-2 relative z-10">{activePost.title}</h2>

            <p className="text-slate-500 text-[16px] leading-relaxed line-clamp-5 flex-grow mb-6 overflow-y-auto max-h-[120px] relative z-10">
              {activePost.description}
            </p>

            <div className="mt-auto border-t border-slate-100 pt-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-medium">Post {currentIndex + 1} of {displayPosts.length}</span>
                <Link href={`/posts/${activePost.slug}`} className="group flex items-center text-[15px] font-bold text-navy hover:text-blue-600 transition-colors">
                  Read Full Post
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile: Link shown under carousel since detail panel is hidden */}
      <div className="flex md:hidden justify-center mt-2 w-full">
        <Link href={`/posts/${activePost.slug}`} className="w-full block">
          <button className="w-full flex items-center justify-center bg-white border border-slate-200 shadow-sm rounded-lg py-3 text-sm font-bold text-navy">
            Read Full Post <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </Link>
      </div>
    </div>
  );
}

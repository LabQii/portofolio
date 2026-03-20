"use client";

import { motion } from "framer-motion";
import { Briefcase, Star, Calendar } from "lucide-react";

type Experience = {
  id: string;
  category: string;
  period: string;
  title: string;
  organization: string;
  description: string;
  tags: string[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

function TimelineCard({ item }: { item: Experience }) {
  return (
    <div
      className="rounded-2xl p-6 border relative overflow-hidden"
      style={{
        background: '#ffffff',
        borderColor: '#c8d4e0',
        boxShadow: '0 2px 12px rgba(15, 36, 66, 0.08)',
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.01]" 
        style={{ backgroundColor: "#1a3a5c" }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        {/* Top row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              background: 'rgba(15, 36, 66, 0.08)',
              color: '#0f2442',
              fontWeight: '600',
            }}
          >
            {item.category}
          </span>
          <span className="text-slate-500 text-sm flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {item.period}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-navy mb-1">{item.title}</h3>

        {/* Organization */}
        <p
          className="text-sm font-semibold mb-3"
          style={{ color: '#2563a8' }}
        >
          {item.organization}
        </p>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md border"
              style={{
                background: '#f1f5f9',
                borderColor: '#c8d4e0',
                color: '#475569',
              }}
            >
              # {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineNode({ featured }: { featured: boolean }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full z-10 ${featured
        ? "w-12 h-12 bg-navy text-white"
        : "w-10 h-10 text-navy"
      }`}
      style={featured ? {} : {
        background: '#ffffff',
        border: '2px solid #8fa8be',
        boxShadow: '0 0 0 4px rgba(15, 36, 66, 0.06)',
      }}
    >
      {featured ? (
        <Star className="w-5 h-5" fill="currentColor" />
      ) : (
        <Briefcase className="w-4 h-4" />
      )}
    </div>
  );
}

export default function ExperienceTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="relative">
      {/* Vertical center line — desktop only */}
      <div
        className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
        style={{
          width: '2px',
          background:
            "linear-gradient(to bottom, transparent 0%, #b8c8d8 15%, #8fa8be 50%, #b8c8d8 85%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Vertical left line — mobile only */}
      <div
        className="block md:hidden absolute left-5 top-0 bottom-0"
        style={{
          width: '2px',
          background:
            "linear-gradient(to bottom, transparent 0%, #b8c8d8 15%, #8fa8be 50%, #b8c8d8 85%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-12">
        {experiences.length === 0 && (
          <p className="text-slate-500 italic text-center py-12">No experiences yet. Add some from the admin panel.</p>
        )}
        {experiences.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.1 }}
              className="relative"
            >
              {/* Desktop: alternating layout */}
              <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6">
                {/* Left slot */}
                <div className={isLeft ? "flex justify-end" : ""}>
                  {isLeft && <div className="w-full max-w-[440px]"><TimelineCard item={item} /></div>}
                </div>

                {/* Center node */}
                <TimelineNode featured={item.featured} />

                {/* Right slot */}
                <div className={!isLeft ? "flex justify-start" : ""}>
                  {!isLeft && <div className="w-full max-w-[440px]"><TimelineCard item={item} /></div>}
                </div>
              </div>

              {/* Mobile: all cards on right of left line */}
              <div className="flex md:hidden items-start gap-4 pl-2">
                {/* Node pinned to left */}
                <div className="flex-shrink-0 relative z-10">
                  <TimelineNode featured={item.featured} />
                </div>
                {/* Card */}
                <div className="flex-1 min-w-0">
                  <TimelineCard item={item} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

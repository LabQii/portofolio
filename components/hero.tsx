"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MessageCircle } from "lucide-react";

interface HeroProps {
  name?: string;
  description?: string;
  cvUrl?: string;
}

export default function Hero({ name, description, cvUrl }: HeroProps) {
  const defaultName = "Hi, I am Muhammad Iqbal Firmansyah";
  const defaultDesc = "Fullstack JavaScript Developer with hands-on experience in Google Apps Script automation and web application development for operational and business needs. He has a strong interest in Front-End Development and continuously improves his skills in Laravel and modern web technologies. Experienced in supporting internal systems, improving workflow efficiency, and mentoring learners in coding environments.";

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center py-24 lg:py-0" style={{ background: "var(--gradient-hero)" }}>
      <div
        className="absolute inset-0 pointer-events-none batik-overlay opacity-[0.02]"
        style={{ backgroundColor: "#1a3a5c" }}
      ></div>
      <div className="relative z-10 w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

          <div className="w-full md:max-w-[60%] lg:max-w-[50%] text-center md:text-left relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-[44px] md:text-[38px] font-bold text-navy leading-[1.1] mb-6 tracking-tight"
            >
              {name || defaultName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-[17px] text-foreground/80 leading-[1.7] mb-10 max-w-[672px]"
            >
              {description || defaultDesc}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4"
            >
              <Button size="lg" asChild className="bg-navy hover:bg-navy/90 text-white rounded-md px-8 py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all">
                <a href={cvUrl || "#"} target={cvUrl ? "_blank" : undefined} rel="noopener noreferrer">
                  Download CV
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Right Area: Dev Portfolio Card */}
          <div className="relative flex items-center justify-center flex-shrink-0 p-8 md:p-10 mt-10 md:mt-0">
            {/* Decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[420px] md:h-[420px] bg-blue-50/80 rounded-full -z-10 opacity-60"></div>

            {/* Main Photo Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-[300px] h-[340px] md:w-[340px] md:h-[380px]"
            >
              {/* Photo Area */}
              <div className="absolute inset-0 bg-slate-100 rounded-[24px] shadow-xl overflow-hidden">
                <Image
                  src="/images/profile/foto-profile-nobg5.png"
                  alt="M Iqbal Firmansyah"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 300px, 340px"
                  priority
                />
              </div>

              {/* Tech Stack Badges (Row above photo) */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 z-20 w-max"
              >
                <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-md text-sm font-semibold text-slate-700">
                  <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" className="w-4 h-4 mr-1.5" />
                  Next.js
                </div>
                <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-md text-sm font-semibold text-slate-700">
                  <img src="https://cdn.simpleicons.org/react" alt="React" className="w-4 h-4 mr-1.5" />
                  React.js
                </div>
                <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-md text-sm font-semibold text-slate-700">
                  <img src="https://cdn.simpleicons.org/laravel" alt="Laravel" className="w-4 h-4 mr-1.5" />
                  Laravel
                </div>
              </motion.div>

              {/* Experience Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 bg-white rounded-2xl px-4 py-3 shadow-lg border border-slate-100 w-[130px] z-20"
              >
                <div className="text-[10px] text-slate-400 tracking-widest uppercase mb-1">Experience</div>
                <div className="flex items-center font-bold text-slate-800 text-sm">
                  <svg className="w-4 h-4 mr-1.5 text-navy shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  1+ Years
                </div>
              </motion.div>
            </motion.div>

            {/* Tech Stack Badges (Mobile: Stacked below) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex md:hidden items-center justify-center gap-2 z-20 w-max"
            >
              <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-md text-[13px] font-semibold text-slate-700">
                <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" className="w-3.5 h-3.5 mr-1.5" />
                Next.js
              </div>
              <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-md text-[13px] font-semibold text-slate-700">
                <img src="https://cdn.simpleicons.org/react" alt="React" className="w-3.5 h-3.5 mr-1.5" />
                React
              </div>
              <div className="flex items-center bg-white rounded-full px-3 py-1.5 shadow-md text-[13px] font-semibold text-slate-700">
                <img src="https://cdn.simpleicons.org/laravel" alt="Laravel" className="w-3.5 h-3.5 mr-1.5" />
                Laravel
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroProps {
  name?: string;
  description?: string;
}

export default function Hero({ name, description }: HeroProps) {
  const defaultName = "Hi, I am Muhammad Iqbal Firmansyah";
  const defaultDesc = "Fullstack JavaScript Developer with hands-on experience in Google Apps Script automation and web application development for operational and business needs. He has a strong interest in Front-End Development and continuously improves his skills in Laravel and modern web technologies. Experienced in supporting internal systems, improving workflow efficiency, and mentoring learners in coding environments.";

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">

          <div className="flex-1 text-center md:text-left">
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
              className="text-[17px] text-foreground/80 leading-[1.7] mb-10 max-w-2xl"
            >
              {description || defaultDesc}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Button size="lg" className="bg-navy hover:bg-navy/90 text-white rounded-md px-10 py-6 text-lg font-semibold shadow-md hover:shadow-lg transition-all">
                Download CV
              </Button>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden border-[6px] border-slate-50 shadow-2xl bg-slate-200">
              <Image
                src="/images/profile/foto-profile.jpg"
                alt="M Iqbal Firmansyah"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

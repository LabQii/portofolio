"use client";

import { useMusic } from "@/contexts/MusicContext";
import { Music, Pause, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function MusicPlayer() {
    const { isPlaying, toggle, isReady } = useMusic();
    const [showLabel, setShowLabel] = useState(false);
    const pathname = usePathname();

    // Hide on admin/login pages
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return null;

    return (
        <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3">
            {/* Tooltip label - only shows on hover */}
            <AnimatePresence>
                {showLabel && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="bg-white border border-slate-100 text-slate-800 text-sm font-medium px-4 py-2 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.08)] whitespace-nowrap backdrop-blur-md"
                    >
                        {isPlaying ? "Pause music" : "Play music"}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Player button */}
            <div className="relative group">
                {/* Wave effect rings */}
                <AnimatePresence>
                    {isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 rounded-full bg-navy/20"
                                    initial={{ scale: 1, opacity: 0.6 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.6,
                                        ease: "easeOut",
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggle}
                    onMouseEnter={() => setShowLabel(true)}
                    onMouseLeave={() => setShowLabel(false)}
                    title={isPlaying ? "Pause music" : "Play background music"}
                    disabled={!isReady}
                    className={`relative h-10 w-10 md:h-12 md:w-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 border
                        ${isPlaying
                            ? "bg-navy text-white border-navy/20 shadow-navy/20"
                            : "bg-white text-slate-600 border-slate-200 hover:border-navy/30 hover:text-navy"
                        } backdrop-blur-md disabled:opacity-40 z-10`}
                >
                    <motion.div
                        key={isPlaying ? "pause" : "play"}
                        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        {isPlaying ? (
                            <Pause className="h-4 w-4 md:h-5 md:w-5 fill-current" />
                        ) : (
                            <Music className="h-4 w-4 md:h-5 md:w-5" />
                        )}
                    </motion.div>
                </motion.button>
            </div>
        </div>
    );
}

"use client";

import { useState, useRef, useEffect } from "react";
// @ts-ignore
import ReactPlayer from "react-player/youtube";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface MusicPlayerProps {
  initialMusicUrl?: string;
}

export default function MusicPlayer({ initialMusicUrl = "" }: MusicPlayerProps) {
  const pathname = usePathname();
  const [url, setUrl] = useState(initialMusicUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  useEffect(() => {
    if (initialMusicUrl) setUrl(initialMusicUrl);
  }, [initialMusicUrl]);

  // Hide on admin/login pages
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/login")) return null;
  if (!url) return null;

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!hasStarted) setHasStarted(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 group">
      {/* "Play music" bubble as seen in mockup */}
      <motion.div
        initial={false}
        animate={{ 
          opacity: isPlaying ? 0.3 : 1,
          y: isPlaying ? 5 : 0,
          scale: isPlaying ? 0.95 : 1
        }}
        className="bg-white border border-rose-50 px-6 py-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-[15px] font-medium text-slate-800 cursor-pointer hover:shadow-md transition-all mb-1"
        onClick={togglePlay}
      >
        {isPlaying ? "Pause music" : "Play music"}
      </motion.div>

      {/* Circular music icon button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className={`w-[68px] h-[68px] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden backdrop-blur-sm border ${
          isPlaying 
            ? "bg-navy text-white border-navy/20" 
            : "bg-[#f1f5f9] text-slate-700 border-white/50 hover:bg-slate-200"
        }`}
      >
        <div className="relative z-10">
          <Music className={`w-8 h-8 ${isPlaying ? 'animate-pulse' : ''}`} strokeWidth={1.5} />
        </div>
      </motion.button>


      {/* Hidden Player */}
      <div className="hidden pointer-events-none opacity-0 invisible" aria-hidden="true">
        <ReactPlayer
          url={url}
          playing={isPlaying}
          muted={isMuted}
          loop={true}
          volume={0.5}
          width="0"
          height="0"
          config={{
            youtube: {
              playerVars: { 
                autoplay: 0,
                controls: 0,
                modestbranding: 1,
                rel: 0,
              }
            }
          }}
          onError={(e: any) => console.error("Music Player Error:", e)}
        />
      </div>
    </div>
  );
}

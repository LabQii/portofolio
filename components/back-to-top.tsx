"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;
  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-[76px] right-4 md:bottom-[92px] md:right-8 z-50 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 shadow-sm dark:shadow-none hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
      aria-label="Back to top"
    >
      <ChevronUp className="h-[18px] w-[18px]" />
    </button>
  );
}

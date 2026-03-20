"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navItems = [
  { name: "Profile", href: "/" },
  { name: "Experience", href: "/#experience" },
  { name: "Activities", href: "/posts" },
  { name: "Projects", href: "/projects" },
  { name: "Contacts", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
          scrolled
            ? "bg-white/65 backdrop-blur-[16px] border-b border-white/30 shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
            : "bg-white border-b border-slate-100 shadow-none"
        )}
        style={scrolled ? { WebkitBackdropFilter: "blur(16px)" } : {}}
      >
        <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight text-navy group">
                <div className="relative w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg p-1.5 border border-slate-100 group-hover:border-navy/20 transition-all">
                  <Image
                    src="/images/logo-q.png"
                    alt="Labqii Tech Logo"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span>Labqii Tech</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.includes('#') && window.location.pathname === '/') {
                        e.preventDefault();
                        const id = item.href.split('#')[1];
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={cn(
                      "text-[14px] font-semibold transition-colors hover:text-navy/70",
                      pathname === item.href ? "text-navy" : "text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-navy p-2 bg-slate-50 rounded-md"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isMenuOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t border-white/20 bg-white/80 backdrop-blur-xl overflow-hidden shadow-lg"
              style={{ WebkitBackdropFilter: "blur(20px)" }}
            >
              <div className="space-y-1 px-4 py-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-semibold",
                        pathname === item.href
                          ? "bg-slate-50 text-navy"
                          : "text-foreground hover:bg-slate-50"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {/* Spacer to prevent overlap on public pages */}
      <div className="h-20" />
    </>
  );
}

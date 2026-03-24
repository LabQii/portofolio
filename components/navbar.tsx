"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Profile", href: "/" },
  { name: "Experience", href: "/#experience" },
  { name: "Activities", href: "/posts" },
  { name: "Projects", href: "/projects" },
  { name: "Contacts", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = React.useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // Magic line states
  const navRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0, opacity: 0 });
  const [isIndicatorReady, setIsIndicatorReady] = React.useState(false);

  React.useEffect(() => {
    // Enable transitions shortly after mount to prevent initial sweep animation
    const t = setTimeout(() => setIsIndicatorReady(true), 50);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    const calculatePosition = () => {
      if (!navRef.current) return;
      const activeNode = navRef.current.querySelector('[data-active="true"]') as HTMLElement;
      
      if (activeNode) {
        setIndicatorStyle({
          left: activeNode.offsetLeft,
          width: activeNode.offsetWidth,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    // Calculate immediately
    calculatePosition();

    // Recalculate on window resize or layout changes
    let resizeTimer: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      // Slight debounce for performance
      resizeTimer = setTimeout(calculatePosition, 20);
    });
    
    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      clearTimeout(resizeTimer);
    };
  }, [pathname, activeSection]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section detection for hash links
      if (pathname === '/') {
        let currentSection = 'profile';
        const scrollY = window.scrollY;

        // Check if user is at the very bottom of the page
        if (window.innerHeight + scrollY >= document.body.offsetHeight - 50) {
          currentSection = 'contact';
        } else {
          const sections = ['experience', 'contact'];
          
          for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              // A section is considered active if its top is above a comfortable threshold in the viewport
              // 300px gives enough buffer as the user scrolls
              if (rect.top <= 300) {
                currentSection = section;
              }
            }
          }
        }
        
        setActiveSection(currentSection);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  React.useEffect(() => {
    // Handle scroll to hash on initial load or navigation from other pages
    const resolveHashScroll = () => {
      const hash = window.location.hash;
      if (hash && pathname === '/') {
        const id = hash.replace('#', '');
        
        // Eagerly set active section to prevent flashing profile
        setActiveSection(id);
        
        let foundOnce = false;
        
        // Polling allows layout to settle and waits for RSC data fetching (e.g. loading.tsx)
        const tryScroll = (retries = 50) => {
          const element = document.getElementById(id);
          
          if (element) {
            foundOnce = true;
            const yOffset = -80;
            const y = Math.max(0, element.getBoundingClientRect().top + window.pageYOffset + yOffset);
            
            // Jump instantly to avoid the smooth scroll from top
            window.scrollTo({ top: y, behavior: 'auto' });
            setActiveSection(id);
            
            // Keep checking for a few frames in case layout shifts push the section further down
            if (retries > 5) {
              setTimeout(() => tryScroll(5), 100);
            } else if (retries > 0) {
              setTimeout(() => tryScroll(retries - 1), 100);
            }
          } else if (!foundOnce && retries > 0) {
            // Element not found yet (e.g., page is still loading RSC data)
            // Keep polling for up to 5 seconds
            setTimeout(() => tryScroll(retries - 1), 100);
          }
        };
        
        tryScroll();
      }
    };

    // Small delay ensures window.location.hash reflects Next.js soft navigation
    setTimeout(resolveHashScroll, 50);
  }, [pathname]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;
  
  const handleScroll = (e: React.MouseEvent, href: string, isMobile = false) => {
    // Check if it's a link meant to behave as an anchor on the home page
    const isHomePageLink = pathname === '/' && (href === '/' || href.startsWith('/#'));
    
    if (isHomePageLink) {
      e.preventDefault();
      
      const executeScroll = () => {
        if (href === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setActiveSection('profile');
        } else {
          const id = href.split('#')[1];
          if (id === 'contact') {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth'
            });
            setActiveSection('contact');
          } else {
            const element = document.getElementById(id);
            if (element) {
              const yOffset = -80;
              const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
              setActiveSection(id);
            }
          }
        }
      };

      if (isMobile) {
        setIsMenuOpen(false);
        // Small delay to ensure menu closing doesn't interrupt scroll geometry
        setTimeout(executeScroll, 100);
      } else {
        executeScroll();
      }
    } else if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out",
          scrolled
            ? "bg-background/80 backdrop-blur-[16px] border-b border-slate-200/50 dark:border-transparent dark:shadow-none shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
            : "bg-background border-b border-slate-100 dark:border-transparent dark:shadow-none shadow-none"
        )}
        style={scrolled ? { WebkitBackdropFilter: "blur(16px)" } : {}}
      >
        <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2.5 text-[22px] font-bold tracking-tight text-primary group">
                <div className="relative w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl p-1.5 border border-slate-100 group-hover:border-navy/20 transition-all shadow-sm">
                  <Image
                    src="/images/logo-q.png"
                    alt="Labqii Tech Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <span>Labqii Tech</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div ref={navRef} className="relative ml-10 flex items-center space-x-6">
                {navItems.map((item) => {
                  let isActive = false;
                  
                  if (pathname === '/') {
                    if (item.href === '/') {
                      isActive = activeSection === 'profile';
                    } else if (item.href.startsWith('/#')) {
                      const id = item.href.split('#')[1];
                      isActive = activeSection === id;
                    } else {
                      isActive = false;
                    }
                  } else {
                    isActive = item.href !== '/' && pathname.startsWith(item.href);
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      data-active={isActive ? "true" : "false"}
                      onClick={(e) => handleScroll(e, item.href)}
                      className={cn(
                        "relative text-[14px] font-semibold transition-all duration-300 py-2 px-1",
                        isActive 
                          ? "text-navy dark:!text-white" 
                          : "text-primary hover:text-navy dark:hover:!text-white"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Magic Line Indicator */}
                <div 
                  className="absolute bottom-0 h-[2.5px] bg-navy dark:bg-accent rounded-full pointer-events-none"
                  style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    opacity: indicatorStyle.opacity,
                    transition: isIndicatorReady 
                      ? 'left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease' 
                      : 'none'
                  }}
                />
                <div className="pl-4 border-l border-slate-400 dark:border-slate-500 flex items-center h-8">
                  <ThemeToggle />
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primary p-2 bg-surface rounded-md"
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
              className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-background/95 backdrop-blur-xl overflow-hidden shadow-lg"
              style={{ WebkitBackdropFilter: "blur(20px)" }}
            >
              <div className="space-y-1 px-4 py-4">
                {navItems.map((item, i) => {
                  let isActive = false;
                  
                  if (pathname === '/') {
                    if (item.href === '/') {
                      isActive = activeSection === 'profile';
                    } else if (item.href.startsWith('/#')) {
                      const id = item.href.split('#')[1];
                      isActive = activeSection === id;
                    } else {
                      isActive = false;
                    }
                  } else {
                    isActive = item.href !== '/' && pathname.startsWith(item.href);
                  }

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 rounded-xl text-[15px] font-semibold transition-all duration-200",
                          isActive
                            ? "bg-slate-50 text-navy dark:bg-surface dark:!text-white shadow-sm"
                            : "text-primary hover:bg-slate-50 hover:text-navy dark:hover:bg-surface dark:hover:!text-white"
                        )}
                        onClick={(e) => handleScroll(e, item.href, true)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
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

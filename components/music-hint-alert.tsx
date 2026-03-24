"use client";

import { useEffect, useState } from "react";

export default function MusicHintAlert() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode from .dark class (not prefers-color-scheme)
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem("music_hint_shown")) return;

    // Show 1.5s after page load (after loader disappears)
    const showTimer = setTimeout(() => {
      setVisible(true);

      // Auto-dismiss after 4s
      const dismissTimer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => setVisible(false), 400);
      }, 4000);

      return () => clearTimeout(dismissTimer);
    }, 1500);

    sessionStorage.setItem("music_hint_shown", "1");

    return () => clearTimeout(showTimer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 88,
        right: 24,
        zIndex: 9998,
        padding: "10px 16px",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        backgroundColor: isDark ? "#1e293b" : "#ffffff",
        color: isDark ? "#f1f5f9" : "#1e293b",
        border: isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "translateY(8px)" : "translateY(0)",
        animation: "music-hint-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 15 }}>🎵</span>
      <span>Background music available</span>
      <style>{`
        @keyframes music-hint-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

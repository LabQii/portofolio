"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import AdminSignOut from "./sign-out-button";

export default function AdminNavbar() {
  return (
    <header className="h-[64px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 shrink-0 relative z-20">
      <Link href="/admin" className="text-[18px] font-bold tracking-tight text-[#0f172a]">
        Labqii Tech
      </Link>

      <div className="flex items-center gap-3">
        <button className="text-[#64748b] hover:text-[#0f172a] transition-colors p-2 rounded-full hover:bg-slate-100">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-px h-5 bg-[#e2e8f0] mx-1"></div>
        <Link href="/" target="_blank" className="text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] transition-colors px-2">
          View Site
        </Link>
        <AdminSignOut />
      </div>
    </header>
  );
}

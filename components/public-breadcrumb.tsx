import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PublicBreadcrumb({ pageName }: { pageName: string }) {
  return (
    <nav className="flex items-center text-[13px] font-medium text-slate-400 mb-6 w-full" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-navy transition-colors">Home</Link>
      <ChevronRight className="w-3.5 h-3.5 mx-1.5" />
      <span className="text-navy">{pageName}</span>
    </nav>
  );
}

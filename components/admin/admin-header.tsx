import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminHeader({ title, backHref }: { title: string; backHref: string }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10 w-full py-4 mb-4">
      <div className="w-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex items-center gap-4">
        <Link href={backHref} className="p-2 -ml-2 rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-navy">{title}</h1>
      </div>
    </header>
  );
}

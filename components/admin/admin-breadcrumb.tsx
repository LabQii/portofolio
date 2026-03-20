import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-0 mb-1" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-1.5 text-[13px] text-[#cbd5e1] select-none">›</span>
            )}
            {isLast || !item.href ? (
              <span className="text-[13px] font-medium text-[#0f172a]">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-[13px] font-normal text-[#94a3b8] hover:text-[#1e293b] transition-colors no-underline hover:underline"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

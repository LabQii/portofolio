import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function PublicBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center mb-4" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-1.5 text-[13px] text-[#cbd5e1] select-none">›</span>
            )}
            {isLast || !item.href ? (
              <span className="text-[13px] font-medium text-white/90">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-[13px] font-normal text-white/50 hover:text-white transition-colors no-underline hover:underline"
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

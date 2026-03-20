"use client";

import { useState } from "react";

interface TechLogoImageProps {
  src: string;
  alt: string;
  initial: string;
  className?: string;
  fallbackClassName?: string;
}

export default function TechLogoImage({
  src,
  alt,
  initial,
  className = "object-contain w-full h-full",
  fallbackClassName = "w-full h-full rounded bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600",
}: TechLogoImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={fallbackClassName}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

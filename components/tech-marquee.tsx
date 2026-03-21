"use client";

import React from "react";
import { getTechLogoDetails } from "@/lib/tech-icons";
import TechLogoImage from "@/components/tech-logo-image";

export default function TechMarquee({
  techStacks,
  customTechLogos = [],
}: {
  techStacks: string[];
  customTechLogos?: any[];
}) {
  if (!techStacks?.length) return null;

  // Split items into 2 rows for opposite directions
  const mid = Math.ceil(techStacks.length / 2);
  const row1 = techStacks.slice(0, mid);
  const row2 = techStacks.slice(mid);

  const renderRow = (items: string[], direction: "left" | "right", duration: string) => {
    // We need the items to span fully across ultrawide screens.
    // If the user only has a few items, duplicating them 2x is not enough to fill the width.
    let repeatCount = Math.max(4, Math.ceil(40 / items.length));
    if (repeatCount % 2 !== 0) repeatCount++; // ensure it's even for -50% translateX loop
    const multipliedItems = Array(repeatCount).fill(items).flat() as string[];

    return (
      <div className="flex w-full overflow-hidden group">
        <div
          className="flex w-fit will-change-transform group-hover:[animation-play-state:paused]"
          style={{ animation: `marquee-${direction} ${duration} linear infinite` }}
        >
          {multipliedItems.map((tech, idx) => {
            const logoDetails = getTechLogoDetails(tech, customTechLogos);
            return (
              <div
                key={`${tech}-${idx}`}
                className="group/item flex flex-col items-center justify-start gap-[4px] px-[16px] py-[8px] mx-[6px] cursor-default"
              >
                {logoDetails.type === "initial" ? (
                  <div className="w-[28px] h-[28px] rounded bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600 transition-all duration-150 ease-in-out group-hover/item:scale-110">
                    {logoDetails.initial}
                  </div>
                ) : (
                  <div className="relative w-[28px] h-[28px] flex items-center justify-center shrink-0 transition-transform duration-150 ease-in-out group-hover/item:scale-110">
                    <TechLogoImage
                      src={logoDetails.url}
                      alt={tech}
                      initial={tech.charAt(0).toUpperCase()}
                    />
                  </div>
                )}
                <span className="text-[11px] font-normal text-[#94a3b8] transition-colors duration-150 ease-in-out whitespace-nowrap group-hover/item:text-[#1e293b]">
                  {tech}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full mt-[58px] flex flex-col items-center">
      <h3 className="text-[11px] font-medium text-[#94a3b8] uppercase tracking-[0.08em] mb-[16px] text-center">
        Tech I Work With
      </h3>

      <div className="w-full overflow-hidden marquee-wrapper contain-[layout] mt-5 flex flex-col gap-[8px]">
        {renderRow(row1, "left", "30s")}
        {renderRow(row2, "right", "36s")}
      </div>
    </div>
  );
}

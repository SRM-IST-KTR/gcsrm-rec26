import React from "react";
import SectionBadge from "@/components/common/SectionBadge";

interface StatusHeaderProps {
  badgeText?: string;
  title?: string;
  className?: string;
}

/**
 * Neobrutalist section header with yellow pill badge and bold title
 */
export function StatusHeader({
  badgeText = "PROGRESS",
  title = "Your Application Status",
  className = "",
}: StatusHeaderProps) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* Pill Badge */}
      <SectionBadge label={badgeText} variant="yellow" className="mb-4 sm:mb-6" />

      {/* Main Title */}
      <h2 className="font-outfit-black text-3xl sm:text-4xl md:text-[46px] text-[#1E1B24] tracking-[-1px] sm:tracking-[-1.5px] leading-tight mb-8 sm:mb-10">
        {title}
      </h2>
    </div>
  );
}

export default StatusHeader;

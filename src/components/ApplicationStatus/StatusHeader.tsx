import React from "react";

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
      <div className="bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-full px-6 py-1.5 mb-4 sm:mb-6 shadow-[3px_3px_0px_#1E1B24]">
        <span className="font-outfit-black text-[13px] sm:text-[14px] text-[#1E1B24] uppercase tracking-[1.5px]">
          {badgeText}
        </span>
      </div>

      {/* Main Title */}
      <h2 className="font-outfit-black text-3xl sm:text-4xl md:text-[46px] text-[#1E1B24] tracking-[-1px] sm:tracking-[-1.5px] leading-tight mb-8 sm:mb-10">
        {title}
      </h2>
    </div>
  );
}

export default StatusHeader;

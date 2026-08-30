import React from "react";

interface YouAreHereBadgeProps {
  label?: string;
  className?: string;
}

/**
 * Floating "YOU ARE HERE" pill badge displayed on the active status level
 */
export function YouAreHereBadge({
  label = "YOU ARE HERE",
  className = "",
}: YouAreHereBadgeProps) {
  return (
    <div
      className={`absolute -top-3 sm:-top-3.5 right-3 sm:right-6 bg-[#3B6FE8] text-white text-[10px] sm:text-[11px] font-black uppercase tracking-wider px-3 sm:px-3.5 py-0.5 sm:py-1 rounded-full border-[2px] border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] rotate-[-2deg] select-none pointer-events-none z-10 font-outfit-black ${className}`}
      aria-label={label}
    >
      {label}
    </div>
  );
}

export default YouAreHereBadge;

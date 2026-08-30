import React from "react";
import { StepState } from "./types";

interface IconProps {
  className?: string;
  size?: number;
}

/**
 * High-contrast Checkmark Icon for completed levels
 */
export function CheckIcon({ className = "w-4 h-4 text-[#1E1B24]", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * Bold 5-Point Star Icon for current/active level
 */
export function StarIcon({ className = "w-5 h-5 text-[#1E1B24]", size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

/**
 * Padlock Icon for locked/upcoming levels
 */
export function LockIcon({ className = "w-4 h-4 text-[#9CA3AF]", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

interface StatusIconBadgeProps {
  state: StepState;
}

/**
 * Modular circular badge rendering the corresponding state icon
 * with Neobrutalist borders, colors, and shadows
 */
export function StatusIconBadge({ state }: StatusIconBadgeProps) {
  switch (state) {
    case "completed":
      return (
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFD600] border-2 border-[#1E1B24] flex items-center justify-center flex-shrink-0 shadow-[1.5px_1.5px_0px_#1E1B24]"
          aria-label="Completed step"
        >
          <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1E1B24]" />
        </div>
      );

    case "active":
      return (
        <div
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-[2.5px] border-[#1E1B24] flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_#1E1B24]"
          aria-label="Active current step"
        >
          <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E1B24]" />
        </div>
      );

    case "locked":
    default:
      return (
        <div
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E5E2DA] border-[1.5px] border-[#CCCCCC] flex items-center justify-center flex-shrink-0"
          aria-label="Locked step"
        >
          <LockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#888888]" />
        </div>
      );
  }
}

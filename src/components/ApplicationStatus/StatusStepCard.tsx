import React from "react";
import { StatusStep } from "./types";
import { StatusIconBadge } from "./StatusIcons";
import { YouAreHereBadge } from "./YouAreHereBadge";

interface StatusStepCardProps {
  step: StatusStep;
  className?: string;
}

/**
 * Individual status level item card with Neobrutalist styling
 * Renders completed, active, or locked states
 */
export function StatusStepCard({ step, className = "" }: StatusStepCardProps) {
  const state = step.state || "locked";

  if (state === "active") {
    return (
      <div
        className={`relative w-full bg-[#FFE452] bg-gradient-to-br from-[#FFE452] to-[#FFD600] border-[3px] border-[#1E1B24] rounded-[18px] p-5 sm:p-6 shadow-[4px_4px_0px_#1E1B24] transition-all ${className}`}
      >
        <YouAreHereBadge />
        <div className="flex items-start gap-4 sm:gap-5">
          <StatusIconBadge state="active" />
          <div className="flex flex-col text-left flex-1 min-w-0">
            <span className="font-outfit-black text-lg sm:text-[20px] font-black text-[#1E1B24] leading-tight">
              {step.level}
            </span>
            <h4 className="font-outfit-black text-sm sm:text-base font-bold text-[#1E1B24] mt-0.5 leading-snug">
              {step.subtitle || step.title}
            </h4>
            {step.description && (
              <p className="font-rubik text-xs sm:text-[13.5px] md:text-sm font-medium text-[#1E1B24] mt-2 leading-relaxed opacity-95">
                {step.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === "completed") {
    return (
      <div
        className={`w-full bg-white border-[2.5px] border-[#1E1B24] rounded-[16px] p-3.5 sm:px-5 sm:py-4 flex items-center gap-4 transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[1px] ${className}`}
      >
        <StatusIconBadge state="completed" />
        <div className="flex flex-col text-left">
          <span className="font-rubik text-xs sm:text-[13px] font-medium text-[#5C5866] leading-none">
            {step.level}
          </span>
          <h4 className="font-outfit-black text-sm sm:text-base font-extrabold text-[#1E1B24] mt-1 leading-snug">
            {step.title}
          </h4>
        </div>
      </div>
    );
  }

  // Locked / Upcoming state
  return (
    <div
      className={`w-full bg-[#F4F3ED] border-2 border-dashed border-[#CCCCCC] rounded-[16px] p-3.5 sm:px-5 sm:py-4 flex items-center gap-4 transition-all opacity-80 select-none ${className}`}
    >
      <StatusIconBadge state="locked" />
      <div className="flex flex-col text-left">
        <span className="font-rubik text-xs sm:text-[13px] font-medium text-[#888888] leading-none">
          {step.level}
        </span>
        <h4 className="font-outfit-black text-sm sm:text-base font-bold text-[#888888] mt-1 leading-snug">
          {step.title}
        </h4>
      </div>
    </div>
  );
}

export default StatusStepCard;

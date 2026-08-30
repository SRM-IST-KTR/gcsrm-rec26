import React from "react";
import { ParticipantData } from "./types";

interface ParticipantSummaryProps {
  participant: Partial<ParticipantData>;
  className?: string;
}

/**
 * Modular helper component displaying participant metadata in a Neobrutalist badge style
 */
export function ParticipantSummary({
  participant,
  className = "",
}: ParticipantSummaryProps) {
  if (!participant.name && !participant.registrationNumber && !participant.email) {
    return null;
  }

  return (
    <div
      className={`w-full bg-[#FFFEEF] border-2 border-[#1E1B24] rounded-[16px] p-4 flex flex-wrap items-center justify-between gap-3 shadow-[2px_2px_0px_#1E1B24] mb-6 ${className}`}
    >
      <div className="flex flex-col">
        <span className="font-rubik text-xs font-medium text-[#5C5866]">Applicant</span>
        <span className="font-outfit-black text-sm font-bold text-[#1E1B24]">
          {participant.name || "Candidate"}
        </span>
      </div>

      {participant.registrationNumber && (
        <div className="flex flex-col">
          <span className="font-rubik text-xs font-medium text-[#5C5866]">Reg. Number</span>
          <span className="font-rubik text-sm font-semibold text-[#1E1B24]">
            {participant.registrationNumber}
          </span>
        </div>
      )}

      {participant.domain && (
        <div className="flex flex-col">
          <span className="font-rubik text-xs font-medium text-[#5C5866]">Domain</span>
          <span className="font-outfit-black text-xs font-bold uppercase bg-[#FFD93D] border border-[#1E1B24] rounded-full px-2.5 py-0.5 mt-0.5 text-[#1E1B24]">
            {participant.domain}
          </span>
        </div>
      )}
    </div>
  );
}

export default ParticipantSummary;

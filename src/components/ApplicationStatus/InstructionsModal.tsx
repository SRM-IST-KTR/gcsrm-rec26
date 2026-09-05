"use client";

import React, { useEffect } from "react";
import { X, Info } from "lucide-react";
import instructionsData from "./domainInstructions.json";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain?: string;
}

export function InstructionsModal({ isOpen, onClose, domain }: InstructionsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Fallback gracefully to Technical if domain is missing or invalid
  const safeDomain = domain && (domain in instructionsData) ? domain as keyof typeof instructionsData : "Technical";
  const data = instructionsData[safeDomain];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-[95vw] sm:w-[85vw] md:w-[550px] max-h-[90vh] bg-white border-[3px] border-[#1E1B24] rounded-xl shadow-[8px_8px_0px_#1E1B24] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#FFD93D] border-b-[3px] border-[#1E1B24] p-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-2">
            <Info className="text-[#1E1B24]" size={24} />
            <h2 className="font-outfit-black text-xl text-[#1E1B24] uppercase tracking-wide">
              {data.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-2 border-[#1E1B24] rounded bg-white hover:bg-[#EF4444] transition-colors group cursor-pointer"
          >
            <X size={20} className="text-[#1E1B24] group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <span className="font-outfit-black text-sm uppercase text-[#1E1B24] tracking-wider">
              {data.badge}
            </span>
            <span className="bg-[var(--error,#D92323)] text-white font-outfit-black text-xs uppercase px-3 py-1.5 rounded-md border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] text-center">
              {data.highlight}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-outfit-black text-base uppercase text-[#1E1B24]">
              Submission Requirements
            </h3>
            <ul className="flex flex-col gap-3">
              {data.rules.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 border-2 border-[#1E1B24] bg-[#FFFDF0] p-3 rounded-lg shadow-[2px_2px_0px_#1E1B24]"
                >
                  <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#1E1B24] text-white font-outfit-black text-xs">
                    {idx + 1}
                  </span>
                  <p className="font-rubik text-sm text-[#1E1B24] font-medium leading-relaxed">
                    {rule}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#EFF8FF] border-2 border-[#1E1B24] p-3 rounded-lg shadow-[2px_2px_0px_#1E1B24]">
            <p className="font-rubik text-sm font-semibold text-[#1E1B24]">
              <span className="font-outfit-black text-[#D92323] uppercase mr-1">Note:</span>
              {data.note}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-[3px] border-[#1E1B24] bg-white flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#4EC37B] hover:bg-[#3ea866] border-2 border-[#1E1B24] rounded-lg text-white font-outfit-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
          >
            UNDERSTOOD
          </button>
        </div>
      </div>
    </div>
  );
}

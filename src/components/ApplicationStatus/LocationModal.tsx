"use client";

import React, { useEffect } from "react";
import { X, MapPin, Calendar, Building, Compass } from "lucide-react";
import locationData from "./onboardingLocation.json";

export interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LocationModal({ isOpen, onClose }: LocationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden", "touch-none");
    } else {
      document.body.classList.remove("overflow-hidden", "touch-none");
    }
    return () => {
      document.body.classList.remove("overflow-hidden", "touch-none");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[95vw] sm:w-[85vw] md:w-[540px] max-h-[90vh] bg-white border-[3px] border-[#1E1B24] rounded-[20px] shadow-[8px_8px_0px_#1E1B24] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#22C55E] border-b-[3px] border-[#1E1B24] p-4 flex items-center justify-between rounded-t-[17px]">
          <div className="flex items-center gap-2.5">
            <MapPin className="text-white" size={24} />
            <h2 className="font-outfit-black text-xl text-white uppercase tracking-wide">
              {locationData.headerTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 border-2 border-[#1E1B24] rounded-lg bg-white hover:bg-[#f0f0f0] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            <X size={20} className="text-[#1E1B24]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain flex flex-col gap-4 text-left">
          {/* Main Venue Card */}
          <div className="bg-[#ECFDF5] border-2 border-[#1E1B24] rounded-xl p-4 shadow-[3px_3px_0px_#1E1B24] flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Building className="text-[#1E1B24] shrink-0 mt-0.5" size={22} />
              <div>
                <h3 className="font-outfit-black text-base text-[#1E1B24] uppercase tracking-wide">
                  {locationData.venue.title}
                </h3>
                <p className="font-rubik text-sm text-[#1E1B24] mt-0.5 font-medium">
                  {locationData.venue.room}
                </p>
                <p className="font-rubik text-xs text-[#5C5866] mt-1">
                  {locationData.venue.address}
                </p>
              </div>
            </div>

            <div className="h-[2px] bg-[#1E1B24]/10" />

            <div className="flex items-start gap-3">
              <Compass className="text-[#1E1B24] shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24] block">
                  {locationData.navigation.title}
                </span>
                <p className="font-rubik text-xs text-[#5C5866] mt-0.5">
                  {locationData.navigation.description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="text-[#1E1B24] shrink-0 mt-0.5" size={20} />
              <div>
                <span className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24] block">
                  {locationData.reporting.title}
                </span>
                <p className="font-rubik text-xs text-[#5C5866] mt-0.5">
                  {locationData.reporting.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-[3px] border-[#1E1B24] bg-white flex justify-end rounded-b-[17px]">
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-bold px-6 py-2 transition-all bg-[#1E1B24] hover:bg-[#33303c] text-white cursor-pointer text-sm uppercase tracking-wider"
          >
            {locationData.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationModal;

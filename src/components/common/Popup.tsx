"use client";

import React, { useEffect } from "react";

export interface PopupProps {
  isOpen: boolean;
  type?: "success" | "error" | "info";
  title?: string;
  message: string;
  onClose: () => void;
  autoCloseMs?: number;
}

/**
 * Neobrutalist floating Popup/Toast component with bold borders and drop shadow.
 */
export function Popup({
  isOpen,
  type = "info",
  title,
  message,
  onClose,
  autoCloseMs,
}: PopupProps) {
  useEffect(() => {
    if (!isOpen || !autoCloseMs || autoCloseMs <= 0) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseMs);

    return () => clearTimeout(timer);
  }, [isOpen, autoCloseMs, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";
  const isError = type === "error";

  const badgeBg = isSuccess
    ? "bg-[#4EC37B]"
    : isError
    ? "bg-[#FF4B4B]"
    : "bg-[#FFD93D]";

  const badgeText = isSuccess ? "SUCCESS" : isError ? "ERROR" : "NOTICE";

  const defaultTitle = isSuccess
    ? "Success"
    : isError
    ? "Notice"
    : "Information";

  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[480px] transition-all animate-in fade-in slide-in-from-top-4 duration-300"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-full bg-white border-[3px] border-[#1E1B24] rounded-[22px] shadow-[6px_6px_0px_#1E1B24] p-5 sm:p-6 flex flex-col gap-3 relative">
        <div className="flex items-center justify-between gap-3">
          {/* Badge & Title */}
          <div className="flex items-center gap-2.5">
            <span
              className={`font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] ${badgeBg}`}
            >
              {badgeText}
            </span>
            <h4 className="font-outfit-black text-[18px] sm:text-[20px] text-[#1E1B24] tracking-tight">
              {title || defaultTitle}
            </h4>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className="w-8 h-8 rounded-full bg-[#FAF7EE] border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] flex items-center justify-center text-[#1E1B24] font-outfit-black hover:bg-[#FF4B4B] hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer shrink-0"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="font-rubik text-[15px] sm:text-[16px] text-[#1E1B24] font-medium leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}

export default Popup;

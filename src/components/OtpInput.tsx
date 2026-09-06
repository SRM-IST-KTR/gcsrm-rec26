"use client";

import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
}

/**
 * 6-slot OTP input with split-box UI.
 * Wraps `input-otp` — one hidden input, custom visual slots.
 */
export function OtpInput({ value, onChange, onComplete, disabled, hasError }: OtpInputProps) {
  return (
    <OTPInput
      value={value}
      onChange={onChange}
      onComplete={onComplete}
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS}
      disabled={disabled}
      autoFocus
      containerClassName="flex justify-center gap-1 min-[360px]:gap-1.5 sm:gap-2"
      render={({ slots }) => (
        <>
          <div className="flex gap-1 min-[360px]:gap-1.5 sm:gap-2">
            {slots.slice(0, 3).map((slot, idx) => (
              <SlotBox key={idx} {...slot} hasError={hasError} />
            ))}
          </div>
          <div className="flex items-center mx-0.5 sm:mx-1">
            <span className="block w-3 h-[2px] bg-[#1E1B24] rounded-full" />
          </div>
          <div className="flex gap-1 min-[360px]:gap-1.5 sm:gap-2">
            {slots.slice(3).map((slot, idx) => (
              <SlotBox key={idx + 3} {...slot} hasError={hasError} />
            ))}
          </div>
        </>
      )}
    />
  );
}

interface SlotBoxProps {
  char: string | null;
  placeholderChar: string | null;
  isActive: boolean;
  hasFakeCaret: boolean;
  hasError?: boolean;
}

function SlotBox({ char, placeholderChar, isActive, hasFakeCaret, hasError }: SlotBoxProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center",
        "w-8 h-11 min-[360px]:w-9 min-[360px]:h-12 sm:w-12 sm:h-14 rounded-xl border-[3px] bg-white",
        "text-base sm:text-xl font-outfit-black text-[#1E1B24]",
        "transition-all duration-150",
        isActive && "border-[#3E9FFF]",
        hasError && "border-[#EF4444]",
        !isActive && !hasError && "border-[#1E1B24]",
      )}
    >
      {char ? (
        char
      ) : placeholderChar ? (
        <span className="text-[#CCCCCC]">{placeholderChar}</span>
      ) : (
        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#E5E0D4]" />
      )}
      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[2px] h-5 sm:h-8 bg-[#1E1B24] animate-pulse" />
        </div>
      )}
    </div>
  );
}
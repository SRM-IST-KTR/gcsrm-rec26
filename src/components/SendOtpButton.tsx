"use client";

import { ButtonHTMLAttributes } from "react";

interface SendOtpButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

/**
 * Neobrutalist submit button for the "Send OTP" action.
 * Styled to match the existing LoginSection button.
 */
export function SendOtpButton({ loading, disabled, children, ...rest }: SendOtpButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="mt-5 w-full rounded-2xl py-4 text-white text-xl uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
      style={{
        backgroundColor: "#3e9fff",
        border: "3px solid #1e1b24",
        boxShadow: "4px 4px 0px #1e1b24",
        fontWeight: 800,
        fontFamily: "'Outfit', sans-serif",
        transition: "box-shadow 0.1s ease, transform 0.1s ease",
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.boxShadow = "2px 2px 0px #1e1b24";
          e.currentTarget.style.transform = "translate(2px, 2px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "4px 4px 0px #1e1b24";
        e.currentTarget.style.transform = "translate(0, 0)";
      }}
      {...rest}
    >
      {children ?? (loading ? "Sending OTP..." : "Send OTP")}
    </button>
  );
}
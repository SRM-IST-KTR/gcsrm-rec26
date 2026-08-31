"use client";

interface ResendOtpLinkProps {
  /** Seconds left until resend is allowed (0 = resend clickable). */
  cooldown: number;
  /** Called when the user clicks the resend link. */
  onResend: () => void;
  /** True while the resend request is in flight. */
  disabled?: boolean;
}

/**
 * "Didn't receive? Resend" link with countdown.
 * Shows a live countdown while `cooldown > 0`, otherwise renders the clickable link.
 */
export function ResendOtpLink({ cooldown, onResend, disabled }: ResendOtpLinkProps) {
  if (cooldown > 0) {
    return (
      <p className="mt-4 text-center text-sm text-[#555555]" role="status">
        Resend available in{" "}
        <span className="font-bold text-[#1E1B24]">{cooldown}s</span>
      </p>
    );
  }

  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={onResend}
        disabled={disabled}
        className="text-sm font-medium text-[#3E9FFF] hover:text-[#2B7FE0] underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer bg-transparent border-none"
      >
        {disabled ? "Sending..." : "Didn't receive? Resend"}
      </button>
    </div>
  );
}
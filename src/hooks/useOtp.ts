"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { saveOtpSession } from "@/lib/otpSession";

export type OtpPhase =
  | "idle"      // email not yet submitted
  | "sending"   // POST /api/otp/send in flight
  | "sent"      // OTP delivered, awaiting code input
  | "verifying" // POST /api/otp/verify in flight
  | "verified"  // OTP accepted
  | "error";    // last request failed

export interface UseOtpResult {
  /** Current phase of the OTP state machine. */
  phase: OtpPhase;
  /** Email that received the OTP; null until the first successful send. */
  email: string | null;
  /** Last error message, if any. */
  error: string | null;
  /** Seconds left until resend is allowed (0 = allowed). */
  resendCooldown: number;
  /** Server-claimed OTP lifetime in seconds from the last successful send. */
  expiresIn: number | null;
  /** Send an OTP to the given email address. Returns true on success. */
  sendOtp: (email: string) => Promise<boolean>;
  /** Verify an OTP for the previously sent email. Returns true on success. */
  verifyOtp: (otp: string) => Promise<boolean>;
  /** Reset to idle state (clears cooldown timer). */
  reset: () => void;
}

function extractMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.body && "errors" in err.body && err.body.errors?.length) {
      return err.body.errors.map((f) => f.msg).join(" ");
    }
    return err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong. Please try again.";
}

export function useOtp(): UseOtpResult {
  const [phase, setPhase] = useState<OtpPhase>("idle");
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);

  const hasSentBefore = useRef(false);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearCooldown = useCallback(() => {
    if (cooldownRef.current) {
      clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }
    setResendCooldown(0);
  }, []);

  // Flush timer on unmount.
  useEffect(() => clearCooldown, [clearCooldown]);

  const startCooldown = useCallback(
    (seconds: number) => {
      clearCooldown();
      setResendCooldown(seconds);
      cooldownRef.current = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearCooldown();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearCooldown],
  );

  const sendOtp = useCallback(
    async (targetEmail: string): Promise<boolean> => {
      const normalized = targetEmail.trim().toLowerCase();
      setError(null);
      setPhase("sending");

      try {
        const result = await api.sendOtp(normalized);
        hasSentBefore.current = true;
        setEmail(normalized);
        setExpiresIn(result.expiresInSeconds ?? null);
        setPhase("sent");
        return true;
      } catch (err) {
        if (err instanceof ApiError && err.status === 429 && err.retryAfterSeconds) {
          startCooldown(err.retryAfterSeconds);
        }
        setError(extractMessage(err));
        // If we already had a successful send (resend case), keep the OTP screen.
        setPhase(hasSentBefore.current ? "sent" : "error");
        return false;
      }
    },
    [startCooldown],
  );

  const verifyOtp = useCallback(
    async (otp: string): Promise<boolean> => {
      if (!email) return false;
      if (!/^\d{6}$/.test(otp)) return false;

      setError(null);
      setPhase("verifying");

      try {
        const result = await api.verifyOtp(email, otp);
        saveOtpSession({
          token: result.token,
          email,
          expiresAt: Date.now() + (result.expiresInSeconds ?? 3600) * 1000,
        });
        setPhase("verified");
        return true;
      } catch (err) {
        setError(extractMessage(err));
        setPhase("sent"); // stay on the OTP screen for retry / resend
        return false;
      }
    },
    [email],
  );

  const reset = useCallback(() => {
    clearCooldown();
    hasSentBefore.current = false;
    setPhase("idle");
    setEmail(null);
    setError(null);
    setExpiresIn(null);
  }, [clearCooldown]);

  return {
    phase,
    email,
    error,
    resendCooldown,
    expiresIn,
    sendOtp,
    verifyOtp,
    reset,
  };
}
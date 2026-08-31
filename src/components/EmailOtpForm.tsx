"use client";

import { useEffect, useState } from "react";
import { useOtp } from "@/hooks/useOtp";
import { OtpInput } from "@/components/OtpInput";
import { SendOtpButton } from "@/components/SendOtpButton";
import { ResendOtpLink } from "@/components/ResendOtpLink";
import { clearOtpSession } from "@/lib/otpSession";

interface EmailOtpFormProps {
  /** Prefill the email input when arriving from the login step. */
  initialEmail?: string;
  /** Called once the OTP is verified; the parent proceeds to the next step. */
  onVerified: (email: string) => void;
  /** Post-verification error surfaced by the parent (e.g. participant lookup failed). */
  externalError?: string | null;
  /** Re-runs the parent's post-verification step after an external error. */
  onRetry?: () => void;
}

const emailPattern = /^[^\s@]+@srmist\.edu\.in$/i;

/**
 * Two-step email + OTP verification form:
 *   Step 1 — enter email → POST /api/otp/send
 *   Step 2 — enter 6-digit code → POST /api/otp/verify
 * On success calls `onVerified(email)`.
 */
export function EmailOtpForm({
  initialEmail = "",
  onVerified,
  externalError = null,
  onRetry,
}: EmailOtpFormProps) {
  const [emailInput, setEmailInput] = useState(initialEmail.trim().toLowerCase());
  const [otpValue, setOtpValue] = useState("");
  const [emailError, setEmailError] = useState("");

  const { phase, email, error, resendCooldown, sendOtp, verifyOtp, reset } = useOtp();

  // When the OTP is verified, hand the verified email to the parent.
  useEffect(() => {
    if (phase === "verified" && email) {
      onVerified(email);
    }
  }, [phase, email, onVerified]);

  // Flush timers when leaving the screen.
  useEffect(() => () => reset(), [reset]);

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = emailInput.trim().toLowerCase();

    if (!normalized) {
      setEmailError("Please enter a valid SRM Email ID before proceeding.");
      return;
    }
    if (!emailPattern.test(normalized)) {
      setEmailError("Please enter a valid SRM email ending with @srmist.edu.in.");
      return;
    }

    setEmailError("");
    setOtpValue("");
    await sendOtp(normalized);
  };

  const handleVerify = async () => {
    if (otpValue.length !== 6) return;
    setOtpValue("");
    await verifyOtp(otpValue);
  };

  const handleResend = async () => {
    if (!email) return;
    setOtpValue("");
    await sendOtp(email);
  };

  const displayError = error || externalError;
  const isSending = phase === "sending";
  const isVerifying = phase === "verifying";
  const showOtpStep = email !== null;
  const heading = showOtpStep ? "Check your email" : "Login with your email";

  return (
    <>
      <div
        className="min-h-screen w-full relative flex flex-col items-center justify-center"
        style={{
          backgroundColor: "#fffdf0",
          fontFamily: "'Outfit', sans-serif",
          overflow: "visible",
          backgroundImage: "url('/login/icon.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 1,
        }}
      >
        {/* Top-left: Shin-chan with laptop */}
        <img
          src="/login/char-laptop.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{ left: "-30px", top: "20px", width: "clamp(130px, 17vw, 230px)", zIndex: 1 }}
        />
        {/* Top-right: Shin-chan as bee */}
        <img
          src="/login/char-bee.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{ right: "-30px", top: "-10px", width: "clamp(140px, 18vw, 250px)", zIndex: 1 }}
        />
        {/* Bottom-left: Action Kamen */}
        <img
          src="/login/char-action-kamen.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{ left: "-10px", bottom: "-20px", width: "clamp(150px, 20vw, 280px)", zIndex: 1 }}
        />
        {/* Bottom-right: green robot arm */}
        <img
          src="/login/char-robot.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{ right: "-20px", bottom: "-20px", width: "clamp(140px, 19vw, 260px)", zIndex: 1 }}
        />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center w-full px-4">
          <div
            className="mb-5 px-8 py-[10px] rounded-full border-[3px] border-[#1e1b24]"
            style={{
              backgroundColor: "#4ec37b",
              boxShadow: "3px 3px 0px #1e1b24",
            }}
          >
            <span
              className="text-[#1e1b24] text-2xl uppercase tracking-wide"
              style={{ fontWeight: 800 }}
            >
              GCSRM
            </span>
          </div>

          <h1
            className="text-[#1e1b24] text-center mb-6 leading-tight"
            style={{ fontWeight: 900, fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            {heading}
          </h1>

          {/* Neobrutalist error banner — hooks errors + parent external errors */}
          {displayError && (
            <div
              className="w-full max-w-md bg-[#FFF5F5] border-[3px] border-[#1E1B24] shadow-[4px_4px_0px_#1E1B24] rounded-[20px] p-4 sm:p-5 text-center mb-8 flex flex-col sm:flex-row items-center justify-center gap-3"
              role="alert"
            >
              <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-white px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#EF4444] shrink-0">
                ERROR
              </span>
              <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
                {displayError}
              </p>
              {externalError && onRetry && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="shrink-0 text-sm font-bold text-white px-4 py-2 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#3E9FFF] hover:bg-[#2B7FE0] transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              )}
            </div>
          )}

          {/* Form card */}
          <div className="relative w-full max-w-md">
            {/* Car that drives around the card border */}
            <img
              src="/login/char-pixel-car.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none z-20"
              style={{
                position: "absolute",
                width: "clamp(54px, 10vw, 76px)",
                height: "auto",
                animation: "drive-around-box 10s linear infinite",
                willChange: "top, left, transform",
              }}
            />

            <style>{`
              @keyframes drive-around-box {
                0% {
                  top: 0%;
                  left: 0%;
                  transform: translate(-50%, -82%) scaleX(-1) rotate(0deg);
                }
                28% {
                  top: 0%;
                  left: 100%;
                  transform: translate(-50%, -82%) scaleX(-1) rotate(0deg);
                }
                32% {
                  top: 0%;
                  left: 100%;
                  transform: translate(-18%, -50%) scaleX(-1) rotate(-90deg);
                }
                48% {
                  top: 100%;
                  left: 100%;
                  transform: translate(-18%, -50%) scaleX(-1) rotate(-90deg);
                }
                52% {
                  top: 100%;
                  left: 100%;
                  transform: translate(-50%, -18%) scaleX(-1) rotate(-180deg);
                }
                78% {
                  top: 100%;
                  left: 0%;
                  transform: translate(-50%, -18%) scaleX(-1) rotate(-180deg);
                }
                82% {
                  top: 100%;
                  left: 0%;
                  transform: translate(-82%, -50%) scaleX(-1) rotate(-270deg);
                }
                96% {
                  top: 0%;
                  left: 0%;
                  transform: translate(-82%, -50%) scaleX(-1) rotate(-270deg);
                }
                100% {
                  top: 0%;
                  left: 0%;
                  transform: translate(-50%, -82%) scaleX(-1) rotate(-360deg);
                }
              }
            `}</style>

            <div
              className="bg-white rounded-3xl p-8 w-full"
              style={{
                border: "3px solid #1e1b24",
                boxShadow: "6px 6px 0px #1e1b24",
              }}
            >
              {!showOtpStep ? (
                /* ── Step 1: Send OTP ─────────────────────────── */
                <form onSubmit={handleSendOtp} noValidate>
                  <label
                    htmlFor="otp-email"
                    className="block text-[#1e1b24] mb-3 text-lg"
                    style={{ fontWeight: 900 }}
                  >
                    SRM Email id
                  </label>

                  <div className="relative" style={{ overflow: "visible" }}>
                    <input
                      type="email"
                      id="otp-email"
                      required
                      placeholder="gc2026@srmist.edu.in"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className="w-full rounded-2xl px-5 py-4 text-[#1e1b24] text-base focus:outline-none transition-all"
                      style={{
                        border: `2px solid ${emailError ? "#d92323" : "#1e1b24"}`,
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 400,
                      }}
                    />
                  </div>

                  {emailError && (
                    <p
                      className="mt-2 text-sm"
                      role="alert"
                      style={{ color: "#d92323", fontWeight: 500 }}
                    >
                      {emailError}
                    </p>
                  )}

                  <SendOtpButton loading={isSending}>
                    {isSending ? "Sending OTP..." : "Send OTP"}
                  </SendOtpButton>
                </form>
              ) : (
                /* ── Step 2: Verify OTP ──────────────────────────  */
                <div>
                  <p
                    className="text-center mb-2 text-[#1e1b24]"
                    style={{ fontWeight: 600, fontSize: "0.95rem" }}
                  >
                    We sent a 6-digit code to{" "}
                    <span className="font-bold">{email}</span>
                  </p>

                  <div className="my-6">
                    <OtpInput
                      value={otpValue}
                      onChange={setOtpValue}
                      disabled={isVerifying}
                      hasError={!!error}
                      onComplete={handleVerify}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={otpValue.length !== 6 || isVerifying}
                    className="mt-2 w-full rounded-2xl py-4 text-white text-xl uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    style={{
                      backgroundColor: "#3e9fff",
                      border: "3px solid #1e1b24",
                      boxShadow: "4px 4px 0px #1e1b24",
                      fontWeight: 800,
                      fontFamily: "'Outfit', sans-serif",
                      transition: "box-shadow 0.1s ease, transform 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (otpValue.length === 6 && !isVerifying) {
                        e.currentTarget.style.boxShadow = "2px 2px 0px #1e1b24";
                        e.currentTarget.style.transform = "translate(2px, 2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "4px 4px 0px #1e1b24";
                      e.currentTarget.style.transform = "translate(0, 0)";
                    }}
                  >
                    {isVerifying ? "Verifying..." : "Verify"}
                  </button>

                  <ResendOtpLink
                    cooldown={resendCooldown}
                    onResend={handleResend}
                    disabled={isSending}
                  />

                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        clearOtpSession();
                        reset();
                      }}
                      className="text-sm font-medium text-[#555555] hover:text-[#1E1B24] underline underline-offset-2 transition-colors cursor-pointer bg-transparent border-none"
                    >
                      Use a different email
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmailOtpForm;
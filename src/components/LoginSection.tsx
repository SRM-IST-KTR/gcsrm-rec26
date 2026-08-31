"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ButtonLink } from "@/components/common/Button";

type LoginSectionProps = {
  onProceed: (email: string) => void;
};

type Step = "EMAIL" | "OTP";

const emailPattern = /^[^\s@]+@srmist\.edu\.in$/i;

export default function LoginSection({ onProceed }: LoginSectionProps) {
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only accept numeric input up to 6 digits
    const cleanOtp = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(cleanOtp);
    if (error) {
      setError("");
    }
  };

  const handleEmailSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter a valid SRM Email ID before proceeding.");
      return;
    }

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid SRM email ending with @srmist.edu.in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to send OTP. Please try again.");
        return;
      }

      setStep("OTP");
    } catch {
      setError("Unable to send OTP. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedOtp = otp.trim();

    if (!normalizedOtp) {
      setError("Please enter the 6-digit OTP sent to your email.");
      return;
    }

    if (normalizedOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          otp: normalizedOtp,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Invalid or expired OTP. Please try again.");
        return;
      }

      if (result.isRegistered) {
        // Fetch participant details to synchronize context session
        try {
          const userRes = await fetch(
            `/api/participants?email=${encodeURIComponent(normalizedEmail)}`
          );
          const userData = await userRes.json();
          if (userData.success && userData.user) {
            login(userData.user);
          }
        } catch (fetchErr) {
          console.error("Failed to load user details:", fetchErr);
        }
        router.push("/");
        return;
      }

      // New participant -> proceed to registration form
      onProceed(normalizedEmail);
    } catch {
      setError("Unable to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === "EMAIL") {
      handleEmailSubmit();
    } else {
      handleOtpSubmit();
    }
  };

  const handleBackToEmail = () => {
    setStep("EMAIL");
    setOtp("");
    setError("");
  };

  const handleResendOtp = async () => {
    if (loading) return;
    const normalizedEmail = email.trim().toLowerCase();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Failed to resend OTP. Please try again.");
      }
    } catch {
      setError("Unable to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasError = Boolean(error);
  const errorMessage = error;

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
          style={{
            left: "-30px",
            top: "20px",
            width: "clamp(130px, 17vw, 230px)",
            zIndex: 1,
          }}
        />

        {/* Top-right: Shin-chan as bee */}
        <img
          src="/login/char-bee.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{
            right: "-30px",
            top: "-10px",
            width: "clamp(140px, 18vw, 250px)",
            zIndex: 1,
          }}
        />

        {/* Bottom-left: Action Kamen superhero */}
        <img
          src="/login/char-action-kamen.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{
            left: "-10px",
            bottom: "-20px",
            width: "clamp(150px, 20vw, 280px)",
            zIndex: 1,
          }}
        />

        {/* Bottom-right: green robot arm */}
        <img
          src="/login/char-robot.png"
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{
            right: "-20px",
            bottom: "-20px",
            width: "clamp(140px, 19vw, 260px)",
            zIndex: 1,
          }}
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

          {/* Login heading */}
          <h1
            className="text-[#1e1b24] text-center mb-6 leading-tight"
            style={{ fontWeight: 900, fontSize: "clamp(2rem, 6vw, 3.5rem)" }}
          >
            {step === "EMAIL" ? "Login!!!" : "Verify OTP"}
          </h1>

          {/* Conditional Neobrutalist Error Banner */}
          {hasError && (
            <div className="w-full max-w-md bg-[#FFF5F5] border-[3px] border-[#1E1B24] shadow-[4px_4px_0px_#1E1B24] rounded-[20px] p-4 sm:p-5 text-center mb-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-white px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#EF4444] shrink-0">
                ERROR
              </span>
              <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#1E1B24] leading-relaxed">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Form card */}
          <div className="relative w-full max-w-md">
            {/* Car that drives smoothly around the card border */}
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

            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-3xl p-8 w-full"
              style={{
                border: "3px solid #1e1b24",
                boxShadow: "6px 6px 0px #1e1b24",
              }}
            >
              {step === "EMAIL" ? (
                <>
                  <label
                    htmlFor="email"
                    className="block text-[#1e1b24] mb-3 text-lg"
                    style={{ fontWeight: 900 }}
                  >
                    SRM Email id
                  </label>

                  <div className="relative" style={{ overflow: "visible" }}>
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="gc2026@srmist.edu.in"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={loading}
                      className="w-full rounded-2xl px-5 py-4 text-[#1e1b24] text-base focus:outline-none transition-all disabled:opacity-60"
                      style={{
                        border: `2px solid ${hasError ? "#d92323" : "#1e1b24"}`,
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 400,
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
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
                      if (!loading) {
                        e.currentTarget.style.boxShadow = "2px 2px 0px #1e1b24";
                        e.currentTarget.style.transform = "translate(2px, 2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "4px 4px 0px #1e1b24";
                      e.currentTarget.style.transform = "translate(0, 0)";
                    }}
                  >
                    {loading ? "Sending OTP..." : "Proceed"}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <label
                      htmlFor="otp"
                      className="block text-[#1e1b24] text-lg"
                      style={{ fontWeight: 900 }}
                    >
                      Enter 6-Digit OTP
                    </label>
                    <button
                      type="button"
                      onClick={handleBackToEmail}
                      disabled={loading}
                      className="text-sm text-[#1e1b24] hover:underline font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      ← Change Email
                    </button>
                  </div>

                  <p className="text-xs text-neutral-600 mb-3">
                    Sent to <span className="font-bold text-[#1e1b24]">{email}</span>
                  </p>

                  <div className="relative" style={{ overflow: "visible" }}>
                    <input
                      type="text"
                      id="otp"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      required
                      placeholder="••••••"
                      value={otp}
                      onChange={handleOtpChange}
                      disabled={loading}
                      className="w-full rounded-2xl px-5 py-4 text-[#1e1b24] text-2xl tracking-[8px] text-center font-mono focus:outline-none transition-all disabled:opacity-60"
                      style={{
                        border: `2px solid ${hasError ? "#d92323" : "#1e1b24"}`,
                        fontWeight: 700,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-xs text-neutral-700 hover:text-[#1e1b24] font-semibold hover:underline cursor-pointer disabled:opacity-50"
                    >
                      Didn&apos;t receive code? Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-5 w-full rounded-2xl py-4 text-white text-xl uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    style={{
                      backgroundColor: "#4ec37b",
                      border: "3px solid #1e1b24",
                      boxShadow: "4px 4px 0px #1e1b24",
                      fontWeight: 800,
                      fontFamily: "'Outfit', sans-serif",
                      transition: "box-shadow 0.1s ease, transform 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.boxShadow = "2px 2px 0px #1e1b24";
                        e.currentTarget.style.transform = "translate(2px, 2px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "4px 4px 0px #1e1b24";
                      e.currentTarget.style.transform = "translate(0, 0)";
                    }}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}
            </form>
          </div>

          <div className="mt-8">
            <ButtonLink
              text="BACK TO HOME"
              link="/"
              bgColor="bg-[#FF4B4B]"
              className="px-8 py-3 text-[1.05rem] rounded-[20px] tracking-[1px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}

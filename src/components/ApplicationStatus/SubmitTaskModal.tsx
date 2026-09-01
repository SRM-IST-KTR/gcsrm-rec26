"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { ParticipantData } from "./types";
import { api, ApiError } from "@/lib/api";
import { getOtpSession } from "@/lib/otpSession";
import { useOtp } from "@/hooks/useOtp";
import { OtpInput } from "@/components/OtpInput";
import { SendOtpButton } from "@/components/SendOtpButton";
import { ResendOtpLink } from "@/components/ResendOtpLink";

interface SubmitTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Partial<ParticipantData> | null;
}

type DomainKey = "technical" | "creatives" | "corporate";

type FormFields = {
  selectedTask: string;
  githubLink: string;
  deployedLink: string;
  demoVideo: string;
  figmaPlugins: string;
  designLink: string;
  designFiles: string;
  introVideo: string;
  documentLink: string;
};

const initialFormFields: FormFields = {
  selectedTask: "",
  githubLink: "",
  deployedLink: "",
  demoVideo: "",
  figmaPlugins: "",
  designLink: "",
  designFiles: "",
  introVideo: "",
  documentLink: "",
};

/** Map form field name to display label. */
const FIELD_LABELS: Record<string, string> = {
  selectedTask: "Task Name / Title",
  githubLink: "GitHub Repository Link",
  deployedLink: "Deployed / Hosted Link",
  demoVideo: "Demo Video Link",
  figmaPlugins: "Figma Plugins / Files",
  designLink: "Design Link (PNG / Images)",
  designFiles: "Design Files Link",
  introVideo: "Intro Video Link",
  documentLink: "Document Link (Drive / PDF)",
};

/** Map form field name to placeholder. */
const FIELD_PLACEHOLDERS: Record<string, string> = {
  selectedTask: "e.g. Task 1: Portfolio Website",
  githubLink: "https://github.com/yourusername/repo",
  deployedLink: "https://your-deployment.vercel.app",
  demoVideo: "https://youtube.com/... or https://drive.google.com/...",
  figmaPlugins: "https://www.figma.com/... or plugin name",
  designLink: "https://imgur.com/... or https://drive.google.com/...",
  designFiles: "https://drive.google.com/...",
  introVideo: "https://youtube.com/... or https://drive.google.com/...",
  documentLink: "https://drive.google.com/...",
};

/**
 * Normalize participant domain string to one of the three domain keys.
 */
function normalizeDomain(domain?: string | null): DomainKey {
  const d = (domain || "").toLowerCase().trim();
  if (d.includes("tech") || d.includes("web") || d.includes("dev")) return "technical";
  if (d.includes("creative") || d.includes("design") || d.includes("ui") || d.includes("ux")) return "creatives";
  if (d.includes("corp") || d.includes("operation") || d.includes("manage")) return "corporate";
  // default based on typical storage
  if (d === "technical" || d === "creatives" || d === "corporate") return d as DomainKey;
  return "technical";
}

/**
 * Domain-specific form fields. Only these fields are rendered for each domain.
 */
const DOMAIN_FIELDS: Record<DomainKey, (keyof FormFields)[]> = {
  technical: ["selectedTask", "githubLink", "deployedLink", "demoVideo"],
  creatives: ["selectedTask", "figmaPlugins", "designLink", "designFiles"],
  corporate: ["selectedTask", "introVideo", "documentLink"],
};

const DOMAIN_LABEL: Record<DomainKey, string> = {
  technical: "Technical",
  creatives: "Creatives",
  corporate: "Corporate",
};

/**
 * Neobrutalist modal for submitting a recruitment task.
 * Handles OTP re-verification if no valid session token exists,
 * then renders domain-specific form fields matching the backend controller.
 */
export function SubmitTaskModal({
  isOpen,
  onClose,
  participant,
}: SubmitTaskModalProps) {
  const { updateParticipant } = useAuth();
  const domain = normalizeDomain(participant?.domain);
  const fields = DOMAIN_FIELDS[domain];

  const [sessionReady, setSessionReady] = useState(false);
  const [otpComplete, setOtpComplete] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const {
    phase: otpPhase,
    email: otpEmail,
    error: otpError,
    resendCooldown,
    sendOtp,
    verifyOtp,
    reset: resetOtp,
  } = useOtp();

  // Check OTP session on mount / open
  useEffect(() => {
    if (isOpen) {
      const session = getOtpSession();
      setSessionReady(!!session && !!session.token);
      if (!session) {
        setOtpComplete(false);
      }
      setOtpValue("");
    }
  }, [isOpen]);

  // ── Form state ─────────────────────────────────────────────────────
  const [formFields, setFormFields] = useState<FormFields>(initialFormFields);
  const [errors, setErrors] = useState<Partial<Record<keyof FormFields, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setFormFields(initialFormFields);
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // ── OTP handlers ───────────────────────────────────────────────────
  const handleSendOtp = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const targetEmail = participant?.email || "";
      if (!targetEmail) return;
      await sendOtp(targetEmail);
    },
    [participant?.email, sendOtp],
  );

  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      const ok = await verifyOtp(otp);
      if (ok) {
        // Re-check session after verification
        const session = getOtpSession();
        if (session && session.token) {
          setSessionReady(true);
          setOtpComplete(true);
        }
      }
    },
    [verifyOtp],
  );

  const handleOtpInputChange = useCallback(
    (value: string) => {
      setOtpValue(value);
      // Auto-verify when 6 digits entered
      if (value.length === 6) {
        handleVerifyOtp(value);
      }
    },
    [handleVerifyOtp],
  );

  // ── Form handlers ──────────────────────────────────────────────────
  const handleFieldChange = useCallback(
    (field: keyof FormFields, value: string) => {
      setFormFields((prev) => ({ ...prev, [field]: value }));
      // Clear error on change
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors],
  );

  const validateForm = useCallback((): boolean => {
    const nextErrors: Partial<Record<keyof FormFields, string>> = {};

    if (!formFields.selectedTask.trim()) {
      nextErrors.selectedTask = "Task name is required.";
    }

    for (const field of fields) {
      if (field === "selectedTask") continue;
      const value = formFields[field].trim();
      if (value && !value.startsWith("http://") && !value.startsWith("https://")) {
        nextErrors[field] = "Please enter a valid URL starting with http:// or https://";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [formFields, fields]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    if (!participant?.email) {
      setSubmitError("Participant email not found. Please re-login.");
      return;
    }

    const session = getOtpSession();
    if (!session?.token) {
      setSubmitError("Session expired. Please re-verify your email.");
      setSessionReady(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload: Record<string, string> = {
        email: participant.email,
        registrationNumber: participant.registrationNumber || "",
        name: participant.name || "",
        phone: participant.phone || "",
        year: participant.year || "",
        domain: DOMAIN_LABEL[domain],
        selectedTask: formFields.selectedTask.trim(),
      };

      // Add domain-specific fields
      for (const field of fields) {
        const val = formFields[field].trim();
        if (val) {
          payload[field] = val;
        }
      }

      await api.submitTask(session.token, payload);

      // Update local participant status
      updateParticipant({ status: "taskSubmitted" });

      setSubmitSuccess(true);

      // Close after brief delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      let msg = "Failed to submit task. Please try again.";
      if (err instanceof ApiError) {
        msg = err.error || err.message || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, participant, domain, fields, formFields, updateParticipant, onClose]);

  // ── Modal close / reset ────────────────────────────────────────────
  const handleClose = useCallback(() => {
    resetOtp();
    setSessionReady(false);
    setOtpComplete(false);
    setFormFields(initialFormFields);
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    onClose();
  }, [onClose, resetOtp]);

  // ── Escape key handler ─────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  // ── Render: OTP Verification Gate ──────────────────────────────────
  if (!sessionReady) {
    const showOtpStep = otpPhase === "sent" || otpPhase === "verifying" || otpPhase === "verified";

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B24]/70 backdrop-blur-xs animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="submit-modal-title"
      >
        <div className="w-full max-w-[480px] bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[8px_8px_0px_#1E1B24] p-6 sm:p-8 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#FFD93D] shrink-0">
                VERIFY
              </span>
              <h3 id="submit-modal-title" className="font-outfit-black text-[20px] text-[#1E1B24] tracking-tight">
                Submit Task
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#1E1B24] bg-[#FAF7EE] text-[#1E1B24] font-bold text-lg shadow-[2px_2px_0px_#1E1B24] hover:bg-[#E5E0D4] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <p className="font-rubik text-[14px] font-medium text-[#5C5866] leading-relaxed">
            Verify your email to submit your {DOMAIN_LABEL[domain]} task.
          </p>

          {/* OTP Step */}
          {!showOtpStep ? (
            /* ── Send OTP ─────────────────────────────────── */
            <form onSubmit={handleSendOtp} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="verify-email" className="font-outfit-black text-[14px] text-[#1E1B24]">
                  SRM Email
                </label>
                <input
                  type="email"
                  id="verify-email"
                  value={participant?.email || ""}
                  disabled
                  className="w-full bg-[#E8E8E8] border-[3px] border-[#AAAAAA] rounded-[16px] p-4 font-rubik text-[16px] text-[#777777] shadow-none cursor-not-allowed"
                />
              </div>

              {otpError && (
                <p className="font-rubik text-sm font-medium text-[#D92323]" role="alert">
                  {otpError}
                </p>
              )}

              <SendOtpButton loading={otpPhase === "sending"}>
                {otpPhase === "sending" ? "Sending OTP..." : "Send OTP"}
              </SendOtpButton>
            </form>
          ) : (
            /* ── Verify OTP ───────────────────────────────── */
            <div className="flex flex-col gap-4">
              <p className="font-rubik text-center text-[13px] font-medium text-[#5C5866]">
                We sent a 6-digit code to{" "}
                <span className="font-bold text-[#1E1B24]">{participant?.email}</span>
              </p>

              <div className="my-2">
                <OtpInput
                  value=""
                  onChange={handleOtpInputChange}
                  disabled={otpPhase === "verifying"}
                  hasError={!!otpError}
                  onComplete={handleVerifyOtp}
                />
              </div>

              {otpError && (
                <p className="font-rubik text-sm font-medium text-[#D92323] text-center" role="alert">
                  {otpError}
                </p>
              )}

              <button
                type="button"
                onClick={() => handleVerifyOtp("")}
                disabled={otpPhase === "verifying"}
                className="w-full rounded-2xl py-4 text-white text-xl uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                style={{
                  backgroundColor: "#3e9fff",
                  border: "3px solid #1e1b24",
                  boxShadow: "4px 4px 0px #1e1b24",
                  fontWeight: 800,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {otpPhase === "verifying" ? "Verifying..." : "Verify"}
              </button>

              <ResendOtpLink
                cooldown={resendCooldown}
                onResend={() => {
                  if (participant?.email) sendOtp(participant.email);
                }}
                disabled={otpPhase === "verifying"}
              />

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    resetOtp();
                    setSessionReady(false);
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
    );
  }

  // ── Render: Task Submission Form ───────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B24]/70 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
    >
      <div className="w-full max-w-[560px] max-h-[90vh] overflow-y-auto bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[8px_8px_0px_#1E1B24] p-6 sm:p-8 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-white px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#4EC37B] shrink-0">
              SUBMIT
            </span>
            <h3 id="submit-modal-title" className="font-outfit-black text-[20px] sm:text-[22px] text-[#1E1B24] tracking-tight">
              Submit Task
            </h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-[#1E1B24] bg-[#FAF7EE] text-[#1E1B24] font-bold text-lg shadow-[2px_2px_0px_#1E1B24] hover:bg-[#E5E0D4] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Domain Badge */}
        <div className="flex items-center gap-2">
          <span className="font-outfit-black text-[11px] uppercase tracking-[1px] text-[#1E1B24] px-2.5 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#FFD93D]">
            {DOMAIN_LABEL[domain]} DOMAIN
          </span>
          {participant?.domain && participant.domain !== DOMAIN_LABEL[domain] && (
            <span className="font-rubik text-[12px] font-medium text-[#5C5866]">
              ({participant.domain})
            </span>
          )}
        </div>

        {/* Participant Info Summary */}
        <div className="bg-[#FFFEEF] border-2 border-[#1E1B24] rounded-[16px] p-3.5 flex flex-wrap gap-x-6 gap-y-1.5 shadow-[2px_2px_0px_#1E1B24]">
          {participant?.name && (
            <div className="flex flex-col">
              <span className="font-rubik text-[10px] font-medium text-[#5C5866] uppercase tracking-wide">Name</span>
              <span className="font-outfit-black text-[13px] text-[#1E1B24]">{participant.name}</span>
            </div>
          )}
          {participant?.email && (
            <div className="flex flex-col">
              <span className="font-rubik text-[10px] font-medium text-[#5C5866] uppercase tracking-wide">Email</span>
              <span className="font-rubik text-[13px] font-semibold text-[#1E1B24]">{participant.email}</span>
            </div>
          )}
          {participant?.registrationNumber && (
            <div className="flex flex-col">
              <span className="font-rubik text-[10px] font-medium text-[#5C5866] uppercase tracking-wide">Reg No</span>
              <span className="font-rubik text-[13px] font-semibold text-[#1E1B24]">{participant.registrationNumber}</span>
            </div>
          )}
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-[#EBFBF0] border-2 border-[#1E1B24] rounded-[16px] p-4 flex items-center gap-3 shadow-[2px_2px_0px_#1E1B24]">
            <span className="text-2xl">✅</span>
            <div className="flex flex-col">
              <span className="font-outfit-black text-[14px] text-[#1E1B24]">Task Submitted Successfully!</span>
              <span className="font-rubik text-[12px] font-medium text-[#5C5866]">Closing in a moment...</span>
            </div>
          </div>
        )}

        {/* Form Fields */}
        {!submitSuccess && (
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label
                  htmlFor={field}
                  className="font-outfit-black text-[14px] text-[#1E1B24]"
                >
                  {FIELD_LABELS[field]}
                  {field === "selectedTask" && (
                    <span className="text-[#D92323] ml-1">*</span>
                  )}
                </label>
                <input
                  type={field === "selectedTask" ? "text" : "url"}
                  id={field}
                  name={field}
                  value={formFields[field]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  placeholder={FIELD_PLACEHOLDERS[field]}
                  className={`w-full bg-white border-[3px] rounded-[16px] shadow-[3px_3px_0px_#1E1B24] p-4 font-rubik text-[15px] font-medium text-[#1E1B24] placeholder:text-[#5C5866]/50 focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[2px_2px_0px_#1E1B24] transition-all ${
                    errors[field] ? "border-[#D92323]" : "border-[#1E1B24]"
                  }`}
                  disabled={isSubmitting}
                />
                {errors[field] && (
                  <p className="font-rubik text-[12px] font-medium text-[#D92323]" role="alert">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}

            {/* Submit Error */}
            {submitError && (
              <div className="bg-[#FFF5F5] border-2 border-[#1E1B24] rounded-[14px] p-3 flex items-start gap-2.5 shadow-[2px_2px_0px_#1E1B24]">
                <span className="text-lg shrink-0 mt-0.5">⚠️</span>
                <p className="font-rubik text-[13px] font-medium text-[#D92323]">{submitError}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-5 py-3 rounded-xl border-2 border-[#1E1B24] bg-[#FAF7EE] text-[#1E1B24] font-rubik font-bold text-sm shadow-[2px_2px_0px_#1E1B24] hover:bg-[#E5E0D4] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl border-2 border-[#1E1B24] bg-[#4EC37B] text-white font-outfit-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_#1E1B24] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Task"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmitTaskModal;
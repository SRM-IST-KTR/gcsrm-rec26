"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Lock,
  GraduationCap,
  Share2,
  FileText,
  Loader2,
  Sparkles,
  Info,
  ChevronDown,
  Check,
} from "lucide-react";
import { ParticipantData, OnboardMemberPayload } from "./types";
import { api, ApiError } from "@/lib/api";
import { getOtpSession } from "@/lib/otpSession";
import { useAuth } from "@/context/AuthContext";

export interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant?: Partial<ParticipantData> | null;
  onSave?: (data: OnboardMemberPayload) => void;
}

interface FormState {
  phoneno: string;
  section: string;
  caption: string;
  pictureUrl: string;
  faname: string;
  faphonenumber: string;
  faemailid: string;
  github: string;
  linkedin: string;
  insta: string;
  portfolio: string;
  ndaUrl: string;
}

const INITIAL_FORM_STATE: FormState = {
  phoneno: "",
  section: "",
  caption: "",
  pictureUrl: "",
  faname: "",
  faphonenumber: "",
  faemailid: "",
  github: "",
  linkedin: "",
  insta: "",
  portfolio: "",
  ndaUrl: "",
};

export function UpdateDataModal({
  isOpen,
  onClose,
  participant,
  onSave,
}: UpdateDataModalProps) {
  const { updateParticipant } = useAuth();

  const candidateEmail = useMemo(
    () => (participant?.email || "candidate").toLowerCase().trim(),
    [participant?.email],
  );
  const draftStorageKey = `onboarding_draft_${candidateEmail}`;

  // Form State
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM_STATE);
  const [openSection, setOpenSection] = useState<number | null>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Initialize and load saved draft from localStorage or participant session
  useEffect(() => {
    if (!isOpen) return;

    let initial = { ...INITIAL_FORM_STATE };

    // Try restoring draft from localStorage
    try {
      const saved = localStorage.getItem(draftStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          initial = { ...initial, ...parsed };
          setDraftSaved(true);
        }
      }
    } catch (err) {
      console.error("Failed to read onboarding draft:", err);
    }

    // Populate missing fields from participant record
    if (participant) {
      if (!initial.phoneno && participant.phone) {
        initial.phoneno = participant.phone.replace(/\D/g, "").slice(-10);
      }
      if (!initial.github) initial.github = participant.links?.github || "";
      if (!initial.portfolio) {
        initial.portfolio =
          participant.links?.demo || participant.links?.deployment || "";
      }
    }

    setFormData(initial);
    setErrors({});
    setSubmitError(null);
    setIsSuccess(false);
  }, [isOpen, participant, draftStorageKey]);

  // Auto-save draft on every formData change when at least one field has data
  useEffect(() => {
    if (!isOpen) return;
    const isAnyFilled = Object.values(formData).some(
      (v) => typeof v === "string" && v.trim().length > 0,
    );

    if (!isAnyFilled) {
      setDraftSaved(false);
      return;
    }

    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(formData));
      setDraftSaved(true);
    } catch (err) {
      console.error("Failed to auto-save onboarding draft:", err);
    }
  }, [formData, isOpen, draftStorageKey]);

  // Prevent background scrolling while modal is open
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

  const candidateSubdomain =
    participant?.subdomain || (participant as any)?.subDomain || "";

  // Section completion calculations
  const section1Fields = [
    formData.phoneno,
    formData.section,
    formData.caption,
    formData.pictureUrl,
  ];
  const filled1 = section1Fields.filter((f) => f.trim().length > 0).length;

  const section2Fields = [
    formData.faname,
    formData.faphonenumber,
    formData.faemailid,
  ];
  const filled2 = section2Fields.filter((f) => f.trim().length > 0).length;

  const section3Fields = [
    formData.github,
    formData.linkedin,
    formData.insta,
    formData.portfolio,
  ];
  const filled3 = section3Fields.filter((f) => f.trim().length > 0).length;

  const section4Fields = [formData.ndaUrl];
  const filled4 = section4Fields.filter((f) => f.trim().length > 0).length;

  const totalFilled = filled1 + filled2 + filled3 + filled4;
  const TOTAL_FIELDS = 12;

  const INDIAN_PHONE_REGEX = /^[6-9]\d{9}$/;
  const isPhoneValid = INDIAN_PHONE_REGEX.test(formData.phoneno.trim());
  const phoneError =
    formData.phoneno.trim().length > 0 && !isPhoneValid
      ? "Enter a valid 10-digit mobile number."
      : errors.phoneno || null;

  const isFaPhoneValid = INDIAN_PHONE_REGEX.test(formData.faphonenumber.trim());
  const faPhoneError =
    formData.faphonenumber.trim().length > 0 && !isFaPhoneValid
      ? "Enter a valid 10-digit mobile number."
      : errors.faphonenumber || null;

  const SRM_FA_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/i;
  const isFaEmailValid =
    formData.faemailid.trim().length > 0 &&
    SRM_FA_EMAIL_REGEX.test(formData.faemailid.trim());

  const faEmailError =
    formData.faemailid.trim().length > 0 && !isFaEmailValid
      ? "FA email must be an official @srmist.edu.in address."
      : errors.faemailid || null;

  const isSection1Complete = filled1 === 4 && isPhoneValid;
  const isSection2Complete = filled2 === 3 && isFaPhoneValid && isFaEmailValid;
  const isSection3Complete = filled3 === 4;
  const isSection4Complete = filled4 === 1;

  const incompleteSections = useMemo(() => {
    const list: string[] = [];
    if (!isSection1Complete) list.push("Academic & Profile");
    if (!isSection2Complete) list.push("Faculty Advisor");
    if (!isSection3Complete) list.push("Social Handles");
    if (!isSection4Complete) list.push("NDA Submission");
    return list;
  }, [
    isSection1Complete,
    isSection2Complete,
    isSection3Complete,
    isSection4Complete,
  ]);

  const isFormComplete = incompleteSections.length === 0;

  const getSection1Badge = () => {
    if (filled1 === 0) {
      return {
        label: "Incomplete",
        pillClass: "bg-[#FF4D4D] text-white",
      };
    }
    if (filled1 < 4 || !isPhoneValid) {
      return {
        label: "In Progress",
        pillClass: "bg-[#FFDE59] text-[#1E1B24]",
      };
    }
    return {
      label: "Ready",
      pillClass: "bg-[#22C55E] text-white",
    };
  };

  const getSection2Badge = () => {
    if (filled2 === 0) {
      return {
        label: "Incomplete",
        pillClass: "bg-[#FF4D4D] text-white",
      };
    }
    if (filled2 < 3 || !isFaPhoneValid || !isFaEmailValid) {
      return {
        label: "In Progress",
        pillClass: "bg-[#FFDE59] text-[#1E1B24]",
      };
    }
    return {
      label: "Ready",
      pillClass: "bg-[#22C55E] text-white",
    };
  };

  const getSectionBadge = (filled: number, total: number) => {
    if (filled === 0) {
      return {
        label: "Incomplete",
        pillClass: "bg-[#FF4D4D] text-white",
      };
    }
    if (filled < total) {
      return {
        label: "In Progress",
        pillClass: "bg-[#FFDE59] text-[#1E1B24]",
      };
    }
    return {
      label: "Ready",
      pillClass: "bg-[#22C55E] text-white",
    };
  };

  const status1 = getSection1Badge();
  const status2 = getSection2Badge();
  const status3 = getSectionBadge(filled3, 4);
  const status4 = getSectionBadge(filled4, 1);

  if (!isOpen) return null;

  const toggleSection = (index: number) => {
    setOpenSection((prev) => (prev === index ? null : index));
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleExecuteClearDraft = () => {
    try {
      localStorage.removeItem(draftStorageKey);
    } catch (err) {
      console.error("Failed to remove onboarding draft:", err);
    }

    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setSubmitError(null);
    setDraftSaved(false);
    setShowClearConfirm(false);
  };

  const validateFormats = () => {
    const errs: Record<string, string> = {};
    const trimmedPhone = formData.phoneno.trim();

    if (!trimmedPhone) {
      errs.phoneno = "Phone number is required";
    } else if (!INDIAN_PHONE_REGEX.test(trimmedPhone)) {
      errs.phoneno = "Enter a valid 10-digit mobile number.";
    }

    const trimmedFaPhone = formData.faphonenumber.trim();
    if (!trimmedFaPhone) {
      errs.faphonenumber = "FA phone number is required";
    } else if (!INDIAN_PHONE_REGEX.test(trimmedFaPhone)) {
      errs.faphonenumber = "Enter a valid 10-digit mobile number.";
    }

    if (
      formData.faemailid.trim() &&
      !SRM_FA_EMAIL_REGEX.test(formData.faemailid.trim())
    ) {
      errs.faemailid = "FA email must be an official @srmist.edu.in address.";
    }

    if (
      formData.pictureUrl.trim() &&
      !/^https?:\/\/.+/i.test(formData.pictureUrl.trim())
    ) {
      errs.pictureUrl = "Enter a valid URL starting with http:// or https://";
    }

    if (
      formData.ndaUrl.trim() &&
      !/^https?:\/\/.+/i.test(formData.ndaUrl.trim())
    ) {
      errs.ndaUrl = "Enter a valid document URL starting with http:// or https://";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormComplete) {
      setSubmitError(
        `Please complete all sections first (${incompleteSections.join(", ")}).`,
      );
      return;
    }

    if (!validateFormats()) {
      setSubmitError("Please correct highlighted fields before submitting.");
      return;
    }

    // Retrieve authentication token
    const session = getOtpSession();
    const token =
      session?.token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("gcsrm_token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("authToken")
        : null);

    if (!token) {
      setSubmitError(
        "Authentication session not found or expired. Please re-verify with OTP.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: OnboardMemberPayload = {
      name: participant?.name || "",
      email: participant?.email || "",
      phoneno: formData.phoneno.trim(),
      section: formData.section.trim(),
      domain: participant?.domain || "",
      subdomain: candidateSubdomain || undefined,
      position: "member",
      joined_yr: 2026,
      isCurrentMember: true,
      caption: formData.caption.trim() || undefined,
      pictureUrl: formData.pictureUrl.trim() || undefined,
      faDetails: [
        {
          faname: formData.faname.trim(),
          faphonenumber: formData.faphonenumber.trim(),
          faemailid: formData.faemailid.trim(),
        },
      ],
      socials: [
        {
          insta: formData.insta.trim() || undefined,
          github: formData.github.trim() || undefined,
          linkedin: formData.linkedin.trim() || undefined,
          portfolio: formData.portfolio.trim() || undefined,
        },
      ],
      ndaUrl: formData.ndaUrl.trim() || undefined,
    };

    try {
      await api.onboard(token, payload);

      // Clear draft on successful submission
      try {
        localStorage.removeItem(draftStorageKey);
      } catch (e) {
        // ignore
      }

      if (updateParticipant) {
        updateParticipant({
          phone: formData.phoneno.trim(),
          subdomain: candidateSubdomain || participant?.subdomain,
          links: {
            ...participant?.links,
            github: formData.github.trim() || participant?.links?.github,
            demo: formData.portfolio.trim() || participant?.links?.demo,
          },
        });
      }

      if (onSave) {
        onSave(payload);
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      console.error("Onboarding submission error:", err);
      let message = "Failed to submit onboarding profile. Please try again.";
      if (err instanceof ApiError) {
        message = err.error || err.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[95vw] sm:w-[90vw] md:w-[620px] max-h-[92vh] bg-white border-[3px] border-[#1E1B24] rounded-[22px] shadow-[8px_8px_0px_#1E1B24] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="bg-[#FF4D4D] border-b-[3px] border-[#1E1B24] p-4 sm:p-5 flex items-center justify-between rounded-t-[19px]">
          <div className="flex items-center gap-2.5">
            <UserCheck className="text-white shrink-0" size={24} />
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h2 className="font-outfit-black text-lg sm:text-xl text-white uppercase tracking-wide">
                Team Member Onboarding
              </h2>
              <span className="inline-block self-start font-outfit-black text-[10px] uppercase bg-black text-white px-2 py-0.5 rounded border border-white/20">
                2026 Cohort
              </span>
            </div>
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

        {/* Modal Content / Scroll Container */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex flex-col gap-4 text-left">
          {isSuccess ? (
            /* Success View */
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-[#ECFDF5] border-2 border-[#1E1B24] rounded-2xl shadow-[4px_4px_0px_#1E1B24] gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#22C55E] border-2 border-[#1E1B24] shadow-[3px_3px_0px_#1E1B24] flex items-center justify-center text-white">
                <CheckCircle2 size={36} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-outfit-black text-xl text-[#1E1B24] uppercase tracking-wide">
                  Welcome to GCSRM!
                </span>
                <p className="font-rubik text-sm text-[#5C5866] max-w-sm">
                  Your onboarding record has been successfully registered into the
                  official 2026 team database.
                </p>
              </div>

              {/* Summary Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="bg-[#FFD93D] border-2 border-[#1E1B24] px-3 py-1 rounded-lg font-outfit-black text-xs uppercase text-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]">
                  Position: Member
                </span>
                <span className="bg-[#38BDF8] border-2 border-[#1E1B24] px-3 py-1 rounded-lg font-outfit-black text-xs uppercase text-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]">
                  Joined: 2026
                </span>
                {participant?.domain && (
                  <span className="bg-[#ECFDF5] border-2 border-[#1E1B24] px-3 py-1 rounded-lg font-outfit-black text-xs uppercase text-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]">
                    Domain: {participant.domain}
                  </span>
                )}
                {candidateSubdomain && (
                  <span className="bg-[#E0E7FF] border-2 border-[#1E1B24] px-3 py-1 rounded-lg font-outfit-black text-xs uppercase text-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]">
                    Subdomain: {candidateSubdomain}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-4 border-2 border-[#1E1B24] rounded-xl shadow-[3px_3px_0px_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#1E1B24] font-outfit-black text-sm uppercase px-8 py-2.5 bg-[#1E1B24] hover:bg-[#33303c] text-white transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Draft Status & Progress Bar */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-rubik text-[#5C5866]">
                  {draftSaved && totalFilled > 0 ? (
                    <>
                      <Check size={14} className="text-[#22C55E]" />
                      <span>Draft auto-saved</span>
                    </>
                  ) : totalFilled > 0 ? (
                    <span>Auto-saving draft...</span>
                  ) : (
                    <span className="text-[#888590]">No draft saved</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-rubik font-bold text-[#1E1B24]">
                    {totalFilled}/{TOTAL_FIELDS} Fields Filled
                  </span>
                  <span
                    className={`border border-[#1E1B24] px-2 py-0.2 rounded-md text-[10px] font-outfit-black uppercase ${
                      isFormComplete
                        ? "bg-[#22C55E] text-white"
                        : "bg-[#FFDE59] text-[#1E1B24]"
                    }`}
                  >
                    {isFormComplete ? "All Ready" : "In Progress"}
                  </span>
                </div>
              </div>

              {/* Error Alert Banner */}
              {submitError && (
                <div className="bg-[#FEE2E2] border-2 border-[#D92323] text-[#D92323] p-3.5 rounded-xl shadow-[3px_3px_0px_#1E1B24] font-rubik text-xs sm:text-sm font-semibold flex items-center gap-2.5">
                  <AlertCircle size={20} className="shrink-0 text-[#D92323]" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Locked Candidate Record Banner */}
              <div className="bg-[#FFFEEF] border-2 border-[#1E1B24] rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_#1E1B24] flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1E1B24]/15 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Lock size={15} className="text-[#1E1B24]" />
                    <span className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      Candidate Profile (Locked)
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#FFD93D] border border-[#1E1B24] text-[#1E1B24] font-outfit-black text-[10px] uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E1B24]">
                      member
                    </span>
                    <span className="bg-[#38BDF8] border border-[#1E1B24] text-[#1E1B24] font-outfit-black text-[10px] uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E1B24]">
                      2026
                    </span>
                    <span className="bg-[#22C55E] border border-[#1E1B24] text-white font-outfit-black text-[10px] uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_#1E1B24]">
                      active
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-rubik text-xs text-[#5C5866]">
                  <div>
                    <strong className="text-[#1E1B24]">Name:</strong>{" "}
                    {participant?.name || "Participant"}
                  </div>
                  <div>
                    <strong className="text-[#1E1B24]">Reg No:</strong>{" "}
                    {participant?.registrationNumber || "N/A"}
                  </div>
                  <div className="sm:col-span-2">
                    <strong className="text-[#1E1B24]">SRM Email:</strong>{" "}
                    {participant?.email || "N/A"}
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                    {participant?.domain && (
                      <div className="flex items-center gap-1.5">
                        <strong className="text-[#1E1B24]">Domain:</strong>
                        <span className="inline-block uppercase font-outfit-black text-[#1E1B24] bg-[#FFD93D] px-2 py-0.5 rounded border border-[#1E1B24] text-[10px]">
                          {participant.domain}
                        </span>
                      </div>
                    )}
                    {candidateSubdomain && (
                      <div className="flex items-center gap-1.5">
                        <strong className="text-[#1E1B24]">Subdomain:</strong>
                        <span className="inline-block uppercase font-outfit-black text-[#1E1B24] bg-[#E0E7FF] px-2 py-0.5 rounded border border-[#1E1B24] text-[10px]">
                          {candidateSubdomain}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ACCORDION SECTION 1: Academic & Profile Details */}
              <div className="border-2 border-[#1E1B24] rounded-2xl shadow-[3px_3px_0px_#1E1B24] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(1)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-outfit-black bg-white hover:bg-[#FAF7EE] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Sparkles size={18} className="text-[#1E1B24] shrink-0" />
                    <span className="text-sm uppercase tracking-wide truncate">
                      1. Academic &amp; Profile Details
                    </span>
                    <span className="font-rubik text-xs font-semibold text-[#5C5866] shrink-0">
                      ({filled1}/4)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`border-2 border-[#1E1B24] px-2.5 py-0.5 rounded-full text-[11px] font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#1E1B24] ${status1.pillClass}`}
                    >
                      {status1.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#1E1B24] transition-transform duration-200 ${
                        openSection === 1 ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openSection === 1 && (
                  <div className="p-4 border-t-2 border-[#1E1B24] bg-white animate-in fade-in duration-150 flex flex-col gap-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Phone Number (Required) */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Phone Number <span className="text-[#D92323]">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="border-2 border-black rounded-xl bg-[#FFDE59] px-3 py-2 font-bold text-black flex items-center justify-center shadow-[2px_2px_0px_#000] text-sm select-none shrink-0">
                            +91
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            value={formData.phoneno}
                            onChange={(e) =>
                              handleChange(
                                "phoneno",
                                e.target.value.replace(/\D/g, "").slice(0, 10),
                              )
                            }
                            placeholder="9876543210"
                            className={`w-full px-3 py-2 rounded-xl border-2 font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none transition-all ${
                              phoneError
                                ? "border-[#FF4D4D] bg-[#FEF2F2] focus:ring-2 focus:ring-[#FF4D4D]"
                                : "border-[#1E1B24] focus:ring-2 focus:ring-[#FF4D4D]"
                            }`}
                          />
                        </div>
                        {phoneError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {phoneError}
                          </span>
                        )}
                      </div>

                      {/* Section */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          College Section <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.section}
                          onChange={(e) =>
                            handleChange("section", e.target.value)
                          }
                          placeholder="e.g. CSE-A, ECE-B"
                          className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                        />
                      </div>

                      {/* Cloudinary Picture URL */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Picture URL (Cloudinary){" "}
                          <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.pictureUrl}
                          onChange={(e) =>
                            handleChange("pictureUrl", e.target.value)
                          }
                          placeholder="https://res.cloudinary.com/..."
                          className={`px-3 py-2 rounded-xl border-2 font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none transition-all ${
                            errors.pictureUrl
                              ? "border-[#D92323] bg-[#FEF2F2]"
                              : "border-[#1E1B24] focus:ring-2 focus:ring-[#FF4D4D]"
                          }`}
                        />
                        {errors.pictureUrl && (
                          <span className="font-rubik text-[11px] text-[#D92323] font-bold">
                            {errors.pictureUrl}
                          </span>
                        )}
                      </div>

                      {/* Caption / Bio */}
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Caption / Bio <span className="text-[#D92323]">*</span>
                        </label>
                        <textarea
                          rows={2}
                          required
                          value={formData.caption}
                          onChange={(e) =>
                            handleChange("caption", e.target.value)
                          }
                          placeholder="Short bio or quote about yourself..."
                          className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION SECTION 2: Faculty Advisor Details */}
              <div className="border-2 border-[#1E1B24] rounded-2xl shadow-[3px_3px_0px_#1E1B24] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(2)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-outfit-black bg-white hover:bg-[#FAF7EE] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <GraduationCap
                      size={18}
                      className="text-[#1E1B24] shrink-0"
                    />
                    <span className="text-sm uppercase tracking-wide truncate">
                      2. Faculty Advisor Details
                    </span>
                    <span className="font-rubik text-xs font-semibold text-[#5C5866] shrink-0">
                      ({filled2}/3)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`border-2 border-[#1E1B24] px-2.5 py-0.5 rounded-full text-[11px] font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#1E1B24] ${status2.pillClass}`}
                    >
                      {status2.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#1E1B24] transition-transform duration-200 ${
                        openSection === 2 ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openSection === 2 && (
                  <div className="p-4 border-t-2 border-[#1E1B24] bg-white animate-in fade-in duration-150 flex flex-col gap-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* FA Name */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          FA Name <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.faname}
                          onChange={(e) =>
                            handleChange("faname", e.target.value)
                          }
                          placeholder="e.g. Dr. Jane Doe"
                          className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                        />
                      </div>

                      {/* FA Phone */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          FA Phone Number <span className="text-[#D92323]">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="border-2 border-black rounded-xl bg-[#FFDE59] px-3 py-2 font-bold text-black flex items-center justify-center shadow-[2px_2px_0px_#000] text-sm select-none shrink-0">
                            +91
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            value={formData.faphonenumber}
                            onChange={(e) =>
                              handleChange(
                                "faphonenumber",
                                e.target.value.replace(/\D/g, "").slice(0, 10),
                              )
                            }
                            placeholder="9876543210"
                            className={`w-full px-3 py-2 rounded-xl border-2 font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none transition-all ${
                              faPhoneError
                                ? "border-[#FF4D4D] bg-[#FEF2F2] focus:ring-2 focus:ring-[#FF4D4D]"
                                : "border-[#1E1B24] focus:ring-2 focus:ring-[#FF4D4D]"
                            }`}
                          />
                        </div>
                        {faPhoneError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {faPhoneError}
                          </span>
                        )}
                      </div>

                      {/* FA Email */}
                      <div className="sm:col-span-2 flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          FA Email ID <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.faemailid}
                          onChange={(e) =>
                            handleChange("faemailid", e.target.value)
                          }
                          placeholder="faculty.name@srmist.edu.in"
                          className={`px-3 py-2 rounded-xl border-2 font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none transition-all ${
                            faEmailError
                              ? "border-[#FF4D4D] bg-[#FEF2F2] focus:ring-2 focus:ring-[#FF4D4D]"
                              : "border-[#1E1B24] focus:ring-2 focus:ring-[#FF4D4D]"
                          }`}
                        />
                        {faEmailError && (
                          <span className="font-rubik text-[11px] text-[#FF4D4D] font-bold">
                            {faEmailError}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION SECTION 3: Social Handles */}
              <div className="border-2 border-[#1E1B24] rounded-2xl shadow-[3px_3px_0px_#1E1B24] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(3)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-outfit-black bg-white hover:bg-[#FAF7EE] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Share2 size={18} className="text-[#1E1B24] shrink-0" />
                    <span className="text-sm uppercase tracking-wide truncate">
                      3. Social Handles
                    </span>
                    <span className="font-rubik text-xs font-semibold text-[#5C5866] shrink-0">
                      ({filled3}/4)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`border-2 border-[#1E1B24] px-2.5 py-0.5 rounded-full text-[11px] font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#1E1B24] ${status3.pillClass}`}
                    >
                      {status3.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#1E1B24] transition-transform duration-200 ${
                        openSection === 3 ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openSection === 3 && (
                  <div className="p-4 border-t-2 border-[#1E1B24] bg-white animate-in fade-in duration-150 flex flex-col gap-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* GitHub */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          GitHub URL <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.github}
                          onChange={(e) =>
                            handleChange("github", e.target.value)
                          }
                          placeholder="https://github.com/username"
                          className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          LinkedIn URL <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.linkedin}
                          onChange={(e) =>
                            handleChange("linkedin", e.target.value)
                          }
                          placeholder="https://linkedin.com/in/username"
                          className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                        />
                      </div>

                      {/* Instagram */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Instagram Handle / URL{" "}
                          <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.insta}
                          onChange={(e) =>
                            handleChange("insta", e.target.value)
                          }
                          placeholder="@username or https://instagram.com/..."
                          className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                        />
                      </div>

                      {/* Portfolio */}
                      <div className="flex flex-col gap-1">
                        <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                          Portfolio URL <span className="text-[#D92323]">*</span>
                        </label>
                        <input
                          type="url"
                          required
                          value={formData.portfolio}
                          onChange={(e) =>
                            handleChange("portfolio", e.target.value)
                          }
                          placeholder="https://yourportfolio.dev"
                          className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ACCORDION SECTION 4: NDA Submission */}
              <div className="border-2 border-[#1E1B24] rounded-2xl shadow-[3px_3px_0px_#1E1B24] overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => toggleSection(4)}
                  className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left font-outfit-black bg-white hover:bg-[#FAF7EE] transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText size={18} className="text-[#1E1B24] shrink-0" />
                    <span className="text-sm uppercase tracking-wide truncate">
                      4. NDA Submission
                    </span>
                    <span className="font-rubik text-xs font-semibold text-[#5C5866] shrink-0">
                      ({filled4}/1)
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={`border-2 border-[#1E1B24] px-2.5 py-0.5 rounded-full text-[11px] font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#1E1B24] ${status4.pillClass}`}
                    >
                      {status4.label}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-[#1E1B24] transition-transform duration-200 ${
                        openSection === 4 ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {openSection === 4 && (
                  <div className="p-4 border-t-2 border-[#1E1B24] bg-[#F8FAFC] animate-in fade-in duration-150 flex flex-col gap-3.5">
                    <p className="font-rubik text-xs text-[#5C5866]">
                      Download the official GCSRM NDA template. Sign it physically
                      or digitally, upload to Google Drive or Cloudinary, and paste
                      the public link below.
                    </p>

                    <div>
                      <a
                        href="/assets/NDA_Template.pdf"
                        download="NDA_Template.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-outfit-black text-xs uppercase px-4 py-2.5 bg-[#FFDE59] hover:bg-[#f0cf48] text-black transition-all cursor-pointer"
                      >
                        <Download size={16} />
                        <span>Download NDA Template (.pdf)</span>
                      </a>
                    </div>

                    <div className="flex flex-col gap-1 pt-1">
                      <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                        Signed NDA Document URL{" "}
                        <span className="text-[#D92323]">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        value={formData.ndaUrl}
                        onChange={(e) =>
                          handleChange("ndaUrl", e.target.value)
                        }
                        placeholder="https://drive.google.com/... or https://res.cloudinary.com/..."
                        className={`px-3 py-2 rounded-xl border-2 font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none transition-all ${
                          errors.ndaUrl
                            ? "border-[#D92323] bg-[#FEF2F2]"
                            : "border-[#1E1B24] focus:ring-2 focus:ring-[#FF4D4D]"
                        }`}
                      />
                      {errors.ndaUrl && (
                        <span className="font-rubik text-[11px] text-[#D92323] font-bold">
                          {errors.ndaUrl}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Validation Helper Note when Incomplete */}
              {!isFormComplete && (
                <div className="flex items-start gap-2 p-3 bg-[#FFFEEF] border-2 border-[#1E1B24] rounded-xl shadow-[2px_2px_0px_#1E1B24] text-xs font-rubik text-[#1E1B24]">
                  <Info size={16} className="shrink-0 mt-0.5 text-[#1E1B24]" />
                  <span>
                    <strong>Attention:</strong> Complete all fields in{" "}
                    <span className="font-bold underline">
                      {incompleteSections.join(", ")}
                    </span>{" "}
                    to enable submission.
                  </span>
                </div>
              )}

              {/* Form Footer Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  disabled={totalFilled === 0 || isSubmitting}
                  className="px-4 py-2 text-xs md:text-sm font-bold border-2 border-black rounded-xl bg-[#FFF] text-[#FF4D4D] shadow-[2px_2px_0px_#000] hover:bg-red-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  Clear Draft
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-bold px-4 py-2.5 transition-all cursor-pointer bg-neutral-200 hover:bg-neutral-300 text-black text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormComplete || isSubmitting}
                  className={`inline-flex items-center gap-2 border-2 border-black rounded-xl font-outfit-black text-sm uppercase tracking-wide px-6 py-2.5 transition-all ${
                    isFormComplete && !isSubmitting
                      ? "bg-[#22C55E] hover:bg-[#1eb053] text-white shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] cursor-pointer"
                      : "bg-neutral-300 text-neutral-500 shadow-none border-neutral-400 cursor-not-allowed opacity-75"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Custom Neo-Brutalist Clear Draft Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-md w-full bg-[#FFFDF5] border-[3px] border-black rounded-2xl p-6 shadow-[6px_6px_0px_#000] flex flex-col gap-4 text-left animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center gap-2.5">
              <span className="bg-[#FF4D4D] text-white border-2 border-black px-2.5 py-0.5 rounded-full text-xs font-outfit-black uppercase shadow-[1.5px_1.5px_0px_#000]">
                WARNING
              </span>
              <h3 className="font-outfit-black text-lg text-[#1E1B24] tracking-tight">
                Clear Saved Draft?
              </h3>
            </div>

            {/* Body */}
            <p className="font-rubik text-sm text-[#5C5866] leading-relaxed">
              Are you sure you want to clear your saved draft? All unsaved inputs across all sections will be reset.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="border-2 border-black rounded-xl bg-[#FFF] hover:bg-neutral-100 px-4 py-2 font-bold text-xs md:text-sm shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer text-[#1E1B24]"
              >
                Cancel / Keep Draft
              </button>
              <button
                type="button"
                onClick={handleExecuteClearDraft}
                className="border-2 border-black rounded-xl bg-[#FF4D4D] hover:bg-[#e04343] text-white px-4 py-2 font-bold text-xs md:text-sm shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                Yes, Clear Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateDataModal;

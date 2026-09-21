"use client";

import React, { useState, useEffect } from "react";
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

export function UpdateDataModal({
  isOpen,
  onClose,
  participant,
  onSave,
}: UpdateDataModalProps) {
  const { updateParticipant } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    phoneno: "",
    section: "",
    subdomain: "",
    caption: "",
    pictureUrl: "",
    github: "",
    linkedin: "",
    insta: "",
    portfolio: "",
    faname: "",
    faphonenumber: "",
    faemailid: "",
    ndaUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize and pre-fill form fields when modal opens
  useEffect(() => {
    if (isOpen && participant) {
      setFormData((prev) => ({
        ...prev,
        phoneno: participant.phone || prev.phoneno || "",
        github: participant.links?.github || prev.github || "",
        portfolio:
          participant.links?.demo ||
          participant.links?.deployment ||
          prev.portfolio ||
          "",
      }));
      setErrors({});
      setSubmitError(null);
      setIsSuccess(false);
    }
  }, [isOpen, participant]);

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

  if (!isOpen) return null;

  const handleChange = (
    field: keyof typeof formData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    const trimmedPhone = formData.phoneno.trim();

    if (!trimmedPhone) {
      errs.phoneno = "Phone number is required";
    } else if (!/^[0-9+\s-]{10,15}$/.test(trimmedPhone)) {
      errs.phoneno = "Enter a valid 10-15 digit phone number";
    }

    if (
      formData.faemailid.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.faemailid.trim())
    ) {
      errs.faemailid = "Enter a valid email address (e.g. name@srmist.edu.in)";
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
      errs.ndaUrl = "Enter a valid document link starting with http:// or https://";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
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
      subdomain: formData.subdomain.trim() || undefined,
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

      if (updateParticipant) {
        updateParticipant({
          phone: formData.phoneno.trim(),
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
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex flex-col gap-5 text-left">
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
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
                  {participant?.domain && (
                    <div className="sm:col-span-2 flex items-center gap-1.5">
                      <strong className="text-[#1E1B24]">Domain:</strong>
                      <span className="inline-block uppercase font-outfit-black text-[#1E1B24] bg-[#FFD93D] px-2 py-0.5 rounded border border-[#1E1B24] text-[10px]">
                        {participant.domain}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 1: Member Contact & Academic Info */}
              <div className="border-2 border-[#1E1B24] rounded-xl p-4 shadow-[3px_3px_0px_#1E1B24] bg-white flex flex-col gap-3.5">
                <div className="flex items-center gap-2 border-b border-[#1E1B24]/15 pb-2">
                  <Sparkles size={18} className="text-[#1E1B24]" />
                  <h3 className="font-outfit-black text-sm uppercase tracking-wider text-[#1E1B24]">
                    1. Member Profile &amp; Contact
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Phone Number (Required) */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      Phone Number <span className="text-[#D92323]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneno}
                      onChange={(e) => handleChange("phoneno", e.target.value)}
                      placeholder="+91 98765 43210"
                      className={`px-3 py-2 rounded-xl border-2 font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none transition-all ${
                        errors.phoneno
                          ? "border-[#D92323] bg-[#FEF2F2]"
                          : "border-[#1E1B24] focus:ring-2 focus:ring-[#FF4D4D]"
                      }`}
                    />
                    {errors.phoneno && (
                      <span className="font-rubik text-[11px] text-[#D92323] font-bold">
                        {errors.phoneno}
                      </span>
                    )}
                  </div>

                  {/* Section */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      College Section
                    </label>
                    <input
                      type="text"
                      value={formData.section}
                      onChange={(e) => handleChange("section", e.target.value)}
                      placeholder="e.g. CSE-A, ECE-B"
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                    />
                  </div>

                  {/* Subdomain */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      Subdomain Track
                    </label>
                    <input
                      type="text"
                      value={formData.subdomain}
                      onChange={(e) => handleChange("subdomain", e.target.value)}
                      placeholder="e.g. Web Development, UI/UX, AI/ML"
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                    />
                  </div>

                  {/* Cloudinary Picture URL */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      Picture URL (Cloudinary)
                    </label>
                    <input
                      type="url"
                      value={formData.pictureUrl}
                      onChange={(e) => handleChange("pictureUrl", e.target.value)}
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
                      Caption / Bio
                    </label>
                    <textarea
                      rows={2}
                      value={formData.caption}
                      onChange={(e) => handleChange("caption", e.target.value)}
                      placeholder="A short punchy bio or quote about yourself..."
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Social Links */}
              <div className="border-2 border-[#1E1B24] rounded-xl p-4 shadow-[3px_3px_0px_#1E1B24] bg-white flex flex-col gap-3.5">
                <div className="flex items-center gap-2 border-b border-[#1E1B24]/15 pb-2">
                  <Share2 size={18} className="text-[#1E1B24]" />
                  <h3 className="font-outfit-black text-sm uppercase tracking-wider text-[#1E1B24]">
                    2. Socials &amp; Portfolio
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* GitHub */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={formData.github}
                      onChange={(e) => handleChange("github", e.target.value)}
                      placeholder="https://github.com/username"
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => handleChange("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      Instagram Handle / URL
                    </label>
                    <input
                      type="text"
                      value={formData.insta}
                      onChange={(e) => handleChange("insta", e.target.value)}
                      placeholder="@username or https://instagram.com/..."
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                    />
                  </div>

                  {/* Portfolio */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      Personal Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => handleChange("portfolio", e.target.value)}
                      placeholder="https://yourportfolio.dev"
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Faculty Advisor (FA) Details */}
              <div className="border-2 border-[#1E1B24] rounded-xl p-4 shadow-[3px_3px_0px_#1E1B24] bg-white flex flex-col gap-3.5">
                <div className="flex items-center gap-2 border-b border-[#1E1B24]/15 pb-2">
                  <GraduationCap size={18} className="text-[#1E1B24]" />
                  <h3 className="font-outfit-black text-sm uppercase tracking-wider text-[#1E1B24]">
                    3. Faculty Advisor (FA) Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* FA Name */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      FA Name
                    </label>
                    <input
                      type="text"
                      value={formData.faname}
                      onChange={(e) => handleChange("faname", e.target.value)}
                      placeholder="e.g. Dr. Jane Doe"
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                    />
                  </div>

                  {/* FA Phone */}
                  <div className="flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      FA Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.faphonenumber}
                      onChange={(e) => handleChange("faphonenumber", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="px-3 py-2 rounded-xl border-2 border-[#1E1B24] font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
                    />
                  </div>

                  {/* FA Email */}
                  <div className="sm:col-span-2 flex flex-col gap-1">
                    <label className="font-outfit-black text-xs uppercase tracking-wider text-[#1E1B24]">
                      FA Official Email ID
                    </label>
                    <input
                      type="email"
                      value={formData.faemailid}
                      onChange={(e) => handleChange("faemailid", e.target.value)}
                      placeholder="faculty.name@ktr.srmist.edu.in"
                      className={`px-3 py-2 rounded-xl border-2 font-rubik text-sm shadow-[2px_2px_0px_#1E1B24] focus:outline-none transition-all ${
                        errors.faemailid
                          ? "border-[#D92323] bg-[#FEF2F2]"
                          : "border-[#1E1B24] focus:ring-2 focus:ring-[#FF4D4D]"
                      }`}
                    />
                    {errors.faemailid && (
                      <span className="font-rubik text-[11px] text-[#D92323] font-bold">
                        {errors.faemailid}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: NDA Section */}
              <div className="border-2 border-[#1E1B24] rounded-xl p-4 shadow-[3px_3px_0px_#1E1B24] bg-[#F8FAFC] flex flex-col gap-3.5">
                <div className="flex items-center gap-2 border-b border-[#1E1B24]/15 pb-2">
                  <FileText size={18} className="text-[#1E1B24]" />
                  <h3 className="font-outfit-black text-sm uppercase tracking-wider text-[#1E1B24]">
                    4. Non-Disclosure Agreement (NDA)
                  </h3>
                </div>

                <p className="font-rubik text-xs text-[#5C5866]">
                  Download the official GCSRM NDA document template. Sign it physically
                  or digitally, upload it to Google Drive or Cloudinary, and submit the public access link below.
                </p>

                <div className="flex items-center gap-3">
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
                    Signed NDA Document URL
                  </label>
                  <input
                    type="url"
                    value={formData.ndaUrl}
                    onChange={(e) => handleChange("ndaUrl", e.target.value)}
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

              {/* Form Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
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
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000] font-outfit-black text-sm uppercase tracking-wide px-6 py-2.5 transition-all cursor-pointer bg-[#FF4D4D] hover:bg-[#e04343] text-white disabled:opacity-75 disabled:cursor-not-allowed"
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
    </div>
  );
}

export default UpdateDataModal;

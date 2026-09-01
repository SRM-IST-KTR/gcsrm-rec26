"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SectionBadge from "@/components/common/SectionBadge";
import Popup from "@/components/common/Popup";
import Dropdown from "@/components/common/Dropdown";
import { api, ApiError } from "@/lib/api";
import { getOtpSession, clearOtpSession } from "@/lib/otpSession";

const emailPattern = /^[^\s@]+@srmist\.edu\.in$/i;
const registrationNumberPattern = /^RA\d+$/;
const domains = ["Technical", "Creatives", "Corporate"];
const years = ["1st Year", "2nd Year"];

type FormData = {
  name: string;
  email: string;
  registrationNumber: string;
  phone: string;
  year: string;
  domain: string;
  degree: string;
  branch: string;
};

type FieldName = keyof FormData;
type Errors = Partial<Record<FieldName, string>>;

const initialFormData: FormData = {
  name: "",
  email: "",
  registrationNumber: "",
  phone: "",
  year: "",
  domain: "",
  degree: "B.Tech",
  branch: "",
};

function validateField(field: FieldName, value: string) {
  if (!value.trim()) return "This field is required.";

  switch (field) {
    case "email":
      return emailPattern.test(value.trim())
        ? ""
        : "Use your SRM email ending with @srmist.edu.in.";
    case "registrationNumber":
      return registrationNumberPattern.test(value.trim())
        ? ""
        : "Registration number must start with RA.";
    case "phone":
      return /^\d{10}$/.test(value)
        ? ""
        : "Phone number must contain exactly 10 digits.";
    case "year":
      return ["1st Year", "2nd Year", "1", "2"].includes(value)
        ? ""
        : "Select 1st Year or 2nd Year.";
    case "domain":
      return domains.includes(value) ? "" : "Select a valid domain.";
    case "branch":
      return value.trim() ? "" : "Please enter your branch.";
    default:
      return "";
  }
}

type RegistrationFormProps = {
  initialEmail?: string;
};

export default function RegistrationForm({ initialEmail = "" }: RegistrationFormProps) {
  const searchParams = useSearchParams();
  const domainQuery = searchParams.get("domain") || "";
  const validDomain = domains.includes(domainQuery) ? domainQuery : "";
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    email: initialEmail,
    domain: validDomain,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const CACHE_KEY = "gcsrm_registration_cache";

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const branchVal =
          parsed.branch ||
          (parsed.degreeWithBranch
            ? parsed.degreeWithBranch.replace(/^B\.Tech\s*/i, "")
            : "");

        // Determine year if cached reg number exists
        const regNo = parsed.registrationNumber || "";
        let autoYear = parsed.year || "";
        if (regNo.toUpperCase().startsWith("RA26")) {
          autoYear = "1st Year";
        } else if (regNo.toUpperCase().startsWith("RA25")) {
          autoYear = "2nd Year";
        }

        setFormData((prev) => ({
          ...prev,
          ...parsed,
          branch: branchVal,
          degree: "B.Tech",
          year: autoYear || parsed.year || "",
          email: initialEmail,
          domain: validDomain || parsed.domain || "",
        }));
      }
    } catch (e) {
      console.error("Failed to parse cached registration data", e);
    }
  }, [initialEmail, validDomain]);

  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error("Failed to cache registration data", e);
    }
  }, [formData]);

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    type: "success" | "error" | "info";
    title?: string;
    message: string;
    autoCloseMs?: number;
  }>({
    isOpen: false,
    type: "info",
    message: "",
  });

  const router = useRouter();
  const { login } = useAuth();

  // Smart Year Auto-fill flag
  const isYearDisabled =
    formData.registrationNumber.trim().toUpperCase().startsWith("RA26") ||
    formData.registrationNumber.trim().toUpperCase().startsWith("RA25");

  const handleBack = () => {
    clearOtpSession();
    router.push("/");
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const field = event.target.name as FieldName;
    let value = event.target.value;

    if (field === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    if (field === "registrationNumber") {
      const upper = value.toUpperCase();
      let autoYear = formData.year;
      if (upper.startsWith("RA26")) {
        autoYear = "1st Year";
      } else if (upper.startsWith("RA25")) {
        autoYear = "2nd Year";
      }

      setFormData((current) => ({
        ...current,
        registrationNumber: value,
        year: autoYear,
      }));
      setErrors((current) => ({
        ...current,
        registrationNumber: validateField("registrationNumber", value),
        year: validateField("year", autoYear),
      }));
      return;
    }

    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
  };

  const handleDropdownChange = (field: FieldName, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      Object.entries(formData).map(([field, value]) => [
        field,
        validateField(field as FieldName, value),
      ])
    ) as Errors;

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    // Intercept with confirmation modal before API dispatch
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      const session = getOtpSession();
      if (!session?.token) {
        throw new ApiError(0, {
          success: false,
          message: "Email verification required. Please verify your email first.",
        });
      }

      const degreeWithBranch = `B.Tech ${formData.branch.trim()}`;

      const { user } = await api.applyForRecruitment(session.token, {
        name: formData.name,
        email: formData.email,
        registrationNumber: formData.registrationNumber,
        phone: formData.phone,
        year: formData.year,
        domain: formData.domain,
        degreeWithBranch,
      });

      // Registration completed → the OTP session is no longer needed.
      clearOtpSession();

      setPopup({
        isOpen: true,
        type: "success",
        title: "Registration Successful!",
        message: "Registration Successful!",
        autoCloseMs: 3000,
      });
      setFormData(initialFormData);
      setErrors({});
      try {
        localStorage.removeItem(CACHE_KEY);
      } catch {}

      setTimeout(() => {
        login(user);
        router.push("/");

        setTimeout(() => {
          const statusSection = document.getElementById("status");
          if (statusSection) {
            statusSection.scrollIntoView({ behavior: "smooth" });
          }
        }, 400);
      }, 2000);
    } catch (err) {
      setIsSubmitting(false);

      let errorText = "";
      let status = 0;
      if (err instanceof ApiError) {
        errorText = err.error || err.message;
        status = err.status;
      } else {
        errorText = "An error occurred: Check your network or input details.";
      }

      const isRegistrationClosed =
        errorText.toLowerCase().includes("registration period has ended") ||
        errorText.toLowerCase().includes("registration has ended") ||
        errorText.toLowerCase().includes("no new registrations are being accepted");

      if (isRegistrationClosed) {
        setPopup({
          isOpen: true,
          type: "error",
          title: "Registration Ended",
          message:
            errorText ||
            "Registration period has ended. No new registrations are being accepted.",
        });
        return;
      }

      if (status >= 500 || status === 0) {
        setPopup({
          isOpen: true,
          type: "error",
          title: "Server Error",
          message: "An error occurred: It's our fault. Please try again later.",
        });
        return;
      }

      setPopup({
        isOpen: true,
        type: "error",
        title: "Client Error",
        message: "An error occurred: Check your network or input details.",
      });
    }
  };

  const inputClass = (field: FieldName) =>
    `w-full bg-white border-[3px] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] p-6 font-rubik text-[18px] font-medium text-[#1E1B24] placeholder:text-[#5C5866]/50 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#1E1B24] transition-all ${
      errors[field] ? "border-[#D92323]" : "border-[#1E1B24]"
    }`;

  const fieldError = (field: FieldName) =>
    errors[field] ? (
      <p className="font-rubik text-sm font-medium text-[#D92323]" role="alert">
        {errors[field]}
      </p>
    ) : null;

  return (
    <>
      <Popup
        isOpen={popup.isOpen}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        autoCloseMs={popup.autoCloseMs}
        onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Neobrutalist Confirmation Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B24]/70 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-modal-title"
        >
          <div className="w-full max-w-[520px] bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[8px_8px_0px_#1E1B24] p-6 sm:p-8 flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#FFD93D] shrink-0">
                CONFIRMATION
              </span>
              <h3
                id="confirm-modal-title"
                className="font-outfit-black text-[22px] sm:text-[24px] text-[#1E1B24] tracking-tight"
              >
                Submit Application?
              </h3>
            </div>

            <p className="font-rubik text-[14px] sm:text-[15px] font-medium text-[#5C5866] leading-relaxed">
              Please double-check your application details. Once submitted, your registration
              domain and responses cannot be changed.
            </p>

            {/* Application Summary Box */}
            <div className="bg-[#FFFEEF] border-2 border-[#1E1B24] rounded-[18px] p-4 flex flex-col gap-2.5 shadow-[3px_3px_0px_#1E1B24]">
              <div className="flex justify-between items-center text-sm">
                <span className="font-rubik text-[#5C5866]">Name:</span>
                <span className="font-outfit-black text-[#1E1B24] text-right">
                  {formData.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-rubik text-[#5C5866]">Email:</span>
                <span className="font-rubik font-semibold text-[#1E1B24] text-right">
                  {formData.email}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-rubik text-[#5C5866]">Reg. Number:</span>
                <span className="font-rubik font-semibold text-[#1E1B24] text-right">
                  {formData.registrationNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-rubik text-[#5C5866]">Domain:</span>
                <span className="font-outfit-black text-xs uppercase px-2.5 py-0.5 rounded-full bg-[#4EC37B] border border-[#1E1B24] text-white">
                  {formData.domain}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-rubik text-[#5C5866]">Year:</span>
                <span className="font-rubik font-semibold text-[#1E1B24] text-right">
                  {formData.year}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-rubik text-[#5C5866]">Degree &amp; Branch:</span>
                <span className="font-rubik font-medium text-[#1E1B24] text-right">
                  B.Tech {formData.branch}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-3 rounded-xl border-2 border-[#1E1B24] bg-[#FAF7EE] text-[#1E1B24] font-rubik font-bold text-sm shadow-[2px_2px_0px_#1E1B24] hover:bg-[#E5E0D4] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
              >
                Review Again
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl border-2 border-[#1E1B24] bg-[#4EC37B] text-white font-outfit-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_#1E1B24] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1E1B24] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit!"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section
        className="relative overflow-hidden bg-[#FFFEEF] py-24 min-h-screen"
        id="apply"
        style={{
          backgroundImage: "url('/login/icon.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Neobrutalist Circular Red Back Button */}
        <button
          type="button"
          onClick={handleBack}
          aria-label="Back to home"
          title="Back to home"
          className="absolute top-6 left-6 sm:top-8 sm:left-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500 border-4 border-[#1E1B24] shadow-[4px_4px_0px_#1E1B24] flex items-center justify-center text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1B24] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all cursor-pointer group"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <img
          src="/login/char-laptop.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute"
          style={{ left: "-30px", top: "20px", width: "clamp(130px, 17vw, 230px)", zIndex: 1 }}
        />
        <img
          src="/login/char-bee.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute"
          style={{ right: "-30px", top: "-10px", width: "clamp(140px, 18vw, 250px)", zIndex: 1 }}
        />
        <img
          src="/login/char-action-kamen.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute"
          style={{ left: "-10px", bottom: "-20px", width: "clamp(150px, 20vw, 280px)", zIndex: 1 }}
        />
        <img
          src="/login/char-robot.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute"
          style={{ right: "-20px", bottom: "-20px", width: "clamp(140px, 19vw, 260px)", zIndex: 1 }}
        />

        <div className="max-w-[800px] mx-auto flex flex-col items-center px-4 relative z-10">
          <SectionBadge label="Registration form" variant="yellow" className="mb-8" />
          <h2 className="font-outfit-black text-[48px] text-[#1E1B24] text-center mb-4 tracking-[-1.5px] leading-tight">
            Registration Details
          </h2>

          {/* Neobrutalist Introductory Banner */}
          <div className="w-full max-w-[680px] bg-white border-[3px] border-[#1E1B24] shadow-[4px_4px_0px_#1E1B24] rounded-[20px] p-4 sm:p-5 text-center mb-12 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#FFD93D] shrink-0">
              NOTICE
            </span>
            <p className="font-rubik text-[15px] sm:text-[16px] font-medium text-[#1E1B24] leading-relaxed">
              Ready to join the club? Please fill out the form details below and let&apos;s get you
              on board!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
            {/* Full Name */}
            <div className="flex flex-col space-y-3">
              <label htmlFor="name" className="font-outfit-black text-[20px] text-[#1E1B24]">
                Full Name
              </label>
              {fieldError("name")}
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className={inputClass("name")}
              />
            </div>

            {/* SRM Email ID */}
            <div className="flex flex-col space-y-3">
              <label htmlFor="email" className="font-outfit-black text-[20px] text-[#1E1B24]">
                SRM email id
              </label>
              {fieldError("email")}
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                aria-disabled="true"
                className={`${inputClass(
                  "email"
                )} font-normal bg-[#E8E8E8] text-[#777777] border-[#AAAAAA] shadow-none cursor-not-allowed`}
              />
            </div>

            {/* Registration Number */}
            <div className="flex flex-col space-y-3">
              <label
                htmlFor="registrationNumber"
                className="font-outfit-black text-[20px] text-[#1E1B24]"
              >
                Registration Number
              </label>
              {fieldError("registrationNumber")}
              <input
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g. RA2611003010079"
                className={inputClass("registrationNumber")}
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col space-y-3">
              <label htmlFor="phone" className="font-outfit-black text-[20px] text-[#1E1B24]">
                Phone Number
              </label>
              {fieldError("phone")}
              <input
                type="tel"
                id="phone"
                name="phone"
                inputMode="numeric"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className={inputClass("phone")}
              />
            </div>

            {/* Year Dropdown with Smart Auto-fill */}
            <div className="flex flex-col space-y-3 relative z-30">
              <div className="flex items-center justify-between">
                <label htmlFor="year" className="font-outfit-black text-[20px] text-[#1E1B24]">
                  Year
                </label>
                {isYearDisabled && (
                  <span className="font-rubik text-xs font-bold text-[#4EC37B] bg-[#EBFBF0] border border-[#4EC37B] rounded-full px-2.5 py-0.5">
                    Auto-detected from Reg. No.
                  </span>
                )}
              </div>
              {fieldError("year")}
              <Dropdown
                id="year"
                name="year"
                value={formData.year}
                options={years}
                placeholder="Select your year"
                error={errors.year}
                disabled={isYearDisabled}
                triggerBg={isYearDisabled ? "bg-[#F3F2EA]" : "bg-[#FFD93D]"}
                onChange={(val) => handleDropdownChange("year", val)}
              />
            </div>

            {/* Domain Dropdown */}
            <div className="flex flex-col space-y-3 relative z-20">
              <label htmlFor="domain" className="font-outfit-black text-[20px] text-[#1E1B24]">
                Domain
              </label>
              {fieldError("domain")}
              <Dropdown
                id="domain"
                name="domain"
                value={formData.domain}
                options={domains}
                placeholder="Select a domain"
                error={errors.domain}
                onChange={(val) => handleDropdownChange("domain", val)}
              />
            </div>

            {/* Split Degree & Branch Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Field 1: Degree (Locked to B.Tech) */}
              <div className="flex flex-col space-y-3 sm:col-span-1">
                <label htmlFor="degree" className="font-outfit-black text-[20px] text-[#1E1B24]">
                  Degree
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value="B.Tech"
                  disabled
                  aria-disabled="true"
                  className="w-full bg-[#E8E8E8] text-[#1E1B24] border-[3px] border-[#1E1B24] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] p-6 font-rubik text-[18px] font-bold cursor-not-allowed select-none"
                />
              </div>

              {/* Field 2: Branch */}
              <div className="flex flex-col space-y-3 sm:col-span-2">
                <label htmlFor="branch" className="font-outfit-black text-[20px] text-[#1E1B24]">
                  Branch
                </label>
                {fieldError("branch")}
                <input
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="e.g. CSE Core, AI/ML, ECE"
                  className={inputClass("branch")}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#3E9FFF] border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] px-10 py-4 font-outfit-black text-[18px] text-white tracking-[1px] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1B24] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Apply Now!"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
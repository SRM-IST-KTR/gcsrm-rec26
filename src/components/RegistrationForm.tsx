"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SectionBadge from "@/components/common/SectionBadge";
import Popup from "@/components/common/Popup";

const emailPattern = /^[^\s@]+@srmist\.edu\.in$/i;
const registrationNumberPattern = /^RA\d+$/;
const domains = ["Technical", "Creatives", "Corporate"];
const years = ["1", "2"];

type FormData = {
  name: string;
  email: string;
  registrationNumber: string;
  phone: string;
  year: string;
  domain: string;
  degreeWithBranch: string;
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
  degreeWithBranch: "",
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
      return years.includes(value) ? "" : "Select year 1 or 2.";
    case "domain":
      return domains.includes(value) ? "" : "Select a valid domain.";
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
  const [formData, setFormData] = useState({ ...initialFormData, email: initialEmail, domain: validDomain });
  const CACHE_KEY = "gcsrm_registration_cache";

  useEffect(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          email: initialEmail,
          domain: validDomain || parsed.domain || ""
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

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const field = event.target.name as FieldName;
    const value = field === "phone"
      ? event.target.value.replace(/\D/g, "").slice(0, 10)
      : event.target.value;

    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = Object.fromEntries(
      Object.entries(formData).map(([field, value]) => [
        field,
        validateField(field as FieldName, value),
      ])
    ) as Errors;

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let result: any = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (response.ok) {
        // 1. Trigger success popup first
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
        } catch (e) {}

        // 2. Delay login and redirect by 2500ms while keeping button in disabled/submitting state
        setTimeout(() => {
          if (result?.user) {
            login(result.user);
          }
          router.push("/");

          // Allow React time to render the conditionally mounted status section
          setTimeout(() => {
            const statusSection = document.getElementById("status");
            if (statusSection) {
              statusSection.scrollIntoView({ behavior: "smooth" });
            }
          }, 400);
        }, 2000);
        return;
      }

      setIsSubmitting(false);

      const errorText = typeof result?.error === "string" ? result.error : "";
      const isRegistrationClosed =
        errorText.toLowerCase().includes("registration period has ended") ||
        errorText.toLowerCase().includes("registration has ended") ||
        errorText.toLowerCase().includes("no new registrations are being accepted");

      if (isRegistrationClosed) {
        setPopup({
          isOpen: true,
          type: "error",
          title: "Registration Ended",
          message: errorText || "Registration period has ended. No new registrations are being accepted.",
        });
        return;
      }

      if (response.status >= 500) {
        setPopup({
          isOpen: true,
          type: "error",
          title: "Server Error",
          message: "An error occurred: It's our fault. Please try again later.",
        });
        return;
      }

      if (response.status >= 400 && response.status < 500) {
        setPopup({
          isOpen: true,
          type: "error",
          title: "Client Error",
          message: "An error occurred: Check your network or input details.",
        });
        return;
      }

      setPopup({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "An error occurred: Check your network or input details.",
      });
    } catch {
      setIsSubmitting(false);
      setPopup({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "An error occurred: Check your network or input details.",
      });
    }
  };

  const inputClass = (field: FieldName) =>
    `w-full bg-white border-[3px] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] p-6 font-rubik text-[18px] font-medium text-[#1E1B24] placeholder:text-[#5C5866]/50 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#1E1B24] transition-all ${errors[field] ? "border-[#D92323]" : "border-[#1E1B24]"}`;

  const fieldError = (field: FieldName) => errors[field] ? (
    <p className="font-rubik text-sm font-medium text-[#D92323]" role="alert">{errors[field]}</p>
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
      <section
        className="relative overflow-hidden bg-[#FFFEEF] py-24"
        id="apply"
      style={{
        backgroundImage: "url('/login/icon.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
        <h2 className="font-outfit-black text-[48px] text-[#1E1B24] text-center mb-4 tracking-[-1.5px] leading-tight">Registration Details</h2>
        
        {/* Neobrutalist Introductory Banner */}
        <div className="w-full max-w-[680px] bg-white border-[3px] border-[#1E1B24] shadow-[4px_4px_0px_#1E1B24] rounded-[20px] p-4 sm:p-5 text-center mb-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="font-outfit-black text-[12px] uppercase tracking-[1.5px] text-[#1E1B24] px-3 py-1 rounded-full border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24] bg-[#FFD93D] shrink-0">
            NOTICE
          </span>
          <p className="font-rubik text-[15px] sm:text-[16px] font-medium text-[#1E1B24] leading-relaxed">
            Ready to join the club? Please fill out the form details below and let&apos;s get you on board!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>
          <div className="flex flex-col space-y-3">
            <label htmlFor="name" className="font-outfit-black text-[20px] text-[#1E1B24]">Full Name</label>
            {fieldError("name")}
            <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" className={inputClass("name")} />
          </div>
          <div className="flex flex-col space-y-3">
            <label htmlFor="email" className="font-outfit-black text-[20px] text-[#1E1B24]">SRM email id</label>
            {fieldError("email")}
            <input type="email" id="email" name="email" value={formData.email} disabled aria-disabled="true" className={`${inputClass("email")} font-normal bg-[#E8E8E8] text-[#777777] border-[#AAAAAA] shadow-none cursor-not-allowed`} />
          </div>
          <div className="flex flex-col space-y-3">
            <label htmlFor="registrationNumber" className="font-outfit-black text-[20px] text-[#1E1B24]">Registration Number</label>
            {fieldError("registrationNumber")}
            <input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="e.g. RA2411003010079" className={inputClass("registrationNumber")} />
          </div>
          <div className="flex flex-col space-y-3">
            <label htmlFor="phone" className="font-outfit-black text-[20px] text-[#1E1B24]">Phone Number</label>
            {fieldError("phone")}
            <input type="tel" id="phone" name="phone" inputMode="numeric" maxLength={10} value={formData.phone} onChange={handleChange} placeholder="10-digit phone number" className={inputClass("phone")} />
          </div>
          <div className="flex flex-col space-y-3">
            <label htmlFor="year" className="font-outfit-black text-[20px] text-[#1E1B24]">Year</label>
            {fieldError("year")}
            <select id="year" name="year" value={formData.year} onChange={handleChange} className={`${inputClass("year")} cursor-pointer`}>
              <option value="" disabled>Select your year</option>
              {years.map((year) => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div className="flex flex-col space-y-3">
            <label htmlFor="domain" className="font-outfit-black text-[20px] text-[#1E1B24]">Domain</label>
            {fieldError("domain")}
            <select id="domain" name="domain" value={formData.domain} onChange={handleChange} className={`${inputClass("domain")} cursor-pointer`}>
              <option value="" disabled>Select a domain</option>
              {domains.map((domain) => <option key={domain} value={domain}>{domain}</option>)}
            </select>
          </div>
          <div className="flex flex-col space-y-3">
            <label htmlFor="degreeWithBranch" className="font-outfit-black text-[20px] text-[#1E1B24]">Degree with Branch</label>
            {fieldError("degreeWithBranch")}
            <input id="degreeWithBranch" name="degreeWithBranch" value={formData.degreeWithBranch} onChange={handleChange} placeholder="e.g. B.Tech CSE" className={inputClass("degreeWithBranch")} />
          </div>
          <div className="pt-8 flex justify-center">
            <button type="submit" disabled={isSubmitting} className="bg-[#3E9FFF] border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] px-10 py-4 font-outfit-black text-[18px] text-white tracking-[1px] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1B24] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
              {isSubmitting ? "Submitting..." : "Apply Now!"}
            </button>
          </div>
        </form>
      </div>
    </section>
  </>
  );
}

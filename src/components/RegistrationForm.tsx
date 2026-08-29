"use client";

import { useState } from "react";

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
  const [formData, setFormData] = useState({ ...initialFormData, email: initialEmail });
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const field = event.target.name as FieldName;
    const value = field === "phone"
      ? event.target.value.replace(/\D/g, "").slice(0, 10)
      : event.target.value;

    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
    setSubmitError("");
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
    setSubmitError("");
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (!response.ok) {
        setSubmitError(result.error || "Unable to submit your application.");
        return;
      }

      setFormData(initialFormData);
      setErrors({});
      alert("Application submitted successfully!");
    } catch {
      setSubmitError("Unable to submit your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: FieldName) =>
    `w-full bg-white border-[3px] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] p-6 font-rubik text-[18px] font-medium text-[#1E1B24] placeholder:text-[#5C5866]/50 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#1E1B24] transition-all ${errors[field] ? "border-[#D92323]" : "border-[#1E1B24]"}`;

  const fieldError = (field: FieldName) => errors[field] ? (
    <p className="font-rubik text-sm font-medium text-[#D92323]" role="alert">{errors[field]}</p>
  ) : null;

  return (
    <section className="bg-[#FFFEEF] py-24" id="apply">
      <div className="max-w-[800px] mx-auto flex flex-col items-center px-4">
        <div className="bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-full px-6 py-2 mb-8 shadow-[3px_3px_0px_#1E1B24]">
          <span className="font-outfit-black text-[14px] text-[#1E1B24] uppercase tracking-[1.5px]">Registration form</span>
        </div>
        <h2 className="font-outfit-black text-[48px] text-[#1E1B24] text-center mb-4 tracking-[-1.5px] leading-tight">Registration Details</h2>
        <p className="font-rubik text-[18px] text-[#5C5866] font-medium text-center max-w-[640px] mb-16 leading-relaxed">Ready to join the club? Fill out the details below and let&apos;s get you on board!</p>

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
          {submitError && <p className="font-rubik text-center font-medium text-[#D92323]" role="alert">{submitError}</p>}
          <div className="pt-8 flex justify-center">
            <button type="submit" disabled={isSubmitting} className="bg-[#3E9FFF] border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] px-10 py-4 font-outfit-black text-[18px] text-white tracking-[1px] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1B24] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer">
              {isSubmitting ? "Submitting..." : "Apply Now!"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

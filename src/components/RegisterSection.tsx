"use client";

import { useState } from "react";
import Image from "next/image";

type RegisterSectionProps = {
  onProceed: (email: string) => void;
};

const emailPattern = /^[^\s@]+@srmist\.edu\.in$/i;

export default function RegisterSection({ onProceed }: RegisterSectionProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
    setIsAlreadyRegistered(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      setError("Please enter a valid SRM email ending with @srmist.edu.in.");
      return;
    }

    setIsChecking(true);
    setError("");
    setIsAlreadyRegistered(false);

    try {
      const response = await fetch(`/api/participants?email=${encodeURIComponent(normalizedEmail)}`);
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to verify your email. Please try again.");
        return;
      }

      if (result.exists) {
        setIsAlreadyRegistered(true);
        return;
      }

      onProceed(normalizedEmail);
    } catch {
      setError("Unable to verify your email. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <section className="min-h-[100svh] bg-[#FFFEEF] px-3 py-10 sm:px-6 sm:py-16 border-t-2 border-[#1E1B24] overflow-hidden relative flex items-center" id="register">
      <div className="container-site mx-auto flex flex-col items-center relative">
        
        {/* Desktop Layout Wrapper for Form and Mascot */}
        <div className="relative w-full max-w-[1050px] flex flex-col lg:block items-center">
          
          {/* Mascot Image (image 68) - Desktop Absolute, Mobile Relative */}
          <div className="lg:absolute lg:w-[266px] lg:h-[243px] lg:left-0 lg:top-[55px] w-[min(62vw,220px)] aspect-[1.1] h-auto relative mb-8 lg:mb-0 z-10">
            <Image
              src="/assets/mascot_form.png"
              alt="Community Mascot"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Form Inputs Container */}
          <form
            onSubmit={handleSubmit}
            className="relative lg:absolute lg:w-[553px] lg:h-[291px] lg:left-1/2 lg:-translate-x-1/2 lg:top-0 w-[min(92vw,553px)] bg-white border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] p-4 sm:p-6 lg:p-0 flex flex-col items-center z-20"
          >
            <div className="w-full mb-6 lg:mb-0 lg:absolute lg:w-[435px] lg:h-[63px] lg:left-[59px] lg:top-[65px]">
              <input
                type="email"
                id="email"
                required
                placeholder="SRM Email ID"
                value={email}
                onChange={handleChange}
                className={`w-full h-[63px] lg:h-full bg-[#FFD93D] border-[3px] rounded-[20px] px-6 font-outfit font-extrabold text-[18px] text-[#1E1B24] placeholder:text-[#1E1B24]/40 focus:outline-none focus:ring-2 focus:ring-[#1E1B24] transition-all ${error || isAlreadyRegistered ? "border-[#D92323]" : "border-black"}`}
              />
            </div>

            <div className="w-full lg:absolute lg:w-[435px] lg:left-[59px] lg:top-[145px]">
              {(error || isAlreadyRegistered) && (
                <p className="mb-3 font-rubik text-sm font-medium text-[#D92323]" role="alert">
                  {isAlreadyRegistered ? "This email is already registered." : error}
                </p>
              )}
              <button
                type="submit"
                disabled={isChecking}
                className="w-full h-[63px] bg-[#3E9FFF] border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] font-outfit-black text-[18px] text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1B24] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {isChecking ? "Checking..." : "Proceed"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}

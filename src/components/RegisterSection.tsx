"use client";

import { useState } from "react";
import Image from "next/image";

export default function RegisterSection() {
  const [formData, setFormData] = useState({
    email: "",
    registrationNumber: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    alert(`Application started for ${formData.email || "applicant"}!`);
  };

  return (
    <section className="bg-[#FFFEEF] pt-20 pb-10 border-t-2 border-[#1E1B24] overflow-hidden relative" id="register">
      <div className="container-site max-w-[1440px] mx-auto flex flex-col items-center relative">
        
        {/* Desktop Layout Wrapper for Form and Mascot */}
        <div className="relative w-full lg:w-[1440px] lg:h-[300px] flex flex-col lg:block items-center mt-8">
          
          {/* Mascot Image (image 68) - Desktop Absolute, Mobile Relative */}
          <div className="lg:absolute lg:w-[266px] lg:h-[243px] lg:left-[188px] lg:top-[55px] w-[220px] h-[200px] relative mb-8 lg:mb-0 z-10">
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
            className="relative lg:absolute lg:w-[553px] lg:h-[291px] lg:left-[calc(50%-276.5px)] lg:top-0 w-[90%] max-w-[553px] bg-white border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] p-6 lg:p-0 flex flex-col items-center z-20"
          >
            {/* SRM Email ID Input */}
            <div className="w-full lg:absolute lg:w-[435px] lg:h-[63px] lg:left-[59px] lg:top-[65px] mb-6 lg:mb-0">
              <input
                type="email"
                name="email"
                required
                placeholder="SRM Email ID"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[63px] lg:h-full bg-[#FFD93D] border-[1px] border-black rounded-[20px] px-6 font-outfit font-extrabold text-[18px] text-[#1E1B24] placeholder:text-[#1E1B24]/40 focus:outline-none focus:ring-2 focus:ring-[#1E1B24] transition-all"
              />
            </div>

            {/* Registration Number Input */}
            <div className="w-full lg:absolute lg:w-[435px] lg:h-[63px] lg:left-[59px] lg:top-[157px]">
              <input
                type="text"
                name="registrationNumber"
                required
                placeholder="Registeration Number"
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full h-[63px] lg:h-full bg-[#FFD93D] border-[1px] border-black rounded-[20px] px-6 font-outfit font-extrabold text-[18px] text-[#1E1B24] placeholder:text-[#1E1B24]/40 focus:outline-none focus:ring-2 focus:ring-[#1E1B24] transition-all"
              />
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}

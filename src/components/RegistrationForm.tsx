"use client";

import { useState } from "react";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    email: "",
    registrationNumber: "",
    domains: "",
    question: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    alert("Application submitted!");
  };

  return (
    <section className="bg-[#FFFEEF] py-24" id="apply">
      <div className="max-w-[800px] mx-auto flex flex-col items-center px-4">
        {/* Badge */}
        <div 
          className="bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-full px-6 py-2 mb-8 shadow-[3px_3px_0px_#1E1B24]"
        >
          <span className="font-outfit-black text-[14px] text-[#1E1B24] uppercase tracking-[1.5px]">
            Registration form
          </span>
        </div>

        <h2 className="font-outfit-black text-[48px] text-[#1E1B24] text-center mb-4 tracking-[-1.5px] leading-tight">
          Registration Details
        </h2>
        <p className="font-rubik text-[18px] text-[#5C5866] font-medium text-center max-w-[640px] mb-16 leading-relaxed">
          Ready to join the club? Fill out the details below and let's get you on board!
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          
          <div className="flex flex-col space-y-3">
            <label htmlFor="email" className="font-outfit-black text-[20px] text-[#1E1B24] flex items-center gap-3">
              <div className="w-3 h-3 rounded-full border-[2px] border-[#1E1B24] bg-[#FF4B4B]"></div>
              SRM email id
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="e.g. ab1234@srmist.edu.in"
              className="w-full bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] p-6 font-rubik text-[18px] font-medium text-[#1E1B24] placeholder:text-[#5C5866]/50 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#1E1B24] transition-all"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col space-y-3">
            <label htmlFor="registrationNumber" className="font-outfit-black text-[20px] text-[#1E1B24] flex items-center gap-3">
              <div className="w-3 h-3 rounded-full border-[2px] border-[#1E1B24] bg-[#3E9FFF]"></div>
              Registration Number
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              required
              placeholder="e.g. RA2311026010001"
              className="w-full bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] p-6 font-rubik text-[18px] font-medium text-[#1E1B24] placeholder:text-[#5C5866]/50 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#1E1B24] transition-all"
              value={formData.registrationNumber}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col space-y-3">
            <label htmlFor="domains" className="font-outfit-black text-[20px] text-[#1E1B24] flex items-center gap-3">
              <div className="w-3 h-3 rounded-full border-[2px] border-[#1E1B24] bg-[#4EC37B]"></div>
              Domains
            </label>
            <div className="relative">
              <select
                id="domains"
                name="domains"
                required
                className="w-full bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] p-6 font-rubik text-[18px] font-medium text-[#1E1B24] appearance-none focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#1E1B24] transition-all cursor-pointer"
                value={formData.domains}
                onChange={handleChange}
              >
                <option value="" disabled>Select a domain</option>
                <option value="technical">Technical</option>
                <option value="creatives">Creatives</option>
                <option value="management">Management</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none font-outfit-black text-[#1E1B24] text-[24px]">
                ↓
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <label htmlFor="question" className="font-outfit-black text-[20px] text-[#1E1B24] flex items-center gap-3">
              <div className="w-3 h-3 rounded-full border-[2px] border-[#1E1B24] bg-[#FDE53E]"></div>
              Question
            </label>
            <textarea
              id="question"
              name="question"
              rows={4}
              placeholder="Why do you want to join us?"
              className="w-full bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] p-6 font-rubik text-[18px] font-medium text-[#1E1B24] placeholder:text-[#5C5866]/50 focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#1E1B24] transition-all resize-y"
              value={formData.question}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="pt-8 flex justify-center">
            <button 
              type="submit" 
              className="bg-[#3E9FFF] border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] px-10 py-4 font-outfit-black text-[18px] text-white tracking-[1px] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1E1B24] cursor-pointer"
            >
              Apply Now!
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

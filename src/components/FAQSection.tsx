"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Who can apply?",
    answer: "Any student of SRMIST passionate about tech, open source, and building cool things. From kindergarteners to seniors!",
    dotColor: "bg-[#FF4B4B]",
  },
  {
    question: "Do I need prior experience?",
    answer: "Not necessarily! We value curiosity and willingness to learn over prior experience. Bring your passion and we'll help you grow.",
    dotColor: "bg-[#3E9FFF]",
  },
  {
    question: "Can I apply for multiple domains?",
    answer: "Yes, you can apply for multiple domains. However, we recommend focusing on the ones you are most passionate about.",
    dotColor: "bg-[#4EC37B]",
  },
  {
    question: "Which domain should I choose?",
    answer: "Choose the domain that aligns with your interests and where you want to build your skills. Feel free to explore our domain descriptions for more clarity.",
    dotColor: "bg-[#FDE53E]",
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#FFFEEF] pt-10 pb-24" id="faq">
      <div className="max-w-[800px] mx-auto flex flex-col items-center px-4">
        {/* Badge */}
        <div 
          className="bg-[#FFD93D] border-[3px] border-[#1E1B24] rounded-full px-6 py-2 mb-8 shadow-[3px_3px_0px_#1E1B24]"
        >
          <span className="font-outfit-black text-[14px] text-[#1E1B24] uppercase tracking-[1.5px]">
            FAQ Info
          </span>
        </div>

        {/* Heading */}
        <h2 className="font-outfit-black text-4xl md:text-[48px] text-[#1E1B24] text-center mb-4 tracking-[-1.5px] leading-tight">
          Queries (FAQ)
        </h2>
        
        {/* Subheading */}
        <p className="font-rubik text-[16px] md:text-[18px] text-[#5C5866] font-medium text-center max-w-[640px] mb-12 md:mb-16 leading-relaxed">
          Got questions about our kindergarten culture, play hours, or nap shifts?<br className="hidden md:block" />
          Here are the cheeky answers.
        </p>

        {/* Accordion */}
        <div className="w-full space-y-4 md:space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className="bg-white border-[3px] border-[#1E1B24] rounded-[24px] shadow-[4px_4px_0px_#1E1B24] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-8 py-8 text-left focus:outline-none cursor-pointer"
                  style={{ minHeight: '94px' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full border-[2px] border-[#1E1B24] ${faq.dotColor}`}></div>
                    <span className="font-outfit-black text-[20px] text-[#1E1B24]">
                      {faq.question}
                    </span>
                  </div>
                  <span className="font-outfit-black text-[24px] text-[#1E1B24] leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                
                <div 
                  className={`px-8 text-[#5C5866] font-rubik font-medium text-[18px] overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 pb-8 opacity-100" : "max-h-0 opacity-0 pb-0"
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

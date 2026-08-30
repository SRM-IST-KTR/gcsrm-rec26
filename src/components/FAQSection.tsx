"use client";

import { useState } from "react";
import SectionBadge from "@/components/common/SectionBadge";

const faqs = [
  {
    question: "Who can apply for GitHub Community SRM Recruitment 2026-27?",
    answer: "First-year and second-year B.Tech students from the Kattankulathur (KTR) campus are eligible to apply.",
    dotColor: "bg-[#FF4B4B]",
  },
  {
    question: "Can I apply for multiple domains?",
    answer: "No. You can apply for only one domain during the recruitment process. Choose the domain that best matches your interests and skills.",
    dotColor: "bg-[#3E9FFF]",
  },
  {
    question: "Can students from any branch apply?",
    answer: "Yes. B.Tech students from all branches at the KTR campus can apply.",
    dotColor: "bg-[#4EC37B]",
  },
  {
    question: "Can I apply if I have no previous club experience?",
    answer: "Yes. Previous club or community experience is not mandatory.",
    dotColor: "bg-[#FDE53E]",
  },
  {
    question: "How will I know if I am selected?",
    answer: "Selected candidates will be notified through the official communication channels.",
    dotColor: "bg-[#FF8A4C]",
  },
  {
    question: "Will there be a task during the recruitment process?",
    answer: "Yes. Candidates will be given a domain-specific task to help us understand their skills, creativity, and approach.",
    dotColor: "bg-[#A78BFA]",
  },
  {
    question: "Is the recruitment task mandatory?",
    answer: "Yes. If a task is assigned to you, completing it within the given deadline is an essential part of the selection process.",
    dotColor: "bg-[#34D399]",
  },
  {
    question: "Do I need to be an expert to join?",
    answer: "Not at all! We're looking for students who are eager to learn, build, contribute, and grow.",
    dotColor: "bg-[#F472B6]",
  },
  {
    question: "Why should I join GitHub Community SRM?",
    answer: "To learn beyond the classroom, work with like-minded people, build meaningful projects, and grow as a contributor to the community.",
    dotColor: "bg-[#FACC15]",
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#FFFEEF] border-t-[3px] border-[#1E1B24] pt-10 pb-24" id="faq">
      <div className="max-w-[800px] mx-auto flex flex-col items-center px-4">
        {/* Badge */}
        <SectionBadge label="FAQ" variant="yellow" className="mb-8" />

        {/* Heading */}
        <h2 className="font-outfit-black text-4xl md:text-[48px] text-[#1E1B24] text-center mb-4 tracking-[-1.5px] leading-tight">
          Queries
        </h2>

        {/* Subheading */}
        <p className="font-rubik text-[16px] md:text-[14px] md:text-[18px] text-[#5C5866] font-medium text-center max-w-[640px] mb-12 md:mb-16 leading-relaxed">
          Everything you need to know before applying to GitHub Community SRM Recruitment 2026-27.
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
                  className="w-full flex items-center justify-between px-5 py-5 md:px-8 md:py-8 text-left focus:outline-none cursor-pointer"
                  style={{ minHeight: '74px' }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full border-[2px] border-[#1E1B24] ${faq.dotColor}`}></div>
                    <span className="font-outfit-black text-[16px] md:text-[20px] text-[#1E1B24]">
                      {faq.question}
                    </span>
                  </div>
                  <span className="font-outfit-black text-[24px] text-[#1E1B24] leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={`px-5 md:px-8 text-[#5C5866] font-rubik font-medium text-[14px] md:text-[18px] overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 pb-8 opacity-100" : "max-h-0 opacity-0 pb-0"
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

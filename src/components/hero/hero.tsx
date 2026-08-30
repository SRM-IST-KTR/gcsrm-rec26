"use client";
import Image from "next/image";
import { ActionButton } from "@/components/common/actionButton";
import SectionBadge from "@/components/common/SectionBadge";

export function HeroSection() {

  // Reusing our trusty scroll offset logic so the button doesn't hide under the nav
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (id.startsWith("#")) {
      e.preventDefault();
      const section = document.getElementById(id.substring(1));
      const nav = document.querySelector('nav');

      if (section && nav) {
        const navHeight = nav.offsetHeight;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: sectionTop - navHeight,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <section className="relative w-full min-h-[85vh] flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 md:px-16 py-16 lg:py-12 gap-12 overflow-hidden border-b-[4px] border-text-primary bg-blue">
      {/* Background Pattern Layer */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-repeat"
        style={{ backgroundImage: `url('/assets/383b3be637a47fe82425f9eece39505bf5d061d3.png')` }}
      />

      {/* Left Content Column */}
      <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl gap-6">

        {/* Top Badge */}
        <SectionBadge
          label="WE'RE HIRING, TROUBLEMAKERS!"
          variant="yellow"
          className="shadow-[4px_4px_0_var(--color-text-primary)] !py-2 !px-6"
          textClassName="!font-extrabold !text-sm md:!text-base"
        />

        {/* Main Heading */}
        <h1 className="font-overpass-black text-5xl md:text-6xl lg:text-[70px] text-white leading-[105%] tracking-[-0.02em] [-webkit-text-stroke:4px_#1E1B24] md:[-webkit-text-stroke:5px_#1E1B24] lg:[-webkit-text-stroke:5.5px_#1E1B24] [paint-order:stroke_fill]">
          Join the <br />
          GitHub SRM <br />
          Community!
        </h1>

        {/* Subtitle / Description */}
        <p className="font-rubik text-bg-white text-base md:text-lg max-w-lg opacity-90 leading-relaxed font-medium">
          <strong className="text-[#FFD600] font-extrabold [-webkit-text-stroke:1.8px_#1E1B24] [paint-order:stroke_fill] tracking-wide">
            GitHub Community SRM
          </strong>{" "}
          is looking for curious minds, creators, builders, and leaders ready to learn, collaborate and build something meaningful.
        </p>

        {/* Action Buttons using the reusable component */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2 w-full">
          <ActionButton
            href="/apply"
            text="APPLY NOW →"
            bgColor="bg-primary"
            textColor="text-bg-white"
          />
          <ActionButton
            href="#domains"
            text="EXPLORE DOMAINS"
            bgColor="bg-yellow"
            textColor="text-text-primary"
            onClick={(e) => scrollToSection(e, "#domains")}
          />
        </div>

      </div>

      {/* Right Mascot Column */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full lg:w-auto lg:min-w-[380px] lg:ml-auto gap-6 mt-8 lg:mt-0">

        {/* Shinchan Avatar Image */}
        <div className="relative w-[280px] h-[310px] sm:w-[340px] sm:h-[380px] drop-shadow-[8px_8px_0_var(--color-text-primary)]">
          <Image
            src="/assets/snlogo.png"
            alt="Sn GitHub Avatar"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Quote Box - Moved below the mascot, made static, flat, and full width */}
        <div className="w-full max-w-[340px] p-3 bg-yellow border-[3px] border-text-primary rounded-md shadow-[4px_4px_0_var(--color-text-primary)] font-rubik text-xs md:text-sm font-bold text-text-primary text-left">
          &quot;Buri Buri Zaimon! … Ab tum batao, kaunsa club join karoge?&quot;
        </div>

      </div>
    </section>
  );
}
"use client"
import Image from "next/image";
import { ActionButton } from "@/components/common/actionButton"; 

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
    <section className="relative w-full min-h-[85vh] flex items-center justify-between px-8 md:px-16 py-12 overflow-hidden border-b-[4px] border-text-primary bg-blue">
      {/* Background Pattern Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-40 pointer-events-none bg-repeat"
        style={{ backgroundImage: `url('/assets/383b3be637a47fe82425f9eece39505bf5d061d3.png')` }}
      />

      {/* Left Content Column */}
      <div className="relative z-10 flex flex-col items-start max-w-2xl gap-6">
        
        {/* Top Badge - Made flat and fully rounded to match the reference */}
        <div className="inline-block px-6 py-2 bg-yellow border-[3px] border-text-primary rounded-full shadow-[4px_4px_0_var(--color-text-primary)] font-rubik font-bold text-sm md:text-base text-text-primary">
          WE&apos;RE HIRING, TROUBLEMAKERS!
        </div>

        {/* Main Heading */}
        <h1 className="font-rubik font-extrabold text-5xl md:text-7xl text-bg-white drop-shadow-[4px_4px_0_var(--color-text-primary)] leading-tight">
          Join the <br />
          GitHub SRM <br />
          Community!
        </h1>

        {/* Subtitle / Description */}
        <p className="font-rubik text-bg-white text-base md:text-lg max-w-lg opacity-90 leading-relaxed font-medium">
          <strong className="text-yellow font-bold">GitHub Community SRM</strong> is looking for curious minds, creators, builders, and leaders ready to learn, collaborate and build something meaningful.
        </p>

        {/* Action Buttons using the reusable component */}
        <div className="flex flex-wrap items-center gap-4 mt-2">
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
      <div className="relative z-10 hidden lg:flex flex-col items-center justify-center min-w-[380px] gap-6">
        
        {/* Shinchan Avatar Image */}
        <div className="relative w-[340px] h-[380px] drop-shadow-[8px_8px_0_var(--color-text-primary)]">
          <Image
            src="/assets/shinchan w logo.png"
            alt="Shinchan GitHub Avatar"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Quote Box - Moved below the mascot, made static, flat, and full width */}
        <div className="w-full max-w-[340px] p-3 bg-yellow border-[3px] border-text-primary rounded-md shadow-[4px_4px_0_var(--color-text-primary)] font-rubik text-xs md:text-sm font-bold text-text-primary text-left">
          &quot;To be a true hero, you must master the art of the afternoon nap!&quot;
        </div>

      </div>
    </section>
  );
}
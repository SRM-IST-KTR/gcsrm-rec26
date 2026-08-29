"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/components/shared/navlinks";
import { ButtonLink } from "../common/Button";
import { Dropbox } from "../common/Dropbox";

export default function NavBar() {
  
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith("#")) {
      e.preventDefault();
      scrollToSection(link.substring(1));
    }
  };

  return (
    // Added 'sticky top-0' here so it locks to the viewport top on scroll
    <nav className="sticky top-0 p-4 bg-bg-cream w-full flex justify-between items-center md:px-8 z-50 border-b-[3px] border-text-primary shadow-sm">
      
      {/* 1. Brand Icon */}
      <div className="flex-shrink-0">
        <Image 
          src="/image.png" 
          alt="GitHub Community SRM" 
          width={100} 
          height={60} 
          className="object-contain object-left" 
          priority
        />
      </div>

      {/* 2. DESKTOP: Mapped Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, index) => (
          <Link 
            key={index}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="font-montserrat font-bold text-text-primary hover:text-blue transition-colors duration-200 text-lg tracking-wide"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* 3. DESKTOP: Call to Action Button */}
      <div className="hidden md:block flex-shrink-0">
        <ButtonLink 
          text="Join Us" 
          link="/apply" 
          bgColor="bg-blue" 
        />
      </div>

      {/* 4. MOBILE: Reusable Dropbox Component */}
      <div className="block md:hidden">
        <Dropbox 
          label="Go to" 
          links={navLinks} 
          bgColor="bg-blue" 
          cta={{
            text: "Join Us",
            link: "/apply",
            bgColor: "bg-primary"
          }}
        />
      </div>

    </nav>
  );
}
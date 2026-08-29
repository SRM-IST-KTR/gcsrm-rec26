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
    const nav = document.querySelector('nav');
    
    if (section && nav) {
      // Get the exact physical height of the navbar
      const navHeight = nav.offsetHeight; 
      // Calculate where the section is, and subtract the navbar height so it sits directly underneath it
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: sectionTop - navHeight,
        behavior: "smooth"
      });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith("#")) {
      e.preventDefault();
      scrollToSection(link.substring(1));
    }
  };

  return (
    <nav className="sticky top-0 p-4 bg-bg-cream w-full flex justify-between items-center md:px-8 z-50 border-b-[3px] border-text-primary shadow-sm">
      
      <div className="flex-shrink-0">
        <Image 
          src="/image.png" 
          alt="GitHub Community SRM" 
          width={80} 
          height={48} 
          className="object-contain object-left" 
          priority
        />
      </div>

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

      <div className="hidden md:block flex-shrink-0">
        <ButtonLink 
          text="Join Us" 
          link="/apply" 
          bgColor="bg-blue" 
        />
      </div>

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
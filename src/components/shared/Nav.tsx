"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/components/shared/navlinks";
import { useAuth } from "@/context/AuthContext";
import { ButtonLink } from "../common/Button";
import { Dropbox } from "../common/Dropbox";
import { UserAccountMenu } from "./UserAccountMenu";

export default function NavBar() {
  const { isLoggedIn } = useAuth();
  
  // Scrolls to specific sections with navbar height offset
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    const nav = document.querySelector('nav');
    
    if (section && nav) {
      const navHeight = nav.offsetHeight; 
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      
      window.scrollTo({
        top: sectionTop - navHeight,
        behavior: "smooth"
      });
    }
  };

  // Scrolls straight to the top of the page for the hero section
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (typeof window !== "undefined" && window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      window.history.pushState(null, "", "/");
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith("#") || link.startsWith("/#")) {
      const targetId = link.replace(/^\/?#/, "");
      const section = document.getElementById(targetId);
      const nav = document.querySelector('nav');
      
      if (section && nav) {
        e.preventDefault();
        const navHeight = nav.offsetHeight; 
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: sectionTop - navHeight,
          behavior: "smooth"
        });

        window.history.pushState(null, "", link.startsWith("/") ? link : `/${link}`);
      }
    }
  };

  return (
    <nav className="sticky top-0 p-4 bg-bg-cream w-full flex justify-between items-center md:px-8 z-50 border-b-[3px] border-text-primary shadow-sm">
      
      {/* 1. Brand Icon */}
      <Link href="/" onClick={scrollToTop} className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
        <Image 
          src="/image.png" 
          alt="GitHub Community SRM" 
          width={80} 
          height={48} 
          className="object-contain object-left" 
          priority
        />
      </Link>

      {/* 2. DESKTOP: Mapped Navigation Links */}
      <div className="hidden md:flex items-center gap-7 lg:gap-8">
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

        {isLoggedIn && (
          <Link
            href="/#status"
            onClick={(e) => handleNavClick(e, "/#status")}
            className="font-montserrat font-bold text-[#1E1B24] bg-[#4ade80] hover:bg-[#3dd776] border-2 border-[#1E1B24] rounded-xl px-3.5 py-1.5 text-[15px] sm:text-base shadow-[2.5px_2.5px_0px_#1E1B24] hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0px_#1E1B24] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-200 tracking-wide cursor-pointer"
          >
            Check Status
          </Link>
        )}
      </div>

      {/* 3. RIGHT SECTION: CTA / User Menu (Desktop) & User Menu + Dropbox (Mobile) */}
      <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
        {/* Desktop: Call to Action Button / User Account Menu */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <UserAccountMenu />
          ) : (
            <ButtonLink 
              text="Join Us" 
              link="/apply" 
              bgColor="bg-blue" 
            />
          )}
        </div>

        {/* Mobile: User Account Menu (if logged in) + Dropdown positioned at far right */}
        <div className="flex md:hidden items-center gap-3">
          {isLoggedIn && <UserAccountMenu />}
          <Dropbox 
            label="Go to" 
            links={navLinks} 
            bgColor="bg-blue" 
            cta={
              isLoggedIn
                ? undefined
                : {
                    text: "Join Us",
                    link: "/apply",
                    bgColor: "bg-primary",
                  }
            }
          />
        </div>
      </div>

    </nav>
  );
}
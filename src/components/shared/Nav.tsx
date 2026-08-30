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
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith("#")) {
      e.preventDefault();
      scrollToSection(link.substring(1));
    }
  };

  return (
    <nav className="sticky top-0 p-4 bg-bg-cream w-full flex justify-between items-center md:px-8 z-50 border-b-[3px] border-text-primary shadow-sm">
      
      {/* 1. Brand Icon */}
      <Link href="/" onClick={scrollToTop} className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity min-w-[70px] sm:min-w-[80px]">
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

      {/* 3. MOBILE CENTER: Reusable Dropbox Component ("Go to") */}
      <div className="flex md:hidden items-center justify-center flex-1 mx-2">
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

      {/* 4. DESKTOP RIGHT: Call to Action Button / User Account Menu */}
      <div className="hidden md:block flex-shrink-0">
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

      {/* 5. MOBILE RIGHT: User Account Menu */}
      <div className="flex md:hidden items-center justify-end min-w-[70px] sm:min-w-[80px] shrink-0">
        {isLoggedIn && <UserAccountMenu />}
      </div>

    </nav>
  );
}
"use client"
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/components/shared/navlinks";
import { useAuth } from "@/context/AuthContext";
import { ButtonLink } from "../common/Button";
import { Dropbox } from "../common/Dropbox";

export default function NavBar() {
  const { isLoggedIn, logout } = useAuth();
  
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
      
      {/* 1. Brand Icon - Now acts as a link to the top */}
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
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border-[3px] border-text-primary font-rubik-medium font-bold text-bg-cream tracking-wider uppercase shadow-[4px_4px_0_var(--color-text-primary)] transition-all duration-150 ease-in-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-text-primary)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none bg-primary cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <ButtonLink 
            text="Join Us" 
            link="/apply" 
            bgColor="bg-blue" 
          />
        )}
      </div>

      {/* 4. MOBILE: Reusable Dropbox Component */}
      <div className="block md:hidden">
        <Dropbox 
          label="Go to" 
          links={navLinks} 
          bgColor="bg-blue" 
          cta={
            isLoggedIn
              ? {
                  text: "Logout",
                  link: "#",
                  bgColor: "bg-primary",
                  onClick: logout,
                }
              : {
                  text: "Join Us",
                  link: "/apply",
                  bgColor: "bg-primary",
                }
          }
        />
      </div>

    </nav>
  );
}
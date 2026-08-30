"use client"
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export interface DropboxItem {
  label: string;
  href: string;
}

interface DropboxProps {
  label?: string;
  links: DropboxItem[];
  bgColor?: string;
  cta?: {
    text: string;
    link: string;
    bgColor?: string;
    onClick?: () => void;
  };
}

export function Dropbox({ 
  label = "Go to", 
  links, 
  bgColor = "bg-blue",
  cta 
}: DropboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false); // Close the menu
    if (href.startsWith("#")) {
      e.preventDefault();
      const section = document.getElementById(href.substring(1));
      const nav = document.querySelector('nav');
      
      if (section && nav) {
        // Exact same calculation for mobile so the section doesn't hide under the sticky nav
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
    <div className="relative inline-block" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`flex justify-between items-center gap-4 px-5 py-2 border-[3px] border-text-primary rounded-xl text-bg-white font-rubik text-lg shadow-[4px_4px_0_var(--color-text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--color-text-primary)] transition-all ${bgColor}`}
      >
        <span>{label}</span>
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21V7M5 14l7-7 7 7M5 3h14"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v14M5 10l7 7 7-7M5 21h14"/>
          </svg>
        )}
      </button>

      <div 
        className={`
          absolute top-[calc(100%+12px)] right-0 w-[240px] flex flex-col gap-3 z-50 pointer-events-none
        `}
      >
        {links.map((item, index) => (
          <div
            key={index}
            style={{ 
              transitionDelay: isOpen ? `${(index + 1) * 50}ms` : `${(links.length - index) * 30}ms` 
            }}
            className={`
              transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top
              ${isOpen 
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
                : "opacity-0 scale-75 -translate-y-4 pointer-events-none"
              }
            `}
          >
            <Link 
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`block w-full text-center py-2 px-4 border-[3px] border-text-primary rounded-xl text-bg-white font-rubik text-lg shadow-[4px_4px_0_var(--color-text-primary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--color-text-primary)] transition-all duration-150 ${bgColor}`}
            >
              {item.label}
            </Link>
          </div>
        ))}

        {cta && (
          <div
            style={{ 
              transitionDelay: isOpen ? `${(links.length + 1) * 50}ms` : '0ms' 
            }}
            className={`
              transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top mt-1
              ${isOpen 
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" 
                : "opacity-0 scale-75 -translate-y-4 pointer-events-none"
              }
            `}
          >
            <Link 
              href={cta.link}
              onClick={(e) => {
                if (cta.onClick) {
                  cta.onClick();
                }
                setIsOpen(false);
              }}
              className={`block w-full text-center py-2 px-4 border-[3px] border-text-primary rounded-full shadow-[4px_4px_0_var(--color-text-primary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--color-text-primary)] transition-all text-bg-white font-bold text-lg ${cta.bgColor || 'bg-primary'}`}
            >
              {cta.text}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
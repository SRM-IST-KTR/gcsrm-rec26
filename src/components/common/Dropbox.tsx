"use client"
import React, { useState } from "react";
import Link from "next/link";

// Define the shape of a single link
export interface DropboxItem {
  label: string;
  href: string;
}

// Define the props the component will accept
interface DropboxProps {
  label?: string;          // The text on the closed button (default: "Go to")
  links: DropboxItem[];    // The array of links to parse
  bgColor?: string;        // The background color of the box (default: "bg-blue")
  cta?: {                  // Optional call-to-action button at the bottom
    text: string;
    link: string;
    bgColor?: string;
  };
}

export function Dropbox({ 
  label = "Go to", 
  links, 
  bgColor = "bg-blue",
  cta 
}: DropboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsOpen(false); // Close menu on click
    if (href.startsWith("#")) {
      e.preventDefault();
      const section = document.getElementById(href.substring(1));
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        // Injected the dynamic bgColor here
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

      {/* Floating Dropdown Panel */}
      {isOpen && (
        // Injected the dynamic bgColor here as well
        <div className={`absolute top-full right-0 mt-4 w-[240px] flex flex-col border-[3px] border-text-primary rounded-xl shadow-[4px_4px_0_var(--color-text-primary)] z-50 animate-in fade-in slide-in-from-top-2 duration-200 ${bgColor}`}>
          <div className="flex flex-col items-center gap-5 py-6 text-bg-white font-rubik text-xl">
            
            {/* Map over the parsed links object */}
            {links.map((item, index) => (
              <Link 
                key={index}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="hover:text-yellow transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

            {/* Conditionally render the CTA only if the prop was provided */}
            {cta && (
              <Link 
                href={cta.link}
                className={`mt-2 px-8 py-2 border-[3px] border-text-primary rounded-full hover:translate-y-[2px] transition-transform text-bg-white font-bold text-lg ${cta.bgColor || 'bg-primary'}`}
              >
                {cta.text}
              </Link>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
}
import React from "react";
import Link from "next/link";

interface ButtonLinkProps {
  text: string;
  bgColor?: string; // Accepts your custom Tailwind bg classes (e.g., 'bg-blue', 'bg-primary')
  link: string;
  className?: string;
}

export function ButtonLink({ 
  text, 
  bgColor = "bg-blue", // Default fallback if no color is provided
  link,
  className = ""
}: ButtonLinkProps) {
  return (
    <Link 
      href={link}
      className={`
        inline-flex items-center justify-center 
        px-8 py-3 
        rounded-full 
        border-[3px] border-text-primary 
        font-rubik-medium font-bold text-bg-cream tracking-wider uppercase
        shadow-[4px_4px_0_var(--color-text-primary)]
        transition-all duration-150 ease-in-out
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--color-text-primary)]
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
        ${bgColor} 
        ${className}
      `}
    >
      {text}
    </Link>
  );
}
// src/components/common/ActionButton.tsx
"use client"
import React from "react";
import Link from "next/link";

interface ActionButtonProps {
  className?: string;
  href: string;
  text: string;
  bgColor?: string;
  textColor?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function ActionButton({
  href,
  text,
  bgColor = "bg-primary",
  textColor = "text-bg-white",
  onClick,
  className = "",
}: ActionButtonProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-8 py-3 border-[3px] border-text-primary rounded-xl font-rubik font-bold text-lg shadow-[4px_4px_0_var(--color-text-primary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--color-text-primary)] transition-all flex items-center justify-center gap-2 ${bgColor} ${textColor} ${className}`}
    >
      {text}
    </Link>
  );
}
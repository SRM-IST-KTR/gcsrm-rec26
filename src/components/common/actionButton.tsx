// src/components/common/actionButton.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export interface ActionButtonProps {
  href?: string;
  text: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  isApplyButton?: boolean;
  loggedInText?: string;
  loggedInHref?: string;
}

/**
 * Smoothly scrolls to a DOM element by id or selector with offset for sticky navbar
 */
export const scrollToElementWithOffset = (targetIdOrSelector: string) => {
  const cleanId = targetIdOrSelector.replace(/^#/, "");
  const targetElement =
    document.getElementById(cleanId) ||
    document.querySelector(`section[aria-label="Application Status Section"]`);

  const nav = document.querySelector("nav");
  if (targetElement) {
    const navHeight = nav ? nav.offsetHeight : 0;
    const sectionTop = targetElement.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: Math.max(0, sectionTop - navHeight),
      behavior: "smooth",
    });
    return true;
  }
  return false;
};

export function ActionButton({
  href = "/apply",
  text,
  bgColor = "bg-primary",
  textColor = "text-bg-white",
  className = "",
  onClick,
  isApplyButton,
  loggedInText = "CHECK STATUS →",
  loggedInHref = "#status",
}: ActionButtonProps) {
  const { isLoggedIn } = useAuth();

  // Detect whether this button acts as an Apply CTA
  const isApply =
    isApplyButton !== undefined
      ? isApplyButton
      : href === "/apply" || href.startsWith("/apply") || text.toUpperCase().includes("APPLY");

  // Dynamic values based on auth state
  const targetHref = isApply && isLoggedIn ? loggedInHref : href;
  const displayText = isApply && isLoggedIn ? loggedInText : text;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If the target is an anchor hash (e.g. #status, #domains)
    if (targetHref.startsWith("#")) {
      const scrolled = scrollToElementWithOffset(targetHref);
      if (scrolled) {
        e.preventDefault();
      }
    } else if (targetHref.startsWith("/#") && typeof window !== "undefined" && window.location.pathname === "/") {
      const hashId = targetHref.replace(/^\/#/, "");
      const scrolled = scrollToElementWithOffset(hashId);
      if (scrolled) {
        e.preventDefault();
      }
    }

    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link
      href={targetHref}
      onClick={handleClick}
      className={`px-8 py-3 border-[3px] border-text-primary rounded-xl font-rubik font-bold text-lg shadow-[4px_4px_0_var(--color-text-primary)] hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-text-primary)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--color-text-primary)] transition-all flex items-center justify-center gap-2 ${bgColor} ${textColor} ${className}`}
    >
      {displayText}
    </Link>
  );
}

export default ActionButton;
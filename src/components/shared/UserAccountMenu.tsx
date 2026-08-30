"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface UserAccountMenuProps {
  className?: string;
}

/**
 * Maps participant domain to its corresponding avatar image path
 */
export function getDomainAvatar(domain?: string | null): string {
  if (!domain) return "/images/recruitment/web-developer.png";

  const normalized = domain.trim().toLowerCase();

  if (
    normalized.includes("tech") ||
    normalized.includes("web") ||
    normalized.includes("dev")
  ) {
    return "/images/recruitment/web-developer.png";
  }

  if (
    normalized.includes("creative") ||
    normalized.includes("design") ||
    normalized.includes("ui") ||
    normalized.includes("ux")
  ) {
    return "/images/recruitment/crayon-creator.png";
  }

  if (
    normalized.includes("corp") ||
    normalized.includes("operation") ||
    normalized.includes("manage")
  ) {
    return "/images/recruitment/operations-lead.png";
  }

  return "/images/recruitment/web-developer.png";
}

/**
 * UserAccountMenu Component
 *
 * Renders a horizontal Neobrutalist trigger with [Identifier Text] [Avatar].
 * Toggles a dropdown menu containing participant details and a Logout action.
 */
export function UserAccountMenu({ className = "" }: UserAccountMenuProps) {
  const { participant, isLoggedIn, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoggedIn || !participant) {
    return null;
  }

  // Extract user identifier (slicing email prefix before '@' or registration number)
  const identifier = participant.email
    ? participant.email.split("@")[0]
    : participant.registrationNumber || "User";

  // Dynamic avatar based on domain
  const avatarSrc = getDomainAvatar(participant.domain);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push("/");
  };

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      {/* Trigger Button: Avatar with Name / Identifier Underneath */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex flex-col items-center justify-center group focus:outline-none cursor-pointer select-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User Account Menu"
      >
        {/* Circular Avatar */}
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-[2.5px] border-[#1E1B24] flex items-center justify-center shadow-[2px_2px_0px_#1E1B24] transition-transform duration-150 group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-[1px_1px_0px_#1E1B24] overflow-hidden shrink-0">
          <Image
            src={avatarSrc}
            alt={participant.name || identifier}
            width={44}
            height={44}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* User Name / Identifier Text Under Avatar - slightly smaller than "Go to" (text-lg) */}
        <span className="font-rubik font-bold text-[15px] sm:text-[16px] text-[#1E1B24] tracking-tight text-center leading-none mt-1 group-hover:text-blue transition-colors max-w-[120px] truncate">
          {identifier}
        </span>
      </button>

      {/* Neobrutalist Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-[calc(100%+8px)] right-0 w-[200px] sm:w-[220px] bg-white border-[3px] border-[#1E1B24] rounded-[20px] shadow-[4px_4px_0px_#1E1B24] p-3 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-100"
          role="menu"
        >
          {/* User Details */}
          <div className="px-2 py-1.5 flex flex-col text-left">
            <span className="font-outfit-black text-sm text-[#1E1B24] truncate">
              {participant.name || identifier}
            </span>
            <span className="font-rubik text-xs text-[#5C5866] truncate mt-0.5">
              {participant.email}
            </span>
            {participant.domain && (
              <span className="inline-block w-fit mt-1.5 text-[10px] font-outfit-black font-bold uppercase bg-[#FFD93D] text-[#1E1B24] border border-[#1E1B24] rounded-full px-2 py-0.5">
                {participant.domain}
              </span>
            )}
          </div>

          <div className="h-[2px] bg-[#1E1B24]/10 my-0.5" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#FF4B4B] border-2 border-[#1E1B24] rounded-xl text-white font-outfit-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_#1E1B24] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#1E1B24] transition-all cursor-pointer"
            role="menuitem"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserAccountMenu;

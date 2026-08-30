"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export interface NavItem {
  label: string;
  href: string;
}

export interface UserProfile {
  name: string;
  avatarUrl?: string | null;
  email?: string;
}

export interface ResponsiveNavbarProps {
  /** List of navigation links (defaults to Home, Library, Playlists) */
  links?: NavItem[];
  /** Current logged-in user profile */
  user?: UserProfile | null;
  /** Logout event handler callback */
  onLogout?: () => void;
  /** Additional container classes */
  className?: string;
}

const DEFAULT_NAV_LINKS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Library", href: "/library" },
  { label: "Playlists", href: "/playlists" },
];

const DEFAULT_USER: UserProfile = {
  name: "Alex Morgan",
  avatarUrl: "/avatars/web-developer.png",
  email: "alex.morgan@example.com",
};

/**
 * Clean SVG Avatar Fallback Placeholder
 */
function AvatarPlaceholder({ className = "w-full h-full text-current/60" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/**
 * Reusable Circular Avatar Component
 */
function UserAvatar({
  user,
  size = 36,
  className = "",
}: {
  user?: UserProfile | null;
  size?: number;
  className?: string;
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center border border-current/20 bg-current/5 shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label={user?.name ? `${user.name}'s avatar` : "User avatar"}
    >
      {user?.avatarUrl && !imageError ? (
        <Image
          src={user.avatarUrl}
          alt={user.name || "User Avatar"}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          priority
        />
      ) : (
        <AvatarPlaceholder className="w-3/5 h-3/5 text-current/70" />
      )}
    </div>
  );
}

/**
 * ResponsiveNavbar Component
 *
 * Seamlessly switches between:
 * 1. Mobile (Default): Flex justify-between, Left: 'Goto' button, Right: Circular Avatar.
 * 2. Desktop (md: breakpoint): Left: Horizontal nav links, Middle: flex-1 spacer, Right: Profile cluster (Name + Avatar + Logout button).
 *
 * Uses CSS variables (--background, --foreground) for container styling.
 */
export function ResponsiveNavbar({
  links = DEFAULT_NAV_LINKS,
  user = DEFAULT_USER,
  onLogout,
  className = "",
}: ResponsiveNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-[var(--background)] text-[var(--foreground)] border-b border-[var(--foreground)]/10 px-4 md:px-8 py-3 transition-colors ${className}`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. MOBILE LAYOUT (< md breakpoint)
          Flex container with justify-between:
          Left: 'Goto' menu button
          Right: Circular User Avatar
      ────────────────────────────────────────────────────────────── */}
      <div className="flex md:hidden justify-between items-center w-full" ref={mobileMenuRef}>
        {/* Left Side: 'Goto' Menu Button */}
        <div className="relative">
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-current/20 hover:border-current/40 hover:bg-current/5 hover:text-[var(--color-blue,#3b82f6)] active:scale-95 transition-all text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-current/20 cursor-pointer"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {/* Directional / Hamburger SVG Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
            <span>Goto</span>
          </button>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-52 bg-[var(--background)] border border-[var(--foreground)]/15 rounded-xl shadow-xl p-2 z-50 flex flex-col gap-1 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-current/5 hover:text-[var(--color-blue,#3b82f6)] transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              {user && onLogout && (
                <>
                  <div className="h-px bg-current/10 my-1" />
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Circular User Avatar */}
        <UserAvatar user={user} size={36} />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. DESKTOP LAYOUT (md: breakpoint and above)
          Left: Horizontal list of navigation links
          Middle: flex-1 spacer
          Right: User profile cluster (Name + Avatar + Logout)
      ────────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center w-full">
        {/* Left Side: Horizontal Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-8">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm lg:text-base font-medium text-current/80 hover:text-[var(--color-blue,#3b82f6)] transition-colors duration-150 focus:outline-none focus-visible:underline"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Middle: Empty Flexible Spacer to push right content to the edge */}
        <div className="flex-1" />

        {/* Right Side: User Profile Cluster */}
        <div className="flex items-center gap-4">
          {/* User's Name */}
          {user?.name && (
            <span className="text-sm font-medium text-current/90 select-none">
              {user.name}
            </span>
          )}

          {/* Circular Avatar */}
          <UserAvatar user={user} size={38} />

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-lg border border-current/20 hover:border-red-500 hover:bg-red-500 hover:text-white text-xs font-semibold uppercase tracking-wider transition-all duration-150 active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default ResponsiveNavbar;

"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Domains", href: "/#domains" },
  { label: "Story", href: "/#story" },
];

const recruitmentLinks = [
  { label: "Apply", href: "/apply" },
  { label: "Selection Process", href: "/#process" },
  { label: "FAQs", href: "/#faqs" },
];

const connectLinks = [
  { label: "Instagram", href: "https://www.instagram.com/githubsrm/?hl=en" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/githubsrm/" },
  { label: "GitHub", href: "https://github.com/SRM-IST-KTR" },
];

function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const { isLoggedIn } = useAuth();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/" || href === "/#top" || href === "#top") {
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        window.history.pushState(null, "", "/");
        return;
      }
    }

    if (href.startsWith("#") || href.startsWith("/#")) {
      const targetId = href.replace(/^\/?#/, "");
      const section = document.getElementById(targetId);
      if (section) {
        e.preventDefault();
        const nav = document.querySelector("nav");
        const navHeight = nav ? nav.offsetHeight : 0;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;

        window.scrollTo({
          top: sectionTop - navHeight,
          behavior: "smooth",
        });

        window.history.pushState(null, "", href);
      }
    }
  };

  const currentNavLinks = [
    ...navLinks,
    ...(isLoggedIn ? [{ label: "Check Status", href: "/#status" }] : []),
  ];

  return (
    <footer
      style={{ backgroundColor: "var(--color-bg-cream)" }}
      className="w-full border-t border-[--color-border]"
    >
      <div className="container-site px-4 pt-8 pb-6 sm:px-6 md:pt-32">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1fr_auto_auto_auto] md:gap-16">
          <div className="col-span-2 flex flex-col items-center text-center md:col-span-1 md:items-start md:text-left">
            <p className="max-w-xs font-rubik text-sm leading-relaxed text-[#1E1B24] md:text-base">
              The official student-led community affiliated with GitHub.
              Spearheading the open-source revolution at SRMIST.
            </p>
            <img
              src="/image.png"
              alt="GitHub Community SRM"
              width={160}
              height={160}
              className="mt-4 h-[82px] w-[82px] object-contain sm:h-[96px] sm:w-[96px] md:h-[130px] md:w-[130px]"
            />
          </div>

          <div className="text-center md:text-left">
            <p
              className="mb-5 font-montserrat text-xs font-extrabold uppercase tracking-widest text-[#1E1B24]"
              style={{ color: "var(--color-text-primary)" }}
            >
              Navigation
            </p>
            <ul className="flex flex-col gap-3">
              {currentNavLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="font-rubik text-sm text-[#1E1B24] hover:text-blue transition-colors duration-200 md:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center md:text-left">
            <p
              className="mb-5 font-montserrat text-xs font-extrabold uppercase tracking-widest text-[#1E1B24]"
              style={{ color: "var(--color-text-primary)" }}
            >
              Recruitment
            </p>
            <ul className="flex flex-col gap-3">
              {recruitmentLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={(e) => handleAnchorClick(e, link.href)}
                    className="font-rubik text-sm text-[#1E1B24] hover:text-blue transition-colors duration-200 md:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div
          className="mt-8 flex items-center justify-center gap-4 border-b border-[--color-border] pb-6 md:justify-end"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <a
            href="https://github.com/SRM-IST-KTR"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-[#1E1B24] bg-[#FFFEEF] text-[#1E1B24] shadow-[3px_3px_0_#1E1B24] transition-transform hover:-translate-y-0.5 sm:h-11 sm:w-11 md:h-11 md:w-11"
          >
            <GitHubIcon />
          </a>
          <a
            href="https://www.instagram.com/githubsrm/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-[#1E1B24] bg-[#FFFEEF] text-[#1E1B24] shadow-[3px_3px_0_#1E1B24] transition-transform hover:-translate-y-0.5 sm:h-11 sm:w-11 md:h-11 md:w-11"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.linkedin.com/company/githubsrm/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-full border-[2px] border-[#1E1B24] bg-[#FFFEEF] text-[#1E1B24] shadow-[3px_3px_0_#1E1B24] transition-transform hover:-translate-y-0.5 sm:h-11 sm:w-11 md:h-11 md:w-11"
          >
            <LinkedInIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}

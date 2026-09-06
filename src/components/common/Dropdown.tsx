"use client";

import React, { useState, useRef, useEffect } from "react";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps {
  id?: string;
  name?: string;
  value: string;
  options: (string | DropdownOption)[];
  placeholder?: string;
  placeholderClassName?: string;
  error?: string | boolean;
  onChange: (value: string) => void;
  triggerBg?: string;
  className?: string;
  disabled?: boolean;
}

export function Dropdown({
  id,
  name,
  value,
  options,
  placeholder = "Select an option",
  placeholderClassName = "",
  error,
  onChange,
  triggerBg = "bg-[#FFD93D]",
  className = "",
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to { label, value } format
  const normalizedOptions: DropdownOption[] = options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const hasError = Boolean(error);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        id={id}
        name={name}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          w-full ${triggerBg} border-[3px] rounded-[24px] shadow-[4px_4px_0px_#1E1B24]
          p-6 font-rubik text-[18px] text-[#1E1B24] flex items-center justify-between text-left
          transition-all duration-200 cursor-pointer select-none focus:outline-none
          hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[6px_6px_0px_#1E1B24]
          active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1E1B24]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#1E1B24]
          ${hasError ? "border-[#D92323]" : "border-[#1E1B24]"}
        `}
      >
        <span
          className={`truncate ${
            selectedOption
              ? "font-bold text-[#1E1B24]"
              : placeholderClassName || "font-medium text-[#1E1B24]/70"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <svg
          className={`w-6 h-6 text-[#1E1B24] stroke-[2.5] shrink-0 ml-3 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Centered Neobrutalist Dropdown Menu Container */}
      <div
        role="listbox"
        aria-labelledby={id}
        className={`
          absolute top-[calc(100%+10px)] left-0 right-0 w-full bg-white border-[3px] border-[#1E1B24]
          rounded-[20px] shadow-[4px_4px_0px_#1E1B24] p-2.5 z-50 flex flex-col gap-1.5
          transform transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-top
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
        `}
      >
        {normalizedOptions.map((option) => {
          const isSelected = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(option.value)}
              className={`
                w-full px-5 py-3.5 rounded-[14px] text-left font-rubik text-[17px]
                flex items-center justify-between cursor-pointer transition-all duration-150
                ${
                  isSelected
                    ? "bg-[#FFD93D] font-bold text-[#1E1B24] border-2 border-[#1E1B24] shadow-[2px_2px_0px_#1E1B24]"
                    : "font-medium text-[#1E1B24] hover:bg-yellow-100 hover:translate-x-1 active:bg-yellow-200"
                }
              `}
            >
              <span className="truncate">{option.label}</span>
              {isSelected && (
                <svg
                  className="w-5 h-5 text-[#1E1B24] stroke-[2.5] shrink-0 ml-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Dropdown;

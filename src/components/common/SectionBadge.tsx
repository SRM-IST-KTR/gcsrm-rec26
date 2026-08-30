import React from "react";

export interface SectionBadgeProps {
  label?: string;
  children?: React.ReactNode;
  variant?: "yellow" | "red" | "green" | "blue" | "custom";
  bgColor?: string;
  className?: string;
  textClassName?: string;
}

const colorMap: Record<string, string> = {
  yellow: "bg-[#FFD93D]",
  red: "bg-[#FF4B4B]",
  green: "bg-[#4EC37B]",
  blue: "bg-[#3E9FFF]",
  custom: "",
};

export const SectionBadge: React.FC<SectionBadgeProps> = ({
  label,
  children,
  variant,
  bgColor,
  className = "",
  textClassName = "",
}) => {
  const content = label ?? children;
  const variantClass = variant ? colorMap[variant] || "" : "";
  const bgStyle = bgColor ? { backgroundColor: bgColor } : undefined;

  return (
    <div
      style={bgStyle}
      className={`inline-flex items-center justify-center w-fit h-fit rounded-[30px] border-[3px] border-[#1e1b24] shadow-[3px_3px_0px_0px_rgb(30_27_36)] py-1.5 px-5 select-none ${variantClass} ${className}`}
    >
      {typeof content === "string" ? (
        <span
          className={`font-outfit font-extrabold text-[14px] leading-[18px] uppercase tracking-[1.5px] text-[#1e1b24] text-center ${textClassName}`}
        >
          {content}
        </span>
      ) : (
        content
      )}
    </div>
  );
};

export default SectionBadge;

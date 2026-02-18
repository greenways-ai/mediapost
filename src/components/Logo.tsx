"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { container: "w-6 h-6", text: "text-lg", icon: "text-xs" },
    md: { container: "w-8 h-8", text: "text-xl", icon: "text-sm" },
    lg: { container: "w-10 h-10", text: "text-2xl", icon: "text-base" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className={`${s.container} rounded-lg bg-gradient-to-br from-accent to-info flex items-center justify-center`}>
        <span className={`text-white font-bold ${s.icon}`}>&lt;/&gt;</span>
      </div>
      {showText && (
        <span className={`font-display font-bold ${s.text} tracking-tight text-text-primary`}>
          Statstrade
        </span>
      )}
    </Link>
  );
}

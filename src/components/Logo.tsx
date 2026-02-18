"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { container: "w-7 h-7", text: "text-lg", icon: "text-xs" },
    md: { container: "w-9 h-9", text: "text-xl", icon: "text-sm" },
    lg: { container: "w-11 h-11", text: "text-2xl", icon: "text-base" },
  };

  const s = sizes[size];

  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className={`${s.container} rounded-xl bg-gradient-to-br from-accent to-info flex items-center justify-center shadow-glow`}>
        <span className={`text-white font-bold ${s.icon} font-display`}>MP</span>
      </div>
      {showText && (
        <span className={`font-display font-bold ${s.text} tracking-tight text-text-primary`}>
          MyPost
        </span>
      )}
    </Link>
  );
}

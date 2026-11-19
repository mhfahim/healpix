import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Mark: a teal squircle holding an inward-curving arrow (revenue coming back).
 * The gradient uses fixed brand teals so the mark reads the same in both themes.
 */
export function LogoMark({ size = 28, className, inverted }: { size?: number; className?: string; inverted?: boolean }) {
  const id = React.useId().replace(/:/g, "");
  const fg = inverted ? "#0F766E" : "#FFFFFF";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <defs>
        <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill={inverted ? "#FFFFFF" : `url(#lg-${id})`} />
      <path d="M23.5 9.5 A9.5 9.5 0 1 0 24.6 19" fill="none" stroke={fg} strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
      <path d="M22.4 10.6 Q16.8 12.8 16.4 16.4" fill="none" stroke={fg} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M13.4 14.2 L16.4 17.4 L19.3 14" fill="none" stroke={fg} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, compact, size = 30 }: { className?: string; compact?: boolean; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {!compact && <span className="text-[19px] font-semibold tracking-[-0.03em] text-slate-900">Helpix</span>}
    </span>
  );
}

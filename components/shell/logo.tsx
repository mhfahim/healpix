import { cn } from "@/lib/utils";

/** Mark: a teal circle with an inward-curving arrow — revenue coming back. */
export function LogoMark({ size = 28, className, inverted }: { size?: number; className?: string; inverted?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="16" fill={inverted ? "#FFFFFF" : "#0F766E"} />
      {/* outer arc entering from top-right, curving inward to the centre */}
      <path
        d="M24.5 9.5 A10 10 0 1 0 25.6 18.6"
        fill="none"
        stroke={inverted ? "#0F766E" : "#FFFFFF"}
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path d="M23 11 Q17 13.5 16.6 16.4" fill="none" stroke={inverted ? "#0F766E" : "#FFFFFF"} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M13.6 14.4 L16.6 17.4 L19.4 14.2" fill="none" stroke={inverted ? "#0F766E" : "#FFFFFF"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ className, compact, size = 28 }: { className?: string; compact?: boolean; size?: number }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark size={size} />
      {!compact && <span className="text-h2 font-semibold tracking-tight text-slate-900">Helpix</span>}
    </span>
  );
}

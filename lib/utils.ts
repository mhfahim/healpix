import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge our custom type scale so `text-body` and `text-slate-900` don't collide.
const merge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["caption", "small", "body", "h3", "base", "h2", "h1", "display", "kpi", "hero"] }],
      "max-w": [{ "max-w": ["content"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return merge(clsx(inputs));
}

/** Indian/Bangladeshi lakh grouping: 3240000 -> "32,40,000" */
export function lakh(n: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);
}

/** BDT currency with lakh formatting: "৳ 32,40,000" */
export function bdt(n: number) {
  return `৳ ${lakh(n)}`;
}

/** Plain number with lakh grouping */
export const num = lakh;

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
/** Convert latin digits in a string or number to Bangla digits */
export function toBn(v: string | number) {
  return String(v).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

export function pct(n: number, digits = 0) {
  return `${n.toFixed(digits)}%`;
}

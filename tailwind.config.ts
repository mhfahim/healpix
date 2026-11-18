import type { Config } from "tailwindcss";

/**
 * Helpix design tokens (Section 3 of the brief).
 * The default Tailwind palette, type scale and radii are REPLACED, not extended,
 * so screens can only use tokens defined here — no one-off colors or font sizes.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      surface: "#FFFFFF",
      teal: {
        50: "#F0FDFA",
        100: "#CCFBF1",
        200: "#99F6E4",
        500: "#14B8A6",
        600: "#0D9488",
        700: "#0F766E",
        800: "#115E59",
        900: "#134E4A",
      },
      slate: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        700: "#334155",
        900: "#0F172A",
      },
      // Semantic. DEFAULT = icon/border color, bg = tint, fg = AA text on the tint.
      success: { DEFAULT: "#16A34A", bg: "#F0FDF4", fg: "#15803D" },
      warning: { DEFAULT: "#D97706", bg: "#FFFBEB", fg: "#B45309" },
      danger: { DEFAULT: "#DC2626", bg: "#FEF2F2", fg: "#B91C1C" },
      info: { DEFAULT: "#2563EB", bg: "#EFF6FF", fg: "#1D4ED8" },
      // AI accent — only for AI-generated content.
      ai: { DEFAULT: "#7C3AED", bg: "#F5F3FF", fg: "#6D28D9" },
      // Data viz
      chart: {
        captured: "#0D9488",
        leaked: "#F97316",
        pending: "#CBD5E1",
        baseline: "#64748B",
        secondary: "#6366F1",
      },
      whatsapp: { bg: "#EFEAE2", bubble: "#D9FDD3", header: "#075E54" },
    },
    fontFamily: {
      sans: ["var(--font-inter)", "var(--font-bengali)", "system-ui", "sans-serif"],
      bn: ["var(--font-bengali)", "var(--font-inter)", "system-ui", "sans-serif"],
      mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      serif: ["Georgia", "serif"], // signatures and the ℞ glyph only
    },
    fontSize: {
      caption: ["12px", { lineHeight: "16px" }],
      small: ["13px", { lineHeight: "18px" }],
      body: ["14px", { lineHeight: "20px" }],
      h3: ["16px", { lineHeight: "24px" }],
      base: ["16px", { lineHeight: "24px" }], // patient body minimum
      h2: ["20px", { lineHeight: "28px" }],
      h1: ["24px", { lineHeight: "32px" }],
      display: ["30px", { lineHeight: "36px" }],
      kpi: ["32px", { lineHeight: "40px" }],
      hero: ["48px", { lineHeight: "56px" }], // patient serial number only
    },
    borderRadius: {
      none: "0",
      sm: "4px",
      DEFAULT: "6px", // buttons, inputs
      md: "6px",
      lg: "8px", // cards
      xl: "12px", // dialogs, sheets
      full: "9999px",
    },
    boxShadow: {
      none: "none",
      sm: "0 1px 2px 0 rgb(15 23 42 / 0.06), 0 4px 12px -2px rgb(15 23 42 / 0.08)",
    },
    extend: {
      maxWidth: { content: "1280px" },
      width: { sidebar: "240px" },
      height: { topbar: "64px" },
      keyframes: {
        wave: { "0%,100%": { transform: "scaleY(0.3)" }, "50%": { transform: "scaleY(1)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "slide-in": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "toast-in": { from: { transform: "translateY(8px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
      },
      animation: {
        wave: "wave 1s ease-in-out infinite",
        shimmer: "shimmer 1.4s infinite",
        "slide-in": "slide-in 220ms cubic-bezier(.2,.8,.2,1)",
        "fade-in": "fade-in 150ms ease-out",
        "toast-in": "toast-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;

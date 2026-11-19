import type { Config } from "tailwindcss";

/**
 * Helpix design tokens.
 *
 * Every color is a CSS variable (RGB channels) defined in app/globals.css with a
 * light and a dark value, so the whole UI switches theme by toggling the `dark`
 * class on <html>. Tailwind's default palette, type scale and radii are
 * REPLACED, not extended: screens can only use tokens defined here.
 */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const scale = (name: string, steps: (number | string)[]) => Object.fromEntries(steps.map((s) => [s, v(`${name}-${s}`)]));
const semantic = (name: string) => ({ DEFAULT: v(name), bg: v(`${name}-bg`), fg: v(`${name}-fg`) });

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Literal white/black: only for content that sits on fixed dark imagery (WhatsApp header, hero panel)
      white: "#FFFFFF",
      black: "#000000",
      surface: { DEFAULT: v("surface"), raised: v("surface-raised"), sunken: v("surface-sunken") },
      // Text/icon color on any saturated fill (primary button, selected chip, status fills)
      "on-accent": v("on-accent"),
      teal: scale("teal", [50, 100, 200, 300, 500, 600, 700, 800, 900]),
      slate: scale("slate", [50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900]),
      success: semantic("success"),
      warning: semantic("warning"),
      danger: semantic("danger"),
      info: semantic("info"),
      // AI accent — only for AI-generated content.
      ai: semantic("ai"),
      // Soft category tints for icon chips, schedule cards and tags (subtle color, never status)
      sky: semantic("sky"),
      iris: semantic("iris"),
      peach: semantic("peach"),
      rose: semantic("rose"),
      mint: semantic("mint"),
      chart: {
        captured: v("chart-captured"),
        leaked: v("chart-leaked"),
        pending: v("chart-pending"),
        baseline: v("chart-baseline"),
        secondary: v("chart-secondary"),
        grid: v("chart-grid"),
      },
      brand: { deep: "#0B3B38" },
      // Dark feature cards inside the light UI (heatmaps, AI insights, gauges)
      hero: v("hero"),
      grad: { green: v("g-green"), lime: v("g-lime"), yellow: v("g-yellow"), orange: v("g-orange"), red: v("g-red") },
      whatsapp: { bg: v("wa-bg"), bubble: v("wa-bubble"), header: v("wa-header") },
    },
    fontFamily: {
      sans: ["var(--font-geist-sans)", "var(--font-bengali)", "system-ui", "sans-serif"],
      bn: ["var(--font-bengali)", "var(--font-geist-sans)", "system-ui", "sans-serif"],
      mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      serif: ["Georgia", "serif"], // signatures and the ℞ glyph only
    },
    fontSize: {
      micro: ["11px", { lineHeight: "14px" }], // chart axis ticks only
      caption: ["12px", { lineHeight: "16px" }],
      small: ["13px", { lineHeight: "18px" }],
      body: ["14px", { lineHeight: "20px" }],
      h3: ["16px", { lineHeight: "24px" }],
      base: ["16px", { lineHeight: "24px" }], // patient body minimum
      h2: ["20px", { lineHeight: "28px" }],
      h1: ["24px", { lineHeight: "32px" }],
      title: ["28px", { lineHeight: "34px", letterSpacing: "-0.02em" }], // page titles
      display: ["30px", { lineHeight: "36px", letterSpacing: "-0.02em" }],
      kpi: ["34px", { lineHeight: "40px", letterSpacing: "-0.035em" }],
      hero: ["48px", { lineHeight: "56px", letterSpacing: "-0.03em" }], // patient serial number only
    },
    borderRadius: {
      none: "0",
      sm: "6px",
      DEFAULT: "8px", // buttons, inputs
      md: "8px",
      lg: "12px", // cards
      xl: "16px", // hero cards, dialogs, sheets
      "2xl": "28px", // phone frame only
      full: "9999px",
    },
    boxShadow: {
      none: "none",
      card: "0 1px 2px 0 rgb(var(--shadow) / 0.03), 0 4px 16px -4px rgb(var(--shadow) / 0.06)",
      sm: "0 1px 2px 0 rgb(var(--shadow) / 0.06), 0 8px 24px -6px rgb(var(--shadow) / 0.14)",
      ring: "0 0 0 4px rgb(var(--teal-500) / 0.15)",
    },
    extend: {
      maxWidth: { content: "1320px" },
      width: { sidebar: "248px" },
      height: { topbar: "64px" },
      keyframes: {
        wave: { "0%,100%": { transform: "scaleY(0.3)" }, "50%": { transform: "scaleY(1)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "slide-in": { from: { transform: "translateX(100%)" }, to: { transform: "translateX(0)" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "pop-in": { from: { opacity: "0", transform: "translateY(4px) scale(0.98)" }, to: { opacity: "1", transform: "none" } },
        "toast-in": { from: { transform: "translateY(8px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
      },
      animation: {
        wave: "wave 1s ease-in-out infinite",
        shimmer: "shimmer 1.4s infinite",
        "slide-in": "slide-in 240ms cubic-bezier(.2,.8,.2,1)",
        "fade-in": "fade-in 150ms ease-out",
        "pop-in": "pop-in 160ms cubic-bezier(.2,.8,.2,1)",
        "toast-in": "toast-in 200ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;

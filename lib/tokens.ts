/**
 * Token references for charts and inline SVG. These are CSS-variable colors,
 * so every chart follows the light/dark theme automatically (SVG presentation
 * attributes resolve var() in all modern browsers).
 */
const c = (name: string) => `rgb(var(--${name}))`;
export const alpha = (name: string, a: number) => `rgb(var(--${name}) / ${a})`;

export const tokens = {
  teal: { 50: c("teal-50"), 100: c("teal-100"), 200: c("teal-200"), 300: c("teal-300"), 500: c("teal-500"), 600: c("teal-600"), 700: c("teal-700"), 800: c("teal-800"), 900: c("teal-900") },
  slate: { 50: c("slate-50"), 100: c("slate-100"), 150: c("slate-150"), 200: c("slate-200"), 300: c("slate-300"), 400: c("slate-400"), 500: c("slate-500"), 700: c("slate-700"), 900: c("slate-900") },
  surface: c("surface"),
  success: c("success"),
  warning: c("warning"),
  danger: c("danger"),
  info: c("info"),
  ai: c("ai"),
  chart: {
    captured: c("chart-captured"),
    leaked: c("chart-leaked"),
    pending: c("chart-pending"),
    baseline: c("chart-baseline"),
    secondary: c("chart-secondary"),
    grid: c("chart-grid"),
  },
} as const;

/** Categorical order for leak reasons and other multi-series charts */
export const categorical = [c("g-orange"), c("g-yellow"), c("g-lime"), c("chart-captured"), c("sky"), c("chart-pending")];

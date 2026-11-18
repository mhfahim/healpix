/** JS mirror of design tokens for charts (Recharts needs literal colors). */
export const tokens = {
  teal: { 50: "#F0FDFA", 100: "#CCFBF1", 200: "#99F6E4", 500: "#14B8A6", 600: "#0D9488", 700: "#0F766E", 800: "#115E59", 900: "#134E4A" },
  slate: { 50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1", 400: "#94A3B8", 500: "#64748B", 700: "#334155", 900: "#0F172A" },
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#2563EB",
  ai: "#7C3AED",
  chart: {
    captured: "#0D9488",
    leaked: "#F97316",
    pending: "#CBD5E1",
    baseline: "#64748B",
    secondary: "#6366F1",
  },
} as const;

/** Categorical order used for leak reasons and multi-series charts */
export const categorical = [
  tokens.chart.leaked,
  tokens.chart.secondary,
  tokens.teal[600],
  tokens.warning,
  tokens.slate[500],
  tokens.chart.pending,
];

"use client";
/**
 * Data display in the BioSync language.
 * - MetricCard (KpiCard): label + status pill, large regular-weight figure with a small unit,
 *   and one quiet visual: a marker line, a bar strip or comparison bars.
 * - MetricLine: thin line, soft area, dashed marker, dark tooltip.
 * - BarStrip: dense capsule "barcode"; CompareBars: Average vs Your result.
 * - RiskSlider (gradient track + ringed knob), TickGauge (arc of gradient ticks + needle),
 *   Heatmap + GradientLegend, StepsList (outlined icon timeline).
 * Compatibility: TickMeter, DotMatrix, Gauge and Progress keep their props but render in this language.
 */
import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/tokens";
import { Card, Skeleton, StatusDot, type DotTone, type TintTone } from "./primitives";

/* Gradient helpers ------------------------------------------------------ */
const STOPS: [number, [number, number, number]][] = [
  [0, [34, 197, 94]],
  [0.3, [163, 230, 53]],
  [0.5, [234, 179, 8]],
  [0.72, [249, 115, 22]],
  [1, [239, 68, 68]],
];
/** Colour at position t (0..1) along the risk gradient (green → red). `good` flips it. */
export function gradAt(t: number, good = false) {
  let x = Math.min(1, Math.max(0, good ? 1 - t : t));
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (x <= p1) {
      const k = (x - p0) / (p1 - p0);
      const c = c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
      return `rgb(${c[0]} ${c[1]} ${c[2]})`;
    }
  }
  x = 1;
  return "rgb(239 68 68)";
}

/* Smooth path through points (Catmull-Rom → Bézier) --------------------- */
function smooth(pts: number[][]) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  return d;
}

/* Sparkline (fixed or fluid width) -------------------------------------- */
export function Sparkline({
  data,
  color = tokens.chart.captured,
  width = 96,
  height = 28,
  className,
  dots,
  fluid,
  step,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  dots?: boolean;
  fluid?: boolean;
  step?: boolean;
}) {
  const W = fluid ? 100 : width;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 3;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * (W - (fluid ? 0 : 4)) + (fluid ? 0 : 2), height - pad - ((d - min) / range) * (height - pad * 2)]);
  const path = step
    ? pts.map((p, i) => (i ? `H${p[0].toFixed(2)} V${p[1].toFixed(2)}` : `M${p[0].toFixed(2)},${p[1].toFixed(2)}`)).join(" ")
    : smooth(pts);
  const last = pts[pts.length - 1];
  return (
    <svg width={fluid ? "100%" : width} height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio={fluid ? "none" : undefined} className={cn("block overflow-visible", className)} aria-hidden>
      <path d={`${path} L${last[0]},${height} L${pts[0][0]},${height} Z`} fill={color} opacity={0.1} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {!fluid && dots && pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2} fill={color} />)}
      {!fluid && <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />}
    </svg>
  );
}

/* Marker line: thin line, soft area, dashed marker + dark tooltip -------- */
export function MetricLine({
  data,
  labels,
  marker,
  height = 72,
  colorVar = "g-green",
  format = (v: number) => String(v),
  markerLabel,
  axis = true,
  onDark,
}: {
  data: number[];
  labels?: string[];
  /** index of the highlighted point (default: last) */
  marker?: number;
  height?: number;
  colorVar?: string;
  format?: (v: number) => string;
  markerLabel?: string;
  axis?: boolean;
  onDark?: boolean;
}) {
  const id = React.useId().replace(/:/g, "");
  const [hover, setHover] = React.useState<number | null>(null);
  const m = hover ?? marker ?? data.length - 1;
  const W = 100;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * W, 8 + (1 - (d - min) / range) * (height - 16)]);
  const path = smooth(pts);
  const x = (m / (data.length - 1)) * 100;
  const color = `rgb(var(--${colorVar}))`;
  return (
    <div className="select-none">
      <div
        className="relative"
        style={{ height }}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setHover(Math.round(((e.clientX - r.left) / r.width) * (data.length - 1)));
        }}
        onMouseLeave={() => setHover(null)}
      >
        <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" className="block overflow-visible" aria-hidden>
          <defs>
            <linearGradient id={`ml-${id}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.16} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`${path} L${W},${height} L0,${height} Z`} fill={`url(#ml-${id})`} />
          <path d={path} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
        </svg>
        <span className={cn("absolute inset-y-0 w-0 border-l border-dashed", onDark ? "border-white/40" : "border-slate-400")} style={{ left: `${x}%`, top: pts[m][1] }} />
        <span className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface" style={{ left: `${x}%`, top: pts[m][1], background: color }} />
        <span
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm bg-hero px-2 py-1 text-center text-white shadow-sm"
          style={{ left: `${Math.min(92, Math.max(8, x))}%`, top: pts[m][1] - 10 }}
        >
          <span className="tnum block text-small font-medium leading-tight">{format(data[m])}</span>
          {(labels || markerLabel) && <span className="block text-[10px] leading-tight text-white/60">{labels ? labels[m] : markerLabel}</span>}
          <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-hero" />
        </span>
      </div>
      {axis && labels && (
        <div className="mt-2 flex justify-between">
          {labels.map((l, i) => (
            <span key={i} className={cn("tnum text-micro", i === m ? (onDark ? "text-white" : "text-slate-900") : onDark ? "text-white/40" : "text-slate-400")}>
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* Bar strip: dense capsules; one range emphasised, the rest faded ------- */
export function BarStrip({
  data,
  colorVar = "g-orange",
  height = 48,
  range,
  split,
  labels,
  className,
}: {
  data: number[];
  colorVar?: string;
  height?: number;
  /** [from, to] indices drawn strong; others faded (default: all strong except edges) */
  range?: [number, number];
  /** index where a thin divider is drawn (e.g. left vs right) */
  split?: number;
  labels?: [string, string] | string[];
  className?: string;
}) {
  const max = Math.max(...data);
  const [a, b] = range ?? [1, data.length - 2];
  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-[3px]" style={{ height }} aria-hidden>
        {data.map((d, i) => (
          <React.Fragment key={i}>
            {split === i && <span className="mx-0.5 h-full w-px bg-slate-300" />}
            <span
              className="w-full max-w-[6px] rounded-full"
              style={{
                height: `${Math.max(28, (d / max) * 100)}%`,
                background: i >= a && i <= b ? `rgb(var(--${colorVar}))` : `rgb(var(--${colorVar}) / 0.14)`,
              }}
            />
          </React.Fragment>
        ))}
      </div>
      {labels && (
        <div className={cn("mt-2 flex text-caption text-slate-400", labels.length === 2 ? "justify-around" : "justify-between")}>
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* Comparison bars (Average vs Your result) ------------------------------ */
export function CompareBars({
  rows,
  max,
  colorVar = "g-orange",
  className,
}: {
  rows: { label: string; value: number; display: string; strong?: boolean }[];
  max?: number;
  colorVar?: string;
  className?: string;
}) {
  const top = max ?? Math.max(...rows.map((r) => r.value)) * 1.6;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {rows.map((r) => {
        const w = Math.min(100, (r.value / top) * 100);
        return (
          <div key={r.label}>
            <div className="relative mb-1.5 h-4 text-caption">
              <span className="absolute left-0 text-slate-500">{r.label}</span>
              <span className="tnum absolute -translate-x-full whitespace-nowrap pr-2 font-medium text-slate-900" style={{ left: `${w}%` }}>
                {r.display}
              </span>
              <span className="absolute top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ left: `${w}%`, background: `rgb(var(--${colorVar}))` }} />
            </div>
            <div className="relative h-6 overflow-hidden rounded-sm bg-slate-100">
              <div
                className="absolute inset-y-0 left-0 rounded-sm"
                style={{
                  width: `${w}%`,
                  background: r.strong ? `linear-gradient(90deg, rgb(var(--${colorVar}) / 0.45), rgb(var(--${colorVar})))` : `linear-gradient(90deg, rgb(var(--${colorVar}) / 0.08), rgb(var(--${colorVar}) / 0.22))`,
                }}
              />
              <span className="absolute -top-1 bottom-0 w-0 border-l border-dashed" style={{ left: `${w}%`, borderColor: `rgb(var(--${colorVar}))` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* Risk slider: gradient track + ringed knob ----------------------------- */
export function RiskSlider({ value, max = 100, good, className, label }: { value: number; max?: number; good?: boolean; className?: string; label?: string }) {
  const t = Math.min(1, Math.max(0, value / max));
  return (
    <div role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label} className={cn("relative h-3.5", className)}>
      <div className={cn("absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full", good ? "bg-grad-good" : "bg-grad-risk")} />
      <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-surface shadow-sm" style={{ left: `${t * 100}%`, borderColor: gradAt(t, good) }} />
    </div>
  );
}

/* Tick gauge: half-circle of gradient ticks with a needle --------------- */
export function TickGauge({
  value,
  max = 100,
  ticks = 41,
  size = 280,
  good = true,
  onDark,
  children,
}: {
  value: number;
  max?: number;
  ticks?: number;
  size?: number;
  /** true: low = red, high = green */
  good?: boolean;
  onDark?: boolean;
  children?: React.ReactNode;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r1 = size / 2 - 6;
  const r0 = r1 - size * 0.12;
  const at = Math.round((value / max) * (ticks - 1));
  return (
    <div className="relative mx-auto" style={{ width: size, height: size / 2 + 8 }}>
      <svg width={size} height={size / 2 + 8} aria-hidden>
        {Array.from({ length: ticks }).map((_, i) => {
          const a = Math.PI - (i / (ticks - 1)) * Math.PI;
          const needle = i === at;
          const rr0 = needle ? r0 - size * 0.08 : r0;
          const x0 = +(cx + rr0 * Math.cos(a)).toFixed(2);
          const y0 = +(cy - rr0 * Math.sin(a)).toFixed(2);
          const x1 = +(cx + r1 * Math.cos(a)).toFixed(2);
          const y1 = +(cy - r1 * Math.sin(a)).toFixed(2);
          return (
            <line
              key={i}
              x1={x0}
              y1={y0}
              x2={x1}
              y2={y1}
              stroke={needle ? (onDark ? "#FFFFFF" : tokens.slate[900]) : gradAt(i / (ticks - 1), good)}
              strokeWidth={needle ? 3.5 : 3}
              strokeLinecap="round"
              opacity={needle ? 1 : i <= at ? 1 : 0.22}
            />
          );
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">{children}</div>
    </div>
  );
}

/* Vertical gradient legend ---------------------------------------------- */
export function GradientLegend({ labels = ["High", "Mid", "Low"], height = 220, onDark }: { labels?: string[]; height?: number; onDark?: boolean }) {
  return (
    <div className="flex items-stretch gap-2.5" style={{ height }}>
      <div className={cn("flex flex-col justify-between text-right text-caption tnum", onDark ? "text-white/60" : "text-slate-500")}>
        {labels.map((l) => (
          <span key={l} className="flex items-center gap-1.5">
            {l} <span className={cn("h-px w-1.5", onDark ? "bg-white/40" : "bg-slate-300")} />
          </span>
        ))}
      </div>
      <div className="w-1.5 rounded-full bg-grad-risk-v" />
    </div>
  );
}

/* Heatmap: soft glowing cells coloured along the risk gradient ---------- */
export function Heatmap({
  rows,
  cols,
  values,
  onDark,
  format = (v: number) => `${Math.round(v * 100)}%`,
}: {
  rows: string[];
  cols: string[];
  /** values[r][c] in 0..1 (0 = good, 1 = bad) */
  values: number[][];
  onDark?: boolean;
  format?: (v: number) => string;
}) {
  const [hover, setHover] = React.useState<[number, number] | null>(null);
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `120px repeat(${cols.length}, minmax(0, 1fr))` }}>
      <span />
      {cols.map((c) => (
        <span key={c} className={cn("truncate pb-1 text-center text-caption", onDark ? "text-white/50" : "text-slate-500")}>
          {c}
        </span>
      ))}
      {rows.map((r, ri) => (
        <React.Fragment key={r}>
          <span className={cn("flex items-center truncate pr-2 text-small", onDark ? "text-white/70" : "text-slate-600")}>{r}</span>
          {cols.map((c, ci) => {
            const v = values[ri][ci];
            const on = hover && hover[0] === ri && hover[1] === ci;
            const col = gradAt(v);
            return (
              <span
                key={c}
                onMouseEnter={() => setHover([ri, ci])}
                onMouseLeave={() => setHover(null)}
                className="relative flex h-9 items-center justify-center rounded transition-transform"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${col} 0%, ${col.replace(/\)$/, " / 0.55)")} 55%, ${col.replace(/\)$/, " / 0.16)")} 100%)`,
                  boxShadow: onDark ? `0 0 12px -6px ${col}` : undefined,
                  transform: on ? "scale(1.06)" : undefined,
                }}
                title={`${r} · ${c}: ${format(v)} leaked`}
              >
                {on && <span className="tnum rounded-sm bg-hero/80 px-1.5 text-[10px] font-medium text-white">{format(v)}</span>}
              </span>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

/* Steps timeline (outlined icon squares) -------------------------------- */
export function StepsList({ steps }: { steps: { icon: LucideIcon; title: string; tag?: string; items: string[] }[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={s.title} className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] gap-6 pb-6 last:pb-0">
          {i < steps.length - 1 && <span className="absolute left-4 top-9 h-[calc(100%-36px)] w-px bg-slate-200" aria-hidden />}
          <div className="flex items-start gap-3">
            <span className="relative z-10 inline-flex size-8 shrink-0 items-center justify-center rounded bg-surface text-slate-700 ring-1 ring-inset ring-slate-200">
              <s.icon className="size-4" strokeWidth={1.5} />
            </span>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-body font-medium text-slate-900">{s.title}</span>
              {s.tag && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-caption text-slate-600">{s.tag}</span>}
            </div>
          </div>
          <ul className="space-y-1 pt-1">
            {s.items.map((it) => (
              <li key={it} className="flex gap-2 text-small text-slate-700">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-slate-400" />
                {it}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/* Metric card (KpiCard) -------------------------------------------------- */
export function KpiCard({
  label,
  value,
  unit,
  delta,
  deltaTone = "up-good",
  sub,
  spark,
  sparkLabels,
  sparkVar,
  sparkColor,
  status,
  chart = "line",
  loading,
  className,
  format,
  children,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  delta?: string;
  deltaTone?: "up-good" | "down-good" | "neutral";
  sub?: string;
  spark?: number[];
  sparkLabels?: string[];
  sparkVar?: string;
  /** @deprecated kept for compatibility */
  sparkColor?: string;
  status?: { label: string; tone: DotTone };
  chart?: "line" | "strip" | "none" | "bars" | "step";
  loading?: boolean;
  className?: string;
  format?: (v: number) => string;
  children?: React.ReactNode;
  /** @deprecated icons are no longer shown on metric cards */
  icon?: LucideIcon;
  /** @deprecated */
  tone?: TintTone;
  menu?: boolean;
}) {
  if (loading) {
    return (
      <Card className={cn("p-5", className)}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-9 w-28" />
        <Skeleton className="mt-5 h-12 w-full" />
      </Card>
    );
  }
  const negative = delta?.trim().startsWith("-") || delta?.trim().startsWith("−");
  const good = deltaTone === "neutral" ? null : deltaTone === "up-good" ? !negative : negative;
  const pill = status ?? (delta ? { label: delta, tone: (good === null ? "neutral" : good ? "green" : "red") as DotTone } : undefined);
  const v = sparkVar ?? (sparkColor?.match(/--([\w-]+)/)?.[1] ?? (good === false ? "g-red" : "g-green"));
  return (
    <Card className={cn("flex min-w-0 flex-col p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 truncate text-body text-slate-600">{label}</p>
        {pill && <StatusDot tone={pill.tone}>{pill.label}</StatusDot>}
      </div>
      <p className="tnum mt-2 whitespace-nowrap text-kpi font-normal text-slate-900">
        {value}
        {unit && <span className="ml-1 text-h2 font-normal text-slate-400">{unit}</span>}
      </p>
      {sub && <p className="mt-0.5 text-caption text-slate-500">{sub}</p>}
      {children && <div className="mt-auto pt-4">{children}</div>}
      {!children && spark && chart !== "none" && (
        <div className="mt-auto pt-5">
          {chart === "strip" || chart === "bars" ? (
            <BarStrip data={spark} colorVar={v} height={36} />
          ) : (
            <MetricLine data={spark} labels={sparkLabels} height={44} colorVar={v} axis={!!sparkLabels} format={format} />
          )}
        </div>
      )}
    </Card>
  );
}

/* Hero card: dark feature surface inside the light UI ------------------- */
export function HeroCard({ title, action, children, className }: { title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-xl bg-hero p-6 text-white ring-1 ring-white/5", className)}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-3">
          {title && <h3 className="text-h2 font-normal tracking-tight text-white">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
export function HeroTile({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-lg bg-white/[0.06] p-4 ring-1 ring-inset ring-white/[0.06]", className)}>{children}</div>;
}

/* Compatibility wrappers ------------------------------------------------ */
/** Progress meter: soft track, gradient fill, ringed knob at the value. */
export function TickMeter({ value, max = 100, colorVar = "chart-captured", className, label, height }: { value: number; max?: number; ticks?: number; colorVar?: string; height?: number; className?: string; label?: string }) {
  const t = Math.min(100, (value / max) * 100);
  void height;
  return (
    <div role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label} className={cn("relative h-3.5", className)}>
      <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-100" />
      <div className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: `${t}%`, background: `linear-gradient(90deg, rgb(var(--${colorVar}) / 0.3), rgb(var(--${colorVar})))` }} />
      <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-surface" style={{ left: `${t}%`, borderColor: `rgb(var(--${colorVar}))` }} />
    </div>
  );
}

/** Weekday counts as a bar strip with the peak labelled. */
export function DotMatrix({ data, labels, colorVar = "chart-captured", peakLabel }: { data: number[]; labels?: string[]; rows?: number; colorVar?: string; peakLabel?: string }) {
  const peak = data.indexOf(Math.max(...data));
  const max = Math.max(...data);
  return (
    <div className="w-full">
      <div className="flex h-28 items-end gap-3">
        {data.map((d, i) => (
          <div key={i} className="relative flex h-full flex-1 flex-col justify-end">
            {i === peak && peakLabel && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface px-2 py-0.5 text-caption shadow-sm ring-1 ring-slate-200">{peakLabel}</span>
            )}
            <span className="w-full rounded-full" style={{ height: `${(d / max) * 100}%`, background: i === peak ? `rgb(var(--${colorVar}))` : `rgb(var(--${colorVar}) / 0.18)` }} />
          </div>
        ))}
      </div>
      {labels && (
        <div className="mt-2 flex gap-3">
          {labels.map((l, i) => (
            <span key={l} className={cn("flex-1 text-center text-micro", i === peak ? "font-medium text-slate-900" : "text-slate-400")}>
              {l}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function Gauge({ value, max = 100, size = 220, children }: { value: number; max?: number; segments?: number; size?: number; colorVar?: string; children?: React.ReactNode }) {
  return (
    <TickGauge value={value} max={max} size={size}>
      {children}
    </TickGauge>
  );
}

export function MiniBars({ data, colorVar = "chart-captured", className, height = 36 }: { data: number[]; colorVar?: string; className?: string; highlight?: number; height?: number }) {
  return <BarStrip data={data} colorVar={colorVar} height={height} className={className} range={[0, data.length - 1]} />;
}

/* Progress bar ---------------------------------------------------------- */
export function Progress({ value, className, tone = "teal", label }: { value: number; className?: string; tone?: "teal" | "warning" | "slate"; label?: string }) {
  return <TickMeter value={value} className={className} label={label} colorVar={tone === "warning" ? "g-orange" : tone === "slate" ? "slate-400" : "chart-captured"} />;
}

/* Data table ------------------------------------------------------------ */
export type Column<T> = {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sort?: (row: T) => number | string;
  align?: "left" | "right" | "center";
  width?: string;
  className?: string;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  pageSize = 0,
  defaultSort,
  onRowClick,
  rowClassName,
  maxHeight,
  dense,
  loading,
  empty,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (r: T) => string | number;
  pageSize?: number;
  defaultSort?: { key: string; dir: "asc" | "desc" };
  onRowClick?: (r: T) => void;
  rowClassName?: (r: T) => string | undefined;
  maxHeight?: string;
  dense?: boolean;
  loading?: boolean;
  empty?: React.ReactNode;
}) {
  const [sort, setSort] = React.useState(defaultSort);
  const [page, setPage] = React.useState(0);
  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sort) return rows;
    const s = [...rows].sort((a, b) => {
      const va = col.sort!(a);
      const vb = col.sort!(b);
      return va < vb ? -1 : va > vb ? 1 : 0;
    });
    return sort.dir === "desc" ? s.reverse() : s;
  }, [rows, sort, columns]);
  const pages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const visible = pageSize ? sorted.slice(page * pageSize, page * pageSize + pageSize) : sorted;
  const cellPad = dense ? "px-3 py-2.5" : "px-4 py-3.5";

  return (
    <div>
      <div className={cn("overflow-auto", maxHeight)}>
        <table className="w-full border-collapse text-body">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="border-b border-slate-200">
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    style={{ width: c.width }}
                    aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
                    className={cn(
                      "whitespace-nowrap px-4 py-2.5 text-caption font-medium text-slate-400",
                      dense && "px-3",
                      c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"
                    )}
                  >
                    {c.sort ? (
                      <button
                        className={cn("inline-flex items-center gap-1 hover:text-slate-900", active && "text-slate-900", c.align === "right" && "flex-row-reverse")}
                        onClick={() => setSort({ key: c.key, dir: active && sort!.dir === "desc" ? "asc" : "desc" })}
                      >
                        {c.header}
                        {active ? (
                          <ChevronDown className={cn("size-3.5 transition-transform", sort!.dir === "asc" && "rotate-180")} />
                        ) : (
                          <ChevronsUpDown className="size-3.5 opacity-50" />
                        )}
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  {columns.map((c) => (
                    <td key={c.key} className={cellPad}>
                      <Skeleton className="h-4 w-full max-w-[140px]" />
                    </td>
                  ))}
                </tr>
              ))}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={columns.length}>{empty}</td>
              </tr>
            )}
            {!loading &&
              visible.map((r) => (
                <tr
                  key={rowKey(r)}
                  onClick={onRowClick ? () => onRowClick(r) : undefined}
                  className={cn(
                    "group border-b border-slate-100 last:border-b-0",
                    onRowClick && "cursor-pointer hover:bg-slate-50",
                    rowClassName?.(r)
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        cellPad,
                        "tnum align-middle",
                        c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left",
                        c.className
                      )}
                    >
                      {c.cell(r)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {pageSize > 0 && sorted.length > pageSize && (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 text-small text-slate-500">
          <span className="tnum">
            {page * pageSize + 1}–{Math.min(sorted.length, (page + 1) * pageSize)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="rounded p-1 hover:bg-slate-100 disabled:opacity-40"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="tnum px-1">
              Page {page + 1} of {pages}
            </span>
            <button
              className="rounded p-1 hover:bg-slate-100 disabled:opacity-40"
              disabled={page >= pages - 1}
              onClick={() => setPage((p) => p + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Capture-rate cell: slim track, teal gradient fill, dashed baseline --- */
export function RateBar({ value, baseline, width = 88 }: { value: number; baseline?: number; width?: number }) {
  return (
    <span className="inline-flex items-center justify-end gap-2.5">
      <span className="relative h-1.5 rounded-full bg-slate-100" style={{ width }}>
        <span className="absolute inset-y-0 left-0 rounded-full bg-grad-teal" style={{ width: `${value}%` }} />
        {baseline !== undefined && <span className="absolute -inset-y-1 w-0 border-l border-dashed border-slate-500" style={{ left: `${baseline}%` }} />}
      </span>
      <span className="tnum w-9 text-right">{value}%</span>
    </span>
  );
}

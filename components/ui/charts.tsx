"use client";
/**
 * Chart language (BioSync)
 * - Quiet axes: no axis lines, faint or no grid, 11px neutral ticks.
 * - Lines are thin (1.5–2px) with a soft area; the focus point gets a dashed
 *   marker and a near-black tooltip with a caret.
 * - Bars are soft capsules: faded tint for context, solid/gradient for focus.
 * - Status ranges use the green → yellow → orange → red data gradient.
 * Colors come only from data-viz tokens (CSS variables), so charts follow the theme.
 */
import * as React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  ComposedChart,
  Area,
  Line,
} from "recharts";
import { tokens, alpha } from "@/lib/tokens";
import { cn, num } from "@/lib/utils";
import { gradAt } from "./data";

const axis = { stroke: tokens.slate[400], fontSize: 11, tickLine: false, axisLine: false } as const;
const grid = { stroke: tokens.chart.grid, vertical: false } as const;

/** Data-gradient palette for categorical series (leak reasons etc.) */
export const gradPalette = ["rgb(var(--g-orange))", "rgb(var(--g-yellow))", "rgb(var(--g-lime))", "rgb(var(--chart-captured))", "rgb(var(--sky))", "rgb(var(--chart-pending))"];

/* Tooltip: near-black pill with caret ----------------------------------- */
export function TooltipPill({ active, payload, label, unit = "", formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="relative animate-pop-in rounded-sm bg-hero px-2.5 py-1.5 text-white shadow-sm">
      {payload.map((p: any) => (
        <p key={p.dataKey} className="tnum flex items-center gap-1.5 text-small font-medium">
          {payload.length > 1 && <span className="size-1.5 rounded-full" style={{ background: p.color || p.payload?.fill }} />}
          {payload.length > 1 && <span className="font-normal text-white/60">{p.name}</span>}
          {formatter ? formatter(p.value) : `${num(p.value)}${unit}`}
        </p>
      ))}
      {label !== undefined && <p className="text-[10px] text-white/60">{label}</p>}
    </div>
  );
}

export function Legendary({ items, className }: { items: { label: string; color: string; dashed?: boolean; hatched?: boolean }[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-slate-500", className)}>
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          {i.dashed ? (
            <svg width="14" height="4" aria-hidden>
              <line x1="0" y1="2" x2="14" y2="2" stroke={i.color} strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
          ) : (
            <span className="size-1.5 rounded-full" style={{ background: i.color }} />
          )}
          {i.label}
        </span>
      ))}
    </div>
  );
}

/* Line: capture rate with dashed baseline and a marked latest point ------ */
export function CaptureLine({
  data,
  baseline,
  height = 260,
  xKey = "month",
  domain,
}: {
  data: { [k: string]: any }[];
  baseline: number;
  height?: number;
  xKey?: string;
  domain?: [number, number];
}) {
  const id = React.useId().replace(/:/g, "");
  const vals = data.map((d) => d.rate as number).concat(baseline);
  const dom: [number, number] = domain ?? [Math.floor((Math.min(...vals) - 6) / 5) * 5, Math.ceil((Math.max(...vals) + 6) / 5) * 5];
  const last = data[data.length - 1];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 36, right: 16, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={`area-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={tokens.chart.captured} stopOpacity={0.14} />
            <stop offset="100%" stopColor={tokens.chart.captured} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={8} />
        <YAxis domain={dom} tickFormatter={(v) => `${v}%`} {...axis} width={48} />
        <RTooltip content={<TooltipPill unit="%" />} cursor={{ stroke: tokens.slate[400], strokeDasharray: "3 3" }} />
        <ReferenceLine y={baseline} stroke={tokens.chart.baseline} strokeDasharray="4 4" label={{ value: `Baseline ${baseline}%`, position: "insideBottomRight", fill: tokens.slate[500], fontSize: 11, dy: -4 }} />
        <ReferenceLine x={last[xKey]} stroke={tokens.slate[400]} strokeDasharray="3 3" />
        <Area type="monotone" dataKey="rate" stroke="none" fill={`url(#area-${id})`} isAnimationActive={false} />
        <Line
          type="monotone"
          dataKey="rate"
          name="Capture rate"
          stroke={tokens.chart.captured}
          strokeWidth={2}
          isAnimationActive={false}
          dot={(p: any) =>
            p.index === data.length - 1 ? (
              <g key="last">
                <circle cx={p.cx} cy={p.cy} r={4.5} fill={tokens.chart.captured} stroke={tokens.surface} strokeWidth={2.5} />
                <g transform={`translate(${p.cx - 26},${p.cy - 38})`}>
                  <rect width="52" height="26" rx="6" fill="rgb(var(--hero))" />
                  <text x="26" y="17" textAnchor="middle" fontSize="12" fontWeight="500" fill="#fff">
                    {`${p.value}%`}
                  </text>
                  <path d="M22 26 L26 30 L30 26 Z" fill="rgb(var(--hero))" />
                </g>
              </g>
            ) : (
              <g key={p.index} />
            )
          }
          activeDot={{ r: 4.5, fill: tokens.chart.captured, stroke: tokens.surface, strokeWidth: 2.5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* Column chart: soft capsules, focus column solid with a tooltip -------- */
export function ColumnChart({
  data,
  xKey,
  yKey,
  name = "Value",
  colorVar = "chart-captured",
  height = 240,
  highlight,
  unit = "",
  formatter,
  barSize = 22,
}: {
  data: { [k: string]: any }[];
  xKey: string;
  yKey: string;
  name?: string;
  color?: string;
  colorVar?: string;
  height?: number;
  highlight?: number;
  unit?: string;
  formatter?: (v: number) => string;
  barSize?: number;
}) {
  const def = highlight ?? data.length - 1;
  const [active, setActive] = React.useState<number>(def);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 12, right: 4, left: -12, bottom: 0 }}
        onMouseMove={(s: any) => s?.activeTooltipIndex !== undefined && setActive(s.activeTooltipIndex)}
        onMouseLeave={() => setActive(def)}
      >
        <CartesianGrid {...grid} />
        <XAxis
          dataKey={xKey}
          {...axis}
          dy={8}
          tick={(p: any) => (
            <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize={11} fill={p.index === active ? tokens.slate[900] : tokens.slate[400]} fontWeight={p.index === active ? 500 : 400}>
              {p.payload.value}
            </text>
          )}
        />
        <YAxis {...axis} width={52} tickFormatter={(v) => `${num(v)}${unit}`} />
        <RTooltip cursor={false} content={<TooltipPill unit={unit} formatter={formatter} />} />
        <Bar dataKey={yKey} name={name} barSize={barSize} radius={[999, 999, 999, 999]} isAnimationActive={false}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === active ? `rgb(var(--${colorVar}))` : alpha(colorVar, 0.16)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Paired columns: context muted, focus series accent ------------------- */
export function TwoSeriesBars({
  data,
  a,
  b,
  height = 260,
  xKey = "month",
}: {
  data: { [k: string]: any }[];
  a: { key: string; name: string; color: string; colorVar?: string };
  b: { key: string; name: string; color: string; colorVar?: string };
  height?: number;
  xKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 12, right: 4, left: -12, bottom: 0 }} barGap={4} barCategoryGap="30%">
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={8} />
        <YAxis {...axis} tickFormatter={(v) => num(v)} width={52} />
        <RTooltip cursor={{ fill: alpha("slate-100", 0.6) }} content={<TooltipPill />} />
        <Bar dataKey={a.key} name={a.name} fill={tokens.slate[200]} radius={[999, 999, 999, 999]} barSize={12} />
        <Bar dataKey={b.key} name={b.name} fill={b.color} radius={[999, 999, 999, 999]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Stacked columns: captured / leaked / pending ------------------------- */
export function StackedCapture({ data, height = 260, xKey = "name" }: { data: { [k: string]: any }[]; height?: number; xKey?: string }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 12, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={8} />
        <YAxis {...axis} tickFormatter={(v) => num(v)} width={52} />
        <RTooltip cursor={{ fill: alpha("slate-100", 0.6) }} content={<TooltipPill />} />
        <Bar dataKey="captured" name="Captured in-house" stackId="a" fill={tokens.chart.captured} barSize={22} radius={[0, 0, 8, 8]} stroke={tokens.surface} strokeWidth={2} />
        <Bar dataKey="leaked" name="Leaked / outside" stackId="a" fill={tokens.chart.leaked} stroke={tokens.surface} strokeWidth={2} />
        <Bar dataKey="pending" name="Pending / unknown" stackId="a" fill={tokens.chart.pending} radius={[8, 8, 0, 0]} stroke={tokens.surface} strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Rate rows (HTML): slim track, gradient fill, knob, dashed baseline --- */
export function RateBars({
  data,
  onClick,
  baseline,
  highlight,
  labelWidth = 150,
}: {
  data: { name: string; rate: number; id?: string }[];
  height?: number;
  onClick?: (d: any) => void;
  baseline?: number;
  highlight?: string;
  labelWidth?: number;
}) {
  const [hover, setHover] = React.useState<number | null>(null);
  return (
    <ul className="flex flex-col">
      {data.map((d, i) => {
        const on = hover === i || (hover === null && highlight !== undefined && d.id === highlight);
        const Tag = onClick ? "button" : "div";
        const col = gradAt(d.rate / 100, true);
        return (
          <li key={d.name}>
            <Tag
              {...(onClick ? { type: "button" as const, onClick: () => onClick(d) } : {})}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className={cn("grid w-full items-center gap-4 rounded px-2 py-2.5 text-left transition-colors", onClick && "hover:bg-slate-50", on && "bg-slate-50")}
              style={{ gridTemplateColumns: `${labelWidth}px 1fr 44px` }}
              aria-label={`${d.name}: ${d.rate}% captured`}
            >
              <span className={cn("truncate text-small", on ? "text-slate-900" : "text-slate-600")}>{d.name}</span>
              <span className="relative h-3.5">
                <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-100" />
                <span className="absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ width: `${d.rate}%`, background: `linear-gradient(90deg, ${col.replace(")", " / 0.25)")}, ${col})` }} />
                {baseline !== undefined && <span className="absolute inset-y-0 w-0 border-l border-dashed border-slate-400" style={{ left: `${baseline}%` }} />}
                <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] bg-surface" style={{ left: `${d.rate}%`, borderColor: col }} />
              </span>
              <span className="tnum text-right text-small text-slate-900">{d.rate}%</span>
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}

/* Ranked bars for counts (HTML) --------------------------------------- */
export function SimpleBars({
  data,
  dataKey,
  nameKey,
  colorVar = "g-orange",
  unit = "",
}: {
  data: { [k: string]: any }[];
  dataKey: string;
  nameKey: string;
  color?: string;
  colorVar?: string;
  height?: number;
  unit?: string;
  layout?: "horizontal" | "vertical";
}) {
  const max = Math.max(...data.map((d) => d[dataKey]));
  return (
    <ul className="flex flex-col gap-3.5">
      {data.map((d, i) => (
        <li key={d[nameKey]}>
          <div className="mb-1.5 flex justify-between text-small">
            <span className="text-slate-600">{d[nameKey]}</span>
            <span className="tnum text-slate-900">
              {num(d[dataKey])}
              {unit}
            </span>
          </div>
          <div className="h-5 overflow-hidden rounded-sm bg-slate-100">
            <div
              className="h-full rounded-sm"
              style={{
                width: `${(d[dataKey] / max) * 100}%`,
                background: i === 0 ? `linear-gradient(90deg, rgb(var(--${colorVar}) / 0.4), rgb(var(--${colorVar})))` : `linear-gradient(90deg, rgb(var(--${colorVar}) / 0.08), rgb(var(--${colorVar}) / 0.25))`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* Donut: thin ring, rounded gapped segments --------------------------- */
export function Donut({
  data,
  height = 240,
  centerLabel,
  centerValue,
  colors = gradPalette,
  hatchIndex,
}: {
  data: { name: string; value: number }[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
  colors?: readonly string[];
  /** segment drawn neutral (e.g. "Not stated") */
  hatchIndex?: number;
}) {
  const [active, setActive] = React.useState<number | null>(null);
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="80%"
            outerRadius="96%"
            paddingAngle={3}
            cornerRadius={20}
            stroke="none"
            startAngle={90}
            endAngle={-270}
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
            isAnimationActive={false}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={i === hatchIndex ? tokens.slate[300] : colors[i % colors.length]} opacity={active === null || active === i ? 1 : 0.3} />
            ))}
          </Pie>
          <RTooltip content={<TooltipPill unit="%" />} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="tnum text-display font-normal text-slate-900">{active !== null ? `${data[active].value}%` : centerValue}</span>
          <span className="text-caption text-slate-500">{active !== null ? data[active].name : centerLabel}</span>
        </div>
      )}
    </div>
  );
}

/* Funnel (accessible list): slim rows with drop-off ------------------- */
export function Funnel({ data }: { data: { stage: string; value: number }[] }) {
  const top = data[0].value;
  return (
    <ol className="flex flex-col gap-3.5">
      {data.map((d, i) => {
        const p = (d.value / top) * 100;
        const prev = i ? data[i - 1].value : d.value;
        const drop = i ? Math.round(((prev - d.value) / prev) * 100) : 0;
        return (
          <li key={d.stage}>
            <div className="mb-1.5 flex items-baseline justify-between text-small">
              <span className="text-slate-600">{d.stage}</span>
              <span className="tnum">
                <span className="text-slate-900">{num(d.value)}</span>
                {drop > 0 && <span className="ml-2 text-caption text-[rgb(var(--g-orange))]">−{drop}%</span>}
              </span>
            </div>
            <div className="h-5 overflow-hidden rounded-sm bg-slate-100">
              <div className="h-full rounded-sm" style={{ width: `${p}%`, background: `linear-gradient(90deg, rgb(var(--chart-captured) / ${0.12 + i * 0.03}), rgb(var(--chart-captured) / ${0.85 - i * 0.12}))` }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* Benchmark row: peer band on a slim track, ringed "you" knob ---------- */
export function BenchmarkRow({ name, you, p25, median, p75, min = 40, max = 90 }: { name: string; you: number; p25: number; median: number; p75: number; min?: number; max?: number }) {
  const x = (v: number) => ((v - min) / (max - min)) * 100;
  const above = you >= p75;
  const below = you < p25;
  const col = above ? "rgb(var(--g-green))" : below ? "rgb(var(--g-red))" : "rgb(var(--g-yellow))";
  return (
    <div className="grid grid-cols-[180px_1fr_72px] items-center gap-4 py-3">
      <span className="truncate text-body text-slate-700">{name}</span>
      <div className="relative h-4">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-100" />
        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-slate-300" style={{ left: `${x(p25)}%`, width: `${x(p75) - x(p25)}%` }} />
        <div className="absolute inset-y-0 w-0 border-l border-dashed border-slate-500" style={{ left: `${x(median)}%` }} title={`Peer median ${median}%`} />
        <div className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-surface shadow-sm" style={{ left: `${x(you)}%`, borderColor: col }} title={`You ${you}%`} />
      </div>
      <span className="tnum text-right text-body text-slate-900">{you}%</span>
    </div>
  );
}

/** @deprecated hatch patterns were removed from the chart language */
export function Hatch() {
  return null;
}

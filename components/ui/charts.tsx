"use client";
/**
 * Chart cards (Recharts). Colors come only from the data-viz tokens:
 * captured = teal-600, leaked = orange, pending = slate-300,
 * baseline = slate-500 dashed, secondary = indigo.
 */
import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  Legend,
  ComposedChart,
  Area,
  LabelList,
} from "recharts";
import { tokens, categorical } from "@/lib/tokens";
import { cn, num } from "@/lib/utils";

const axis = { stroke: tokens.slate[400], fontSize: 12, tickLine: false, axisLine: false } as const;
const grid = { stroke: tokens.slate[200], strokeDasharray: "0", vertical: false } as const;

function TooltipBox({ active, payload, label, unit = "", formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded border border-slate-200 bg-white px-3 py-2 text-small shadow-sm">
      {label !== undefined && <p className="mb-1 font-medium text-slate-900">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey} className="tnum flex items-center gap-2 text-slate-700">
          <span className="size-2 rounded-full" style={{ background: p.color || p.payload?.fill }} />
          {p.name}: <span className="font-medium text-slate-900">{formatter ? formatter(p.value) : `${num(p.value)}${unit}`}</span>
        </p>
      ))}
    </div>
  );
}

export function Legendary({ items, className }: { items: { label: string; color: string; dashed?: boolean }[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-slate-500", className)}>
      {items.map((i) => (
        <span key={i.label} className="inline-flex items-center gap-1.5">
          {i.dashed ? (
            <svg width="16" height="4" aria-hidden>
              <line x1="0" y1="2" x2="16" y2="2" stroke={i.color} strokeWidth="1.5" strokeDasharray="3 2" />
            </svg>
          ) : (
            <span className="size-2.5 rounded-sm" style={{ background: i.color }} />
          )}
          {i.label}
        </span>
      ))}
    </div>
  );
}

/* Line: capture rate with dashed baseline ----------------------------- */
export function CaptureLine({
  data,
  baseline,
  height = 260,
  xKey = "month",
}: {
  data: { [k: string]: any }[];
  baseline: number;
  height?: number;
  xKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 16, right: 16, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="capFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={tokens.chart.captured} stopOpacity={0.16} />
            <stop offset="100%" stopColor={tokens.chart.captured} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={6} />
        <YAxis domain={[40, 90]} tickFormatter={(v) => `${v}%`} {...axis} width={48} />
        <RTooltip content={<TooltipBox unit="%" />} />
        <ReferenceLine
          y={baseline}
          stroke={tokens.chart.baseline}
          strokeDasharray="5 4"
          label={{ value: `Baseline ${baseline}%`, position: "insideBottomRight", fill: tokens.slate[500], fontSize: 12 }}
        />
        <Area type="monotone" dataKey="rate" stroke="none" fill="url(#capFill)" />
        <Line
          type="monotone"
          dataKey="rate"
          name="Capture rate"
          stroke={tokens.chart.captured}
          strokeWidth={2}
          dot={{ r: 3, fill: tokens.chart.captured, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        >
          <LabelList dataKey="rate" position="top" formatter={(v: number) => `${v}%`} style={{ fontSize: 12, fill: tokens.slate[700] }} />
        </Line>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* Horizontal bar: capture rate by department (clickable) -------------- */
export function RateBars({
  data,
  height = 280,
  onClick,
  baseline,
  highlight,
}: {
  data: { name: string; rate: number; id?: string }[];
  height?: number;
  onClick?: (d: any) => void;
  baseline?: number;
  highlight?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={tokens.slate[200]} horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} {...axis} />
        <YAxis type="category" dataKey="name" width={150} {...axis} tick={{ fill: tokens.slate[700], fontSize: 12 }} />
        <RTooltip cursor={{ fill: tokens.slate[100] }} content={<TooltipBox unit="%" />} />
        {baseline && <ReferenceLine x={baseline} stroke={tokens.chart.baseline} strokeDasharray="5 4" />}
        <Bar
          dataKey="rate"
          name="Capture rate"
          radius={[0, 4, 4, 0]}
          barSize={16}
          onClick={onClick}
          className={onClick ? "cursor-pointer" : undefined}
        >
          {data.map((d) => (
            <Cell key={d.name} fill={highlight && d.id !== highlight ? tokens.teal[200] : tokens.chart.captured} />
          ))}
          <LabelList dataKey="rate" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 12, fill: tokens.slate[700] }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Stacked bar: captured vs leaked vs pending -------------------------- */
export function StackedCapture({
  data,
  height = 260,
  xKey = "name",
}: {
  data: { [k: string]: any }[];
  height?: number;
  xKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={6} />
        <YAxis {...axis} tickFormatter={(v) => num(v)} width={56} />
        <RTooltip cursor={{ fill: tokens.slate[100] }} content={<TooltipBox />} />
        <Bar dataKey="captured" name="Captured in-house" stackId="a" fill={tokens.chart.captured} barSize={28} />
        <Bar dataKey="leaked" name="Leaked / outside" stackId="a" fill={tokens.chart.leaked} />
        <Bar dataKey="pending" name="Pending / unknown" stackId="a" fill={tokens.chart.pending} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Grouped bars (two series) ------------------------------------------- */
export function TwoSeriesBars({
  data,
  a,
  b,
  height = 260,
  xKey = "month",
}: {
  data: { [k: string]: any }[];
  a: { key: string; name: string; color: string };
  b: { key: string; name: string; color: string };
  height?: number;
  xKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }} barGap={4}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={6} />
        <YAxis {...axis} tickFormatter={(v) => num(v)} width={56} />
        <RTooltip cursor={{ fill: tokens.slate[100] }} content={<TooltipBox />} />
        <Bar dataKey={a.key} name={a.name} fill={a.color} radius={[4, 4, 0, 0]} barSize={18} />
        <Bar dataKey={b.key} name={b.name} fill={b.color} radius={[4, 4, 0, 0]} barSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Simple vertical bars ------------------------------------------------ */
export function SimpleBars({
  data,
  dataKey,
  nameKey,
  color = tokens.chart.leaked,
  height = 240,
  unit = "",
  layout = "horizontal",
}: {
  data: { [k: string]: any }[];
  dataKey: string;
  nameKey: string;
  color?: string;
  height?: number;
  unit?: string;
  layout?: "horizontal" | "vertical";
}) {
  if (layout === "vertical") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 0 }}>
          <CartesianGrid stroke={tokens.slate[200]} horizontal={false} />
          <XAxis type="number" {...axis} tickFormatter={(v) => num(v)} />
          <YAxis type="category" dataKey={nameKey} width={160} {...axis} tick={{ fill: tokens.slate[700], fontSize: 12 }} />
          <RTooltip cursor={{ fill: tokens.slate[100] }} content={<TooltipBox unit={unit} />} />
          <Bar dataKey={dataKey} name="Uploads" fill={color} radius={[0, 4, 4, 0]} barSize={16}>
            <LabelList dataKey={dataKey} position="right" formatter={(v: number) => num(v)} style={{ fontSize: 12, fill: tokens.slate[700] }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 16, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey={nameKey} {...axis} dy={6} />
        <YAxis {...axis} width={56} tickFormatter={(v) => `${num(v)}${unit}`} />
        <RTooltip cursor={{ fill: tokens.slate[100] }} content={<TooltipBox unit={unit} />} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Donut ---------------------------------------------------------------- */
export function Donut({
  data,
  height = 240,
  centerLabel,
  centerValue,
  colors = categorical,
}: {
  data: { name: string; value: number }[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
  colors?: readonly string[];
}) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={1.5} stroke="none" startAngle={90} endAngle={-270}>
            {data.map((d, i) => (
              <Cell key={d.name} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <RTooltip content={<TooltipBox unit="%" />} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="tnum text-h1 font-semibold text-slate-900">{centerValue}</span>
          {centerLabel && <span className="text-caption text-slate-500">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

/* Funnel (CSS, accessible) --------------------------------------------- */
export function Funnel({ data }: { data: { stage: string; value: number }[] }) {
  const top = data[0].value;
  return (
    <ol className="flex flex-col gap-2">
      {data.map((d, i) => {
        const pctTop = (d.value / top) * 100;
        const prev = i ? data[i - 1].value : d.value;
        const drop = i ? Math.round(((prev - d.value) / prev) * 100) : 0;
        return (
          <li key={d.stage}>
            <div className="mb-1 flex items-baseline justify-between text-small">
              <span className="font-medium text-slate-700">{d.stage}</span>
              <span className="tnum text-slate-500">
                <span className="font-semibold text-slate-900">{num(d.value)}</span> · {Math.round(pctTop)}%
              </span>
            </div>
            <div className="h-6 w-full rounded bg-slate-100">
              <div className="flex h-full items-center rounded bg-chart-captured" style={{ width: `${pctTop}%`, opacity: 1 - i * 0.12 }} />
            </div>
            {i > 0 && drop > 0 && (
              <p className="tnum mt-0.5 text-caption text-slate-500">
                <span className="text-chart-leaked">▼</span> {drop}% drop from previous step
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* Benchmark band row (P25–P75 with median) ---------------------------- */
export function BenchmarkRow({ name, you, p25, median, p75, min = 40, max = 90 }: { name: string; you: number; p25: number; median: number; p75: number; min?: number; max?: number }) {
  const x = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  const above = you >= p75;
  const below = you < p25;
  return (
    <div className="grid grid-cols-[180px_1fr_72px] items-center gap-4 py-2.5">
      <span className="truncate text-body text-slate-700">{name}</span>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200" />
        <div className="absolute top-1/2 h-3 -translate-y-1/2 rounded-sm bg-slate-200" style={{ left: x(p25), width: `calc(${x(p75)} - ${x(p25)})` }} />
        <div className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-chart-baseline" style={{ left: x(median) }} title={`Peer median ${median}%`} />
        <div
          className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-chart-captured ring-1 ring-teal-700"
          style={{ left: x(you) }}
          title={`You ${you}%`}
        />
      </div>
      <span className={cn("tnum text-right text-body font-semibold", above ? "text-success-fg" : below ? "text-danger-fg" : "text-slate-900")}>
        {you}%
      </span>
    </div>
  );
}

export { Legend };

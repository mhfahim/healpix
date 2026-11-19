"use client";
/**
 * Chart language
 * - Hairline dashed horizontal grid, no axis lines, 11px slate-400 ticks.
 * - Bars are rounded capsules. The active/highlighted bar is solid; the rest
 *   use a diagonal hatch of the same hue, so emphasis never needs a new color.
 * - "Remainder" (leaked, not-yet, peer band) is shown as hatch, not a second fill.
 * - Lines are smooth with a soft gradient area and a ringed active dot.
 * - One tooltip style: an inverse pill (dark in light mode, light in dark mode).
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
import { tokens, categorical, alpha } from "@/lib/tokens";
import { cn, num } from "@/lib/utils";

const axis = { stroke: tokens.slate[400], fontSize: 11, tickLine: false, axisLine: false } as const;
const grid = { stroke: tokens.chart.grid, strokeDasharray: "3 4", vertical: false } as const;

/** Diagonal hatch pattern. `bg` fills behind the stripes. */
export function Hatch({ id, color, bg = "transparent", gap = 6, width = 1.5 }: { id: string; color: string; bg?: string; gap?: number; width?: number }) {
  return (
    <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width={gap} height={gap} fill={bg} />
      <line x1="0" y1="0" x2="0" y2={gap} stroke={color} strokeWidth={width} />
    </pattern>
  );
}

/* Tooltip -------------------------------------------------------------- */
export function TooltipPill({ active, payload, label, unit = "", formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="animate-pop-in rounded-[10px] bg-slate-900 px-3 py-2 text-small text-on-accent shadow-sm">
      {label !== undefined && <p className="mb-0.5 text-caption text-slate-400">{label}</p>}
      {payload.map((p: any) => (
        <p key={p.dataKey} className="tnum flex items-center gap-2 font-medium">
          <span className="size-1.5 rounded-full" style={{ background: p.color || p.payload?.fill }} />
          {payload.length > 1 && <span className="font-normal opacity-70">{p.name}</span>}
          {formatter ? formatter(p.value) : `${num(p.value)}${unit}`}
        </p>
      ))}
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
          ) : i.hatched ? (
            <span className="hatch size-2.5 rounded-[3px] ring-1 ring-inset ring-current" style={{ color: i.color }} />
          ) : (
            <span className="size-2 rounded-full" style={{ background: i.color }} />
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
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 20, right: 12, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id={`area-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={tokens.chart.captured} stopOpacity={0.22} />
            <stop offset="100%" stopColor={tokens.chart.captured} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={8} />
        <YAxis domain={dom} tickFormatter={(v) => `${v}%`} {...axis} width={48} />
        <RTooltip content={<TooltipPill unit="%" />} cursor={{ stroke: tokens.slate[300], strokeDasharray: "3 3" }} />
        <ReferenceLine
          y={baseline}
          stroke={tokens.chart.baseline}
          strokeDasharray="4 4"
          label={{ value: `Baseline ${baseline}%`, position: "insideBottomRight", fill: tokens.slate[500], fontSize: 11, dy: -4 }}
        />
        <Area type="monotone" dataKey="rate" stroke="none" fill={`url(#area-${id})`} />
        <Line
          type="monotone"
          dataKey="rate"
          name="Capture rate"
          stroke={tokens.chart.captured}
          strokeWidth={2.5}
          dot={(p: any) =>
            p.index === data.length - 1 ? (
              <g key="last">
                <circle cx={p.cx} cy={p.cy} r={8} fill={alpha("chart-captured", 0.15)} />
                <circle cx={p.cx} cy={p.cy} r={4} fill={tokens.chart.captured} stroke={tokens.surface} strokeWidth={2} />
              </g>
            ) : (
              <g key={p.index} />
            )
          }
          activeDot={{ r: 5, fill: tokens.chart.captured, stroke: tokens.surface, strokeWidth: 2.5 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/* Column chart: hatched columns with one solid active column --------- */
export function ColumnChart({
  data,
  xKey,
  yKey,
  name = "Value",
  color = tokens.chart.captured,
  colorVar = "chart-captured",
  height = 240,
  highlight,
  unit = "",
  formatter,
  barSize = 28,
}: {
  data: { [k: string]: any }[];
  xKey: string;
  yKey: string;
  name?: string;
  color?: string;
  colorVar?: string;
  height?: number;
  /** index shown solid when nothing is hovered (defaults to the last) */
  highlight?: number;
  unit?: string;
  formatter?: (v: number) => string;
  barSize?: number;
}) {
  const id = React.useId().replace(/:/g, "");
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
        <defs>
          <Hatch id={`h-${id}`} color={alpha(colorVar, 0.45)} bg={alpha(colorVar, 0.08)} />
          <Hatch id={`t-${id}`} color={tokens.slate[150]} />
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={8} tick={(p: any) => (
          <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize={11} fill={p.index === active ? tokens.slate[900] : tokens.slate[400]} fontWeight={p.index === active ? 600 : 400}>
            {p.payload.value}
          </text>
        )} />
        <YAxis {...axis} width={52} tickFormatter={(v) => `${num(v)}${unit}`} />
        <RTooltip cursor={false} content={<TooltipPill unit={unit} formatter={formatter} />} />
        <Bar dataKey={yKey} name={name} barSize={barSize} radius={[8, 8, 8, 8]} background={{ fill: `url(#t-${id})`, radius: 8 } as any} isAnimationActive={false}>
          {data.map((_, i) => (
            <Cell key={i} fill={i === active ? color : `url(#h-${id})`} stroke={i === active ? "none" : alpha(colorVar, 0.35)} strokeWidth={1} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Paired columns: primary solid, comparison hatched -------------------- */
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
  const id = React.useId().replace(/:/g, "");
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 12, right: 4, left: -12, bottom: 0 }} barGap={4} barCategoryGap="28%">
        <defs>
          <Hatch id={`a-${id}`} color={alpha(a.colorVar ?? "chart-pending", 1)} bg={alpha(a.colorVar ?? "chart-pending", 0.25)} />
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={8} />
        <YAxis {...axis} tickFormatter={(v) => num(v)} width={52} />
        <RTooltip cursor={{ fill: alpha("slate-200", 0.4), radius: 8 } as any} content={<TooltipPill />} />
        <Bar dataKey={a.key} name={a.name} fill={`url(#a-${id})`} radius={[6, 6, 6, 6]} barSize={14} />
        <Bar dataKey={b.key} name={b.name} fill={b.color} radius={[6, 6, 6, 6]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Stacked columns: captured / leaked / pending ------------------------ */
export function StackedCapture({ data, height = 260, xKey = "name" }: { data: { [k: string]: any }[]; height?: number; xKey?: string }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 12, right: 4, left: -12, bottom: 0 }}>
        <defs>
          <Hatch id={`p-${id}`} color={tokens.slate[300]} bg={alpha("slate-100", 1)} />
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey={xKey} {...axis} dy={8} />
        <YAxis {...axis} tickFormatter={(v) => num(v)} width={52} />
        <RTooltip cursor={{ fill: alpha("slate-200", 0.4) }} content={<TooltipPill />} />
        <Bar dataKey="captured" name="Captured in-house" stackId="a" fill={tokens.chart.captured} barSize={26} radius={[0, 0, 6, 6]} stroke={tokens.surface} strokeWidth={2} />
        <Bar dataKey="leaked" name="Leaked / outside" stackId="a" fill={tokens.chart.leaked} stroke={tokens.surface} strokeWidth={2} />
        <Bar dataKey="pending" name="Pending / unknown" stackId="a" fill={`url(#p-${id})`} radius={[6, 6, 0, 0]} stroke={tokens.surface} strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* Horizontal rate bars (HTML): captured solid, leaked remainder hatched -- */
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
    <div className="relative">
      <ul className="flex flex-col gap-1">
        {data.map((d, i) => {
          const on = hover === i || (hover === null && highlight !== undefined && d.id === highlight);
          const Tag = onClick ? "button" : "div";
          return (
            <li key={d.name}>
              <Tag
                {...(onClick ? { type: "button" as const, onClick: () => onClick(d) } : {})}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className={cn("grid w-full items-center gap-3 rounded-[10px] px-2 py-1.5 text-left transition-colors", onClick && "hover:bg-slate-50")}
                style={{ gridTemplateColumns: `${labelWidth}px 1fr 44px` }}
                aria-label={`${d.name}: ${d.rate}% captured`}
              >
                <span className={cn("truncate text-small", on ? "font-medium text-slate-900" : "text-slate-600")}>{d.name}</span>
                <span className="relative h-3.5 overflow-hidden rounded-full text-chart-leaked/45 hatch bg-chart-leaked/[0.06]">
                  <span
                    className={cn("absolute inset-y-0 left-0 rounded-full transition-all", on || hover === null ? "bg-chart-captured" : "bg-chart-captured/55")}
                    style={{ width: `${d.rate}%` }}
                  />
                  {baseline !== undefined && <span className="absolute inset-y-0 w-px bg-black/50" style={{ left: `${baseline}%` }} />}
                </span>
                <span className="tnum text-right text-small font-semibold">{d.rate}%</span>
              </Tag>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 flex justify-between pl-2" style={{ paddingLeft: labelWidth + 20, paddingRight: 64 }}>
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t} className="tnum text-micro text-slate-400">
            {t}%
          </span>
        ))}
      </div>
    </div>
  );
}

/* Ranked horizontal bars for counts (HTML) ---------------------------- */
export function SimpleBars({
  data,
  dataKey,
  nameKey,
  colorVar = "chart-leaked",
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
    <ul className="flex flex-col gap-3">
      {data.map((d, i) => (
        <li key={d[nameKey]} className="grid grid-cols-[160px_1fr_56px] items-center gap-3">
          <span className="truncate text-small text-slate-700">{d[nameKey]}</span>
          <span className="relative h-7 overflow-hidden rounded-lg bg-slate-100/60">
            <span
              className={cn("absolute inset-y-0 left-0 rounded-lg", i === 0 ? "" : "hatch")}
              style={{
                width: `${(d[dataKey] / max) * 100}%`,
                background: i === 0 ? `rgb(var(--${colorVar}))` : `rgb(var(--${colorVar}) / 0.08)`,
                color: `rgb(var(--${colorVar}) / 0.5)`,
              }}
            />
          </span>
          <span className="tnum text-right text-small font-semibold">
            {num(d[dataKey])}
            {unit}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Donut: rounded, gapped segments; optional hatched segment ----------- */
export function Donut({
  data,
  height = 240,
  centerLabel,
  centerValue,
  colors = categorical,
  hatchIndex,
}: {
  data: { name: string; value: number }[];
  height?: number;
  centerLabel?: string;
  centerValue?: string;
  colors?: readonly string[];
  /** segment drawn as hatch (e.g. "Not stated") */
  hatchIndex?: number;
}) {
  const id = React.useId().replace(/:/g, "");
  const [active, setActive] = React.useState<number | null>(null);
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <Hatch id={`d-${id}`} color={tokens.slate[300]} bg={tokens.slate[100]} />
          </defs>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="66%"
            outerRadius="94%"
            paddingAngle={2.5}
            cornerRadius={8}
            stroke="none"
            startAngle={90}
            endAngle={-270}
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
            isAnimationActive={false}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={i === hatchIndex ? `url(#d-${id})` : colors[i % colors.length]} opacity={active === null || active === i ? 1 : 0.35} />
            ))}
          </Pie>
          <RTooltip content={<TooltipPill unit="%" />} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-caption text-slate-500">{active !== null ? data[active].name : centerLabel}</span>
          <span className="tnum text-h1 font-semibold tracking-tight text-slate-900">{active !== null ? `${data[active].value}%` : centerValue}</span>
        </div>
      )}
    </div>
  );
}

/* Funnel (accessible list): solid stage, hatched drop-off -------------- */
export function Funnel({ data }: { data: { stage: string; value: number }[] }) {
  const top = data[0].value;
  return (
    <ol className="flex flex-col gap-3">
      {data.map((d, i) => {
        const pctTop = (d.value / top) * 100;
        const prev = i ? data[i - 1].value : d.value;
        const drop = i ? Math.round(((prev - d.value) / prev) * 100) : 0;
        return (
          <li key={d.stage}>
            <div className="mb-1.5 flex items-baseline justify-between text-small">
              <span className="text-slate-600">{d.stage}</span>
              <span className="tnum">
                <span className="font-semibold text-slate-900">{num(d.value)}</span> <span className="text-slate-400">{Math.round(pctTop)}%</span>
              </span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-slate-100 text-slate-300 hatch">
              <div className="absolute inset-y-0 left-0 rounded-full bg-chart-captured" style={{ width: `${pctTop}%`, opacity: 1 - i * 0.13 }} />
            </div>
            {i > 0 && drop > 0 && (
              <p className="tnum mt-1 text-caption text-slate-500">
                <span className="font-medium text-chart-leaked">−{drop}%</span> from previous step
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* Benchmark band row (P25–P75 hatched band, median tick, you dot) ------ */
export function BenchmarkRow({ name, you, p25, median, p75, min = 40, max = 90 }: { name: string; you: number; p25: number; median: number; p75: number; min?: number; max?: number }) {
  const x = (v: number) => `${((v - min) / (max - min)) * 100}%`;
  const above = you >= p75;
  const below = you < p25;
  return (
    <div className="grid grid-cols-[180px_1fr_72px] items-center gap-4 py-2.5">
      <span className="truncate text-body text-slate-700">{name}</span>
      <div className="relative h-7">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-100" />
        <div className="hatch absolute top-1/2 h-4 -translate-y-1/2 rounded-full bg-slate-100 text-slate-300" style={{ left: x(p25), width: `calc(${x(p75)} - ${x(p25)})` }} />
        <div className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-chart-baseline" style={{ left: x(median) }} title={`Peer median ${median}%`} />
        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-surface bg-chart-captured shadow-sm"
          style={{ left: x(you) }}
          title={`You ${you}%`}
        />
      </div>
      <span className={cn("tnum text-right text-body font-semibold", above ? "text-success-fg" : below ? "text-danger-fg" : "text-slate-900")}>{you}%</span>
    </div>
  );
}

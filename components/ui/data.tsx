"use client";
/**
 * Data display: KpiCard, MiniBars, Sparkline, TickMeter, DotMatrix, Gauge,
 * Progress, DataTable (sortable, sticky header, row actions, pagination), RateBar.
 */
import * as React from "react";
import { ArrowDownRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Minus, MoreHorizontal, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/tokens";
import { Card, Skeleton, IconChip, type TintTone } from "./primitives";

/* Sparkline (pure SVG) -------------------------------------------------- */
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
  /** Stretch to the container's width instead of a fixed pixel width */
  fluid?: boolean;
  /** Step line (stairs) instead of straight segments */
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
    : pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
  const last = pts[pts.length - 1];
  const svg = (
    <svg
      width={fluid ? "100%" : width}
      height={height}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio={fluid ? "none" : undefined}
      className={cn("block overflow-visible", !fluid && className)}
      aria-hidden
    >
      <path d={`${path} L${last[0]},${height} L${pts[0][0]},${height} Z`} fill={color} opacity={0.1} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      {!fluid && dots && pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2} fill={color} />)}
      {!fluid && <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />}
    </svg>
  );
  if (!fluid) return svg;
  return (
    <div className={cn("relative", className)} style={{ height }} aria-hidden>
      <div className="absolute inset-y-0 left-0 right-1">
        {svg}
        <span className="absolute size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface" style={{ left: "100%", top: last[1], background: color }} />
      </div>
    </div>
  );
}

/* Mini columns: last (or highlighted) column solid, the rest soft ------ */
export function MiniBars({ data, colorVar = "chart-captured", className, highlight, height = 36 }: { data: number[]; colorVar?: string; className?: string; highlight?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data) * 0.6;
  const hi = highlight ?? data.length - 1;
  return (
    <div className={cn("flex items-end gap-[3px]", className)} style={{ height }} aria-hidden>
      {data.map((d, i) => (
        <span
          key={i}
          className="w-[7px] rounded-[3px]"
          style={{
            height: `${Math.max(14, ((d - min) / (max - min || 1)) * 100)}%`,
            background: i === hi ? `rgb(var(--${colorVar}))` : `linear-gradient(to top, rgb(var(--${colorVar}) / 0.05), rgb(var(--${colorVar}) / 0.28))`,
          }}
        />
      ))}
    </div>
  );
}

/* KPI card --------------------------------------------------------------- */
export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "up-good",
  sub,
  spark,
  sparkColor,
  sparkVar,
  chart = "bars",
  loading,
  className,
  icon,
  tone = "teal",
  menu,
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  /** up-good: green when positive; down-good: green when negative; neutral */
  deltaTone?: "up-good" | "down-good" | "neutral";
  sub?: string;
  spark?: number[];
  /** @deprecated use sparkVar; kept for line sparklines */
  sparkColor?: string;
  /** CSS color variable for the mini chart, e.g. "chart-leaked" */
  sparkVar?: string;
  chart?: "bars" | "line" | "step";
  loading?: boolean;
  className?: string;
  icon?: LucideIcon;
  tone?: TintTone;
  menu?: boolean;
}) {
  if (loading) {
    return (
      <Card className={cn("p-5", className)}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-8 w-28" />
        <Skeleton className="mt-4 h-3 w-36" />
      </Card>
    );
  }
  const negative = delta?.trim().startsWith("-") || delta?.trim().startsWith("−");
  const good = deltaTone === "neutral" ? null : deltaTone === "up-good" ? !negative : negative;
  const DeltaIcon = deltaTone === "neutral" ? Minus : negative ? ArrowDownRight : ArrowUpRight;
  const v = sparkVar ?? (sparkColor?.match(/--([\w-]+)/)?.[1] ?? "chart-captured");
  return (
    <Card className={cn("flex min-w-0 flex-col overflow-hidden p-5", className)}>
      <div className="flex items-center gap-2.5">
        {icon && <IconChip icon={icon} tone={tone} size="sm" />}
        <p className="min-w-0 flex-1 truncate text-small font-medium text-slate-600">{label}</p>
        {menu && <MoreHorizontal className="size-4 text-slate-400" />}
      </div>
      <p className="tnum mt-3 whitespace-nowrap text-kpi font-semibold text-slate-900">{value}</p>
      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
        <p className="min-w-0 text-caption text-slate-500">
          {delta && (
            <span
              className={cn(
                "tnum mr-1.5 inline-flex items-center gap-0.5 whitespace-nowrap font-semibold",
                good === null && "text-slate-600",
                good === true && "text-success-fg",
                good === false && "text-danger-fg"
              )}
            >
              <DeltaIcon className="size-3.5" strokeWidth={2.25} aria-hidden />
              {delta}
            </span>
          )}
          {sub}
        </p>
        {spark &&
          (chart === "bars" ? (
            <MiniBars data={spark} colorVar={v} className="shrink-0" height={32} />
          ) : (
            <Sparkline data={spark} color={`rgb(var(--${v}))`} width={72} height={30} step={chart === "step"} className="shrink-0" />
          ))}
      </div>
    </Card>
  );
}

/* Tick meter: a row of thin ticks, filled up to the value -------------- */
export function TickMeter({ value, max = 100, ticks = 40, colorVar = "chart-captured", height = 28, className, label }: { value: number; max?: number; ticks?: number; colorVar?: string; height?: number; className?: string; label?: string }) {
  const filled = Math.round((value / max) * ticks);
  return (
    <div role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label} className={cn("flex items-stretch gap-[3px]", className)} style={{ height }}>
      {Array.from({ length: ticks }).map((_, i) => (
        <span key={i} className="flex-1 rounded-full" style={{ background: i < filled ? `rgb(var(--${colorVar}))` : `rgb(var(--${colorVar}) / 0.12)` }} />
      ))}
    </div>
  );
}

/* Dot matrix: columns of dots (counts), peak column emphasised --------- */
export function DotMatrix({ data, labels, rows = 5, colorVar = "chart-captured", peakLabel }: { data: number[]; labels?: string[]; rows?: number; colorVar?: string; peakLabel?: string }) {
  const max = Math.max(...data);
  const peak = data.indexOf(max);
  return (
    <div className="flex items-end gap-2" aria-hidden>
      {data.map((d, i) => {
        const n = Math.max(1, Math.round((d / max) * rows));
        return (
          <div key={i} className="relative flex flex-col items-center gap-1">
            {i === peak && peakLabel && (
              <span className="absolute -top-8 whitespace-nowrap rounded-full bg-surface px-2 py-0.5 text-caption shadow-sm ring-1 ring-slate-200">{peakLabel}</span>
            )}
            {Array.from({ length: rows }).map((_, r) => {
              const on = rows - r <= n;
              return (
                <span
                  key={r}
                  className="size-2.5 rounded-full"
                  style={{ background: on ? (i === peak ? `rgb(var(--${colorVar}))` : `rgb(var(--${colorVar}) / 0.45)`) : `rgb(var(--${colorVar}) / 0.08)` }}
                />
              );
            })}
            {labels && <span className={cn("mt-1 text-micro", i === peak ? "font-semibold text-slate-900" : "text-slate-400")}>{labels[i]}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* Segmented gauge (half circle) ----------------------------------------- */
export function Gauge({ value, max = 100, segments = 18, size = 220, colorVar = "chart-captured", children }: { value: number; max?: number; segments?: number; size?: number; colorVar?: string; children?: React.ReactNode }) {
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  const filled = Math.round((value / max) * segments);
  const gap = 2.2;
  const seg = (180 - gap * (segments - 1)) / segments;
  const arc = (a0: number, a1: number) => {
    const p = (a: number, rr: number) => [+(cx + rr * Math.cos((Math.PI * a) / 180)).toFixed(2), +(cy - rr * Math.sin((Math.PI * a) / 180)).toFixed(2)];
    const r2 = r - 22;
    const [x0, y0] = p(a0, r);
    const [x1, y1] = p(a1, r);
    const [x2, y2] = p(a1, r2);
    const [x3, y3] = p(a0, r2);
    return `M${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} L${x2},${y2} A${r2},${r2} 0 0 0 ${x3},${y3} Z`;
  };
  return (
    <div className="relative" style={{ width: size, height: size / 2 + 12 }}>
      <svg width={size} height={size / 2 + 12} aria-hidden>
        {Array.from({ length: segments }).map((_, i) => {
          const a0 = 180 - i * (seg + gap);
          const a1 = a0 - seg;
          return <path key={i} d={arc(a0, a1)} fill={`rgb(var(--${colorVar}) / ${i < filled ? 0.35 + (0.65 * i) / segments : 0.1})`} strokeLinejoin="round" />;
        })}
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">{children}</div>
    </div>
  );
}

/* Progress bar ---------------------------------------------------------- */
export function Progress({ value, className, tone = "teal", label }: { value: number; className?: string; tone?: "teal" | "warning" | "slate"; label?: string }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("hatch h-2 w-full overflow-hidden rounded-full bg-slate-100 text-slate-200", className)}
    >
      <div
        className={cn("h-full rounded-full transition-all", tone === "teal" && "bg-teal-600", tone === "warning" && "bg-warning", tone === "slate" && "bg-slate-400")}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
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

/* Capture-rate cell: captured solid, leaked remainder hatched ---------- */
export function RateBar({ value, baseline, width = 88 }: { value: number; baseline?: number; width?: number }) {
  return (
    <span className="inline-flex items-center justify-end gap-2.5">
      <span className="hatch relative h-2 overflow-hidden rounded-full bg-chart-leaked/[0.06] text-chart-leaked/40" style={{ width }}>
        <span className="absolute inset-y-0 left-0 rounded-full bg-chart-captured" style={{ width: `${value}%` }} />
        {baseline !== undefined && <span className="absolute inset-y-0 w-px bg-slate-900/50" style={{ left: `${baseline}%` }} />}
      </span>
      <span className="tnum w-9 text-right font-medium">{value}%</span>
    </span>
  );
}

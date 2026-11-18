"use client";
/**
 * Data display: Sparkline, KpiCard, DataTable (sortable, sticky header,
 * row actions, pagination), Progress, Meter.
 */
import * as React from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokens } from "@/lib/tokens";
import { Card, Skeleton } from "./primitives";

/* Sparkline (pure SVG) -------------------------------------------------- */
export function Sparkline({
  data,
  color = tokens.chart.captured,
  width = 96,
  height = 28,
  className,
  dots,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  dots?: boolean;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => [(i / (data.length - 1)) * (width - 4) + 2, height - 3 - ((d - min) / range) * (height - 6)]);
  const path = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <path d={`${path} L${last[0]},${height} L2,${height} Z`} fill={color} opacity={0.08} />
      <path d={path} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {dots && pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={2} fill={color} />)}
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={color} />
    </svg>
  );
}

/* KPI card -------------------------------------------------------------- */
export function KpiCard({
  label,
  value,
  delta,
  deltaTone = "up-good",
  sub,
  spark,
  sparkColor,
  loading,
  className,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  /** up-good: green when positive; down-good: green when negative; neutral */
  deltaTone?: "up-good" | "down-good" | "neutral";
  sub?: string;
  spark?: number[];
  sparkColor?: string;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}) {
  if (loading) {
    return (
      <Card className={cn("p-4", className)}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-8 w-28" />
        <Skeleton className="mt-3 h-3 w-36" />
      </Card>
    );
  }
  const negative = delta?.trim().startsWith("-") || delta?.trim().startsWith("−");
  const good = deltaTone === "neutral" ? null : deltaTone === "up-good" ? !negative : negative;
  const DeltaIcon = deltaTone === "neutral" ? Minus : negative ? ArrowDown : ArrowUp;
  return (
    <Card className={cn("flex flex-col p-4", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-small font-medium text-slate-500">{label}</p>
        {icon}
      </div>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="tnum whitespace-nowrap text-kpi font-semibold tracking-tight text-slate-900">{value}</p>
        {spark && <Sparkline data={spark} color={sparkColor} className="mb-1.5 shrink-0" />}
      </div>
      {(delta || sub) && (
        <p className="mt-1 flex flex-wrap items-center gap-1.5 text-caption text-slate-500">
          {delta && (
            <span
              className={cn(
                "tnum inline-flex items-center gap-0.5 rounded-sm px-1 py-px font-medium",
                good === null && "bg-slate-100 text-slate-700",
                good === true && "bg-success-bg text-success-fg",
                good === false && "bg-danger-bg text-danger-fg"
              )}
            >
              <DeltaIcon className="size-3" strokeWidth={2.5} aria-hidden />
              {delta}
            </span>
          )}
          {sub}
        </p>
      )}
    </Card>
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
      className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}
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
  const cellPad = dense ? "px-3 py-2" : "px-4 py-3";

  return (
    <div>
      <div className={cn("overflow-auto", maxHeight)}>
        <table className="w-full border-collapse text-body">
          <thead className="sticky top-0 z-10 bg-slate-50">
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
                      "whitespace-nowrap px-4 py-2 text-caption font-medium text-slate-500",
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

/* Capture-rate cell: bar + number ------------------------------------- */
export function RateBar({ value, baseline, width = 80 }: { value: number; baseline?: number; width?: number }) {
  return (
    <span className="inline-flex items-center justify-end gap-2">
      <span className="relative h-1.5 rounded-full bg-chart-leaked/25" style={{ width }}>
        <span className="absolute inset-y-0 left-0 rounded-full bg-chart-captured" style={{ width: `${value}%` }} />
        {baseline !== undefined && <span className="absolute -top-1 h-3.5 w-px bg-chart-baseline" style={{ left: `${baseline}%` }} />}
      </span>
      <span className="tnum w-9 text-right font-medium">{value}%</span>
    </span>
  );
}

"use client";
import * as React from "react";
import { Card, Skeleton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/* Compact stat: label, figure, change with its reference ---------------- */
export function Stat({
  label,
  value,
  delta,
  vs,
  downIsGood,
  loading,
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  vs?: string;
  downIsGood?: boolean;
  loading?: boolean;
  className?: string;
}) {
  if (loading) {
    return (
      <Card className={cn("p-5", className)}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-7 w-28" />
        <Skeleton className="mt-3 h-3 w-32" />
      </Card>
    );
  }
  const negative = delta?.startsWith("−") || delta?.startsWith("-");
  const good = delta ? (downIsGood ? negative : !negative) : null;
  return (
    <Card className={cn("flex min-w-0 flex-col p-5", className)}>
      <p className="truncate text-small text-slate-600">{label}</p>
      <p className="tnum mt-2 whitespace-nowrap text-[28px] font-medium leading-8 tracking-[-0.02em] text-slate-900">{value}</p>
      {(delta || vs) && (
        <p className="tnum mt-2 text-caption text-slate-500">
          {delta && <span className={cn("mr-1 font-medium", good ? "text-success-fg" : "text-danger-fg")}>{delta}</span>}
          {vs}
        </p>
      )}
    </Card>
  );
}

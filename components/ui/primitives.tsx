/**
 * Small presentational primitives: Card, Badge, StatusPill, Avatar, Skeleton,
 * Banner, EmptyState, Field/Input/Select/Textarea, Kbd, Divider.
 */
import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  Clock,
  Info,
  Stethoscope,
  UserCheck,
  XCircle,
  Ban,
  AlertOctagon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Card ----------------------------------------------------------------- */
export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-slate-200 bg-surface", className)} {...p} />;
}
export function CardHeader({
  title,
  description,
  action,
  className,
  icon: Icon,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-4", className)}>
      <div className="min-w-0">
        <h3 className="flex items-center gap-2 text-h3 font-semibold text-slate-900">
          {Icon && <Icon className="size-4 text-slate-500" strokeWidth={1.5} />}
          {title}
        </h3>
        {description && <p className="mt-0.5 text-small text-slate-500">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
export function CardBody({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...p} />;
}

/* Badge ---------------------------------------------------------------- */
const badgeTones = {
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
  teal: "bg-teal-50 text-teal-800 border-teal-200",
  success: "bg-success-bg text-success-fg border-success/25",
  warning: "bg-warning-bg text-warning-fg border-warning/25",
  danger: "bg-danger-bg text-danger-fg border-danger/25",
  info: "bg-info-bg text-info-fg border-info/25",
  ai: "bg-ai-bg text-ai-fg border-ai/25",
  outline: "bg-white text-slate-700 border-slate-200",
} as const;
export type Tone = keyof typeof badgeTones;

export function Badge({
  tone = "neutral",
  icon: Icon,
  className,
  children,
  size = "md",
}: {
  tone?: Tone;
  icon?: LucideIcon;
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border font-medium",
        size === "sm" ? "px-1.5 py-px text-caption" : "px-2 py-0.5 text-caption",
        badgeTones[tone],
        className
      )}
    >
      {Icon && <Icon className="size-3" strokeWidth={2} aria-hidden />}
      {children}
    </span>
  );
}

/* Status pill (never color alone: icon + label) ------------------------ */
const statusMap: Record<string, { tone: Tone; icon: LucideIcon }> = {
  Booked: { tone: "info", icon: Clock },
  Arrived: { tone: "teal", icon: UserCheck },
  "With doctor": { tone: "ai", icon: Stethoscope },
  Done: { tone: "success", icon: CheckCircle2 },
  "No-show": { tone: "warning", icon: AlertTriangle },
  Cancelled: { tone: "neutral", icon: XCircle },
};
export function StatusPill({ status, className }: { status: string; className?: string }) {
  const s = statusMap[status] ?? { tone: "neutral" as Tone, icon: CircleDot };
  // "With doctor" uses teal-dark rather than AI violet — violet is reserved for AI content.
  const tone = status === "With doctor" ? "teal" : s.tone;
  return (
    <Badge tone={tone} icon={s.icon} className={cn(status === "With doctor" && "bg-teal-700 text-white border-teal-700", className)}>
      {status}
    </Badge>
  );
}

/* Avatar --------------------------------------------------------------- */
export function Avatar({ initials, size = "md", className }: { initials: string; size?: "sm" | "md" | "lg" | "xl"; className?: string }) {
  const s = { sm: "size-7 text-caption", md: "size-9 text-small", lg: "size-12 text-h3", xl: "size-16 text-h2" }[size];
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-teal-100 font-semibold text-teal-800", s, className)}
      aria-hidden
    >
      {initials}
    </span>
  );
}

export function initialsOf(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}

/* Skeleton ------------------------------------------------------------- */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded bg-slate-100", className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}

/* Banner --------------------------------------------------------------- */
const bannerTones = {
  info: { cls: "bg-info-bg border-info/25 text-info-fg", icon: Info },
  warning: { cls: "bg-warning-bg border-warning/30 text-warning-fg", icon: AlertTriangle },
  danger: { cls: "bg-danger-bg border-danger/25 text-danger-fg", icon: AlertOctagon },
  success: { cls: "bg-success-bg border-success/25 text-success-fg", icon: CheckCircle2 },
};
export function Banner({
  tone = "info",
  title,
  children,
  action,
  className,
  icon,
}: {
  tone?: keyof typeof bannerTones;
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
}) {
  const t = bannerTones[tone];
  const Icon = icon ?? t.icon;
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-lg border px-4 py-3", t.cls, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
      <div className="min-w-0 flex-1 text-body">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cn(title && "mt-0.5", "text-slate-700")}>{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* Empty state ---------------------------------------------------------- */
export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  body?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-slate-100">
        <Icon className="size-6 text-slate-500" strokeWidth={1.5} />
      </span>
      <p className="text-h3 font-semibold">{title}</p>
      {body && <p className="mt-1 max-w-sm text-body text-slate-500">{body}</p>}
      {action && <div className="mt-5 flex gap-2">{action}</div>}
    </div>
  );
}

/* Form fields ---------------------------------------------------------- */
export function Field({
  label,
  hint,
  error,
  children,
  className,
  htmlFor,
}: {
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-small font-medium text-slate-700">
        {label}
      </label>
      {children}
      {error ? (
        <p className="flex items-center gap-1 text-caption text-danger-fg">
          <AlertOctagon className="size-3" /> {error}
        </p>
      ) : (
        hint && <p className="text-caption text-slate-500">{hint}</p>
      )}
    </div>
  );
}

export const inputCls =
  "h-9 w-full rounded border border-slate-200 bg-white px-3 text-body text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-50 disabled:text-slate-400 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/20";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...p }, ref) => <input ref={ref} className={cn(inputCls, className)} {...p} />
);
Input.displayName = "Input";

export function Textarea({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputCls, "h-auto min-h-[80px] py-2", className)} {...p} />;
}

export function Select({ className, children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        inputCls,
        "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%2364748B%22 stroke-width=%221.5%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_8px_center] bg-no-repeat pr-8",
        className
      )}
      {...p}
    >
      {children}
    </select>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-slate-200 bg-slate-50 px-1 font-mono text-caption text-slate-500">
      {children}
    </kbd>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-slate-200", className)} />;
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-caption font-medium uppercase tracking-wide text-slate-500", className)}>{children}</p>;
}

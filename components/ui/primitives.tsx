/**
 * Small presentational primitives: Card, Badge, StatusPill, Avatar, IconChip,
 * Skeleton, Banner, EmptyState, Field/Input/Select/Textarea, Kbd, Divider.
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
  AlertOctagon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Card ----------------------------------------------------------------- */
export function Card({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-slate-200/80 bg-surface shadow-card", className)} {...p} />;
}
export function CardHeader({
  title,
  description,
  action,
  className,
  icon: Icon,
  tone,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
  tone?: TintTone;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && tone && <IconChip icon={Icon} tone={tone} size="sm" />}
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-h3 font-semibold tracking-tight text-slate-900">
            {Icon && !tone && <Icon className="size-4 text-slate-400" strokeWidth={1.75} />}
            {title}
          </h3>
          {description && <p className="mt-0.5 text-small text-slate-500">{description}</p>}
        </div>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
export function CardBody({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...p} />;
}

/* Tints: subtle category color (icon chips, avatars, tags) -------------- */
export type TintTone = "teal" | "sky" | "iris" | "peach" | "rose" | "mint" | "slate" | "warning" | "danger" | "success" | "info" | "ai";
export const tint: Record<TintTone, string> = {
  teal: "bg-teal-50 text-teal-700",
  sky: "bg-sky-bg text-sky-fg",
  iris: "bg-iris-bg text-iris-fg",
  peach: "bg-peach-bg text-peach-fg",
  rose: "bg-rose-bg text-rose-fg",
  mint: "bg-mint-bg text-mint-fg",
  slate: "bg-slate-100 text-slate-600",
  warning: "bg-warning-bg text-warning-fg",
  danger: "bg-danger-bg text-danger-fg",
  success: "bg-success-bg text-success-fg",
  info: "bg-info-bg text-info-fg",
  ai: "bg-ai-bg text-ai-fg",
};

export function IconChip({ icon: Icon, tone = "teal", size = "md", className }: { icon: LucideIcon; tone?: TintTone; size?: "sm" | "md" | "lg"; className?: string }) {
  const s = { sm: "size-8 rounded-[10px] [&_svg]:size-4", md: "size-10 rounded-xl [&_svg]:size-5", lg: "size-12 rounded-[14px] [&_svg]:size-6" }[size];
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", s, tint[tone], className)} aria-hidden>
      <Icon strokeWidth={1.75} />
    </span>
  );
}

/* Badge ---------------------------------------------------------------- */
const badgeTones = {
  neutral: "bg-slate-100 text-slate-700",
  teal: "bg-teal-50 text-teal-800",
  success: "bg-success-bg text-success-fg",
  warning: "bg-warning-bg text-warning-fg",
  danger: "bg-danger-bg text-danger-fg",
  info: "bg-info-bg text-info-fg",
  ai: "bg-ai-bg text-ai-fg",
  sky: "bg-sky-bg text-sky-fg",
  iris: "bg-iris-bg text-iris-fg",
  peach: "bg-peach-bg text-peach-fg",
  rose: "bg-rose-bg text-rose-fg",
  outline: "bg-surface text-slate-700 ring-1 ring-inset ring-slate-200",
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
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium",
        size === "sm" ? "px-1.5 py-px text-caption" : "px-2.5 py-0.5 text-caption",
        badgeTones[tone],
        className
      )}
    >
      {Icon && <Icon className="size-3" strokeWidth={2.25} aria-hidden />}
      {children}
    </span>
  );
}

/* Status pill (never color alone: icon + label) ------------------------ */
const statusMap: Record<string, { tone: Tone; icon: LucideIcon }> = {
  Booked: { tone: "info", icon: Clock },
  Arrived: { tone: "teal", icon: UserCheck },
  "With doctor": { tone: "iris", icon: Stethoscope },
  Done: { tone: "success", icon: CheckCircle2 },
  "No-show": { tone: "warning", icon: AlertTriangle },
  Cancelled: { tone: "neutral", icon: XCircle },
};
export function StatusPill({ status, className }: { status: string; className?: string }) {
  const s = statusMap[status] ?? { tone: "neutral" as Tone, icon: CircleDot };
  return (
    <Badge tone={s.tone} icon={s.icon} className={className}>
      {status}
    </Badge>
  );
}

/* Avatar: initials on a soft tint picked from the name ------------------ */
const avatarTints: TintTone[] = ["teal", "sky", "iris", "peach", "rose", "mint"];
function hashTone(s: string): TintTone {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return avatarTints[h % avatarTints.length];
}
export function Avatar({ initials, size = "md", className, tone }: { initials: string; size?: "xs" | "sm" | "md" | "lg" | "xl"; className?: string; tone?: TintTone }) {
  const s = { xs: "size-6 text-[10px]", sm: "size-7 text-caption", md: "size-9 text-small", lg: "size-12 text-h3", xl: "size-16 text-h2" }[size];
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-semibold", s, tint[tone ?? hashTone(initials)], className)} aria-hidden>
      {initials}
    </span>
  );
}

export function AvatarStack({ names, max = 3, size = "xs" }: { names: string[]; max?: number; size?: "xs" | "sm" }) {
  return (
    <span className="flex -space-x-1.5">
      {names.slice(0, max).map((n) => (
        <Avatar key={n} initials={initialsOf(n)} size={size} className="ring-2 ring-surface" />
      ))}
      {names.length > max && (
        <span className={cn("inline-flex items-center justify-center rounded-full bg-slate-100 font-medium text-slate-600 ring-2 ring-surface", size === "xs" ? "size-6 text-[10px]" : "size-7 text-caption")}>
          +{names.length - max}
        </span>
      )}
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
    <div className={cn("relative overflow-hidden rounded-md bg-slate-100", className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-surface/70 to-transparent" />
    </div>
  );
}

/* Banner --------------------------------------------------------------- */
const bannerTones = {
  info: { cls: "bg-info-bg text-info-fg", icon: Info },
  warning: { cls: "bg-warning-bg text-warning-fg", icon: AlertTriangle },
  danger: { cls: "bg-danger-bg text-danger-fg", icon: AlertOctagon },
  success: { cls: "bg-success-bg text-success-fg", icon: CheckCircle2 },
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
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex items-start gap-3 rounded-lg px-4 py-3", t.cls, className)}>
      <span className="mt-px inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-surface/70">
        <Icon className="size-3.5" strokeWidth={2.25} aria-hidden />
      </span>
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
    <div className={cn("flex flex-col items-center justify-center px-6 py-14 text-center", className)}>
      <span className="relative mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-surface shadow-sm ring-1 ring-slate-200">
        <Icon className="size-6 text-teal-700" strokeWidth={1.75} />
      </span>
      <p className="text-h3 font-semibold tracking-tight">{title}</p>
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
  "h-10 w-full rounded border border-slate-200 bg-surface px-3 text-body text-slate-900 shadow-card placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:outline-none focus:shadow-ring disabled:bg-slate-50 disabled:text-slate-400 aria-[invalid=true]:border-danger";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...p }, ref) => <input ref={ref} className={cn(inputCls, className)} {...p} />
);
Input.displayName = "Input";

export function Textarea({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputCls, "h-auto min-h-[80px] py-2", className)} {...p} />;
}

export function Select({ className, children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("relative", className)}>
      <select className={cn(inputCls, "appearance-none pr-9")} {...p}>
        {children}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-slate-200 bg-slate-50 px-1 font-mono text-[11px] text-slate-500">
      {children}
    </kbd>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-slate-200", className)} />;
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-caption font-medium uppercase tracking-[0.06em] text-slate-400", className)}>{children}</p>;
}

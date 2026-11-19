"use client";
/**
 * Clinical / workflow components: AiDraftBlock, AiBadge, SafetyAlert, Stepper,
 * TimelineItem, Dropzone, RecordingIndicator, OfflineBadge.
 */
import * as React from "react";
import {
  Sparkles,
  Check,
  Pencil,
  X,
  ShieldAlert,
  AlertTriangle,
  Info,
  UploadCloud,
  Camera,
  CircleCheck,
  WifiOff,
  Circle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/* AI badge + draft block ---------------------------------------------- */
export function AiBadge({ label = "AI draft", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-ai/25 bg-ai-bg px-2 py-0.5 text-caption font-medium text-ai-fg", className)}>
      <Sparkles className="size-3" strokeWidth={2} aria-hidden />
      {label}
    </span>
  );
}

export type DraftState = "draft" | "accepted" | "editing" | "dismissed";

export function AiDraftBlock({
  title,
  children,
  state: controlled,
  onStateChange,
  className,
  compact,
  actions = true,
  editor,
  meta,
}: {
  title?: React.ReactNode;
  children: React.ReactNode;
  state?: DraftState;
  onStateChange?: (s: DraftState) => void;
  className?: string;
  compact?: boolean;
  actions?: boolean;
  editor?: React.ReactNode;
  meta?: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState<DraftState>("draft");
  const state = controlled ?? internal;
  const set = (s: DraftState) => (onStateChange ? onStateChange(s) : setInternal(s));

  if (state === "dismissed") {
    return (
      <div className={cn("flex items-center justify-between rounded-lg border border-dashed border-slate-200 px-4 py-2 text-small text-slate-500", className)}>
        <span>{title ?? "AI draft"} dismissed</span>
        <button className="font-medium text-teal-700 hover:underline" onClick={() => set("draft")}>
          Undo
        </button>
      </div>
    );
  }
  const accepted = state === "accepted";
  return (
    <div
      className={cn(
        "rounded-lg border-y border-r border-l-2",
        accepted ? "border-slate-200 border-l-teal-600 bg-surface" : "border-ai/20 border-l-ai bg-ai-bg/60",
        compact ? "px-3 py-2.5" : "px-4 py-3",
        className
      )}
    >
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {accepted ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-caption font-medium text-teal-800">
              <Check className="size-3" strokeWidth={2.5} /> Accepted
            </span>
          ) : (
            <AiBadge />
          )}
          {title && <span className="truncate text-small font-medium text-slate-700">{title}</span>}
          {meta}
        </div>
        {actions && !accepted && state !== "editing" && (
          <div className="flex shrink-0 items-center gap-1">
            <Button size="sm" variant="secondary" className="h-7 px-2" onClick={() => set("accepted")} aria-label="Accept AI draft">
              <Check /> Accept
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => set("editing")} aria-label="Edit AI draft">
              <Pencil /> Edit
            </Button>
            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => set("dismissed")} aria-label="Dismiss AI draft">
              <X /> Dismiss
            </Button>
          </div>
        )}
        {accepted && actions && (
          <button className="text-caption font-medium text-slate-500 hover:text-slate-900" onClick={() => set("editing")}>
            Edit
          </button>
        )}
      </div>
      {state === "editing" ? (
        <div>
          {editor ?? <div contentEditable suppressContentEditableWarning className="rounded border border-teal-500 bg-surface p-2 text-body outline-none ring-2 ring-teal-500/20">{children}</div>}
          <div className="mt-2 flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => set("draft")}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => set("accepted")}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-body text-slate-900">{children}</div>
      )}
    </div>
  );
}

/* Safety alert --------------------------------------------------------- */
const sev = {
  high: { label: "High", cls: "border-danger/30 bg-danger-bg", icon: ShieldAlert, iconCls: "text-danger", pill: "bg-danger text-on-accent" },
  moderate: { label: "Moderate", cls: "border-warning/30 bg-warning-bg", icon: AlertTriangle, iconCls: "text-warning", pill: "bg-warning-fg text-on-accent" },
  info: { label: "Info", cls: "border-info/25 bg-info-bg", icon: Info, iconCls: "text-info", pill: "bg-info-fg text-on-accent" },
};
export function SafetyAlert({
  severity,
  category,
  title,
  body,
  resolved,
  onAcknowledge,
  onChange,
  changeLabel = "Change",
}: {
  severity: keyof typeof sev;
  category: string;
  title: string;
  body?: string;
  resolved?: "acknowledged" | "changed" | null;
  onAcknowledge?: () => void;
  onChange?: () => void;
  changeLabel?: string;
}) {
  const s = sev[severity];
  const Icon = s.icon;
  if (resolved) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-surface px-3 py-2 text-small text-slate-500">
        <CircleCheck className="size-4 text-success" />
        <span className="font-medium text-slate-700">{category}:</span>
        <span className="truncate">{resolved === "changed" ? "Resolved by changing medicine" : "Acknowledged by doctor"}</span>
      </div>
    );
  }
  return (
    <div className={cn("rounded-lg border px-3 py-2.5", s.cls)} role="alert">
      <div className="flex items-start gap-2.5">
        <Icon className={cn("mt-0.5 size-4 shrink-0", s.iconCls)} strokeWidth={2} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cn("rounded-sm px-1.5 py-px text-caption font-semibold", s.pill)}>{s.label}</span>
            <span className="text-caption font-medium uppercase tracking-wide text-slate-500">{category}</span>
          </div>
          <p className="mt-1 text-body font-medium text-slate-900">{title}</p>
          {body && <p className="text-small text-slate-700">{body}</p>}
          <div className="mt-2 flex gap-2">
            {onChange && (
              <Button size="sm" variant="secondary" className="h-7" onClick={onChange}>
                {changeLabel}
              </Button>
            )}
            {onAcknowledge && (
              <Button size="sm" variant="ghost" className="h-7" onClick={onAcknowledge}>
                Acknowledge
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Stepper -------------------------------------------------------------- */
export function Stepper({
  steps,
  current,
  onStep,
  orientation = "horizontal",
}: {
  steps: string[];
  current: number;
  onStep?: (i: number) => void;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <ol className={cn("flex", orientation === "horizontal" ? "items-center gap-2" : "flex-col gap-1")}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s} className={cn("flex items-center gap-2", orientation === "horizontal" && i < steps.length - 1 && "flex-1")}>
            <button
              type="button"
              disabled={!onStep}
              onClick={() => onStep?.(i)}
              className={cn(
                "flex items-center gap-2 rounded text-left",
                orientation === "vertical" && "w-full px-2 py-2",
                orientation === "vertical" && active && "bg-teal-50"
              )}
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "tnum inline-flex size-7 shrink-0 items-center justify-center rounded-full border text-small font-semibold",
                  done && "border-teal-700 bg-teal-700 text-on-accent",
                  active && "border-teal-700 bg-surface text-teal-800 ring-4 ring-teal-100",
                  !done && !active && "border-slate-300 bg-surface text-slate-500"
                )}
              >
                {done ? <Check className="size-4" strokeWidth={2.5} /> : i + 1}
              </span>
              <span className={cn("text-small font-medium", active ? "text-slate-900" : "text-slate-500")}>{s}</span>
            </button>
            {orientation === "horizontal" && i < steps.length - 1 && (
              <span className={cn("h-px flex-1", done ? "bg-teal-600" : "bg-slate-200")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* Timeline item -------------------------------------------------------- */
export function TimelineItem({
  title,
  time,
  body,
  state,
  last,
  big,
}: {
  title: React.ReactNode;
  time?: React.ReactNode;
  body?: React.ReactNode;
  state: "done" | "current" | "pending";
  last?: boolean;
  big?: boolean;
}) {
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      {!last && <span className={cn("absolute left-[11px] top-6 h-[calc(100%-20px)] w-0.5", state === "done" ? "bg-teal-600" : "bg-slate-200")} />}
      <span
        className={cn(
          "relative z-10 mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full",
          state === "done" && "bg-teal-700 text-on-accent",
          state === "current" && "border-2 border-teal-700 bg-surface text-teal-700",
          state === "pending" && "border-2 border-slate-300 bg-surface text-slate-300"
        )}
      >
        {state === "done" ? (
          <Check className="size-3.5" strokeWidth={3} />
        ) : state === "current" ? (
          <Loader2 className="size-3.5 animate-spin" strokeWidth={2.5} />
        ) : (
          <Circle className="size-2 fill-current" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn(big ? "text-base" : "text-body", "font-medium", state === "pending" ? "text-slate-500" : "text-slate-900")}>{title}</p>
        {time && <p className={cn(big ? "text-body" : "text-caption", "tnum text-slate-500")}>{time}</p>}
        {body && <div className="mt-1 text-small text-slate-700">{body}</div>}
      </div>
    </li>
  );
}

/* Dropzone ------------------------------------------------------------- */
export function Dropzone({
  title = "Drop files here or click to upload",
  hint = "JPG, PNG or PDF, up to 10 MB each",
  camera,
  cameraLabel = "Take photo",
  onFiles,
  className,
  big,
}: {
  title?: string;
  hint?: string;
  camera?: boolean;
  cameraLabel?: string;
  onFiles?: (n: number) => void;
  className?: string;
  big?: boolean;
}) {
  const [over, setOver] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        onFiles?.(e.dataTransfer.files.length || 1);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 text-center transition-colors",
        over ? "border-teal-500 bg-teal-50" : "border-slate-300 bg-slate-50",
        big ? "py-10" : "py-8",
        className
      )}
    >
      <UploadCloud className="mb-3 size-8 text-teal-700" strokeWidth={1.5} />
      <p className={cn(big ? "text-base" : "text-body", "font-medium text-slate-900")}>{title}</p>
      <p className="mt-1 text-caption text-slate-500">{hint}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {camera && (
          <Button type="button" size={big ? "lg" : "md"} onClick={() => onFiles?.(1)}>
            <Camera /> {cameraLabel}
          </Button>
        )}
        <Button type="button" size={big ? "lg" : "md"} variant="secondary" onClick={() => input.current?.click()}>
          <UploadCloud /> Browse
        </Button>
        <input
          ref={input}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => onFiles?.(e.target.files?.length ?? 0)}
        />
      </div>
    </div>
  );
}

/* Recording indicator -------------------------------------------------- */
export function RecordingIndicator({ state, seconds }: { state: "idle" | "recording" | "paused"; seconds: number }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-3">
      <span className={cn("relative inline-flex size-2.5 rounded-full", state === "recording" ? "bg-danger" : state === "paused" ? "bg-warning" : "bg-slate-300")}>
        {state === "recording" && <span className="absolute inset-0 animate-ping rounded-full bg-danger/60" />}
      </span>
      <div className="flex h-6 items-center gap-[3px]" aria-hidden>
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className={cn("w-[3px] origin-center rounded-full", state === "recording" ? "animate-wave bg-teal-600" : "bg-slate-300")}
            style={{ height: `${8 + ((i * 7) % 16)}px`, animationDelay: `${(i % 7) * 0.11}s` }}
          />
        ))}
      </div>
      <span className="tnum text-body font-medium text-slate-900" aria-label="Recording time">
        {mm}:{ss}
      </span>
      <span className="text-small text-slate-500">{state === "recording" ? "Recording" : state === "paused" ? "Paused" : "Not recording"}</span>
    </div>
  );
}

/* Offline badge -------------------------------------------------------- */
export function OfflineBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning-bg px-2.5 py-1 text-caption font-medium text-warning-fg">
      <WifiOff className="size-3.5" strokeWidth={2} /> Offline, changes will sync
    </span>
  );
}

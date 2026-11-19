"use client";
import * as React from "react";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastT = { id: number; title: string; body?: string; tone?: "success" | "info" | "warning" };
const Ctx = React.createContext<(t: Omit<ToastT, "id">) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastT[]>([]);
  const push = React.useCallback((t: Omit<ToastT, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { ...t, id }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 4200);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-[calc(100%-32px)] max-w-sm -translate-x-1/2 flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => setToasts((s) => s.filter((x) => x.id !== t.id))} />
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function Toast({ title, body, tone = "success", onClose, className }: Omit<ToastT, "id"> & { onClose?: () => void; className?: string }) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? AlertTriangle : Info;
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex animate-toast-in items-start gap-3 rounded-lg border border-slate-200 bg-slate-900 px-4 py-3 text-on-accent shadow-sm",
        className
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", tone === "success" ? "text-teal-200" : tone === "warning" ? "text-warning" : "text-teal-200")} />
      <div className="flex-1">
        <p className="text-body font-medium">{title}</p>
        {body && <p className="text-small text-slate-300">{body}</p>}
      </div>
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss" className="rounded p-0.5 text-slate-400 hover:text-on-accent">
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export function useToast() {
  return React.useContext(Ctx);
}

"use client";
/**
 * Interactive primitives: Tabs, SegmentedControl, Chip, Switch, Checkbox,
 * Dialog, Sheet, Tooltip, Combobox, DatePicker.
 */
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Check, ChevronLeft, ChevronRight, CalendarDays, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputCls } from "./primitives";

/* Tabs ----------------------------------------------------------------- */
export const Tabs = TabsPrimitive.Root;
export function TabsList({ className, ...p }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return <TabsPrimitive.List className={cn("flex items-center gap-1 border-b border-slate-200", className)} {...p} />;
}
export function TabsTrigger({ className, ...p }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "-mb-px inline-flex h-10 items-center gap-2 border-b-2 border-transparent px-3 text-body font-medium text-slate-500 transition-colors hover:text-slate-900 data-[state=active]:border-teal-700 data-[state=active]:text-teal-800",
        className
      )}
      {...p}
    />
  );
}
export const TabsContent = TabsPrimitive.Content;

/* Segmented control ---------------------------------------------------- */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  ariaLabel,
}: {
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className={cn("inline-flex rounded border border-slate-200 bg-slate-100 p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-1.5 rounded-sm font-medium text-slate-500 transition-colors hover:text-slate-900 [&_svg]:size-4",
            size === "sm" && "h-7 px-2.5 text-small",
            size === "md" && "h-8 px-3 text-body",
            size === "lg" && "h-11 px-4 text-base",
            value === o.value && "bg-white text-slate-900 shadow-sm"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* Chip ----------------------------------------------------------------- */
export function Chip({
  selected,
  onClick,
  children,
  className,
  size = "md",
  disabled,
}: {
  selected?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-4",
        size === "md" ? "h-8 px-3 text-small" : "min-h-11 px-4 text-base",
        selected
          ? "border-teal-700 bg-teal-700 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        className
      )}
    >
      {selected && <Check strokeWidth={2.5} aria-hidden />}
      {children}
    </button>
  );
}

/* Switch --------------------------------------------------------------- */
export function Switch({ className, ...p }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full bg-slate-300 transition-colors data-[state=checked]:bg-teal-700",
        className
      )}
      {...p}
    >
      <SwitchPrimitive.Thumb className="block size-4 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[18px]" />
    </SwitchPrimitive.Root>
  );
}

/* Checkbox ------------------------------------------------------------- */
export function Checkbox({ className, ...p }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-sm border border-slate-300 bg-white data-[state=checked]:border-teal-700 data-[state=checked]:bg-teal-700",
        className
      )}
      {...p}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="size-3.5 text-white" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

/* Dialog --------------------------------------------------------------- */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 animate-fade-in bg-slate-900/40" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-md -translate-x-1/2 -translate-y-1/2 animate-fade-in rounded-xl border border-slate-200 bg-white p-6 shadow-sm focus:outline-none",
            className
          )}
        >
          <DialogPrimitive.Title className="text-h2 font-semibold">{title}</DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="mt-1 text-body text-slate-500">{description}</DialogPrimitive.Description>
          ) : (
            <DialogPrimitive.Description className="sr-only">Dialog</DialogPrimitive.Description>
          )}
          {children && <div className="mt-4">{children}</div>}
          {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
            <X className="size-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* Sheet (right drawer) ------------------------------------------------- */
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  width = "max-w-xl",
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 animate-fade-in bg-slate-900/30" />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-50 flex w-full animate-slide-in flex-col rounded-l-xl border-l border-slate-200 bg-white shadow-sm focus:outline-none",
            width
          )}
        >
          <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <DialogPrimitive.Title className="text-h2 font-semibold">{title}</DialogPrimitive.Title>
              <DialogPrimitive.Description className={cn("mt-0.5 text-body text-slate-500", !description && "sr-only")}>
                {description ?? "Side sheet"}
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
              <X className="size-5" />
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && <div className="flex justify-end gap-2 border-t border-slate-200 px-6 py-4">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* Tooltip -------------------------------------------------------------- */
export function Tooltip({ content, children, side = "top" }: { content: React.ReactNode; children: React.ReactNode; side?: "top" | "bottom" | "left" | "right" }) {
  return (
    <TooltipPrimitive.Provider delayDuration={150}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={6}
            className="z-50 max-w-xs animate-fade-in rounded border border-slate-200 bg-white px-3 py-2 text-small text-slate-700 shadow-sm"
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* Combobox ------------------------------------------------------------- */
export function Combobox<T>({
  items,
  getLabel,
  getSub,
  onSelect,
  placeholder,
  className,
  autoFocus,
  inputClassName,
}: {
  items: T[];
  getLabel: (t: T) => string;
  getSub?: (t: T) => string;
  onSelect: (t: T) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  inputClassName?: string;
}) {
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const filtered = React.useMemo(
    () =>
      items
        .filter((i) => (getLabel(i) + " " + (getSub?.(i) ?? "")).toLowerCase().includes(q.toLowerCase()))
        .slice(0, 8),
    [items, q, getLabel, getSub]
  );
  const choose = (t: T) => {
    onSelect(t);
    setQ("");
    setOpen(false);
  };
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoFocus={autoFocus}
        value={q}
        placeholder={placeholder}
        className={cn(inputCls, "pl-9", inputClassName)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, filtered.length - 1));
          if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
          if (e.key === "Enter" && filtered[active]) {
            e.preventDefault();
            choose(filtered[active]);
          }
        }}
      />
      {open && q && (
        <ul role="listbox" className="absolute z-40 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-sm">
          {filtered.length === 0 && <li className="px-3 py-2 text-body text-slate-500">No matches</li>}
          {filtered.map((t, i) => (
            <li
              key={getLabel(t) + i}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(t);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn("cursor-pointer px-3 py-2", i === active && "bg-teal-50")}
            >
              <p className="text-body font-medium">{getLabel(t)}</p>
              {getSub && <p className="text-caption text-slate-500">{getSub(t)}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* Date picker ---------------------------------------------------------- */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export function DatePicker({
  value,
  onChange,
  className,
  label = "Pick a date",
}: {
  value: Date;
  onChange: (d: Date) => void;
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(new Date(value.getFullYear(), value.getMonth(), 1));
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const first = view.getDay();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: first + days }, (_, i) => (i < first ? null : i - first + 1));
  const same = (d: number) => value.getFullYear() === view.getFullYear() && value.getMonth() === view.getMonth() && value.getDate() === d;
  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={cn(inputCls, "flex items-center gap-2 text-left")}
      >
        <CalendarDays className="size-4 text-slate-500" />
        <span className="tnum">
          {value.getDate()} {MONTHS[value.getMonth()].slice(0, 3)} {value.getFullYear()}
        </span>
      </button>
      {open && (
        <div className="absolute z-40 mt-1 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <button type="button" className="rounded p-1 hover:bg-slate-100" aria-label="Previous month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>
              <ChevronLeft className="size-4" />
            </button>
            <p className="text-body font-medium">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </p>
            <button type="button" className="rounded p-1 hover:bg-slate-100" aria-label="Next month" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-caption text-slate-500">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d} className="py-1">
                {d}
              </span>
            ))}
            {cells.map((d, i) =>
              d === null ? (
                <span key={i} />
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    onChange(new Date(view.getFullYear(), view.getMonth(), d));
                    setOpen(false);
                  }}
                  className={cn(
                    "tnum h-8 rounded text-small text-slate-900 hover:bg-teal-50",
                    same(d) && "bg-teal-700 font-medium text-white hover:bg-teal-700"
                  )}
                >
                  {d}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

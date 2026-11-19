"use client";
/** WhatsApp-style chat frame for W1–W3 conversation mockups (390 × 844). */
import * as React from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, CheckCheck, FileText, List, Mic, Paperclip, Phone, Smile, Video, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { LangToggle, useLang } from "./patient";

export function WhatsAppFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-slate-100 sm:flex sm:items-center sm:justify-center sm:py-8">
        <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden bg-whatsapp-bg sm:h-[844px] sm:min-h-0 sm:rounded-xl sm:border sm:border-slate-200 sm:shadow-sm">
          <header className="flex h-16 shrink-0 items-center gap-2 bg-whatsapp-header px-2 text-white">
            <ArrowLeft className="size-5" />
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-surface text-caption font-semibold text-slate-900">MS</span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 truncate text-body font-semibold">
                Meridian Hospital <BadgeCheck className="size-4 text-teal-200" />
              </p>
              <p className="text-caption text-white/80">Business account</p>
            </div>
            <Video className="size-5 opacity-90" />
            <Phone className="ml-3 size-5 opacity-90" />
            <LangToggle className="ml-2 scale-90 border-white/20 bg-white/10 [&_button]:text-white/80 [&_button[aria-checked=true]]:text-slate-900" />
          </header>
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4">{children}</div>
          <div className="flex shrink-0 items-center gap-2 px-2 pb-4 pt-2">
            <div className="flex h-11 flex-1 items-center gap-3 rounded-full bg-surface px-4 text-slate-400">
              <Smile className="size-5" />
              <span className="flex-1 text-body">Message</span>
              <Paperclip className="size-5" />
            </div>
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-teal-700 text-on-accent">
              <Mic className="size-5" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export function DayDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center py-1">
      <span className="rounded bg-surface/90 px-3 py-1 text-caption text-slate-500 shadow-sm">{children}</span>
    </div>
  );
}

export function Bubble({
  from,
  time,
  children,
  buttons,
  className,
}: {
  from: "bot" | "me";
  time: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex", from === "me" ? "justify-end" : "justify-start")}>
      <div className="max-w-[85%]">
        <div
          className={cn(
            "rounded-lg px-3 pb-1.5 pt-2 text-body text-slate-900 shadow-[0_1px_0.5px_rgba(15,23,42,0.13)]",
            from === "me" ? "rounded-tr-sm bg-whatsapp-bubble" : "rounded-tl-sm bg-surface",
            className
          )}
        >
          {children}
          <p className="tnum mt-1 flex items-center justify-end gap-1 text-caption text-slate-500">
            {time}
            {from === "me" && <CheckCheck className="size-3.5 text-info" />}
          </p>
        </div>
        {buttons && <div className="mt-0.5 flex flex-col gap-0.5">{buttons}</div>}
      </div>
    </div>
  );
}

export function WaButton({ children, href, icon }: { children: React.ReactNode; href?: string; icon?: "list" | "link" }) {
  const { href: h } = useLang();
  const cls =
    "flex h-10 items-center justify-center gap-2 rounded-lg bg-surface text-body font-medium text-info-fg shadow-[0_1px_0.5px_rgba(15,23,42,0.13)] hover:bg-slate-50";
  const inner = (
    <>
      {icon === "list" && <List className="size-4" />}
      {icon === "link" && <ExternalLink className="size-4" />}
      {children}
    </>
  );
  return href ? (
    <Link href={h(href)} className={cls}>
      {inner}
    </Link>
  ) : (
    <button className={cls}>{inner}</button>
  );
}

export function WaList({ title, items, selected }: { title: string; items: { label: string; sub?: string }[]; selected?: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-[0_1px_0.5px_rgba(15,23,42,0.13)]">
      <p className="border-b border-slate-100 px-4 py-2 text-caption font-medium text-slate-500">{title}</p>
      {items.map((i) => (
        <div key={i.label} className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5 last:border-b-0">
          <div>
            <p className="text-body text-slate-900">{i.label}</p>
            {i.sub && <p className="text-caption text-slate-500">{i.sub}</p>}
          </div>
          <span className={cn("size-4 rounded-full border-2", selected === i.label ? "border-[6px] border-teal-700" : "border-slate-300")} />
        </div>
      ))}
    </div>
  );
}

export function PdfAttachment({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="mb-1 flex items-center gap-3 rounded bg-slate-100 p-2.5">
      <span className="inline-flex size-10 items-center justify-center rounded bg-danger text-caption font-bold text-on-accent">
        <FileText className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-body font-medium">{name}</p>
        <p className="text-caption text-slate-500">{meta}</p>
      </div>
    </div>
  );
}

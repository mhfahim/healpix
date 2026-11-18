"use client";
/**
 * Patient mobile web shell (390 × 844). Bangla default, ?lang=en for English.
 * Language lives in the URL so every frame is linkable in either language.
 */
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { cn, toBn } from "@/lib/utils";
import { hospital } from "@/data/mock";
import { LogoMark } from "./logo";

type Lang = "bn" | "en";
type LangCtx = {
  lang: Lang;
  t: (bn: React.ReactNode, en: React.ReactNode) => React.ReactNode;
  ts: (bn: string, en: string) => string;
  n: (v: string | number) => string;
  href: (path: string) => string;
};
const Ctx = React.createContext<LangCtx>({
  lang: "bn",
  t: (b) => b,
  ts: (b) => b,
  n: (v) => toBn(v),
  href: (p) => p,
});
export const useLang = () => React.useContext(Ctx);

function LangProviderInner({ children }: { children: React.ReactNode }) {
  const sp = useSearchParams();
  const lang: Lang = sp.get("lang") === "en" ? "en" : "bn";
  const value = React.useMemo<LangCtx>(
    () => ({
      lang,
      t: (bn, en) => (lang === "bn" ? bn : en),
      ts: (bn, en) => (lang === "bn" ? bn : en),
      n: (v) => (lang === "bn" ? toBn(v) : String(v)),
      href: (p) => (lang === "en" ? `${p}${p.includes("?") ? "&" : "?"}lang=en` : p),
    }),
    [lang]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function LangProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={null}>
      <LangProviderInner>{children}</LangProviderInner>
    </React.Suspense>
  );
}

/** Link that carries the current language */
export function PLink({ href, className, children, ...p }: React.ComponentProps<typeof Link> & { href: string }) {
  const { href: h } = useLang();
  return (
    <Link href={h(href)} className={className} {...p}>
      {children}
    </Link>
  );
}

export function LangToggle({ className }: { className?: string }) {
  const { lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const set = (l: Lang) => {
    const p = new URLSearchParams(sp.toString());
    if (l === "en") p.set("lang", "en");
    else p.delete("lang");
    router.replace(`${pathname}${p.toString() ? `?${p}` : ""}`, { scroll: false });
  };
  return (
    <div role="radiogroup" aria-label="Language" className={cn("inline-flex rounded-full border border-slate-200 bg-slate-100 p-0.5 text-small font-medium", className)}>
      {(["bn", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={lang === l}
          onClick={() => set(l)}
          className={cn("h-8 min-w-11 rounded-full px-3 text-slate-500", lang === l && "bg-white text-slate-900 shadow-sm")}
        >
          {l === "bn" ? "বাংলা" : "EN"}
        </button>
      ))}
    </div>
  );
}

/** Device frame: full-width on phones, framed 390 × 844 on desktop. */
export function PatientFrame({
  children,
  header,
  bottom,
  className,
  bg = "bg-slate-50",
}: {
  children: React.ReactNode;
  header?: React.ReactNode;
  bottom?: React.ReactNode;
  className?: string;
  bg?: string;
}) {
  const { lang } = useLang();
  return (
    <div className="min-h-screen bg-slate-100 sm:flex sm:items-center sm:justify-center sm:py-8" lang={lang}>
      <div
        className={cn(
          "relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden sm:h-[844px] sm:min-h-0 sm:rounded-xl sm:border sm:border-slate-200 sm:shadow-sm",
          bg
        )}
      >
        <StatusBar />
        {header}
        <div className={cn("flex-1 overflow-y-auto text-base", className)}>{children}</div>
        {bottom && <div className="sticky bottom-0 z-20 border-t border-slate-200 bg-white px-4 pb-5 pt-3">{bottom}</div>}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="hidden h-7 shrink-0 items-center justify-between bg-white px-6 text-caption font-semibold text-slate-900 sm:flex" aria-hidden>
      <span className="tnum">6:24</span>
      <span className="flex items-center gap-1">
        <span className="h-2.5 w-4 rounded-sm border border-slate-900" />
      </span>
    </div>
  );
}

/** Top app bar: back button + title, or hospital header */
export function PHeader({ title, back, right, sub }: { title: React.ReactNode; back?: string; right?: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <header className="z-20 flex min-h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-2">
      {back ? (
        <PLink href={back} className="inline-flex size-11 items-center justify-center rounded-full text-slate-700 hover:bg-slate-100" aria-label="Back">
          <ArrowLeft className="size-5" />
        </PLink>
      ) : (
        <span className="w-2" />
      )}
      <div className="min-w-0 flex-1 py-2">
        <p className="truncate text-h3 font-semibold">{title}</p>
        {sub && <p className="truncate text-caption text-slate-500">{sub}</p>}
      </div>
      {right ?? <LangToggle className="mr-2" />}
    </header>
  );
}

export function HospitalHeader() {
  const { t } = useLang();
  return (
    <header className="shrink-0 border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-lg bg-slate-900 text-small font-semibold text-white">MS</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-h3 font-semibold leading-tight">{t(hospital.nameBn, hospital.name)}</p>
          <p className="truncate text-small text-slate-500">{t(hospital.branchBn, hospital.branch)}</p>
        </div>
        <LangToggle />
      </div>
    </header>
  );
}

export function PoweredBy() {
  return (
    <p className="flex items-center justify-center gap-1.5 py-6 text-caption text-slate-400">
      <LogoMark size={14} /> Powered by Helpix
    </p>
  );
}

export function HotlineLink({ className }: { className?: string }) {
  const { t, n } = useLang();
  return (
    <a href={`tel:${hospital.hotline}`} className={cn("inline-flex items-center gap-2 font-medium text-teal-700", className)}>
      <Phone className="size-4" /> {t("হটলাইন", "Hotline")} {n(hospital.hotline)}
    </a>
  );
}

/** Large primary button for patient screens (min 44px; we use 48) */
export function PButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const cls = cn(
    "inline-flex h-12 w-full items-center justify-center gap-2 rounded text-base font-medium transition-colors [&_svg]:size-5 disabled:opacity-50",
    variant === "primary" && "bg-teal-700 text-white hover:bg-teal-800 active:bg-teal-900",
    variant === "secondary" && "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
    variant === "ghost" && "text-teal-700 hover:bg-teal-50",
    disabled && "pointer-events-none",
    className
  );
  if (href)
    return (
      <PLink href={href} className={cls} aria-disabled={disabled}>
        {children}
      </PLink>
    );
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}

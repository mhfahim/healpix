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
    <div role="radiogroup" aria-label="Language" className={cn("inline-flex rounded-full bg-slate-100 p-1 text-small font-medium", className)}>
      {(["bn", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          role="radio"
          aria-checked={lang === l}
          onClick={() => set(l)}
          className={cn("h-8 min-w-11 rounded-full px-3 text-slate-500", lang === l && "bg-surface text-slate-900 shadow-card")}
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
    <div className="bg-dots min-h-screen bg-slate-100 sm:flex sm:items-center sm:justify-center sm:py-8" lang={lang}>
      <div
        className={cn(
          "relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden sm:h-[844px] sm:min-h-0 sm:rounded-2xl sm:shadow-sm sm:ring-[6px] sm:ring-black",
          bg
        )}
      >
        <StatusBar />
        {header}
        <div className={cn("flex-1 overflow-y-auto text-base", className)}>{children}</div>
        {bottom && (
          <div className="sticky bottom-0 z-20 rounded-t-xl border-t border-slate-200/70 bg-surface/90 px-4 pb-6 pt-3 shadow-[0_-8px_24px_-12px_rgb(var(--shadow)/0.12)] backdrop-blur-md">
            {bottom}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="relative hidden h-11 shrink-0 items-center justify-between bg-surface px-7 text-small font-semibold text-slate-900 sm:flex" aria-hidden>
      <span className="tnum">6:24</span>
      <span className="absolute left-1/2 top-2.5 h-[26px] w-[104px] -translate-x-1/2 rounded-full bg-black" />
      <span className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.5" y="5" width="3" height="6" rx="1" /><rect x="9" y="2.5" width="3" height="8.5" rx="1" /><rect x="13.5" y="0" width="3" height="11" rx="1" /></svg>
        <span className="relative h-[11px] w-[22px] rounded-[3px] border border-current p-[1.5px] opacity-90">
          <span className="block h-full w-[70%] rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  );
}

/** Top app bar: back button + title, or hospital header */
export function PHeader({ title, back, right, sub }: { title: React.ReactNode; back?: string; right?: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <header className="z-20 flex min-h-[60px] shrink-0 items-center gap-2 bg-surface px-3">
      {back ? (
        <PLink href={back} className="inline-flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-150" aria-label="Back">
          <ArrowLeft className="size-5" />
        </PLink>
      ) : (
        <span className="w-2" />
      )}
      <div className="min-w-0 flex-1 py-2">
        <p className="truncate text-h3 font-semibold tracking-tight">{title}</p>
        {sub && <p className="truncate text-caption text-slate-500">{sub}</p>}
      </div>
      {right ?? <LangToggle className="mr-2" />}
    </header>
  );
}

export function HospitalHeader() {
  const { t } = useLang();
  return (
    <header className="shrink-0 bg-surface px-4 pb-3 pt-1">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-11 items-center justify-center rounded-lg bg-slate-900 text-small font-semibold text-on-accent">MS</span>
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
    "inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-base font-medium transition-all active:scale-[0.98] [&_svg]:size-5 disabled:opacity-50",
    variant === "primary" && "bg-slate-900 text-on-accent hover:bg-slate-800",
    variant === "secondary" && "bg-slate-100 text-slate-900 hover:bg-slate-150",
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

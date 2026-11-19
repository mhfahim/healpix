"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, Layers, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { screenByPath, screenByCode, flows } from "@/lib/screens";

/** Floating prototype helper: back to the index, current frame name, state switcher. */
function Inner() {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const screen = screenByPath(pathname);
  if (pathname === "/") return null;
  // Next steps across all prototype flows that pass through this screen.
  const next = screen
    ? Array.from(
        new Set(
          flows.flatMap((f) =>
            [f.steps, f.alt ?? []].flatMap((seq) => seq.flatMap((c, i) => (c === screen.code && seq[i + 1] && seq[i + 1] !== c ? [seq[i + 1]] : [])))
          )
        )
      )
    : [];
  const state = params.get("state") ?? "default";
  const setState = (s: string) => {
    const p = new URLSearchParams(params.toString());
    if (s === "default") p.delete("state");
    else p.set("state", s);
    router.replace(`${pathname}${p.toString() ? `?${p}` : ""}`, { scroll: false });
  };
  return (
    <div className="no-print fixed bottom-4 left-4 z-[55] hidden items-center sm:flex gap-1 rounded-full border border-slate-200 bg-surface/95 p-1 pr-2 text-small shadow-sm backdrop-blur">
      <Link href="/" className="inline-flex h-7 items-center gap-1.5 rounded-full bg-slate-900 px-3 font-medium text-on-accent hover:bg-slate-700" title="Prototype index">
        <LayoutGrid className="size-3.5" /> Index
      </Link>
      {screen && (
        <span className="px-2 font-medium text-slate-700">
          <span className="text-slate-500">{screen.code}</span> {screen.title}
        </span>
      )}
      {next.length > 0 && (
        <span className="ml-1 flex items-center gap-1 border-l border-slate-200 pl-2">
          <span className="text-caption text-slate-500">Next</span>
          {next.map((c) => {
            const s = screenByCode(c)!;
            return (
              <Link key={c} href={s.path} title={s.title} className="inline-flex h-6 items-center gap-1 rounded-full bg-teal-50 px-2 font-medium text-teal-800 hover:bg-teal-100">
                {c} <ArrowRight className="size-3" />
              </Link>
            );
          })}
        </span>
      )}
      {screen?.states && (
        <span className="ml-1 flex items-center gap-0.5 border-l border-slate-200 pl-2">
          <Layers className="mr-1 size-3.5 text-slate-500" aria-hidden />
          {["default", "loading", "empty", "error", "offline"].map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={cn("h-6 rounded-full px-2 capitalize text-slate-500 hover:bg-slate-100", state === s && "bg-teal-50 font-medium text-teal-800")}
            >
              {s}
            </button>
          ))}
        </span>
      )}
    </div>
  );
}

export function ProtoBar() {
  return (
    <React.Suspense fallback={null}>
      <Inner />
    </React.Suspense>
  );
}

import Link from "next/link";
import { ArrowRight, Monitor, Smartphone, Layers, GitBranch } from "lucide-react";
import { groups, flows, screenByCode } from "@/lib/screens";
import { Logo } from "@/components/shell/logo";
import { Badge } from "@/components/ui/primitives";
import { ThemeToggle } from "@/components/shell/theme";

export default function Index() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5">
          <Logo />
          <span className="flex items-center gap-3 text-small text-slate-500">Prototype · Meridian Specialized Hospital (fictional sample data) <ThemeToggle /></span>
        </div>
      </header>
      <main className="mx-auto max-w-content px-6 py-10">
        <div className="max-w-3xl">
          <p className="text-small font-medium text-teal-700">Helpix product prototype</p>
          <h1 className="mt-1 text-display font-normal tracking-tight">We show hospitals the revenue walking out their door, and bring it back.</h1>
          <p className="mt-3 text-h3 font-normal text-slate-500">
            Every screen from the brief, wired into the nine clickable flows. Use the floating bar at the bottom-left of any screen to return here or switch
            between default, loading, empty, error and offline states (M1, D1, D5, F1).
          </p>
        </div>

        {/* Flows */}
        <section className="mt-10">
          <h2 className="flex items-center gap-2 text-h2 font-semibold">
            <GitBranch className="size-5 text-teal-700" strokeWidth={1.5} /> Prototype flows
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {flows.map((f) => {
              const first = screenByCode(f.steps[0])!;
              return (
                <Link
                  key={f.n}
                  href={first.path}
                  className="group rounded-lg border border-slate-200 bg-surface p-4 transition-colors hover:border-teal-500"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-caption font-medium text-slate-500">Flow {f.n}</span>
                    <ArrowRight className="size-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-700" />
                  </div>
                  <p className="mt-1 text-h3 font-semibold">{f.title}</p>
                  <p className="tnum mt-2 flex flex-wrap items-center gap-1 text-small text-slate-500">
                    {f.steps.map((s, i) => (
                      <span key={i} className="inline-flex items-center gap-1">
                        <span className="rounded-sm bg-slate-100 px-1.5 py-px font-medium text-slate-700">{s}</span>
                        {i < f.steps.length - 1 && <span aria-hidden>›</span>}
                      </span>
                    ))}
                  </p>
                  {f.alt && <p className="mt-1 text-caption text-slate-500">Alternate: {f.alt.join(" › ")}</p>}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Screens */}
        {groups.map((g) => (
          <section key={g.id} className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-2">
              <h2 className="text-h2 font-semibold">{g.label}</h2>
              <span className="inline-flex items-center gap-1.5 text-small text-slate-500">
                {g.id === "p" ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
                {g.viewport}
              </span>
            </div>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {g.screens.map((s) => (
                <li key={s.code}>
                  <Link href={s.path} className="flex h-full flex-col rounded-lg border border-slate-200 bg-surface px-4 py-3 hover:border-teal-500">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-caption font-semibold text-teal-700">{s.code}</span>
                      {s.states && (
                        <Badge tone="neutral" icon={Layers} size="sm">
                          5 states
                        </Badge>
                      )}
                    </span>
                    <span className="mt-0.5 text-body font-medium">{s.title}</span>
                    {s.note && <span className="mt-0.5 text-caption text-slate-500">{s.note}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-16 text-caption text-slate-400">All hospitals, doctors, patients and labs are fictional. No backend; data comes from data/mock.ts.</p>
      </main>
    </div>
  );
}

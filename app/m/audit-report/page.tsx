"use client";
import * as React from "react";
import { Download, Link2, Printer, Camera, Receipt, GitCompare, CheckCircle2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/controls";
import { Logo } from "@/components/shell/logo";
import { audit, hospital } from "@/data/mock";
import { bdt, cn, num } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

function A4({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("mx-auto mb-8 aspect-[210/297] w-full max-w-[794px] overflow-hidden rounded-sm border border-slate-200 bg-surface px-14 py-12 print:mb-0 print:break-after-page print:border-0", className)}>
      {children}
    </section>
  );
}

function PageFooter({ n }: { n: number }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3 text-caption text-slate-400">
      <span>Helpix Leak Audit · {hospital.name} · Confidential</span>
      <span className="tnum">Page {n} of 3</span>
    </div>
  );
}

function HBar({ label, rate, value, max }: { label: string; rate: number; value: number; max: number }) {
  return (
    <div className="grid grid-cols-[150px_1fr_110px] items-center gap-3 py-1.5 text-small">
      <span className="truncate text-slate-700">{label}</span>
      <span className="h-3 rounded-sm bg-slate-100">
        <span className="block h-3 rounded-sm bg-chart-leaked" style={{ width: `${(value / max) * 100}%` }} />
      </span>
      <span className="tnum text-right">
        <span className="font-semibold">{bdt(value)}</span> <span className="text-slate-500">· {rate}%</span>
      </span>
    </div>
  );
}

export default function AuditReport() {
  const [view, setView] = React.useState<"screen" | "a4">("a4");
  const toast = useToast();
  const maxDept = Math.max(...audit.byDept.map((d) => d.leakedValue));
  const maxTest = Math.max(...audit.byTest.map((d) => d.leakedValue));
  return (
    <AppShell
      surface="management"
      title="Leak Audit report"
      subtitle={`30-day audit · ${audit.period}`}
      actions={
        <>
          <Segmented
            size="sm"
            value={view}
            onChange={setView}
            options={[
              { value: "a4", label: "A4 print" },
              { value: "screen", label: "On-screen" },
            ]}
          />
          <Button variant="secondary" onClick={() => window.print()}>
            <Printer /> Print
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              navigator.clipboard?.writeText("https://helpix.app/r/meridian-audit-jun26");
              toast({ title: "Share link copied", body: "Link expires in 14 days · view-only", tone: "info" });
            }}
          >
            <Link2 /> Share link
          </Button>
          <Button onClick={() => toast({ title: "PDF ready", body: "Meridian_Leak_Audit_June2026.pdf (3 pages)" })}>
            <Download /> Download PDF
          </Button>
        </>
      }
      contentClassName={view === "a4" ? "bg-slate-100 max-w-none" : undefined}
    >
      <div className={cn(view === "screen" && "[&>section]:aspect-auto [&>section]:max-w-none [&>section]:rounded-lg [&>section]:px-10 [&>section]:py-8")}>
        {/* Page 1 — cover */}
        <A4 className="flex flex-col">
          <div className="flex items-center justify-between">
            <Logo />
            <span className="text-small text-slate-500">Leak Audit Report</span>
          </div>
          <div className="mt-24">
            <p className="text-small font-medium uppercase tracking-wide text-teal-700">{hospital.name} · {hospital.branch}</p>
            <p className="mt-1 text-small text-slate-500">Audit period: {audit.period} (30 days)</p>
            <h1 className="mt-6 text-display font-semibold leading-tight tracking-tight">
              Estimated <span className="text-chart-leaked">{bdt(audit.leakedValue)}</span> in prescribed tests left your hospital this month.
            </h1>
            <p className="mt-4 max-w-lg text-h3 font-normal text-slate-500">
              Only 58 of every 100 tests your doctors prescribed were done in your own lab. The rest went to other labs.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              ["Prescriptions audited", num(audit.prescriptions)],
              ["Tests prescribed", num(audit.prescribed)],
              ["Capture rate baseline", `${audit.rate}%`],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg border border-slate-200 p-4">
                <p className="text-caption text-slate-500">{l}</p>
                <p className="tnum mt-1 text-h1 font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 h-4 w-full overflow-hidden rounded-full bg-chart-leaked" aria-label="58% captured, 42% leaked">
            <div className="h-full bg-chart-captured" style={{ width: "58%" }} />
          </div>
          <div className="mt-1.5 flex justify-between text-caption text-slate-500">
            <span>Captured in-house · {num(audit.captured)} tests</span>
            <span>Leaked · {num(audit.leaked)} tests</span>
          </div>
          <div className="mt-auto pt-10">
            <PageFooter n={1} />
          </div>
        </A4>

        {/* Page 2 — methodology & leak breakdown */}
        <A4 className="flex flex-col">
          <h2 className="text-h2 font-semibold">1. Methodology</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              [Camera, "Capture", "Front desk photographed 3,480 paper prescriptions over 30 days."],
              [GitCompare, "Match", "AI extracted the test list; staff confirmed each one. Matched to lab billing by patient phone and date (±7 days)."],
              [Receipt, "Measure", "A prescribed test counts as captured if billed in your lab within 7 days."],
            ].map(([I, t, b]: any) => (
              <div key={t} className="rounded-lg border border-slate-200 p-3">
                <I className="size-4 text-teal-700" />
                <p className="mt-2 text-body font-semibold">{t}</p>
                <p className="text-small text-slate-700">{b}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-caption text-slate-500">Revenue estimated at ৳ 2,000 average test order value. Patient names were not stored in this report.</p>

          <h2 className="mt-8 text-h2 font-semibold">2. Capture rate baseline: 58%</h2>
          <p className="mt-1 text-body text-slate-700">This is the number Helpix is measured against during the pilot.</p>

          <h2 className="mt-8 text-h2 font-semibold">3. Leak by department</h2>
          <div className="mt-3">
            {audit.byDept.map((d) => (
              <HBar key={d.name} label={d.name} rate={d.rate} value={d.leakedValue} max={maxDept} />
            ))}
          </div>
          <h2 className="mt-8 text-h2 font-semibold">4. Leak by test</h2>
          <div className="mt-3">
            {audit.byTest.map((d) => (
              <HBar key={d.name} label={d.name} rate={d.rate} value={d.leakedValue} max={maxTest} />
            ))}
          </div>
          <p className="mt-2 text-caption text-slate-500">Bar = estimated value leaked · % = capture rate</p>
          <div className="mt-auto pt-6">
            <PageFooter n={2} />
          </div>
        </A4>

        {/* Page 3 — recommendations & pilot */}
        <A4 className="flex flex-col">
          <h2 className="text-h2 font-semibold">5. Recommended actions</h2>
          <ol className="mt-4 space-y-3">
            {[
              ["Send the test list to the patient's phone with your prices, at the moment of prescription.", "Biggest single lever. Removes “I'll do it later, somewhere else.”"],
              ["Offer home sample collection for Lipid Profile, HbA1c and CBC.", "23% of patients who left said another lab was closer to home."],
              ["Review the Lipid Profile price (৳ 1,200 vs. ~৳ 850 outside).", "Price was the top reason for leaving (41%)."],
              ["Let doctors review reports remotely.", "Frees chamber slots now used for 5-minute report-showing visits."],
            ].map(([t, b], i) => (
              <li key={t} className="flex gap-3">
                <span className="tnum inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-teal-700 text-caption font-semibold text-on-accent">{i + 1}</span>
                <div>
                  <p className="text-body font-medium">{t}</p>
                  <p className="text-small text-slate-500">{b}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="mt-10 text-h2 font-semibold">6. Pilot proposal</h2>
          <div className="mt-4 rounded-lg border-2 border-teal-700 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-teal-700" />
              <p className="text-h3 font-semibold">Capture guarantee</p>
            </div>
            <p className="mt-2 text-body text-slate-700">
              If your capture rate does not rise at least <span className="font-semibold">8 points above the 58% baseline</span> by the end of month 3, the monthly license is
              waived until it does.
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-200 pt-4 text-small">
              <div>
                <dt className="text-slate-500">Pilot length</dt>
                <dd className="font-semibold">90 days</dd>
              </div>
              <div>
                <dt className="text-slate-500">Scope</dt>
                <dd className="font-semibold">All OPD departments, Dhanmondi</dd>
              </div>
              <div>
                <dt className="text-slate-500">Billing</dt>
                <dd className="font-semibold">Per active doctor / month</dd>
              </div>
            </dl>
          </div>
          <ul className="mt-6 space-y-1.5 text-small text-slate-700">
            {["Setup and staff training included", "Lab system, WhatsApp and SMS integration included", "Doctor-level data stays private by default"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" /> {x}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-6">
            <PageFooter n={3} />
          </div>
        </A4>
      </div>
    </AppShell>
  );
}

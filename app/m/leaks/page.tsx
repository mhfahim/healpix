"use client";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data";
import { leakReasons, metrics, outsideLabs, priceGap } from "@/data/mock";
import { bdt, cn, num } from "@/lib/utils";
import { Stat } from "../stat";

/* Reason fills: price leads in the leak color, the rest step down the neutral ramp,
   "Not stated" keeps the hatch used for unknown or leaked volume across Helpix. */
const reasonFill = ["bg-chart-leaked", "bg-slate-500", "bg-slate-400", "bg-slate-300", "hatch bg-slate-100 text-slate-400", "bg-slate-200"];

const quotes = [
  { test: "Lipid Profile", quote: "“Northgate is ৳ 300 cheaper and near my house.”", reason: "Price" },
  { test: "Echocardiogram", quote: "“My cousin works at Riverside, report comes same evening.”", reason: "Faster report" },
  { test: "USG Whole Abdomen", quote: "“I didn't know you did home collection.”", reason: "Closer to home" },
];

export default function LeakInsights() {
  const totalUploads = outsideLabs.reduce((s, l) => s + l.uploads, 0);
  const maxUploads = Math.max(...outsideLabs.map((l) => l.uploads));
  const lead = leakReasons[0];
  return (
    <AppShell surface="management" title="Leak insights" subtitle="Where patients took their tests, and why · November 2026" management contentClassName="max-w-[1760px]">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat label="Estimated leaked tests" value={num(metrics.leaked)} delta="−2.7%" vs="vs Oct" downIsGood />
        <Stat label="Estimated value leaked" value={bdt(metrics.leaked * metrics.avgOrder)} vs="at ৳ 2,000 per order" />
        <Stat label="Outside reports uploaded" value={num(totalUploads)} vs="sent for remote review" />
        <Stat label="Reason coverage" value={`${metrics.reasonsKnownPct}%`} vs="of leaked tests have a known reason" />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        {/* Main: why patients left */}
        <Card className="col-span-12 xl:col-span-8">
          <CardHeader title="Why patients left" description="Reported when uploading an outside report or replying to a reminder" />
          <CardBody className="pb-6">
            <div className="flex items-baseline gap-3">
              <span className="tnum text-[48px] font-medium leading-none tracking-[-0.03em] text-slate-900">{lead.value}%</span>
              <span className="text-body text-slate-600">left over {lead.reason.toLowerCase()}, the largest single reason</span>
            </div>

            <div className="mt-6 flex h-10 gap-0.5 overflow-hidden rounded-[6px]" role="img" aria-label={leakReasons.map((r) => `${r.reason} ${r.value}%`).join(", ")}>
              {leakReasons.map((r, i) => (
                <div key={r.reason} className={cn("h-full", reasonFill[i])} style={{ width: `${r.value}%` }} title={`${r.reason} ${r.value}%`} />
              ))}
            </div>

            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {leakReasons.map((r, i) => (
                <li key={r.reason} className="flex h-9 items-center justify-between gap-3 border-b border-slate-200/70 text-body">
                  <span className="flex items-center gap-2.5 text-slate-700">
                    <span className={cn("size-2.5 shrink-0 rounded-[3px]", reasonFill[i])} />
                    {r.reason}
                  </span>
                  <span className={cn("tnum font-medium", i === 0 ? "text-peach-fg" : "text-slate-900")}>{r.value}%</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Side: where they went */}
        <Card className="col-span-12 xl:col-span-4">
          <CardHeader title="Top outside labs" description="By outside reports uploaded" />
          <CardBody>
            <ol className="flex flex-col gap-4">
              {outsideLabs.map((l, i) => (
                <li key={l.lab}>
                  <div className="mb-2 flex items-baseline justify-between gap-3 text-small">
                    <span className="truncate text-slate-700">{l.lab}</span>
                    <span className="tnum font-medium text-slate-900">{num(l.uploads)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-[3px] bg-slate-100">
                    <div className={cn("h-full", i === 0 ? "bg-chart-leaked" : "bg-slate-400")} style={{ width: `${(l.uploads / maxUploads) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-caption text-slate-500">Lab names as reported by patients</p>
          </CardBody>
        </Card>

        <Card className="col-span-12 overflow-hidden xl:col-span-8">
          <CardHeader
            title="Price gap"
            description="Our price vs the average reported outside, same test"
            action={
              <Button size="sm" href="/m/recovery?create=1">
                Create recovery action <ArrowRight />
              </Button>
            }
          />
          <div className="mt-3">
            <DataTable
              dense
              rows={priceGap}
              rowKey={(r) => r.test}
              defaultSort={{ key: "leak", dir: "desc" }}
              columns={[
                { key: "test", header: "Test", cell: (r) => <span className="font-medium">{r.test}</span>, sort: (r) => r.test },
                { key: "ours", header: "Our price", align: "right", cell: (r) => bdt(r.ours), sort: (r) => r.ours },
                { key: "outside", header: "Avg outside", align: "right", cell: (r) => bdt(r.outside), sort: (r) => r.outside },
                {
                  key: "gap",
                  header: "Gap",
                  align: "right",
                  cell: (r) => (
                    <span className="whitespace-nowrap">
                      <span className="font-medium text-slate-900">+{bdt(r.gap)}</span>
                      <span className="ml-1.5 inline-block w-10 text-left text-caption text-slate-500">{Math.round((r.gap / r.outside) * 100)}%</span>
                    </span>
                  ),
                  sort: (r) => r.gap,
                },
                {
                  key: "leak",
                  header: "Leak rate",
                  align: "right",
                  cell: (r) => <span className={cn("font-medium", r.leakRate >= 40 ? "text-peach-fg" : "text-slate-900")}>{r.leakRate}%</span>,
                  sort: (r) => r.leakRate,
                },
              ]}
            />
          </div>
        </Card>

        <Card className="col-span-12 xl:col-span-4">
          <CardHeader title="What patients said" description="Recent reasons in their words, translated" />
          <CardBody>
            <ul className="divide-y divide-slate-200/70">
              {quotes.map((q) => (
                <li key={q.quote} className="py-4 first:pt-0">
                  <p className="text-body text-slate-900">{q.quote}</p>
                  <p className="mt-1.5 text-caption text-slate-500">
                    {q.test} · {q.reason}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-2 border-t border-slate-200/70 pt-4 text-caption text-slate-500">
              Reasons come only from patients who chose to say. 36% of leaked tests have no reason yet.
            </p>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}

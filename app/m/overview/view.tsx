"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, TrendingDown, TrendingUp, RefreshCw, Database, FlaskConical, Stethoscope, CheckCircle2, Circle, Info } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Banner, Skeleton, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DataTable, RateBar } from "@/components/ui/data";
import { CaptureLine, RateBars, Legendary } from "@/components/ui/charts";
import { captureTrend, deptCapture, funnel, insights, metrics, topLeakingTests } from "@/data/mock";
import { tokens } from "@/lib/tokens";
import { bdt, cn, num } from "@/lib/utils";
import type { ViewState } from "@/lib/screens";

export function OverviewView({ state }: { state: ViewState }) {
  const router = useRouter();
  const loading = state === "loading";
  return (
    <AppShell surface="management" title="Overview" subtitle="November 2026 · Dhanmondi branch" management>
      {state === "offline" && (
        <Banner tone="warning" className="mb-6" title="You're offline">
          Showing figures cached at 6:02 PM. They'll refresh automatically when you reconnect.
        </Banner>
      )}
      {state === "error" && (
        <Banner
          tone="danger"
          className="mb-6"
          title="We couldn't load this month's figures"
          action={
            <Button size="sm" variant="secondary" onClick={() => router.replace("/m/overview")}>
              <RefreshCw /> Retry
            </Button>
          }
        >
          The lab system (LIS) sync failed at 6:02 PM. Captured counts may be out of date. Your Helpix contact has been notified.
        </Banner>
      )}

      {state === "empty" ? (
        <EmptyOverview />
      ) : (
        <>
          {/* Lead figure + compact stats */}
          <div className="grid grid-cols-12 gap-4">
            <CaptureLead loading={loading} className="col-span-12 lg:col-span-5 xl:col-span-4" />
            <div className="col-span-12 grid grid-cols-2 gap-4 lg:col-span-7 xl:col-span-8 xl:grid-cols-3">
              <Stat loading={loading} label="Tests prescribed" value={num(metrics.prescribed)} delta="+3.9%" vs="vs Oct" />
              <Stat loading={loading} label="Captured in-house" value={num(metrics.captured)} delta="+6.9%" vs="vs Oct" />
              <Stat loading={loading} label="Estimated leaked" value={num(metrics.leaked)} delta="−2.7%" vs="vs Oct" downIsGood />
              <Stat
                loading={loading}
                className="xl:col-span-2"
                label="Recovered revenue"
                value={bdt(metrics.recovered)}
                vs="above the 58% baseline at ৳ 2,000 per order"
              />
              <Stat loading={loading} className="col-span-2 xl:col-span-1" label="Chamber slots freed" value={num(metrics.slotsFreed)} vs="report-only visits avoided" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-6">
            <Card className="col-span-12 xl:col-span-8">
              <CardHeader
                title="Capture rate over time"
                description="Share of prescribed tests done in our lab"
                action={
                  <Legendary
                    items={[
                      { label: "Capture rate", color: tokens.chart.captured },
                      { label: "Audit baseline 58%", color: tokens.chart.baseline, dashed: true },
                    ]}
                  />
                }
              />
              <CardBody>{loading ? <Skeleton className="h-[260px] w-full" /> : state === "error" ? <ChartError /> : <CaptureLine data={captureTrend} baseline={58} />}</CardBody>
            </Card>
            <Card className="col-span-12 md:col-span-6 xl:col-span-4">
              <CardHeader title="Test journey" description="This month, all departments" />
              <CardBody>{loading ? <Skeleton className="h-[260px] w-full" /> : <Journey />}</CardBody>
            </Card>

            <Card className="col-span-12 md:col-span-6 xl:col-span-5">
              <CardHeader title="Capture rate by department" description="Lowest first, hatched share leaked" />
              <CardBody>
                {loading ? (
                  <Skeleton className="h-[280px] w-full" />
                ) : (
                  <RateBars data={deptCapture} baseline={58} onClick={(d: any) => router.push(`/m/departments/${d.id}`)} />
                )}
              </CardBody>
            </Card>

            <Card className="col-span-12 overflow-hidden xl:col-span-7">
              <CardHeader
                title="Top leaking tests"
                description="By revenue lost this month"
                action={
                  <Button size="sm" variant="ghost" href="/m/leaks">
                    Leak insights <ArrowRight />
                  </Button>
                }
              />
              <div className="mt-3">
                <DataTable
                  dense
                  loading={loading}
                  rows={topLeakingTests}
                  rowKey={(r) => r.test}
                  defaultSort={{ key: "lost", dir: "desc" }}
                  columns={[
                    { key: "test", header: "Test", cell: (r) => <span className="font-medium">{r.test}</span>, sort: (r) => r.test },
                    { key: "prescribed", header: "Prescribed", align: "right", cell: (r) => num(r.prescribed), sort: (r) => r.prescribed },
                    { key: "captured", header: "Captured", align: "right", cell: (r) => num(r.captured), sort: (r) => r.captured },
                    { key: "rate", header: "Capture", align: "right", cell: (r) => <RateBar value={r.rate} baseline={58} width={56} />, sort: (r) => r.rate },
                    { key: "lost", header: "Revenue lost", align: "right", cell: (r) => <span className="whitespace-nowrap font-medium">{bdt(r.lost)}</span>, sort: (r) => r.lost },
                  ]}
                />
              </div>
            </Card>
          </div>

          {/* Insights: one ledger card, three entries */}
          <Card className="mt-6">
            <CardHeader title="Insights this month" description="Generated from this month's data" />
            <div className="mt-4 grid border-t border-slate-200/80 md:grid-cols-3 md:divide-x md:divide-slate-200/80">
              {insights.map((i, idx) => {
                const Icon = i.tone === "leak" ? TrendingDown : i.tone === "win" ? TrendingUp : Info;
                return (
                  <div key={i.title} className={cn("flex flex-col gap-2 p-5", idx > 0 && "border-t border-slate-200/80 md:border-t-0")}>
                    {loading ? (
                      <>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <p className="flex items-start gap-2 text-body font-medium text-slate-900">
                          <Icon className={cn("mt-0.5 size-4 shrink-0", i.tone === "leak" ? "text-chart-leaked" : "text-slate-400")} strokeWidth={1.5} />
                          {i.title.replace(/\.$/, "")}
                        </p>
                        <p className="pl-6 text-small text-slate-600">{i.body}</p>
                        <Link
                          href={i.href}
                          className="mt-auto inline-flex items-center gap-1 self-start pl-6 pt-1 text-small font-medium text-teal-700 transition-colors hover:text-teal-800"
                        >
                          {i.cta} <ArrowRight className="size-3.5" />
                        </Link>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
          <p className="mt-3 text-caption text-slate-500">
            Recovered revenue = (capture rate − 58% baseline) × tests prescribed × ৳ 2,000 average order
          </p>
        </>
      )}
    </AppShell>
  );
}

/* Lead: capture rate against the audit baseline ------------------------ */
function CaptureLead({ loading, className }: { loading?: boolean; className?: string }) {
  const rate = metrics.captureRate;
  const base = metrics.baselineRate;
  if (loading) {
    return (
      <Card className={cn("p-6", className)}>
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-4 h-12 w-24" />
        <Skeleton className="mt-8 h-3 w-full" />
      </Card>
    );
  }
  return (
    <Card className={cn("flex flex-col p-6", className)}>
      <p className="text-small text-slate-600">Test capture rate</p>
      <div className="mt-3 flex items-baseline gap-3">
        <span className="tnum text-[48px] font-medium leading-none tracking-[-0.03em] text-slate-900">{rate}%</span>
        <span className="tnum text-small text-slate-500">
          <span className="font-medium text-success-fg">+{rate - base} pts</span> vs audit baseline
        </span>
      </div>
      <p className="mt-2 text-small text-slate-500">
        {num(metrics.captured)} of {num(metrics.prescribed)} prescribed tests done in our lab
      </p>

      <div className="mt-auto pt-8">
        <div className="relative h-3 overflow-hidden rounded-[4px] bg-chart-leaked/[0.06] text-chart-leaked/40 hatch" role="img" aria-label={`Capture rate ${rate}%, audit baseline ${base}%`}>
          <div className="absolute inset-y-0 left-0 bg-chart-captured" style={{ width: `${rate}%` }} />
        </div>
        <div className="relative mt-2 h-4 text-caption text-slate-500">
          <span className="tnum absolute left-0">0</span>
          <span className="tnum absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${base}%` }}>
            <span className="absolute -top-[22px] left-1/2 h-[18px] w-px -translate-x-1/2 border-l border-dashed border-slate-900/50" />
            Audit {base}%
          </span>
          <span className="tnum absolute right-0">100</span>
        </div>
      </div>
    </Card>
  );
}

/* Compact stat: label, figure, change with its reference ---------------- */
function Stat({
  label,
  value,
  delta,
  vs,
  downIsGood,
  loading,
  className,
}: {
  label: string;
  value: React.ReactNode;
  delta?: string;
  vs?: string;
  downIsGood?: boolean;
  loading?: boolean;
  className?: string;
}) {
  if (loading) {
    return (
      <Card className={cn("p-5", className)}>
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-7 w-28" />
        <Skeleton className="mt-3 h-3 w-32" />
      </Card>
    );
  }
  const negative = delta?.startsWith("−") || delta?.startsWith("-");
  const good = delta ? (downIsGood ? negative : !negative) : null;
  return (
    <Card className={cn("flex min-w-0 flex-col p-5", className)}>
      <p className="truncate text-small text-slate-600">{label}</p>
      <p className="tnum mt-2 whitespace-nowrap text-[28px] font-medium leading-8 tracking-[-0.02em] text-slate-900">{value}</p>
      {(delta || vs) && (
        <p className="tnum mt-2 text-caption text-slate-500">
          {delta && <span className={cn("mr-1 font-medium", good ? "text-success-fg" : "text-danger-fg")}>{delta}</span>}
          {vs}
        </p>
      )}
    </Card>
  );
}

/* Journey: one teal, hatched drop-off, only the largest drop called out -- */
function Journey() {
  const top = funnel[0].value;
  const drops = funnel.map((d, i) => (i ? Math.round(((funnel[i - 1].value - d.value) / funnel[i - 1].value) * 100) : 0));
  const worst = drops.indexOf(Math.max(...drops));
  return (
    <ol className="flex flex-col gap-4">
      {funnel.map((d, i) => {
        const pct = (d.value / top) * 100;
        return (
          <li key={d.stage}>
            <div className="mb-2 flex items-baseline justify-between gap-3 text-small">
              <span className="text-slate-700">{d.stage}</span>
              <span className="tnum">
                <span className="font-medium text-slate-900">{num(d.value)}</span>
                <span className="ml-2 inline-block w-9 text-right text-slate-500">{Math.round(pct)}%</span>
              </span>
            </div>
            <div className="hatch relative h-2 overflow-hidden rounded-[4px] bg-slate-100 text-slate-300">
              <div className="absolute inset-y-0 left-0 bg-chart-captured" style={{ width: `${pct}%` }} />
            </div>
            {i > 0 && drops[i] > 0 && (
              <p className={cn("tnum mt-1 text-caption", i === worst ? "text-chart-leaked" : "text-slate-500")}>
                −{drops[i]}% from {funnel[i - 1].stage.toLowerCase()}
                {i === worst && " · largest drop"}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ChartError() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 text-center">
      <Database className="size-6 text-slate-400" strokeWidth={1.5} />
      <p className="mt-2 text-body font-medium">Chart unavailable</p>
      <p className="text-small text-slate-500">Waiting for lab system data</p>
    </div>
  );
}

function EmptyOverview() {
  const steps = [
    { label: "Hospital, departments and doctors set up", done: true, icon: CheckCircle2 },
    { label: "Lab price list uploaded (148 tests)", done: true, icon: FlaskConical },
    { label: "Lab system (LIS) connected", done: true, icon: Database },
    { label: "First digital prescriptions signed by doctors", done: false, icon: Stethoscope },
    { label: "First test bookings captured", done: false, icon: Circle },
  ];
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {["Test capture rate", "Tests prescribed", "Captured in-house", "Estimated leaked", "Recovered revenue", "Chamber slots freed"].map((l) => (
          <Stat key={l} label={l} value={<span className="text-slate-300">—</span>} vs="No data yet" />
        ))}
      </div>
      <Card className="col-span-12 xl:col-span-8">
        <EmptyState
          icon={TrendingUp}
          title="Your dashboard fills in as prescriptions flow"
          body="Once doctors sign their first prescriptions in Helpix, you'll see how many tests are captured in-house and where the rest go. Most hospitals see a full picture within 3 days."
          action={
            <>
              <Button href="/m/overview">Preview with sample month</Button>
              <Button variant="secondary" href="/m/adoption">
                Invite doctors
              </Button>
            </>
          }
        />
      </Card>
      <Card className="col-span-12 xl:col-span-4">
        <CardHeader title="Go-live checklist" description="3 of 5 complete" />
        <CardBody>
          <ul className="space-y-3">
            {steps.map((s) => (
              <li key={s.label} className="flex items-start gap-2.5 text-body">
                {s.done ? <CheckCircle2 className="mt-0.5 size-4 text-success" /> : <Circle className="mt-0.5 size-4 text-slate-300" />}
                <span className={s.done ? "text-slate-500 line-through decoration-slate-300" : "text-slate-900"}>{s.label}</span>
              </li>
            ))}
          </ul>
          <Badge tone="info" className="mt-4">
            Baseline 58% from your Leak Audit is ready
          </Badge>
        </CardBody>
      </Card>
    </div>
  );
}

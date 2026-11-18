"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lightbulb, TrendingDown, TrendingUp, RefreshCw, Database, FlaskConical, Stethoscope, CheckCircle2, Circle, Info } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Banner, Skeleton, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { KpiCard, DataTable, RateBar } from "@/components/ui/data";
import { CaptureLine, RateBars, Funnel, Legendary } from "@/components/ui/charts";
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
          {/* KPI row */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            <KpiCard loading={loading} label="Test capture rate" value={`${metrics.captureRate}%`} delta="+13 pts" sub={`vs. ${metrics.baselineRate}% baseline`} spark={metrics.spark.captureRate} />
            <KpiCard loading={loading} label="Tests prescribed" value={num(metrics.prescribed)} delta="+3.9%" sub="vs. Oct" spark={metrics.spark.prescribed} sparkColor={tokens.slate[500]} />
            <KpiCard loading={loading} label="Captured in-house" value={num(metrics.captured)} delta="+6.9%" sub="vs. Oct" spark={metrics.spark.captured} />
            <KpiCard
              loading={loading}
              label="Estimated leaked"
              value={num(metrics.leaked)}
              delta="-2.7%"
              deltaTone="down-good"
              sub="vs. Oct"
              spark={metrics.spark.leaked}
              sparkColor={tokens.chart.leaked}
            />
            <KpiCard loading={loading} label="Recovered revenue" value={<span className="text-h1">{bdt(metrics.recovered)}</span>} sub="vs. 58% baseline · ৳ 2,000 avg order" />
            <KpiCard loading={loading} label="Chamber slots freed" value={num(metrics.slotsFreed)} sub="report-only visits avoided" spark={metrics.spark.slotsFreed} sparkColor={tokens.chart.secondary} />
          </div>

          <div className="mt-6 grid grid-cols-12 gap-6">
            <Card className="col-span-12 xl:col-span-8">
              <CardHeader
                title="Capture rate over time"
                description="Share of prescribed tests done in our lab. Baseline from the June Leak Audit."
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
              <CardHeader title="Test journey funnel" description="This month, all departments" />
              <CardBody>{loading ? <Skeleton className="h-[260px] w-full" /> : <Funnel data={funnel} />}</CardBody>
            </Card>

            <Card className="col-span-12 md:col-span-6 xl:col-span-5">
              <CardHeader title="Capture rate by department" description="Lowest first · click a bar to open the department" />
              <CardBody>
                {loading ? (
                  <Skeleton className="h-[280px] w-full" />
                ) : (
                  <RateBars data={deptCapture} baseline={58} onClick={(d: any) => router.push(`/m/departments/${d.id}`)} />
                )}
              </CardBody>
            </Card>

            <Card className="col-span-12 overflow-hidden xl:col-span-7">
              <CardHeader title="Top leaking tests" description="Sorted by estimated revenue lost this month" action={<Button size="sm" variant="ghost" href="/m/leaks">Leak insights <ArrowRight /></Button>} />
              <div className="mt-3">
                <DataTable
                  loading={loading}
                  rows={topLeakingTests}
                  rowKey={(r) => r.test}
                  defaultSort={{ key: "lost", dir: "desc" }}
                  columns={[
                    { key: "test", header: "Test", cell: (r) => <span className="font-medium">{r.test}</span>, sort: (r) => r.test },
                    { key: "prescribed", header: "Prescribed", align: "right", cell: (r) => num(r.prescribed), sort: (r) => r.prescribed },
                    { key: "captured", header: "Captured", align: "right", cell: (r) => num(r.captured), sort: (r) => r.captured },
                    { key: "rate", header: "Capture rate", align: "right", cell: (r) => <RateBar value={r.rate} baseline={58} />, sort: (r) => r.rate },
                    { key: "lost", header: "Est. revenue lost", align: "right", cell: (r) => <span className="font-medium">{bdt(r.lost)}</span>, sort: (r) => r.lost },
                  ]}
                />
              </div>
            </Card>
          </div>

          {/* Insights */}
          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 text-h3 font-semibold">
              <Lightbulb className="size-4 text-slate-500" strokeWidth={1.5} /> Insights this month
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {insights.map((i) => {
                const Icon = i.tone === "leak" ? TrendingDown : i.tone === "win" ? TrendingUp : Info;
                return (
                  <Card key={i.title} className="flex flex-col p-4">
                    {loading ? (
                      <>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="mt-2 h-10 w-full" />
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-3">
                          <span
                            className={cn(
                              "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
                              i.tone === "leak" && "bg-danger-bg text-danger-fg",
                              i.tone === "win" && "bg-success-bg text-success-fg",
                              i.tone === "info" && "bg-info-bg text-info-fg"
                            )}
                          >
                            <Icon className="size-4" />
                          </span>
                          <div>
                            <p className="text-body font-semibold">{i.title}</p>
                            <p className="mt-0.5 text-small text-slate-700">{i.body}</p>
                          </div>
                        </div>
                        <Link href={i.href} className="mt-3 inline-flex items-center gap-1 self-end text-small font-medium text-teal-700 hover:underline">
                          {i.cta} <ArrowRight className="size-3.5" />
                        </Link>
                      </>
                    )}
                  </Card>
                );
              })}
            </div>
            <p className="mt-3 text-caption text-slate-500">
              Insights are generated automatically from this month's data. Recovered revenue = (capture rate − 58% baseline) × tests prescribed × ৳ 2,000 average order.
            </p>
          </div>
        </>
      )}
    </AppShell>
  );
}

function ChartError() {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 text-center">
      <Database className="size-6 text-slate-400" strokeWidth={1.5} />
      <p className="mt-2 text-body font-medium">Chart unavailable</p>
      <p className="text-small text-slate-500">Waiting for lab system data.</p>
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
          <KpiCard key={l} label={l} value={<span className="text-slate-300">—</span>} sub="No data yet" />
        ))}
      </div>
      <Card className="col-span-12 xl:col-span-8">
        <EmptyState
          icon={TrendingUp}
          title="Your dashboard fills in as prescriptions flow"
          body="Once doctors sign their first prescriptions in Helpix, you'll see how many tests are captured in-house and where the rest go. Most hospitals see a full picture within 3 days."
          action={
            <>
              <Button href="/m/overview">
                Preview with sample month
              </Button>
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
          <Badge tone="info" className="mt-4">Baseline 58% from your Leak Audit is ready</Badge>
        </CardBody>
      </Card>
    </div>
  );
}

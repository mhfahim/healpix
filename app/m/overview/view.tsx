"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, RefreshCw, Database, Stethoscope, CheckCircle2, Circle, TrendingUp, CalendarRange, BadgePercent, Home, Activity, Plus } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Banner, Skeleton, EmptyState, StatusDot } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { KpiCard, DataTable, RateBar, HeroCard, HeroTile, Heatmap, GradientLegend, RiskSlider, TickGauge, BarStrip, CompareBars, StepsList } from "@/components/ui/data";
import { CaptureLine, RateBars, Funnel, Legendary } from "@/components/ui/charts";
import {
  captureTrend,
  deptCapture,
  funnel,
  metrics,
  topLeakingTests,
  heatCols,
  heatRows,
  heatLeak,
  sessionCaptured,
  sessionRecovered,
  monthLabels,
  nextSteps,
} from "@/data/mock";
import { tokens } from "@/lib/tokens";
import { bdt, num } from "@/lib/utils";
import type { ViewState } from "@/lib/screens";

const stepIcons = { BadgePercent, Home, Stethoscope, Activity } as Record<string, typeof Home>;

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
          {/* Hero row: dark feature cards */}
          <div className="grid grid-cols-12 gap-5">
            <HeroCard
              className="col-span-12 xl:col-span-7"
              title="Leak map"
              action={<span className="text-caption text-white/50">Share of prescribed tests done outside · hover a cell</span>}
            >
              {loading ? (
                <div className="h-[300px] animate-pulse rounded-lg bg-white/5" />
              ) : (
                <div className="flex gap-6">
                  <div className="min-w-0 flex-1">
                    <Heatmap rows={heatRows} cols={heatCols} values={heatLeak.map((r) => r.map((v) => v / 0.62))} onDark format={(v) => `${Math.round(v * 62)}%`} />
                  </div>
                  <GradientLegend labels={["60%", "30%", "5%"]} height={300} onDark />
                </div>
              )}
            </HeroCard>

            <HeroCard
              className="col-span-12 flex flex-col xl:col-span-5"
              title="Capture insights"
              action={
                <span className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-caption text-white/80 ring-1 ring-inset ring-white/15">
                  <CalendarRange className="size-3.5" /> 1 – 19 Nov 2026
                </span>
              }
            >
              <div className="grid grid-cols-2 gap-3">
                <HeroTile>
                  <p className="text-body text-white">Leak risk · Cardiology</p>
                  <p className="mt-1 text-caption text-white/55">Price drives 52% of exits. Lipid Profile leaks most.</p>
                  <p className="tnum mt-4 text-h1 font-normal">41%</p>
                  <RiskSlider value={41} className="mt-2" label="Cardiology leak risk" />
                </HeroTile>
                <HeroTile>
                  <p className="text-body text-white">Recovery momentum</p>
                  <p className="mt-1 text-caption text-white/55">13 pts above the June audit baseline of 58%.</p>
                  <p className="tnum mt-4 text-h1 font-normal">+13</p>
                  <RiskSlider value={78} good className="mt-2" label="Recovery momentum" />
                </HeroTile>
              </div>
              <div className="mt-auto pt-6">
                <TickGauge value={metrics.captureRate} max={100} size={300} onDark>
                  <span className="tnum text-display font-normal text-white">{metrics.captureRate}%</span>
                  <span className="text-caption text-white/55">Test capture rate</span>
                </TickGauge>
              </div>
            </HeroCard>
          </div>

          {/* Metric cards */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard loading={loading} label="Test capture rate" value={metrics.captureRate} unit="%" delta="+13 pts" sub="vs. 58% audit baseline" spark={metrics.spark.captureRate} sparkLabels={monthLabels} sparkVar="chart-captured" format={(v) => `${v}%`} />
            <KpiCard loading={loading} label="Tests prescribed" value={num(metrics.prescribed)} delta="+3.9%" sub="vs. October" spark={metrics.spark.prescribed} sparkLabels={monthLabels} sparkVar="g-green" format={num} />
            <KpiCard loading={loading} label="Captured in-house" value={num(metrics.captured)} status={{ label: "Normal", tone: "green" }} sub="Per session, 1–19 Nov">
              <BarStrip data={sessionCaptured} colorVar="chart-captured" height={44} range={[0, sessionCaptured.length - 1]} labels={["1 Nov", "19 Nov"]} />
            </KpiCard>
            <KpiCard loading={loading} label="Estimated leaked" value={num(metrics.leaked)} status={{ label: "Moderate", tone: "orange" }} sub="Share of prescribed tests done outside">
              <CompareBars
                rows={[
                  { label: "Audit baseline", value: 42, display: "42%" },
                  { label: "This month", value: 29, display: "29%", strong: true },
                ]}
                max={60}
              />
            </KpiCard>
            <KpiCard loading={loading} label="Recovered revenue" value={bdt(metrics.recovered)} delta="vs. baseline" deltaTone="neutral" sub="Per session, 1–19 Nov">
              <BarStrip data={sessionRecovered} colorVar="g-green" height={44} range={[0, sessionRecovered.length - 1]} labels={["1 Nov", "19 Nov"]} />
            </KpiCard>
            <KpiCard loading={loading} label="Chamber slots freed" value={num(metrics.slotsFreed)} status={{ label: "Normal", tone: "green" }} sub="Report-only visits avoided" spark={metrics.spark.slotsFreed} sparkLabels={monthLabels} sparkVar="chart-secondary" format={num} />
          </div>

          <div className="mt-5 grid grid-cols-12 gap-5">
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
              <CardHeader title="Test journey" description="This month, all departments" />
              <CardBody>{loading ? <Skeleton className="h-[260px] w-full" /> : <Funnel data={funnel} />}</CardBody>
            </Card>

            <Card className="col-span-12 md:col-span-6 xl:col-span-5">
              <CardHeader title="Capture by department" description="Lowest first · dashed line = 58% baseline · click to open" />
              <CardBody>
                {loading ? <Skeleton className="h-[280px] w-full" /> : <RateBars data={deptCapture} baseline={58} onClick={(d: any) => router.push(`/m/departments/${d.id}`)} />}
              </CardBody>
            </Card>

            <Card className="col-span-12 overflow-hidden xl:col-span-7">
              <CardHeader title="Top leaking tests" description="Sorted by estimated revenue lost this month" action={<Button size="sm" variant="secondary" href="/m/leaks">Leak insights <ArrowRight /></Button>} />
              <div className="mt-3">
                <DataTable
                  loading={loading}
                  rows={topLeakingTests}
                  rowKey={(r) => r.test}
                  defaultSort={{ key: "lost", dir: "desc" }}
                  columns={[
                    { key: "test", header: "Test", cell: (r) => <span className="text-slate-900">{r.test}</span>, sort: (r) => r.test },
                    { key: "prescribed", header: "Prescribed", align: "right", cell: (r) => num(r.prescribed), sort: (r) => r.prescribed },
                    { key: "captured", header: "Captured", align: "right", cell: (r) => num(r.captured), sort: (r) => r.captured },
                    { key: "rate", header: "Capture rate", align: "right", cell: (r) => <RateBar value={r.rate} baseline={58} />, sort: (r) => r.rate },
                    { key: "lost", header: "Est. revenue lost", align: "right", cell: (r) => <span className="text-slate-900">{bdt(r.lost)}</span>, sort: (r) => r.lost },
                  ]}
                />
              </div>
            </Card>

            <Card className="col-span-12">
              <CardHeader
                title="Suggested next steps"
                description="Generated from this month's leak data"
                action={
                  <Button size="sm" variant="secondary" href="/m/recovery?create=1">
                    Create action <Plus />
                  </Button>
                }
              />
              <CardBody className="pt-6">
                {loading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <div className="grid gap-x-10 lg:grid-cols-2">
                    <StepsList steps={nextSteps.slice(0, 2).map((s) => ({ ...s, icon: stepIcons[s.icon] }))} />
                    <StepsList steps={nextSteps.slice(2).map((s) => ({ ...s, icon: stepIcons[s.icon] }))} />
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
          <p className="mt-4 text-caption text-slate-500">Recovered revenue = (capture rate − 58% baseline) × tests prescribed × ৳ 2,000 average order.</p>
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
    { label: "Hospital, departments and doctors set up", done: true },
    { label: "Lab price list uploaded (148 tests)", done: true },
    { label: "Lab system (LIS) connected", done: true },
    { label: "First digital prescriptions signed by doctors", done: false },
    { label: "First test bookings captured", done: false },
  ];
  return (
    <div className="grid grid-cols-12 gap-5">
      <div className="col-span-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {["Test capture rate", "Tests prescribed", "Captured in-house"].map((l) => (
          <KpiCard key={l} label={l} value={<span className="text-slate-300">—</span>} status={{ label: "No data yet", tone: "neutral" }} />
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
                {s.done ? <CheckCircle2 className="mt-0.5 size-4 text-[rgb(var(--g-green))]" /> : <Circle className="mt-0.5 size-4 text-slate-300" />}
                <span className={s.done ? "text-slate-500 line-through decoration-slate-300" : "text-slate-900"}>{s.label}</span>
              </li>
            ))}
          </ul>
          <StatusDot tone="teal" className="mt-4">
            Baseline 58% from your Leak Audit is ready
          </StatusDot>
        </CardBody>
      </Card>
    </div>
  );
}


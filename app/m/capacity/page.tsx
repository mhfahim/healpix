"use client";
import { CalendarCheck as KCalendarCheck, CalendarX2 as KCalendarX2, Timer as KTimer, UserPlus as KUserPlus } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge } from "@/components/ui/primitives";
import { KpiCard, DataTable, DotMatrix } from "@/components/ui/data";
import { TwoSeriesBars, Legendary } from "@/components/ui/charts";
import { captureTrend, metrics } from "@/data/mock";
import { tokens } from "@/lib/tokens";
import { num } from "@/lib/utils";

const byDoctorDept = [
  { dept: "Medicine", avoided: 420, turnaround: 4.6, reviews: 1380 },
  { dept: "Endocrinology", avoided: 230, turnaround: 4.1, reviews: 710 },
  { dept: "Cardiology", avoided: 190, turnaround: 6.8, reviews: 640 },
  { dept: "Gynecology & Obstetrics", avoided: 150, turnaround: 5.5, reviews: 520 },
  { dept: "Gastroenterology", avoided: 70, turnaround: 5.9, reviews: 290 },
  { dept: "Orthopedics", avoided: 50, turnaround: 7.2, reviews: 240 },
  { dept: "Pediatrics", avoided: 30, turnaround: 3.8, reviews: 180 },
];

export default function Capacity() {
  return (
    <AppShell surface="management" title="Capacity and follow-up" subtitle="Chamber time freed by remote report review · November 2026" management>
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard icon={KCalendarX2} tone="teal" label="Report-only visits avoided" value={num(metrics.reportVisitsAvoided)} delta="+13%" sub="vs. Oct" spark={metrics.spark.slotsFreed} />
        <KpiCard icon={KCalendarCheck} tone="iris" label="Chamber slots freed" value={num(metrics.slotsFreed)} sub="≈ 190 chamber hours" spark={metrics.spark.slotsFreed} sparkColor={tokens.chart.secondary} />
        <KpiCard icon={KTimer} tone="sky" label="Median remote review turnaround" value={`${metrics.medianTurnaroundH} h`} delta="-0.8 h" deltaTone="down-good" sub="report ready → doctor response" />
        <KpiCard icon={KUserPlus} tone="mint" label="New patients seen in freed slots" value={num(metrics.newPatientsInFreedSlots)} sub="68% of freed slots re-used" />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8 lg:row-span-2">
          <CardHeader
            title="In-person follow-ups vs. remote reviews"
            description="Report follow-ups per month"
            action={
              <Legendary
                items={[
                  { label: "In-person report visits", color: tokens.slate[400], hatched: true },
                  { label: "Remote reviews", color: tokens.chart.captured },
                ]}
              />
            }
          />
          <CardBody>
            <TwoSeriesBars
              data={captureTrend}
              a={{ key: "inPerson", name: "In-person report visits", color: tokens.slate[300] }}
              b={{ key: "remote", name: "Remote reviews", color: tokens.chart.captured }}
              height={280}
            />
          </CardBody>
        </Card>
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader title="Remote reviews by weekday" description="This month · each dot ≈ 120 reviews" />
          <CardBody className="flex justify-center pb-6 pt-10">
            <DotMatrix data={[640, 690, 520, 810, 700, 600, 0].slice(0, 6)} labels={["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"]} rows={7} peakLabel="Peak: Tue" />
          </CardBody>
        </Card>
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader title="Turnaround distribution" description="Report ready → doctor response" />
          <CardBody className="space-y-3">
            {[
              ["Under 2 h", 22],
              ["2 – 6 h", 41],
              ["6 – 12 h", 24],
              ["12 – 24 h", 9],
              ["Over 24 h", 4],
            ].map(([l, v]) => (
              <div key={l as string}>
                <div className="mb-1 flex justify-between text-small">
                  <span className="text-slate-700">{l}</span>
                  <span className="tnum font-medium">{v}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full" style={{ width: `${(v as number) * 2}%`, background: (l as string).startsWith("Over") ? tokens.warning : tokens.chart.captured }} />
                </div>
              </div>
            ))}
            <p className="pt-1 text-caption text-slate-500">Target: 90% within 12 hours. Currently 87%.</p>
          </CardBody>
        </Card>
        <Card className="col-span-12 overflow-hidden">
          <CardHeader title="By department" />
          <div className="mt-3">
            <DataTable
              rows={byDoctorDept}
              rowKey={(r) => r.dept}
              defaultSort={{ key: "avoided", dir: "desc" }}
              columns={[
                { key: "dept", header: "Department", cell: (r) => <span className="font-medium">{r.dept}</span>, sort: (r) => r.dept },
                { key: "reviews", header: "Remote reviews", align: "right", cell: (r) => num(r.reviews), sort: (r) => r.reviews },
                { key: "avoided", header: "Visits avoided", align: "right", cell: (r) => num(r.avoided), sort: (r) => r.avoided },
                {
                  key: "t",
                  header: "Median turnaround",
                  align: "right",
                  cell: (r) => <Badge tone={r.turnaround > 6.5 ? "warning" : "neutral"}>{r.turnaround} h</Badge>,
                  sort: (r) => r.turnaround,
                },
              ]}
            />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

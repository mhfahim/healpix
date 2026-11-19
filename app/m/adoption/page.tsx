"use client";
import { FileSignature as KFileSignature, Inbox as KInbox, Sparkles as KSparkles } from "lucide-react";
import * as React from "react";
import { CalendarPlus, Lock } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, Badge, Avatar, initialsOf } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { KpiCard, DataTable, Progress, TickMeter } from "@/components/ui/data";
import { adoptionByDept, inactiveDoctors, metrics } from "@/data/mock";
import { num } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function Adoption() {
  const toast = useToast();
  const [scheduled, setScheduled] = React.useState<string[]>([]);
  return (
    <AppShell surface="management" title="Doctor adoption" subtitle="How doctors are using Helpix · November 2026" management>
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-5">
          <p className="text-small font-medium text-slate-600">Active doctors</p>
          <p className="tnum mt-1 text-kpi font-semibold">
            {metrics.activeDoctors} <span className="text-h2 font-normal text-slate-500">of {metrics.totalDoctors}</span>
          </p>
          <TickMeter value={metrics.activeDoctors} max={metrics.totalDoctors} ticks={metrics.totalDoctors} height={24} className="mt-3" label="Active doctors" />
          <p className="mt-1.5 text-caption text-slate-500">Active = signed a digital prescription in the last 7 days</p>
        </Card>
        <KpiCard icon={KFileSignature} tone="teal" label="Digital prescriptions" value={`${metrics.digitalRxPct}%`} delta="+9 pts" sub="of all OPD prescriptions" />
        <KpiCard icon={KSparkles} tone="ai" label="AI draft acceptance rate" value={`${metrics.aiAcceptance}%`} sub="accepted as-is or with small edits" />
        <KpiCard icon={KInbox} tone="sky" label="Remote reviews completed" value={num(metrics.remoteReviews)} delta="+12%" sub="vs. Oct" />
      </div>

      <Card className="mt-6 overflow-hidden">
        <CardHeader
          title="Adoption by department"
          description="Department level by default. Individual doctor metrics are not shown here."
          action={
            <Badge tone="neutral" icon={Lock}>
              Doctor-level data needs admin permission
            </Badge>
          }
        />
        <div className="mt-3">
          <DataTable
            rows={adoptionByDept}
            rowKey={(r) => r.dept}
            defaultSort={{ key: "adopt", dir: "desc" }}
            columns={[
              { key: "dept", header: "Department", cell: (r) => <span className="font-medium">{r.dept}</span>, sort: (r) => r.dept },
              {
                key: "adopt",
                header: "Adoption",
                cell: (r) => {
                  const p = Math.round((r.active / r.doctors) * 100);
                  return (
                    <span className="flex items-center gap-3">
                      <Progress value={p} className="w-32" tone={p < 80 ? "warning" : "teal"} label={`${r.dept} adoption`} />
                      <span className="tnum w-10 font-medium">{p}%</span>
                    </span>
                  );
                },
                sort: (r) => r.active / r.doctors,
              },
              { key: "active", header: "Active doctors", align: "right", cell: (r) => `${r.active} / ${r.doctors}`, sort: (r) => r.active },
              { key: "rx", header: "Digital Rx", align: "right", cell: (r) => `${r.digitalRx}%`, sort: (r) => r.digitalRx },
              { key: "ai", header: "AI acceptance", align: "right", cell: (r) => `${r.ai}%`, sort: (r) => r.ai },
              { key: "p", header: "Prescriptions", align: "right", cell: (r) => num(r.prescriptions), sort: (r) => r.prescriptions },
            ]}
          />
        </div>
      </Card>

      <Card className="mt-6 overflow-hidden">
        <CardHeader title="Onboarding status" description="6 doctors not yet active · onboarding is managed by the hospital admin" />
        <div className="mt-3">
          <DataTable
            rows={inactiveDoctors}
            rowKey={(r) => r.name}
            columns={[
              {
                key: "name",
                header: "Doctor",
                cell: (r) => (
                  <span className="flex items-center gap-2.5">
                    <Avatar initials={initialsOf(r.name)} size="sm" />
                    <span className="font-medium">{r.name}</span>
                  </span>
                ),
                sort: (r) => r.name,
              },
              { key: "dept", header: "Department", cell: (r) => r.dept, sort: (r) => r.dept },
              {
                key: "status",
                header: "Status",
                cell: (r) => (
                  <Badge tone={r.status === "Not started" ? "neutral" : r.status === "Invited" ? "info" : r.status.startsWith("Trained") ? "warning" : "teal"}>
                    {scheduled.includes(r.name) ? "Training scheduled" : r.status}
                  </Badge>
                ),
              },
              { key: "date", header: "Last update", cell: (r) => <span className="text-slate-500">{r.date}</span> },
              {
                key: "act",
                header: "",
                align: "right",
                cell: (r) =>
                  r.status === "Training scheduled" || scheduled.includes(r.name) ? (
                    <span className="text-small text-slate-500">24 Nov, 2:00 PM</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setScheduled((s) => [...s, r.name]);
                        toast({ title: "Training scheduled", body: `${r.name} · 24 Nov, 2:00 PM · 30 min` });
                      }}
                    >
                      <CalendarPlus /> Schedule training
                    </Button>
                  ),
              },
            ]}
          />
        </div>
      </Card>
    </AppShell>
  );
}

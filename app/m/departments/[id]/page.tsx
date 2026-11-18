"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Lock, Send } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Banner } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/controls";
import { DataTable, KpiCard, RateBar } from "@/components/ui/data";
import { CaptureLine, RateBars, Legendary } from "@/components/ui/charts";
import { captureTrend, cardiologyTests, deptCapture } from "@/data/mock";
import { tokens } from "@/lib/tokens";
import { bdt, num } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function DepartmentDetail({ params }: { params: { id: string } }) {
  const dept = deptCapture.find((d) => d.id === params.id) ?? deptCapture[0];
  const [ask, setAsk] = React.useState(false);
  const [requested, setRequested] = React.useState(false);
  const toast = useToast();
  const leaked = dept.prescribed - dept.captured;
  const trend = captureTrend.map((m, i) => ({ ...m, rate: dept.trend[i] }));
  const testRows = dept.id === "cardiology" ? cardiologyTests : cardiologyTests.map((t) => ({ ...t, rate: Math.min(95, t.rate + (dept.rate - 59)) }));

  return (
    <AppShell
      surface="management"
      title={
        <span className="flex items-center gap-2">
          <Link href="/m/overview" className="font-normal text-slate-500 hover:text-slate-900">
            Departments
          </Link>
          <span className="text-slate-300">/</span>
          <span className="inline-flex items-center gap-1">
            {dept.name} <ChevronDown className="size-4 text-slate-400" />
          </span>
        </span>
      }
      subtitle="Department head: Dr. Tanvir Ahmed · 8 doctors"
      management
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard label="Capture rate" value={`${dept.rate}%`} delta={`+${dept.rate - dept.baseline} pts`} sub={`vs. ${dept.baseline}% dept. baseline`} spark={dept.trend} />
        <KpiCard label="Tests prescribed" value={num(dept.prescribed)} />
        <KpiCard label="Captured in-house" value={num(dept.captured)} />
        <KpiCard label="Estimated leaked" value={num(leaked)} sparkColor={tokens.chart.leaked} />
        <KpiCard label="Est. value leaked" value={bdt(leaked * 2000)} sub="at ৳ 2,000 avg order" />
      </div>

      {dept.id === "cardiology" && (
        <Banner tone="warning" className="mt-6" title="Lowest capture rate in the hospital" action={<Button size="sm" variant="secondary" href="/m/leaks">See why patients left <ArrowRight /></Button>}>
          Lipid Profile is the biggest gap: 48% captured. 52% of Cardiology patients who left cited price.
        </Banner>
      )}

      <div className="mt-6 grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader title="Capture rate by test" description="Lowest first" />
          <CardBody>
            <RateBars data={[...testRows].sort((a, b) => a.rate - b.rate).map((t) => ({ name: t.test, rate: t.rate }))} height={240} baseline={dept.baseline} />
          </CardBody>
        </Card>
        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            title="Trend"
            description="Monthly capture rate"
            action={<Legendary items={[{ label: dept.name, color: tokens.chart.captured }, { label: "Hospital baseline", color: tokens.chart.baseline, dashed: true }]} />}
          />
          <CardBody>
            <CaptureLine data={trend} baseline={58} height={240} />
          </CardBody>
        </Card>

        <Card className="col-span-12 overflow-hidden lg:col-span-7">
          <CardHeader title="Tests in this department" />
          <div className="mt-3">
            <DataTable
              rows={testRows}
              rowKey={(r) => r.test}
              defaultSort={{ key: "rate", dir: "asc" }}
              columns={[
                { key: "test", header: "Test", cell: (r) => <span className="font-medium">{r.test}</span>, sort: (r) => r.test },
                { key: "p", header: "Prescribed", align: "right", cell: (r) => num(r.prescribed), sort: (r) => r.prescribed },
                { key: "c", header: "Captured", align: "right", cell: (r) => num(r.captured), sort: (r) => r.captured },
                { key: "rate", header: "Capture rate", align: "right", cell: (r) => <RateBar value={r.rate} baseline={58} />, sort: (r) => r.rate },
              ]}
            />
          </div>
        </Card>

        {/* Locked doctor-level panel */}
        <Card className="col-span-12 lg:col-span-5">
          <CardHeader title="Doctor-level breakdown" description="Capture rate per prescribing doctor" />
          <CardBody>
            <div className="relative overflow-hidden rounded-lg border border-slate-200">
              <div className="pointer-events-none select-none space-y-3 p-4 blur-[6px]" aria-hidden>
                {[64, 58, 71, 49, 62].map((v, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="h-3 w-28 rounded bg-slate-200" />
                    <span className="h-2 flex-1 rounded-full bg-slate-100">
                      <span className="block h-2 rounded-full bg-teal-200" style={{ width: `${v}%` }} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 px-6 text-center">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-slate-100">
                  <Lock className="size-5 text-slate-700" strokeWidth={1.5} />
                </span>
                <p className="mt-3 text-body font-semibold">Doctor-level view requires admin permission</p>
                <p className="mt-1 text-small text-slate-500">To protect doctor privacy, management sees department-level data by default. Access is logged.</p>
                {requested ? (
                  <Badge tone="info" className="mt-3">Request sent to hospital admin</Badge>
                ) : (
                  <Button size="sm" variant="secondary" className="mt-3" onClick={() => setAsk(true)}>
                    <Lock /> Request access
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Dialog
        open={ask}
        onOpenChange={setAsk}
        title="Request doctor-level access"
        description="Your hospital admin will review this request. All doctor-level views are recorded in the data access log."
        footer={
          <>
            <Button variant="secondary" onClick={() => setAsk(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setAsk(false);
                setRequested(true);
                toast({ title: "Access request sent", body: "Admin: Nazmul Hasan" });
              }}
            >
              <Send /> Send request
            </Button>
          </>
        }
      >
        <label className="text-small font-medium text-slate-700">Reason</label>
        <textarea className="mt-1.5 h-20 w-full rounded border border-slate-200 p-2 text-body focus:border-teal-500 focus:outline-none" defaultValue="Cardiology capture review with department head, 24 Nov." />
      </Dialog>
    </AppShell>
  );
}

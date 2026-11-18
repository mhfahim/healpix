"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ScanLine, Search, Send, UserCheck } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Input, Avatar, StatusPill, Banner } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { queue } from "@/data/mock";
import { newBooking } from "../queue/view";
import { cn } from "@/lib/utils";

type V = { key: string; label: string; unit: string; ref: string; check: (v: number, v2?: number) => boolean; two?: boolean; placeholder?: string };
const fields: V[] = [
  { key: "bp", label: "Blood pressure", unit: "mmHg", ref: "< 130/80", two: true, check: (s, d) => s >= 140 || (d ?? 0) >= 90 || s < 90 },
  { key: "pulse", label: "Pulse", unit: "bpm", ref: "60–100", check: (v) => v > 100 || v < 60 },
  { key: "temp", label: "Temperature", unit: "°F", ref: "97–99.5", check: (v) => v > 99.5 || v < 96 },
  { key: "weight", label: "Weight", unit: "kg", ref: "", check: () => false },
  { key: "height", label: "Height", unit: "cm", ref: "", check: () => false },
  { key: "spo2", label: "SpO2", unit: "%", ref: "≥ 95", check: (v) => v < 95 },
  { key: "rbs", label: "Random blood sugar", unit: "mmol/L", ref: "< 7.8", check: (v) => v >= 7.8 || v < 3.9 },
];

export default function CheckIn({ searchParams }: { searchParams: { serial?: string } }) {
  const router = useRouter();
  const serial = Number(searchParams.serial ?? 17);
  const patient = serial === 17 ? newBooking : queue.find((q) => q.serial === serial) ?? newBooking;
  const [vals, setVals] = React.useState<Record<string, string>>({
    bp: "148",
    bp2: "92",
    pulse: "84",
    temp: "98.6",
    weight: "64",
    height: "152",
    spo2: "98",
    rbs: "6.4",
  });
  const abnormal = fields.filter((f) => {
    const v = Number(vals[f.key]);
    return vals[f.key] && f.check(v, f.two ? Number(vals[f.key + "2"]) : undefined);
  });
  const bmi = vals.weight && vals.height ? (Number(vals.weight) / (Number(vals.height) / 100) ** 2).toFixed(1) : "—";

  return (
    <AppShell surface="frontdesk" title="Check-in and vitals" subtitle="Dr. Farhana Rahman · Room 304">
      <div className="mb-6 flex gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input className="h-11 pl-9 text-h3 font-normal" defaultValue={`Serial ${serial}`} aria-label="Search by serial or phone" placeholder="Serial or phone" />
        </div>
        <Button variant="secondary" size="lg">
          <ScanLine /> Scan booking QR
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 p-5 lg:col-span-4">
          <div className="flex items-center gap-3">
            <Avatar initials={patient.name.split(" ").map((x) => x[0]).join("")} size="lg" />
            <div>
              <p className="text-h2 font-semibold">{patient.name}</p>
              <p className="tnum text-small text-slate-500">
                {patient.age} {patient.sex} · {patient.phone}
              </p>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-body">
            <div className="flex justify-between">
              <dt className="text-slate-500">Serial</dt>
              <dd className="tnum text-h3 font-semibold">{patient.serial}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Est. time</dt>
              <dd className="tnum font-medium">{patient.time}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Status</dt>
              <dd>
                <StatusPill status={patient.status} />
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Reason</dt>
              <dd className="mt-0.5">{patient.reason}</dd>
            </div>
          </dl>
          <Badge tone="neutral" className="mt-4">Fee ৳ 1,000 · paid at counter</Badge>
        </Card>

        <Card className="col-span-12 lg:col-span-8">
          <CardHeader title="Vitals" description="Values outside the normal range are highlighted" />
          <CardBody>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {fields.map((f) => {
                const isAb = abnormal.includes(f);
                return (
                  <div key={f.key} className={cn(f.two && "col-span-2")}>
                    <label className="mb-1.5 flex items-center gap-1 text-small font-medium text-slate-700" htmlFor={f.key}>
                      {f.label}
                      {isAb && <AlertTriangle className="size-3.5 text-warning" aria-label="Out of range" />}
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={f.key}
                        inputMode="decimal"
                        value={vals[f.key] ?? ""}
                        onChange={(e) => setVals((s) => ({ ...s, [f.key]: e.target.value }))}
                        className={cn("tnum h-11 text-h3 font-normal", isAb && "border-warning bg-warning-bg text-warning-fg")}
                        aria-invalid={isAb}
                        aria-label={f.two ? "Systolic" : f.label}
                      />
                      {f.two && (
                        <>
                          <span className="text-h2 text-slate-300">/</span>
                          <Input
                            inputMode="decimal"
                            value={vals[f.key + "2"] ?? ""}
                            onChange={(e) => setVals((s) => ({ ...s, [f.key + "2"]: e.target.value }))}
                            className={cn("tnum h-11 text-h3 font-normal", isAb && "border-warning bg-warning-bg text-warning-fg")}
                            aria-label="Diastolic"
                          />
                        </>
                      )}
                      <span className="w-14 shrink-0 text-caption text-slate-500">{f.unit}</span>
                    </div>
                    {f.ref && <p className={cn("mt-1 text-caption", isAb ? "font-medium text-warning-fg" : "text-slate-500")}>{isAb ? `Out of range (${f.ref})` : `Normal ${f.ref}`}</p>}
                  </div>
                );
              })}
              <div>
                <p className="mb-1.5 text-small font-medium text-slate-700">BMI</p>
                <p className="tnum flex h-11 items-center text-h3">{bmi}</p>
              </div>
            </div>
            {abnormal.length > 0 && (
              <Banner tone="warning" className="mt-5" title={`${abnormal.length} value${abnormal.length > 1 ? "s" : ""} out of range`}>
                {abnormal.map((a) => a.label).join(", ")}. The doctor will see these flagged on the patient snapshot.
              </Banner>
            )}
          </CardBody>
          <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
            <Button variant="secondary">Save vitals only</Button>
            <Button size="lg" onClick={() => router.push(serial === 17 ? "/f/queue?new=17&arrived=17" : "/f/queue")}>
              <UserCheck /> Mark arrived and send to doctor <Send />
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

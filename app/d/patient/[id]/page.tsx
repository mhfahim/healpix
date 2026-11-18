"use client";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, FileText, Play, ShieldAlert, TrendingUp, History } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { AiDraftBlock } from "@/components/ui/clinical";
import { Sparkline } from "@/components/ui/data";
import { patients, vitals, reports } from "@/data/mock";
import { tokens } from "@/lib/tokens";
import { cn } from "@/lib/utils";

export default function Snapshot() {
  const p = patients.rahima;
  return (
    <AppShell
      surface="doctor"
      title={
        <span className="flex items-center gap-2">
          <Link href="/d/today" className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Back to today">
            <ArrowLeft className="size-4" />
          </Link>
          Patient snapshot
        </span>
      }
      subtitle="Serial 9 · waiting outside · vitals recorded 6:18 PM"
      actions={
        <Button href="/d/consult" size="lg">
          <Play /> Start consultation
        </Button>
      }
    >
      {/* Identity strip */}
      <Card className="flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar initials="RB" size="lg" />
          <div>
            <p className="text-h2 font-semibold">{p.name}</p>
            <p className="tnum text-small text-slate-500">
              {p.age} years · Female · {p.id} · Visit #{p.visit}
            </p>
          </div>
        </div>
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-small">
          <div>
            <dt className="text-slate-500">Phone</dt>
            <dd className="tnum font-medium">{p.phone}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Last visit</dt>
            <dd className="font-medium">2 Jun 2026 (Dr. Rahman)</dd>
          </div>
          <div>
            <dt className="text-slate-500">Allergies</dt>
            <dd>
              <Badge tone="danger" icon={ShieldAlert} className="bg-danger text-white border-danger">
                Penicillin
              </Badge>
            </dd>
          </div>
        </dl>
      </Card>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-7">
          <AiDraftBlock title="Pre-visit summary" meta={<span className="text-caption text-slate-500">from 5 visits, 14 reports, booking note</span>}>
            <ul className="space-y-1">
              <li>
                <span className="font-medium">Reason today:</span> increased thirst, tiredness and burning urination for 3 days (booking voice note).
              </li>
              <li>
                <span className="font-medium">Key history:</span> Type 2 diabetes since 2016, hypertension, dyslipidemia. HbA1c rising across the last 3 tests.
              </li>
              <li>
                <span className="font-medium">Current medicines:</span> Comet XR 500 mg ১+০+১, Camlodin 5 mg ১+০+০.
              </li>
            </ul>
          </AiDraftBlock>

          <Card>
            <CardHeader title="Today's vitals" description="Recorded at front desk, 6:18 PM" />
            <CardBody className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {vitals.map((v) => (
                <div key={v.key} className={cn("rounded-lg border p-3", v.abnormal ? "border-warning/40 bg-warning-bg" : "border-slate-200")}>
                  <p className="flex items-center gap-1 text-caption text-slate-500">
                    {v.label} {v.abnormal && <AlertTriangle className="size-3 text-warning" aria-label="Abnormal" />}
                  </p>
                  <p className={cn("tnum mt-0.5 text-h3 font-semibold", v.abnormal && "text-warning-fg")}>{v.value}</p>
                  <p className="text-caption text-slate-500">{v.unit}</p>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent reports" icon={TrendingUp} description="Abnormal values highlighted · last 3 results" />
            <CardBody className="divide-y divide-slate-100">
              {Object.values(reports).map((r) => {
                const last = r.history[r.history.length - 1];
                return (
                  <div key={r.name} className="grid grid-cols-[1fr_120px_110px_80px] items-center gap-4 py-3">
                    <div>
                      <p className="text-body font-medium">{r.name}</p>
                      <p className="text-caption text-slate-500">Ref {r.ref} {r.unit}</p>
                    </div>
                    <Sparkline data={r.history} color={tokens.danger} dots width={110} />
                    <p className="tnum text-small text-slate-500">{r.history.join(" → ")}</p>
                    <p className="tnum text-right">
                      <span className="text-h3 font-semibold text-danger-fg">{last}</span> <Badge tone="danger" size="sm">H</Badge>
                    </p>
                  </div>
                );
              })}
            </CardBody>
          </Card>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-5">
          <Card>
            <CardHeader title="Active problems" />
            <CardBody>
              <ul className="space-y-2 text-body">
                {p.problems.map((x) => (
                  <li key={x} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-slate-400" /> {x}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Previous prescriptions" icon={History} />
            <CardBody className="space-y-2">
              {[
                ["2 Jun 2026", "Dr. Farhana Rahman", "Comet XR 500 mg, Camlodin 5 mg · HbA1c, Lipid Profile"],
                ["14 Jan 2026", "Dr. Farhana Rahman", "Comet 500 mg, Camlodin 5 mg · HbA1c, Serum Creatinine"],
                ["3 Sep 2025", "Dr. Kamal Hossain", "Comet 500 mg · FBS, HbA1c"],
              ].map(([d, doc, body]) => (
                <button key={d} className="flex w-full items-start gap-3 rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50">
                  <FileText className="mt-0.5 size-4 shrink-0 text-slate-500" />
                  <span>
                    <span className="block text-body font-medium">
                      {d} · <span className="font-normal text-slate-500">{doc}</span>
                    </span>
                    <span className="block text-small text-slate-700">{body}</span>
                  </span>
                </button>
              ))}
            </CardBody>
          </Card>
          <Button href="/d/consult" size="lg" className="w-full">
            <Play /> Start consultation
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

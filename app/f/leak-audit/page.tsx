"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowRight, Camera, Check, Plus, RotateCcw, ScanLine, X } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Field, Input, Select, Banner } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { AiDraftBlock, Dropzone } from "@/components/ui/clinical";
import { Progress } from "@/components/ui/data";
import { departments } from "@/data/mock";
import { useToast } from "@/components/ui/toast";

const extracted = ["CBC", "Lipid Profile", "ECG", "Echocardiogram"];

export default function LeakAuditCapture() {
  const [count, setCount] = React.useState(86);
  const [captured, setCaptured] = React.useState(true);
  const [tests, setTests] = React.useState(extracted);
  const [state, setState] = React.useState<"draft" | "accepted" | "editing" | "dismissed">("draft");
  const toast = useToast();

  const save = () => {
    setCount((c) => c + 1);
    setCaptured(false);
    setTests(extracted);
    setState("draft");
    toast({ title: "Prescription saved", body: `Today: ${count + 1} prescriptions captured` });
  };

  return (
    <AppShell
      surface="frontdesk"
      title="Leak Audit capture"
      subtitle="Free 30-day audit · photograph every paper prescription leaving the chamber"
      actions={
        <Button variant="secondary" href="/m/audit-report">
          Preview audit report <ArrowRight />
        </Button>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-small font-medium text-slate-500">Today</p>
          <p className="tnum mt-1 text-kpi font-semibold">{count}</p>
          <p className="text-caption text-slate-500">prescriptions captured</p>
        </Card>
        <Card className="p-4">
          <p className="text-small font-medium text-slate-500">Audit progress</p>
          <p className="tnum mt-1 text-kpi font-semibold">
            Day 18 <span className="text-h2 font-normal text-slate-500">of 30</span>
          </p>
          <Progress value={60} className="mt-2" label="Audit progress" />
        </Card>
        <Card className="p-4">
          <p className="text-small font-medium text-slate-500">Total captured</p>
          <p className="tnum mt-1 text-kpi font-semibold">2,104</p>
          <p className="text-caption text-slate-500">≈ 117 per day · target 110</p>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-6">
          <CardHeader title="Prescription photo" action={captured && <Button size="sm" variant="ghost" onClick={() => setCaptured(false)}><RotateCcw /> Retake</Button>} />
          <CardBody>
            {captured ? (
              <div className="flex h-[460px] items-center justify-center overflow-hidden rounded-lg bg-slate-700 p-6">
                {/* Simulated handwritten paper prescription */}
                <div className="h-full w-[300px] rotate-1 bg-white p-5 shadow-sm">
                  <div className="border-b border-slate-300 pb-2">
                    <p className="text-body font-semibold text-slate-700">Dr. Tanvir Ahmed</p>
                    <p className="text-caption text-slate-500">MBBS, MD (Cardiology) · Meridian</p>
                  </div>
                  <p className="mt-2 text-caption text-slate-500">Name: Abdul Karim · 62 M · 19/11/26</p>
                  <p className="mt-4 font-serif text-h2 italic text-slate-700">℞</p>
                  <ul className="mt-1 space-y-1 font-serif text-body italic text-slate-700">
                    <li>Tab. Rosuva 10 — 0+0+1</li>
                    <li>Tab. Ecosprin 75 — 0+1+0</li>
                  </ul>
                  <p className="mt-4 font-serif text-body font-semibold italic text-slate-700">Adv:</p>
                  <ul className="space-y-0.5 font-serif text-body italic text-slate-700">
                    {extracted.map((t) => (
                      <li key={t}>— {t === "Echocardiogram" ? "Echo" : t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Dropzone big camera title="Photograph the paper prescription" hint="Keep it flat with all four corners visible" onFiles={() => setCaptured(true)} />
            )}
          </CardBody>
        </Card>

        <div className="col-span-12 space-y-4 lg:col-span-6">
          {captured ? (
            <>
              <AiDraftBlock title="Read from photo" state={state} onStateChange={setState} meta={<span className="text-caption text-slate-500">confirm or edit</span>}>
                <dl className="grid grid-cols-2 gap-3 text-body">
                  <div>
                    <dt className="text-caption text-slate-500">Doctor</dt>
                    <dd className="font-medium">Dr. Tanvir Ahmed</dd>
                  </div>
                  <div>
                    <dt className="text-caption text-slate-500">Department</dt>
                    <dd className="font-medium">Cardiology</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="mb-1 text-caption text-slate-500">Tests detected ({tests.length})</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {tests.map((t) => (
                        <span key={t} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white py-0.5 pl-2.5 pr-1 text-small font-medium">
                          {t}
                          <button aria-label={`Remove ${t}`} className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100" onClick={() => setTests((s) => s.filter((x) => x !== t))}>
                            <X className="size-3" />
                          </button>
                        </span>
                      ))}
                      <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-0.5 text-small text-slate-500 hover:border-teal-500">
                        <Plus className="size-3" /> Add test
                      </button>
                    </dd>
                  </div>
                </dl>
                <p className="mt-2 text-caption text-slate-500">“Echo” read as Echocardiogram. Medicines are ignored in the audit.</p>
              </AiDraftBlock>
              <Card>
                <CardBody className="grid grid-cols-2 gap-4">
                  <Field label="Doctor">
                    <Select defaultValue="Dr. Tanvir Ahmed">
                      <option>Dr. Tanvir Ahmed</option>
                      <option>Dr. Farhana Rahman</option>
                      <option>Dr. Nusrat Jahan</option>
                      <option>Dr. Kamal Hossain</option>
                    </Select>
                  </Field>
                  <Field label="Department">
                    <Select defaultValue="cardiology">
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Patient mobile (for matching)" hint="Used only to match lab billing. Not shown in reports." className="col-span-2">
                    <Input defaultValue="01819-552310" className="tnum" />
                  </Field>
                </CardBody>
                <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
                  <Button variant="secondary" onClick={() => setCaptured(false)}>
                    Skip
                  </Button>
                  <Button size="lg" onClick={save}>
                    <Check /> Confirm and save
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <ScanLine className="mx-auto size-8 text-slate-400" strokeWidth={1.5} />
              <p className="mt-3 text-h3 font-semibold">Ready for the next prescription</p>
              <p className="mt-1 text-body text-slate-500">Take a photo. Helpix reads the doctor and test list; you confirm in a few seconds.</p>
              <Button className="mt-4" onClick={() => setCaptured(true)}>
                <Camera /> Capture
              </Button>
            </Card>
          )}
          <Banner tone="info" title="How the audit works">
            Each prescription is matched against lab billing for 7 days. At day 30 you get the Leak Audit report with your baseline capture rate.{" "}
            <Link href="/m/audit-report" className="font-medium text-teal-700 underline">
              See a sample
            </Link>
          </Banner>
        </div>
      </div>
    </AppShell>
  );
}

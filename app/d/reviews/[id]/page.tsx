"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  CalendarPlus,
  CheckCircle2,
  CloudUpload,
  FileEdit,
  FlaskConical,
  Minus,
  MessageSquareText,
  RotateCw,
  Send,
  ZoomIn,
  ZoomOut,
  Plus,
  X,
} from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Avatar, Textarea, SectionLabel } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { AiDraftBlock, AiBadge } from "@/components/ui/clinical";
import { Dialog, Sheet, Chip, DatePicker } from "@/components/ui/controls";
import { mizanurExtracted, rahimaLabValues, reviewInbox, rxMeds, rxReplacement } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

function Trend({ value, prev, flag }: { value: number | string; prev: number | string; flag: string }) {
  if (typeof value !== "number" || typeof prev !== "number") {
    return <span className="tnum text-small text-slate-500">prev {prev}</span>;
  }
  const up = value > prev;
  const Icon = value === prev ? Minus : up ? ArrowUpRight : ArrowDownRight;
  const worse = flag === "H" ? up : flag === "L" ? !up : false;
  return (
    <span className={cn("tnum inline-flex items-center gap-0.5 text-small", worse ? "text-danger-fg" : "text-slate-500")}>
      <Icon className="size-3.5" /> {prev}
    </span>
  );
}

export default function ReviewDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const item = reviewInbox.find((r) => r.id === params.id) ?? reviewInbox[0];
  const outside = item.source === "outside";
  const [zoom, setZoom] = React.useState(1);
  const [rxOpen, setRxOpen] = React.useState(false);
  const [okOpen, setOkOpen] = React.useState(false);
  const [visitOpen, setVisitOpen] = React.useState(false);
  const [extracted, setExtracted] = React.useState<"draft" | "accepted">("draft");
  const [visitDate, setVisitDate] = React.useState(new Date(2026, 10, 22));
  const [meds, setMeds] = React.useState([
    { ...rxMeds[0], brand: "Comet XR 1000 mg", dose: "০+০+১", note: "Increased (was 500 mg ১+০+১)" },
    { ...rxMeds[1], note: "Continue" },
    { id: "rosuva", brand: "Rosuva 10 mg", generic: "Rosuvastatin", dose: "০+০+১", when: "রাতে খাবারের পরে", duration: "3 months", ai: true, note: "New · LDL 152" },
    { ...rxReplacement, duration: "complete course", note: "Continue as prescribed" },
  ]);

  return (
    <AppShell
      surface="doctor"
      title={
        <span className="flex items-center gap-2">
          <Link href="/d/reviews" className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Back to inbox">
            <ArrowLeft className="size-4" />
          </Link>
          Report review
        </span>
      }
      subtitle={`${item.patient} · ${item.tests.join(", ")} · received ${item.received}`}
      fullBleed
    >
      <div className="grid h-[calc(100vh-64px)] grid-cols-[minmax(0,1fr)_400px]">
        {/* LEFT: viewer */}
        <section className="overflow-y-auto bg-slate-50 px-6 py-5">
          <div className="mb-4 flex items-center gap-3">
            <Avatar initials={item.patient.split(" ").map((x) => x[0]).join("")} />
            <div>
              <p className="text-h3 font-semibold">{item.patient}</p>
              <p className="tnum text-small text-slate-500">
                {item.age} {item.sex} · Last visit 19 Nov (today) with you
              </p>
            </div>
            {outside ? (
              <Badge tone="warning" icon={CloudUpload} className="ml-auto">
                Outside upload · Northgate Diagnostics (patient-reported)
              </Badge>
            ) : (
              <Badge tone="teal" icon={FlaskConical} className="ml-auto">
                In-house lab · Meridian · verified by lab
              </Badge>
            )}
          </div>

          {outside ? (
            <div className="grid gap-4 xl:grid-cols-2">
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
                  <span className="text-small font-medium">Page 1 of 2 · photo</span>
                  <div className="flex gap-1">
                    <Button size="icon-sm" variant="ghost" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z - 0.25))}>
                      <ZoomOut />
                    </Button>
                    <span className="tnum flex w-12 items-center justify-center text-caption">{Math.round(zoom * 100)}%</span>
                    <Button size="icon-sm" variant="ghost" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2.5, z + 0.25))}>
                      <ZoomIn />
                    </Button>
                    <Button size="icon-sm" variant="ghost" aria-label="Rotate">
                      <RotateCw />
                    </Button>
                  </div>
                </div>
                <div className="h-[520px] overflow-auto bg-slate-700 p-6">
                  {/* Simulated photographed report */}
                  <div
                    className="mx-auto w-[360px] origin-top -rotate-1 bg-white p-6 shadow-sm transition-transform"
                    style={{ transform: `scale(${zoom}) rotate(-1.2deg)` }}
                  >
                    <p className="text-center text-body font-semibold text-slate-700">NORTHGATE DIAGNOSTICS</p>
                    <p className="text-center text-caption text-slate-500">Biochemistry Report</p>
                    <div className="mt-3 border-y border-slate-300 py-1 text-caption text-slate-500">Name: Mizanur Rahman · Age 45 · Sample 18/11/2026</div>
                    <table className="mt-3 w-full text-caption text-slate-700">
                      <tbody>
                        {mizanurExtracted.map((v) => (
                          <tr key={v.test} className="border-b border-dashed border-slate-200">
                            <td className="py-1.5">{v.test}</td>
                            <td className="py-1.5 font-semibold">{v.value}</td>
                            <td className="py-1.5">{v.unit}</td>
                            <td className="py-1.5 text-slate-500">{v.ref}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-6 text-right text-caption italic text-slate-400">Pathologist signature</p>
                  </div>
                </div>
              </Card>
              <div>
                <AiDraftBlock
                  title="Values read from photo"
                  state={extracted}
                  onStateChange={(s) => setExtracted(s === "accepted" ? "accepted" : "draft")}
                  meta={<span className="text-caption text-slate-500">confirm before use</span>}
                >
                  <table className="w-full text-small">
                    <thead>
                      <tr className="text-left text-caption text-slate-500">
                        <th className="py-1 font-medium">Test</th>
                        <th className="py-1 font-medium">Value</th>
                        <th className="py-1 font-medium">Ref</th>
                        <th className="py-1 text-right font-medium">Read confidence</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mizanurExtracted.map((v) => (
                        <tr key={v.test} className="border-t border-ai/10">
                          <td className="py-1.5">{v.test}</td>
                          <td className={cn("tnum py-1.5 font-semibold", v.flag && "text-danger-fg")}>
                            {v.value} {v.flag && <Badge tone="danger" size="sm">{v.flag}</Badge>}
                          </td>
                          <td className="py-1.5 text-slate-500">{v.ref}</td>
                          <td className="tnum py-1.5 text-right">
                            {v.conf < 90 ? <Badge tone="warning" size="sm">{v.conf}% · check</Badge> : <span className="text-slate-500">{v.conf}%</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </AiDraftBlock>
                <Card className="mt-4 p-4">
                  <SectionLabel className="mb-1">Patient said</SectionLabel>
                  <p className="text-body">
                    Reason for outside lab: <Badge tone="neutral">Closer to home</Badge>
                  </p>
                  <Link href="/m/leaks" className="mt-1 inline-block text-caption text-teal-700 underline">Counted in Leak insights (anonymized)</Link>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="overflow-hidden">
              <CardHeader title="Results" description="Sample collected 19 Nov, 9:12 AM · reported 2:10 PM" />
              <table className="mt-3 w-full text-body">
                <thead className="bg-slate-50">
                  <tr className="border-y border-slate-200 text-left text-caption text-slate-500">
                    <th className="px-5 py-2 font-medium">Test</th>
                    <th className="px-3 py-2 text-right font-medium">Result</th>
                    <th className="px-3 py-2 font-medium">Unit</th>
                    <th className="px-3 py-2 font-medium">Reference</th>
                    <th className="px-5 py-2 text-right font-medium">vs. previous (Jun)</th>
                  </tr>
                </thead>
                <tbody>
                  {["Diabetes", "Lipid Profile", "Kidney", "Urine R/E"].map((g) => (
                    <React.Fragment key={g}>
                      <tr>
                        <td colSpan={5} className="bg-slate-50/60 px-5 pb-1 pt-3 text-caption font-semibold uppercase tracking-wide text-slate-500">
                          {g}
                        </td>
                      </tr>
                      {rahimaLabValues
                        .filter((v) => v.group === g)
                        .map((v) => (
                          <tr key={v.test} className={cn("border-b border-slate-100", v.flag && "bg-danger-bg/50")}>
                            <td className="px-5 py-2.5">{v.test}</td>
                            <td className={cn("tnum px-3 py-2.5 text-right font-semibold", v.flag && "text-danger-fg")}>
                              {v.value} {v.flag && <Badge tone="danger" size="sm">{v.flag === "H" ? "High" : "Low"}</Badge>}
                            </td>
                            <td className="px-3 py-2.5 text-slate-500">{v.unit}</td>
                            <td className="tnum px-3 py-2.5 text-slate-500">{v.ref}</td>
                            <td className="px-5 py-2.5 text-right">
                              <Trend value={v.value} prev={v.prev} flag={v.flag} />
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </section>

        {/* RIGHT: summary + outcomes */}
        <aside className="flex min-h-0 flex-col border-l border-slate-200 bg-white">
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            <AiDraftBlock title="Summary of findings" actions={false}>
              {outside ? (
                <p>LDL 168 and total cholesterol 246 remain high despite diet advice (Sep). Triglycerides mildly raised; read confidence 81%, please verify. No statin on record.</p>
              ) : (
                <ul className="list-inside list-disc space-y-1">
                  <li>Glycemic control worse: HbA1c 8.2% (7.6% in Jun).</li>
                  <li>Dyslipidemia: LDL 152, HDL 38, TG 210. Not on a statin.</li>
                  <li>Creatinine 1.3 mg/dL, up from 1.1 (eGFR ≈ 52).</li>
                  <li>Urine pus cells now normal (3–5/HPF). UTI responding.</li>
                </ul>
              )}
              <p className="mt-2 text-caption text-slate-500">AI summary for your review. It is not sent to the patient.</p>
            </AiDraftBlock>

            <div>
              <SectionLabel className="mb-2">Last prescription · today</SectionLabel>
              <ul className="space-y-1.5 rounded-lg border border-slate-200 p-3 text-small">
                {[rxMeds[0], rxMeds[1], rxReplacement].map((m) => (
                  <li key={m.id} className="flex justify-between gap-2">
                    <span className="font-medium">{m.brand}</span>
                    <span className="font-bn text-slate-500">{m.dose}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 bg-slate-50 p-5">
            <SectionLabel className="mb-1">Outcome</SectionLabel>
            <Button size="lg" className="w-full justify-start" onClick={() => setRxOpen(true)}>
              <FileEdit /> Update prescription and send
            </Button>
            <Button size="lg" variant="secondary" className="w-full justify-start" onClick={() => setOkOpen(true)}>
              <CheckCircle2 /> No change needed
            </Button>
            <Button size="lg" variant="secondary" className="w-full justify-start" onClick={() => setVisitOpen(true)}>
              <CalendarPlus /> Ask patient to visit
            </Button>
          </div>
        </aside>
      </div>

      {/* 1. Compact prescription editor */}
      <Sheet
        open={rxOpen}
        onOpenChange={setRxOpen}
        title="Update prescription"
        description="Prefilled from today's prescription. Changes are highlighted."
        footer={
          <>
            <Button variant="secondary" onClick={() => setRxOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setRxOpen(false);
                toast({ title: "Updated prescription sent", body: `${item.patient} · WhatsApp + SMS` });
                setTimeout(() => router.push("/p/response"), 1200);
              }}
            >
              <Send /> Sign and send
            </Button>
          </>
        }
      >
        <ul className="space-y-2">
          {meds.map((m) => (
            <li key={m.id} className={cn("flex items-start justify-between gap-3 rounded-lg border p-3", m.note.startsWith("New") || m.note.startsWith("Incr") ? "border-l-2 border-ai/20 border-l-ai bg-ai-bg/60" : "border-slate-200")}>
              <div>
                <p className="flex items-center gap-2 text-body font-semibold">
                  {m.brand} {(m.note.startsWith("New") || m.note.startsWith("Incr")) && <AiBadge label="AI suggested" />}
                </p>
                <p className="text-caption text-slate-500">{m.generic}</p>
                <p className="mt-1 text-small">
                  <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 font-bn font-semibold">{m.dose}</span> <span className="font-bn text-slate-700">{m.when}</span> · {m.duration}
                </p>
                <p className="mt-1 text-caption text-slate-500">{m.note}</p>
              </div>
              <button aria-label={`Remove ${m.brand}`} className="rounded p-1 text-slate-400 hover:bg-slate-100" onClick={() => setMeds((s) => s.filter((x) => x.id !== m.id))}>
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        <Button variant="ghost" size="sm" className="mt-2">
          <Plus /> Add medicine
        </Button>
        <div className="mt-5">
          <SectionLabel className="mb-2">Note to patient (Bangla)</SectionLabel>
          <Textarea
            className="font-bn"
            rows={4}
            defaultValue="আপনার রিপোর্ট দেখেছি। ডায়াবেটিস এখনো নিয়ন্ত্রণে নেই, তাই রাতের ওষুধের মাত্রা বাড়ানো হলো। কোলেস্টেরলের জন্য নতুন একটি ওষুধ দেওয়া হলো। ৩ মাস পর আবার HbA1c পরীক্ষা করবেন।"
          />
        </div>
      </Sheet>

      {/* 2. No change */}
      <Dialog
        open={okOpen}
        onOpenChange={setOkOpen}
        title="Send reassurance note"
        description="The patient gets this message and the report PDF."
        footer={
          <>
            <Button variant="secondary" onClick={() => setOkOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOkOpen(false);
                toast({ title: "Note sent", body: `${item.patient} · no change to medicines` });
                router.push("/d/reviews");
              }}
            >
              <Send /> Send
            </Button>
          </>
        }
      >
        <div className="mb-2 flex flex-wrap gap-2">
          <Chip selected>Reports normal</Chip>
          <Chip>Continue same medicine</Chip>
          <Chip>Recheck in 3 months</Chip>
        </div>
        <Textarea className="font-bn" rows={3} defaultValue="আপনার রিপোর্ট দেখেছি। চিন্তার কিছু নেই। আগের ওষুধ একইভাবে চালিয়ে যান।" />
        <p className="mt-2 flex items-center gap-1.5 text-caption text-slate-500">
          <MessageSquareText className="size-3.5" /> Template from your Bangla advice library
        </p>
      </Dialog>

      {/* 3. Ask to visit */}
      <Dialog
        open={visitOpen}
        onOpenChange={setVisitOpen}
        title="Ask patient to visit"
        description="We'll hold a serial and send the patient a pre-filled booking."
        footer={
          <>
            <Button variant="secondary" onClick={() => setVisitOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setVisitOpen(false);
                toast({ title: "Visit request sent", body: "Serial held: Sun 22 Nov, serial 6, around 5:50 PM" });
                setTimeout(() => router.push("/p/response/visit"), 1200);
              }}
            >
              <Send /> Book and notify
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <SectionLabel className="mb-1.5">Date</SectionLabel>
            <DatePicker value={visitDate} onChange={setVisitDate} />
          </div>
          <div>
            <SectionLabel className="mb-1.5">Urgency</SectionLabel>
            <div className="flex gap-2">
              <Chip>Within a week</Chip>
              <Chip selected>Next chamber day</Chip>
              <Chip>Today</Chip>
            </div>
          </div>
          <Textarea className="font-bn" rows={2} defaultValue="রিপোর্ট নিয়ে সরাসরি কথা বলা দরকার। অনুগ্রহ করে চেম্বারে আসুন।" />
        </div>
      </Dialog>
    </AppShell>
  );
}

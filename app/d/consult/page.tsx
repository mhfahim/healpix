"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Mic,
  Pause,
  Square,
  Play,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Star,
  Repeat,
  CheckCircle2,
  Plus,
  FlaskConical,
  X,
  FileSignature,
  Sparkles,
  AlertTriangle,
  Check,
  Pencil,
} from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Badge, Card, SectionLabel, Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { AiBadge, AiDraftBlock, RecordingIndicator, SafetyAlert, type DraftState } from "@/components/ui/clinical";
import { Chip, Combobox, DatePicker, Switch, Tooltip } from "@/components/ui/controls";
import { Sparkline } from "@/components/ui/data";
import { adviceTemplates, drugDb, icd, patients, prescribedTestIds, reports, rxMeds, rxReplacement, testById, tests, vitals } from "@/data/mock";
import { tokens } from "@/lib/tokens";
import { cn } from "@/lib/utils";

type Med = (typeof rxMeds)[number] & { state?: DraftState };

const transcript = [
  { who: "Doctor", t: "00:04", text: "Assalamu alaikum, apa. Kemon achen? What brings you in today?" },
  { who: "Patient", t: "00:11", text: "For three days I'm very thirsty, feeling weak. And there's burning when I pass urine." },
  { who: "Doctor", t: "00:32", text: "Any fever? Are you taking the Comet twice daily?" },
  { who: "Patient", t: "00:38", text: "No fever. Sometimes I forget the night dose. Sugar at home was 14 in the morning." },
  { who: "Doctor", t: "01:05", text: "Your BP today is 150 over 95. Tummy is soft, slight tenderness above the bladder." },
  { who: "Doctor", t: "02:20", text: "We'll check HbA1c, lipid profile, creatinine and urine. I'll give a short antibiotic course." },
];

function Src({ children, quote }: { children: React.ReactNode; quote: string }) {
  return (
    <Tooltip
      content={
        <span>
          <span className="mb-1 flex items-center gap-1 text-caption font-medium text-ai-fg">
            <Sparkles className="size-3" /> Source in transcript
          </span>
          “{quote}”
        </span>
      }
    >
      <span className="cursor-help rounded-sm decoration-ai/40 decoration-dotted underline-offset-4 hover:bg-ai/10 hover:underline">{children}</span>
    </Tooltip>
  );
}

export default function Consultation() {
  const router = useRouter();
  const p = patients.rahima;
  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rec, setRec] = React.useState<"idle" | "recording" | "paused">("idle");
  const [secs, setSecs] = React.useState(0);
  const [showTranscript, setShowTranscript] = React.useState(false);
  const [noteReady, setNoteReady] = React.useState(false);
  const [sections, setSections] = React.useState<Record<string, DraftState>>({ cc: "draft", hx: "draft", ex: "draft", dx: "draft" });
  const [dx, setDx] = React.useState<string[]>(["E11.65", "I10", "N39.0"]);
  const [meds, setMeds] = React.useState<Med[]>(rxMeds.map((m) => ({ ...m, state: "draft" as DraftState })));
  const [testIds, setTestIds] = React.useState<string[]>(prescribedTestIds);
  const [advice, setAdvice] = React.useState<string[]>([adviceTemplates[0], adviceTemplates[1], adviceTemplates[2]]);
  const [followDate, setFollowDate] = React.useState(new Date(2026, 11, 19));
  const [remote, setRemote] = React.useState(true);
  const [alerts, setAlerts] = React.useState<Record<string, "acknowledged" | "changed" | null>>({ allergy: null, kidney: null, abx: null });

  React.useEffect(() => {
    if (rec !== "recording") return;
    const i = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(i);
  }, [rec]);

  const stop = () => {
    setRec("idle");
    setNoteReady(true);
    setShowTranscript(false);
  };
  const start = () => {
    setRec("recording");
    if (secs === 0) setSecs(161); // demo: picks up mid-consultation
    setTimeout(() => setNoteReady(true), 1200);
  };

  const hasMoxaclav = meds.some((m) => m.id === "moxaclav" && m.state !== "dismissed");
  const hasCipro = meds.some((m) => m.id === "ciprocin");
  const activeAlerts = [
    hasMoxaclav && {
      id: "allergy",
      severity: "high" as const,
      category: "Allergy conflict",
      title: "Patient is allergic to Penicillin",
      body: "Moxaclav 625 mg contains amoxicillin (penicillin class).",
      changeLabel: "Change to Ciprocin 500 mg",
    },
    {
      id: "kidney",
      severity: "moderate" as const,
      category: "Kidney dosing",
      title: "Metformin with Serum Creatinine 1.3 mg/dL",
      body: "eGFR ≈ 52 mL/min. 1,000 mg/day is within limit. Recheck creatinine in 3 months.",
    },
    {
      id: "abx",
      severity: "info" as const,
      category: "Antibiotic use",
      title: hasCipro ? "Ciprofloxacin for 5 days" : "Antibiotic prescribed",
      body: "Urine R/E is in the test list. Consider culture if symptoms persist after 48 h.",
    },
  ].filter(Boolean) as { id: string; severity: "high" | "moderate" | "info"; category: string; title: string; body: string; changeLabel?: string }[];

  const unresolvedHigh = activeAlerts.some((a) => a.severity === "high" && !alerts[a.id]);
  const unresolved = activeAlerts.filter((a) => !alerts[a.id]).length;
  const pendingMeds = meds.filter((m) => m.state === "draft").length;

  const changeAbx = () => {
    setMeds((ms) => ms.map((m) => (m.id === "moxaclav" ? { ...rxReplacement, state: "accepted" as DraftState } : m)));
    setAlerts((a) => ({ ...a, allergy: "changed" }));
  };

  return (
    <AppShell
      surface="doctor"
      fullBleed
      title={
        <span className="flex items-center gap-3">
          <Avatar initials="RB" size="sm" />
          <span>
            {p.name}{" "}
            <span className="tnum text-body font-normal text-slate-500">
              · {p.age} F · {p.id} · Serial 9
            </span>
          </span>
          <Badge tone="danger" icon={ShieldAlert} className="border-danger bg-danger text-on-accent">
            Penicillin allergy
          </Badge>
        </span>
      }
      actions={
        <Button variant="secondary" href="/d/patient/rahima">
          Snapshot
        </Button>
      }
    >
      <div className={cn("grid h-[calc(100vh-128px)]", leftOpen ? "grid-cols-[248px_minmax(0,1fr)_minmax(340px,400px)]" : "grid-cols-[44px_minmax(0,1fr)_minmax(340px,400px)]")}>
        {/* LEFT: patient context */}
        <aside className="overflow-y-auto border-r border-slate-200 bg-surface">
          <div className={cn("flex items-center border-b border-slate-200 px-3 py-2", leftOpen ? "justify-between" : "justify-center")}>
            {leftOpen && <SectionLabel>Patient context</SectionLabel>}
            <button onClick={() => setLeftOpen((o) => !o)} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label={leftOpen ? "Collapse patient context" : "Expand patient context"}>
              {leftOpen ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          </div>
          {leftOpen && (
            <div className="space-y-5 p-4">
              <div>
                <SectionLabel className="mb-2">Vitals · 6:18 PM</SectionLabel>
                <dl className="grid grid-cols-2 gap-2">
                  {vitals.map((v) => (
                    <div key={v.key} className={cn("rounded border px-2 py-1.5", v.abnormal ? "border-warning/40 bg-warning-bg" : "border-slate-200")}>
                      <dt className="flex items-center gap-1 text-caption text-slate-500">
                        {v.label} {v.abnormal && <AlertTriangle className="size-3 text-warning" aria-label="Abnormal" />}
                      </dt>
                      <dd className={cn("tnum text-body font-semibold", v.abnormal && "text-warning-fg")}>
                        {v.value} <span className="text-caption font-normal text-slate-500">{v.unit}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <SectionLabel className="mb-2">Allergies</SectionLabel>
                <Badge tone="danger" icon={ShieldAlert}>Penicillin · rash (2019)</Badge>
              </div>
              <div>
                <SectionLabel className="mb-2">Active problems</SectionLabel>
                <ul className="space-y-1 text-small">
                  {p.problems.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionLabel className="mb-2">Recent reports</SectionLabel>
                <ul className="space-y-2">
                  {Object.values(reports).map((r) => (
                    <li key={r.name} className="flex items-center justify-between gap-2">
                      <span className="min-w-0">
                        <span className="block truncate text-small font-medium">{r.name}</span>
                        <span className="tnum text-caption text-slate-500">{r.history.join(" → ")}</span>
                      </span>
                      <Sparkline data={r.history} color={tokens.danger} width={56} height={22} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <SectionLabel className="mb-2">Current medicines</SectionLabel>
                <ul className="space-y-1 text-small">
                  {p.meds.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </aside>

        {/* CENTER: AI scribe */}
        <section className="overflow-y-auto bg-slate-50 px-6 py-5">
          <Card className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <RecordingIndicator state={rec} seconds={secs} />
              <div className="flex items-center gap-2">
                {rec === "idle" && (
                  <Button onClick={start}>
                    <Mic /> {secs ? "Resume recording" : "Start recording"}
                  </Button>
                )}
                {rec === "recording" && (
                  <Button variant="secondary" onClick={() => setRec("paused")}>
                    <Pause /> Pause
                  </Button>
                )}
                {rec === "paused" && (
                  <Button variant="secondary" onClick={() => setRec("recording")}>
                    <Play /> Resume
                  </Button>
                )}
                {rec !== "idle" && (
                  <Button variant="destructive" onClick={stop}>
                    <Square /> Stop
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="inline-flex items-center gap-1.5 text-small text-success-fg">
                <ShieldCheck className="size-4" /> Patient agreed to recording · 6:24 PM
              </span>
              <button className="inline-flex items-center gap-1 text-small font-medium text-slate-700 hover:text-slate-900" onClick={() => setShowTranscript((s) => !s)} aria-expanded={showTranscript}>
                Live transcript <ChevronDown className={cn("size-4 transition-transform", showTranscript && "rotate-180")} />
              </button>
            </div>
            {showTranscript && (
              <ol className="mt-3 max-h-56 space-y-2 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-3 text-small">
                {transcript.map((l) => (
                  <li key={l.t} className="grid grid-cols-[44px_64px_1fr] gap-2">
                    <span className="tnum text-slate-400">{l.t}</span>
                    <span className={cn("font-medium", l.who === "Doctor" ? "text-teal-800" : "text-slate-700")}>{l.who}</span>
                    <span className="text-slate-700">{l.text}</span>
                  </li>
                ))}
                {rec === "recording" && <li className="pl-[116px] text-slate-400">Listening…</li>}
              </ol>
            )}
          </Card>

          <div className="mb-3 mt-6 flex items-center justify-between">
            <h2 className="text-h3 font-semibold">Consultation note</h2>
            {noteReady && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSections({ cc: "accepted", hx: "accepted", ex: "accepted", dx: "accepted" })}
              >
                <Check /> Accept all sections
              </Button>
            )}
          </div>

          {!noteReady ? (
            <Card className="flex flex-col items-center px-6 py-10 text-center">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-ai-bg">
                <Sparkles className="size-5 text-ai" />
              </span>
              <p className="mt-3 text-body font-medium">Start recording to draft the note</p>
              <p className="mt-1 max-w-sm text-small text-slate-500">
                Helpix listens to the consultation and drafts each section. Nothing is saved to the record until you accept it.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              <AiDraftBlock title="Chief complaints" state={sections.cc} onStateChange={(s) => setSections((x) => ({ ...x, cc: s }))}>
                <ol className="list-inside list-decimal space-y-0.5">
                  <li>
                    <Src quote="For three days I'm very thirsty, feeling weak.">Increased thirst and tiredness × 3 days</Src>
                  </li>
                  <li>
                    <Src quote="And there's burning when I pass urine.">Burning micturition × 3 days</Src>
                  </li>
                </ol>
              </AiDraftBlock>
              <AiDraftBlock title="History" state={sections.hx} onStateChange={(s) => setSections((x) => ({ ...x, hx: s }))}>
                <p>
                  Known T2DM (2016), HTN, dyslipidemia. <Src quote="Sometimes I forget the night dose.">Misses evening Metformin dose intermittently.</Src>{" "}
                  <Src quote="Sugar at home was 14 in the morning.">Home fasting glucose ~14 mmol/L.</Src> <Src quote="No fever.">No fever.</Src> Allergy: penicillin (rash).
                </p>
              </AiDraftBlock>
              <AiDraftBlock title="Examination" state={sections.ex} onStateChange={(s) => setSections((x) => ({ ...x, ex: s }))}>
                <p>
                  <Src quote="Your BP today is 150 over 95.">BP 150/95 mmHg</Src>, pulse 88/min, temp 99.4°F, SpO2 97%, RBS 13.8 mmol/L.{" "}
                  <Src quote="Tummy is soft, slight tenderness above the bladder.">Abdomen soft, mild suprapubic tenderness.</Src>
                </p>
              </AiDraftBlock>
              <AiDraftBlock title="Assessment / Diagnosis" state={sections.dx} onStateChange={(s) => setSections((x) => ({ ...x, dx: s }))}>
                <ul className="space-y-1.5">
                  {icd.map((c) => (
                    <li key={c.code} className={cn("flex items-center justify-between gap-2", !dx.includes(c.code) && "text-slate-400 line-through")}>
                      <span>
                        {c.label} <Badge tone="outline" size="sm" className="ml-1 font-mono">{c.code}</Badge>
                      </span>
                      <button
                        className="text-caption font-medium text-slate-500 hover:text-slate-900"
                        onClick={() => setDx((d) => (d.includes(c.code) ? d.filter((x) => x !== c.code) : [...d, c.code]))}
                      >
                        {dx.includes(c.code) ? "Remove" : "Add back"}
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-caption text-slate-500">ICD-10 suggestions · hover underlined text to see its source</p>
              </AiDraftBlock>
            </div>
          )}
        </section>

        {/* RIGHT: prescription builder */}
        <aside className="flex min-h-0 flex-col border-l border-slate-200 bg-surface">
          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-h3 font-semibold">Medicines</h2>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <Star /> Favorites
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2">
                    <Repeat /> Repeat last
                  </Button>
                </div>
              </div>
              <Combobox
                items={drugDb}
                getLabel={(d) => d.brand}
                getSub={(d) => `${d.generic} · ${d.company}`}
                placeholder="Search Bangladeshi drug database…"
                onSelect={(d) =>
                  setMeds((m) => [...m, { id: d.brand, brand: d.brand, generic: d.generic, dose: "১+০+১", when: "খাবারের পরে", duration: "7 days", ai: false, state: "accepted" }])
                }
              />
              <ul className="mt-3 space-y-2">
                {meds.map((m) =>
                  m.state === "dismissed" ? (
                    <li key={m.id} className="flex items-center justify-between rounded-lg border border-dashed border-slate-200 px-3 py-2 text-small text-slate-500">
                      {m.brand} removed
                      <button className="font-medium text-teal-700" onClick={() => setMeds((ms) => ms.map((x) => (x.id === m.id ? { ...x, state: "draft" } : x)))}>
                        Undo
                      </button>
                    </li>
                  ) : (
                    <li
                      key={m.id}
                      className={cn(
                        "rounded-lg border-y border-r border-l-2 px-3 py-2.5",
                        m.state === "draft" && m.ai ? "border-ai/20 border-l-ai bg-ai-bg/60" : "border-slate-200 border-l-teal-600",
                        m.id === "moxaclav" && !alerts.allergy && "ring-1 ring-danger/40"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-body font-semibold">{m.brand}</p>
                          <p className="truncate text-caption text-slate-500">{m.generic}</p>
                        </div>
                        {m.state === "draft" && m.ai ? <AiBadge label="AI" /> : <CheckCircle2 className="size-4 shrink-0 text-teal-600" aria-label="Accepted" />}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
                        <span className="tnum rounded-sm bg-slate-100 px-1.5 py-0.5 font-bn font-semibold">{m.dose}</span>
                        <span className="font-bn text-slate-700">{m.when}</span>
                        <span className="text-slate-500">· {m.duration}</span>
                      </div>
                      {m.state === "draft" && m.ai && (
                        <div className="mt-2 flex gap-1">
                          <Button size="sm" variant="secondary" className="h-7 px-2" onClick={() => setMeds((ms) => ms.map((x) => (x.id === m.id ? { ...x, state: "accepted" } : x)))}>
                            <Check /> Accept
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2">
                            <Pencil /> Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setMeds((ms) => ms.map((x) => (x.id === m.id ? { ...x, state: "dismissed" } : x)))}>
                            <X /> Dismiss
                          </Button>
                        </div>
                      )}
                    </li>
                  )
                )}
              </ul>
              {pendingMeds > 0 && (
                <button
                  className="mt-2 text-small font-medium text-ai-fg hover:underline"
                  onClick={() => setMeds((ms) => ms.map((x) => (x.state === "draft" ? { ...x, state: "accepted" } : x)))}
                >
                  Accept all {pendingMeds} AI suggestions
                </button>
              )}
            </div>

            <div>
              <h2 className="mb-2 text-h3 font-semibold">Tests</h2>
              <div className="flex flex-wrap gap-1.5">
                {testIds.map((id) => {
                  const t = testById(id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-surface py-1 pl-2.5 pr-1 text-small font-medium">
                      <CheckCircle2 className="size-3.5 text-success" aria-label="Available in-house" />
                      {t.name}
                      <button className="rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label={`Remove ${t.name}`} onClick={() => setTestIds((s) => s.filter((x) => x !== id))}>
                        <X className="size-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tests
                  .filter((t) => !testIds.includes(t.id))
                  .slice(0, 5)
                  .map((t) => (
                    <button key={t.id} onClick={() => setTestIds((s) => [...s, t.id])} className="inline-flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-2.5 py-1 text-small text-slate-500 hover:border-teal-500 hover:text-teal-800">
                      <Plus className="size-3.5" /> {t.name}
                    </button>
                  ))}
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-caption text-slate-500">
                <FlaskConical className="size-3.5" /> <CheckCircle2 className="size-3 text-success" /> = available in our lab
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-h3 font-semibold">Advice</h2>
              <div className="flex flex-wrap gap-1.5">
                {adviceTemplates.map((a) => (
                  <Chip key={a} selected={advice.includes(a)} onClick={() => setAdvice((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]))} className="font-bn">
                    {a}
                  </Chip>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-2 text-h3 font-semibold">Follow-up</h2>
              <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
                <span>
                  <span className="block text-body font-medium">Review reports remotely</span>
                  <span className="block text-caption text-slate-500">Patient won't need a report-showing visit</span>
                </span>
                <Switch checked={remote} onCheckedChange={setRemote} aria-label="Review reports remotely" />
              </label>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-small text-slate-500">Next visit</span>
                <DatePicker value={followDate} onChange={setFollowDate} className="flex-1" />
              </div>
            </div>
          </div>

          {/* Pinned safety + sign */}
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-small font-semibold">
                {unresolved ? <ShieldAlert className="size-4 text-danger" /> : <ShieldCheck className="size-4 text-success" />}
                Safety check
              </p>
              <span className="text-caption text-slate-500">
                {unresolved ? `${unresolved} to review` : "All clear"} · Interactions ✓ · Pregnancy n/a
              </span>
            </div>
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {activeAlerts.map((a) => (
                <SafetyAlert
                  key={a.id}
                  severity={a.severity}
                  category={a.category}
                  title={a.title}
                  body={a.body}
                  resolved={alerts[a.id]}
                  changeLabel={a.changeLabel}
                  onChange={a.id === "allergy" ? changeAbx : undefined}
                  onAcknowledge={() => setAlerts((s) => ({ ...s, [a.id]: "acknowledged" }))}
                />
              ))}
            </div>
            <Button
              size="lg"
              className="mt-3 w-full"
              disabled={unresolvedHigh}
              onClick={() => router.push(`/d/sign?abx=${hasCipro ? "ciprocin" : hasMoxaclav ? "moxaclav" : "none"}`)}
            >
              <FileSignature /> Review and sign
            </Button>
            {unresolvedHigh && <p className="mt-1.5 text-center text-caption text-danger-fg">Resolve the high-severity alert to continue</p>}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

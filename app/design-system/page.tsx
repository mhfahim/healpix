"use client";
import * as React from "react";
import {
  Plus,
  Download,
  Trash2,
  Settings,
  Inbox,
  ListOrdered,
  Phone,
  MessageCircle,
  Globe,
  UserRound,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/shell/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardBody,
  Badge,
  StatusPill,
  Avatar,
  Skeleton,
  Banner,
  EmptyState,
  Field,
  Input,
  Select,
  Kbd,
  SectionLabel,
} from "@/components/ui/primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent, Segmented, Chip, Switch, Checkbox, Dialog, Sheet, Combobox, DatePicker, Tooltip } from "@/components/ui/controls";
import { AiDraftBlock, SafetyAlert, Stepper, TimelineItem, Dropzone, RecordingIndicator, OfflineBadge } from "@/components/ui/clinical";
import { KpiCard, DataTable, Progress, RateBar, TickMeter, DotMatrix, Gauge, MiniBars } from "@/components/ui/data";
import { CaptureLine, RateBars, StackedCapture, Donut, Funnel, Legendary, ColumnChart, TwoSeriesBars, SimpleBars } from "@/components/ui/charts";
import { ThemeSegment } from "@/components/shell/theme";
import { IconChip, AvatarStack } from "@/components/ui/primitives";
import { Target, Wallet, FlaskConical as Flask, CalendarCheck } from "lucide-react";
import { captureTrend as trend2, outsideLabs } from "@/data/mock";
import { Toast, useToast } from "@/components/ui/toast";
import { captureTrend, deptCapture, funnel, leakReasons, metrics, drugDb, topLeakingTests } from "@/data/mock";
import { tokens, categorical } from "@/lib/tokens";
import { bdt, num } from "@/lib/utils";
import { NavPreview } from "./nav-preview";

const palette: { group: string; items: { name: string; v: string; note?: string }[] }[] = [
  {
    group: "Primary · Helpix Teal",
    items: [
      { name: "teal-50", v: "teal-50", note: "Active nav, tints" },
      { name: "teal-100", v: "teal-100" },
      { name: "teal-200", v: "teal-200" },
      { name: "teal-500", v: "teal-500", note: "Focus ring" },
      { name: "teal-600", v: "teal-600", note: "Captured" },
      { name: "teal-700", v: "teal-700", note: "PRIMARY" },
      { name: "teal-800", v: "teal-800" },
      { name: "teal-900", v: "teal-900" },
    ],
  },
  {
    group: "Neutrals · Slate (inverts in dark mode)",
    items: [
      { name: "slate-50", v: "slate-50", note: "App background" },
      { name: "surface", v: "surface", note: "Cards" },
      { name: "slate-100", v: "slate-100", note: "Fills, tracks" },
      { name: "slate-200", v: "slate-200", note: "Borders" },
      { name: "slate-400", v: "slate-400", note: "Ticks, icons" },
      { name: "slate-500", v: "slate-500", note: "Secondary text" },
      { name: "slate-700", v: "slate-700" },
      { name: "slate-900", v: "slate-900", note: "Primary text" },
    ],
  },
  {
    group: "Semantic · status only",
    items: [
      { name: "success", v: "success" },
      { name: "warning", v: "warning" },
      { name: "danger", v: "danger" },
      { name: "info", v: "info" },
      { name: "ai (AI only)", v: "ai" },
    ],
  },
  {
    group: "Tints · subtle category color (icon chips, avatars, schedule)",
    items: [
      { name: "mint", v: "mint" },
      { name: "sky", v: "sky" },
      { name: "iris", v: "iris" },
      { name: "peach", v: "peach" },
      { name: "rose", v: "rose" },
    ],
  },
  {
    group: "Data visualization",
    items: [
      { name: "Captured in-house", v: "chart-captured" },
      { name: "Leaked / outside", v: "chart-leaked" },
      { name: "Pending / unknown", v: "chart-pending" },
      { name: "Baseline (dashed)", v: "chart-baseline" },
      { name: "Secondary series", v: "chart-secondary" },
    ],
  },
];

const type = [
  { name: "Page title", cls: "text-title font-semibold", spec: "28/34 semibold −2%" },
  { name: "Display", cls: "text-display font-semibold", spec: "30/36 semibold" },
  { name: "H1", cls: "text-h1 font-semibold", spec: "24/32 semibold" },
  { name: "H2", cls: "text-h2 font-semibold", spec: "20/28 semibold" },
  { name: "H3", cls: "text-h3 font-semibold", spec: "16/24 semibold" },
  { name: "Body", cls: "text-body", spec: "14/20 regular" },
  { name: "Body-strong", cls: "text-body font-medium", spec: "14/20 medium" },
  { name: "Small", cls: "text-small", spec: "13/18" },
  { name: "Caption", cls: "text-caption text-slate-500", spec: "12/16 slate-500" },
  { name: "KPI number", cls: "text-kpi font-semibold tnum", spec: "32/40 semibold tabular" },
  { name: "Patient body", cls: "text-base", spec: "16/24 (mobile minimum)" },
];

function Section({ id, title, desc, children }: { id: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-6 border-t border-slate-200 py-10 first:border-t-0">
      <h2 className="text-h1 font-semibold">{title}</h2>
      {desc && <p className="mt-1 max-w-2xl text-body text-slate-500">{desc}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Spec({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <SectionLabel className="mb-2">{label}</SectionLabel>
      {children}
    </div>
  );
}

export default function DesignSystem() {
  const toast = useToast();
  const [seg, setSeg] = React.useState<"table" | "kanban">("table");
  const [chips, setChips] = React.useState<string[]>(["Today"]);
  const [dlg, setDlg] = React.useState(false);
  const [sheet, setSheet] = React.useState(false);
  const [date, setDate] = React.useState(new Date(2026, 10, 19));
  const [step, setStep] = React.useState(2);
  const [rec, setRec] = React.useState<"idle" | "recording" | "paused">("recording");

  const toc = ["Theme", "Foundations", "Typography", "Spacing & shape", "Buttons & inputs", "Selection", "Display", "Feedback", "AI & clinical", "Data", "Charts", "Chart language", "Overlays", "Layout"];

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-56 shrink-0 border-r border-slate-200 bg-surface p-5 lg:block">
        <Logo />
        <p className="mt-1 text-caption text-slate-500">Design System v1.0</p>
        <nav className="mt-6 flex flex-col gap-0.5">
          {toc.map((t) => (
            <a key={t} href={`#${t}`} className="rounded px-2 py-1.5 text-body text-slate-700 hover:bg-slate-100">
              {t}
            </a>
          ))}
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-content px-8 py-8">
        <p className="text-small font-medium text-teal-700">DS</p>
        <h1 className="text-display font-semibold">Design System</h1>
        <p className="mt-2 max-w-2xl text-h3 font-normal text-slate-500">
          Calm, clinical, trustworthy. shadcn/ui patterns on Radix primitives, Tailwind tokens, Lucide icons at 1.5px stroke, 4px base grid.
        </p>

        <Section id="Theme" title="Light and dark" desc="Every token is a CSS variable with a light and a dark value. Slate inverts in dark mode, saturated fills lighten and their text flips to a deep teal, so components never need dark-specific classes. The choice is remembered per viewer and defaults to the system setting.">
          <div className="flex flex-wrap items-center gap-4">
            <ThemeSegment />
            <span className="text-small text-slate-500">Also in the sidebar (Dark mode switch) and the top bar (sun/moon).</span>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <KpiCard icon={Target} label="Test capture rate" value="71%" delta="+13 pts" sub="vs. 58% baseline" spark={metrics.spark.captureRate} />
            <KpiCard icon={Wallet} tone="peach" sparkVar="chart-leaked" label="Estimated leaked" value="3,620" delta="-2.7%" deltaTone="down-good" sub="vs. Oct" spark={metrics.spark.leaked} />
            <KpiCard icon={Flask} tone="mint" sparkVar="mint" chart="line" label="Captured in-house" value="8,860" delta="+6.9%" sub="vs. Oct" spark={metrics.spark.captured} />
            <KpiCard icon={CalendarCheck} tone="iris" sparkVar="iris" chart="step" label="Slots freed" value="1,140" sub="report-only visits" spark={metrics.spark.slotsFreed} />
          </div>
        </Section>

        <Section id="Foundations" title="Color tokens" desc="Tailwind's default palette is replaced by these tokens, so screens cannot use one-off colors. Violet is reserved for AI-generated content.">
          <div className="grid gap-8">
            {palette.map((g) => (
              <div key={g.group}>
                <SectionLabel className="mb-3">{g.group}</SectionLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
                  {g.items.map((c) => (
                    <div key={c.name} className="overflow-hidden rounded-lg border border-slate-200 bg-surface">
                      <div className="flex h-14">
                        <div className="flex-1" style={{ background: `rgb(var(--${c.v}))` }} />
                        {["success", "warning", "danger", "info", "ai", "mint", "sky", "iris", "peach", "rose"].includes(c.v) && (
                          <>
                            <div className="w-5" style={{ background: `rgb(var(--${c.v}-bg))` }} />
                            <div className="w-5" style={{ background: `rgb(var(--${c.v}-fg))` }} />
                          </>
                        )}
                      </div>
                      <div className="px-2.5 py-2">
                        <p className="text-small font-medium">{c.name}</p>
                        <p className="font-mono text-caption text-slate-500">--{c.v}</p>
                        {c.note && <p className="text-caption text-slate-500">{c.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="p-5">
                <SectionLabel className="mb-3">Logo</SectionLabel>
                <div className="flex items-center gap-8">
                  <Logo size={36} />
                  <LogoMark size={48} />
                  <span className="rounded-lg bg-brand-deep p-3">
                    <LogoMark size={40} inverted />
                  </span>
                </div>
                <p className="mt-3 text-small text-slate-500">Wordmark in Inter semibold, slate-900. Mark: teal circle with an inward-curving arrow, revenue coming back.</p>
              </Card>
              <Card className="p-5">
                <SectionLabel className="mb-3">Accessibility</SectionLabel>
                <ul className="space-y-1.5 text-body text-slate-700">
                  <li>· WCAG 2.1 AA: semantic text uses the darker <code className="font-mono text-small">fg</code> shade on tints.</li>
                  <li>· Focus ring: 2px teal-500, 2px offset (Tab through this page).</li>
                  <li>· Status is never color alone: every pill and alert pairs an icon and label.</li>
                  <li>· Touch targets ≥ 44px on patient screens.</li>
                </ul>
              </Card>
            </div>
          </div>
        </Section>

        <Section id="Typography" title="Typography" desc="Geist for Latin (tight tracking on headings and figures), Noto Sans Bengali for Bangla. Tabular numerals for all figures.">
          <Card>
            {type.map((t) => (
              <div key={t.name} className="grid grid-cols-[140px_1fr_200px] items-baseline gap-4 border-b border-slate-100 px-5 py-3 last:border-0">
                <span className="text-small text-slate-500">{t.name}</span>
                <span className={t.cls}>{t.name === "KPI number" ? bdt(metrics.recovered) : "Tests prescribed vs. captured"}</span>
                <span className="font-mono text-caption text-slate-500">{t.spec}</span>
              </div>
            ))}
            <div className="grid grid-cols-[140px_1fr_200px] items-baseline gap-4 px-5 py-3">
              <span className="text-small text-slate-500">Bangla</span>
              <span className="text-h3 font-normal">রোগীর নির্দেশনা: ১+০+১, খাবারের পরে</span>
              <span className="font-mono text-caption text-slate-500">Noto Sans Bengali</span>
            </div>
          </Card>
        </Section>

        <Section id="Spacing & shape" title="Spacing, radius, elevation">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-5">
              <SectionLabel className="mb-3">8pt spacing scale</SectionLabel>
              {[4, 8, 12, 16, 24, 32, 48, 64].map((s) => (
                <div key={s} className="mb-1.5 flex items-center gap-3">
                  <span className="tnum w-8 text-caption text-slate-500">{s}</span>
                  <span className="h-3 rounded-sm bg-teal-600" style={{ width: s * 2 }} />
                </div>
              ))}
            </Card>
            <Card className="p-5">
              <SectionLabel className="mb-3">Radius</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["6px", "Buttons, inputs", "rounded"],
                  ["8px", "Cards", "rounded-lg"],
                  ["12px", "Dialogs, sheets", "rounded-xl"],
                  ["full", "Pills, avatars", "rounded-full"],
                ].map(([v, n, c]) => (
                  <div key={v} className="flex flex-col items-center gap-2">
                    <span className={`size-14 border-2 border-teal-700 bg-teal-50 ${c}`} />
                    <span className="text-caption text-slate-500">
                      {v} · {n}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <SectionLabel className="mb-3">Elevation</SectionLabel>
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 bg-surface p-3 text-small">Flat card · 1px slate-200, no shadow</div>
                <div className="rounded-lg border border-slate-200 bg-surface p-3 text-small shadow-sm">shadow-sm · popovers, dropdowns, dialogs only</div>
              </div>
            </Card>
          </div>
        </Section>

        <Section id="Buttons & inputs" title="Buttons and inputs">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-5 p-5">
              <Spec label="Variants">
                <div className="flex flex-wrap gap-2">
                  <Button>
                    <Plus /> Primary
                  </Button>
                  <Button variant="secondary">
                    <Download /> Secondary
                  </Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="destructive">
                    <Trash2 /> Destructive
                  </Button>
                  <Button variant="link">Link</Button>
                </div>
              </Spec>
              <Spec label="Sizes · sm / md / lg">
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon" variant="secondary" aria-label="Settings">
                    <Settings />
                  </Button>
                </div>
              </Spec>
              <Spec label="States">
                <div className="flex flex-wrap items-center gap-2">
                  <Button>Default</Button>
                  <Button className="bg-teal-800">Hover</Button>
                  <Button className="ring-2 ring-teal-500 ring-offset-2">Focus</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </Spec>
            </Card>
            <Card className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Patient name" hint="As written on NID">
                <Input placeholder="e.g. Rahima Begum" />
              </Field>
              <Field label="Mobile number" error="Enter an 11-digit number">
                <Input defaultValue="01711-2345" aria-invalid />
              </Field>
              <Field label="Department">
                <Select defaultValue="Medicine">
                  <option>Medicine</option>
                  <option>Cardiology</option>
                </Select>
              </Field>
              <Field label="Disabled">
                <Input disabled defaultValue="Auto-assigned" />
              </Field>
              <Field label="Combobox (drug search)" className="sm:col-span-2">
                <Combobox items={drugDb} getLabel={(d) => d.brand} getSub={(d) => `${d.generic} · ${d.company}`} onSelect={(d) => toast({ title: `Added ${d.brand}` })} placeholder="Type “met” or “cip”…" />
              </Field>
              <Field label="Date picker">
                <DatePicker value={date} onChange={setDate} />
              </Field>
              <Field label="Keyboard hints">
                <p className="flex h-9 items-center gap-1.5 text-small text-slate-500">
                  <Kbd>Enter</Kbd> confirm · <Kbd>⌘</Kbd>
                  <Kbd>K</Kbd> search
                </p>
              </Field>
            </Card>
          </div>
        </Section>

        <Section id="Selection" title="Selection controls">
          <Card className="grid gap-6 p-5 md:grid-cols-2">
            <Spec label="Tabs">
              <Tabs defaultValue="ready">
                <TabsList>
                  <TabsTrigger value="ready">
                    Ready to review <Badge tone="teal">8</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="waiting">Waiting for reports</TabsTrigger>
                  <TabsTrigger value="done">Done</TabsTrigger>
                </TabsList>
                <TabsContent value="ready" className="pt-3 text-small text-slate-500">
                  Tab content
                </TabsContent>
              </Tabs>
            </Spec>
            <Spec label="Segmented control">
              <Segmented
                value={seg}
                onChange={setSeg}
                options={[
                  { value: "table", label: "Table" },
                  { value: "kanban", label: "Kanban" },
                ]}
              />
            </Spec>
            <Spec label="Chips / pills">
              <div className="flex flex-wrap gap-2">
                {["Today", "Tomorrow", "This week"].map((c) => (
                  <Chip key={c} selected={chips.includes(c)} onClick={() => setChips((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]))}>
                    {c}
                  </Chip>
                ))}
                <Chip disabled>Disabled</Chip>
              </div>
            </Spec>
            <Spec label="Switch · Checkbox">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-body">
                  <Switch defaultChecked /> On
                </label>
                <label className="flex items-center gap-2 text-body">
                  <Switch /> Off
                </label>
                <label className="flex items-center gap-2 text-body">
                  <Checkbox defaultChecked /> I agree
                </label>
                <label className="flex items-center gap-2 text-body">
                  <Checkbox /> Unchecked
                </label>
              </div>
            </Spec>
          </Card>
        </Section>

        <Section id="Display" title="Display">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="space-y-5 p-5">
              <Spec label="Badges">
                <div className="flex flex-wrap gap-2">
                  {(["neutral", "teal", "success", "warning", "danger", "info", "ai", "outline"] as const).map((t) => (
                    <Badge key={t} tone={t}>
                      {t}
                    </Badge>
                  ))}
                </div>
              </Spec>
              <Spec label="Status pills (icon + label, never color alone)">
                <div className="flex flex-wrap gap-2">
                  {["Booked", "Arrived", "With doctor", "Done", "No-show", "Cancelled"].map((s) => (
                    <StatusPill key={s} status={s} />
                  ))}
                </div>
              </Spec>
              <Spec label="Booking channel icons">
                <div className="flex gap-4 text-small text-slate-700">
                  <span className="flex items-center gap-1.5"><Phone className="size-4 text-slate-500" />Phone</span>
                  <span className="flex items-center gap-1.5"><MessageCircle className="size-4 text-slate-500" />WhatsApp</span>
                  <span className="flex items-center gap-1.5"><Globe className="size-4 text-slate-500" />Web</span>
                  <span className="flex items-center gap-1.5"><UserRound className="size-4 text-slate-500" />Walk-in</span>
                </div>
              </Spec>
              <Spec label="Avatars">
                <div className="flex items-center gap-3">
                  <Avatar initials="FR" size="sm" />
                  <Avatar initials="TA" />
                  <Avatar initials="NJ" size="lg" />
                  <Avatar initials="KH" size="xl" />
                </div>
              </Spec>
            </Card>
            <Card>
              <CardHeader title="Card title" description="Cards: 1px slate-200 border, 8px radius, no shadow" action={<Button size="sm" variant="secondary">Action</Button>} />
              <CardBody>
                <Spec label="Skeleton loader">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                </Spec>
                <Spec label="Progress" className="mt-4">
                  <Progress value={42} label="Progress" />
                </Spec>
                <Spec label="Sidebar nav items" className="mt-4">
                  <NavPreview />
                </Spec>
              </CardBody>
            </Card>
          </div>
        </Section>

        <Section id="Feedback" title="Feedback">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Banner tone="info" title="Leak Audit in progress">
                Day 18 of 30. Keep capturing paper prescriptions at the front desk.
              </Banner>
              <Banner tone="warning" title="Dr. Rahman is running 15 min late">
                Patients after serial 9 have been notified on WhatsApp.
              </Banner>
              <Banner tone="danger" title="Lab system disconnected">
                In-house results will not sync until the LIS connection is restored.
              </Banner>
              <Banner tone="success" title="Test list sent to patient" />
              <div className="flex items-center gap-3">
                <OfflineBadge />
              </div>
            </div>
            <div className="space-y-3">
              <Toast title="Prescription sent. Test list sent to patient." />
              <Button variant="secondary" onClick={() => toast({ title: "Booking saved", body: "Serial 18 · Dr. Farhana Rahman · 7:00 PM" })}>
                Trigger toast
              </Button>
              <Card>
                <EmptyState
                  icon={Inbox}
                  title="No reports waiting"
                  body="When patients finish their tests, results appear here for remote review."
                  action={<Button size="sm" variant="secondary">View done</Button>}
                />
              </Card>
            </div>
          </div>
        </Section>

        <Section id="AI & clinical" title="AI and clinical components" desc="AI output is always a draft: 2px violet left border, “AI draft” badge with sparkle, and Accept / Edit / Dismiss. Nothing is final until a human acts.">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <AiDraftBlock title="Patient summary">
                58-year-old woman with type 2 diabetes and hypertension, here for thirst, tiredness and burning urination for 3 days. HbA1c rising (7.1 → 8.2).
              </AiDraftBlock>
              <AiDraftBlock title="Accepted state" state="accepted" onStateChange={() => {}}>
                Assessment: Type 2 DM with hyperglycemia (E11.65).
              </AiDraftBlock>
              <AiDraftBlock title="Dismissed state" state="dismissed" onStateChange={() => {}}>
                x
              </AiDraftBlock>
              <Card className="p-4">
                <SectionLabel className="mb-3">Audio recording indicator</SectionLabel>
                <RecordingIndicator state={rec} seconds={194} />
                <div className="mt-3 flex gap-2">
                  {(["recording", "paused", "idle"] as const).map((s) => (
                    <Chip key={s} selected={rec === s} onClick={() => setRec(s)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              </Card>
            </div>
            <div className="space-y-3">
              <SafetyAlert severity="high" category="Allergy conflict" title="Patient is allergic to Penicillin" body="Moxaclav 625 mg contains amoxicillin (penicillin class)." onChange={() => {}} onAcknowledge={() => {}} />
              <SafetyAlert severity="moderate" category="Kidney dosing" title="Metformin with creatinine 1.3 mg/dL" body="eGFR ≈ 52. Current dose within limit; monitor." onAcknowledge={() => {}} />
              <SafetyAlert severity="info" category="Antibiotic use" title="Urine culture recommended" onAcknowledge={() => {}} />
              <SafetyAlert severity="high" category="Allergy conflict" title="" resolved="changed" />
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <SectionLabel className="mb-4">Stepper</SectionLabel>
              <Stepper steps={["Hospital", "Departments", "Doctors", "Lab prices", "Integrations", "Go live"]} current={step} onStep={setStep} />
            </Card>
            <Card className="p-5">
              <SectionLabel className="mb-4">Timeline</SectionLabel>
              <ol>
                <TimelineItem title="Sample collected" time="9:12 AM" state="done" />
                <TimelineItem title="Processing" time="Started 9:40 AM" state="current" />
                <TimelineItem title="Report ready" state="pending" last />
              </ol>
            </Card>
          </div>
          <div className="mt-6">
            <Dropzone camera title="Drop report photos here" hint="Multiple pages OK · JPG, PNG, PDF" onFiles={(n) => toast({ title: `${n} file(s) added` })} />
          </div>
        </Section>

        <Section id="Data" title="Data display">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Test capture rate" value="71%" delta="+13 pts" sub="vs. 58% baseline" spark={metrics.spark.captureRate} />
            <KpiCard label="Estimated leaked" value={num(metrics.leaked)} delta="-2.7%" deltaTone="down-good" sub="vs. last month" spark={metrics.spark.leaked} sparkColor={tokens.chart.leaked} />
            <KpiCard label="Recovered revenue" value={bdt(metrics.recovered)} sub="vs. baseline" />
            <KpiCard label="Loading" value="" loading />
          </div>
          <Card className="mt-6 overflow-hidden">
            <DataTable
              rows={topLeakingTests}
              rowKey={(r) => r.test}
              pageSize={4}
              defaultSort={{ key: "lost", dir: "desc" }}
              columns={[
                { key: "test", header: "Test", cell: (r) => <span className="font-medium">{r.test}</span>, sort: (r) => r.test },
                { key: "prescribed", header: "Prescribed", align: "right", cell: (r) => num(r.prescribed), sort: (r) => r.prescribed },
                { key: "rate", header: "Capture rate", align: "right", cell: (r) => <RateBar value={r.rate} baseline={58} />, sort: (r) => r.rate },
                { key: "lost", header: "Est. revenue lost", align: "right", cell: (r) => bdt(r.lost), sort: (r) => r.lost },
              ]}
            />
          </Card>
        </Section>

        <Section id="Charts" title="Chart cards" desc="Captured = teal-600 · Leaked = orange · Pending = slate-300 · Baseline = slate-500 dashed · Secondary = indigo.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Line · capture rate" action={<Legendary items={[{ label: "Capture rate", color: tokens.chart.captured }, { label: "Baseline", color: tokens.chart.baseline, dashed: true }]} />} />
              <CardBody>
                <CaptureLine data={captureTrend} baseline={58} height={220} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Bar · by department" />
              <CardBody>
                <RateBars data={deptCapture} height={220} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader
                title="Stacked bar"
                action={
                  <Legendary
                    items={[
                      { label: "Captured", color: tokens.chart.captured },
                      { label: "Leaked", color: tokens.chart.leaked },
                      { label: "Pending", color: tokens.chart.pending },
                    ]}
                  />
                }
              />
              <CardBody>
                <StackedCapture
                  height={220}
                  data={deptCapture.slice(0, 5).map((d) => ({ name: d.name.split(" ")[0], captured: d.captured, leaked: Math.round((d.prescribed - d.captured) * 0.8), pending: Math.round((d.prescribed - d.captured) * 0.2) }))}
                />
              </CardBody>
            </Card>
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader title="Funnel" />
                <CardBody>
                  <Funnel data={funnel.slice(0, 3)} />
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Donut" />
                <CardBody>
                  <Donut data={leakReasons.map((r) => ({ name: r.reason, value: r.value }))} height={180} centerValue="41%" centerLabel="Price" />
                  <Legendary className="mt-2" items={leakReasons.slice(0, 4).map((r, i) => ({ label: r.reason, color: categorical[i] }))} />
                </CardBody>
              </Card>
            </div>
          </div>
        </Section>

        <Section id="Chart language" title="Chart language" desc="One grammar for every graph: dashed hairline grid, rounded capsules, the active item solid and everything else hatched in the same hue, remainders (leaked, not yet, peer band) as hatch, and a single inverse tooltip pill.">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Column · hover to move the solid bar" />
              <CardBody>
                <ColumnChart data={trend2} xKey="month" yKey="remote" name="Remote reviews" height={220} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Paired columns · comparison hatched" action={<Legendary items={[{ label: "In-person", color: tokens.slate[400], hatched: true }, { label: "Remote", color: tokens.chart.captured }]} />} />
              <CardBody>
                <TwoSeriesBars data={trend2} a={{ key: "inPerson", name: "In-person", color: tokens.slate[300] }} b={{ key: "remote", name: "Remote", color: tokens.chart.captured }} height={220} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Ranked bars · leader solid" />
              <CardBody>
                <SimpleBars data={outsideLabs} dataKey="uploads" nameKey="lab" />
              </CardBody>
            </Card>
            <Card>
              <CardHeader title="Donut · rounded, gapped, hatched unknown" />
              <CardBody>
                <Donut data={leakReasons.map((r) => ({ name: r.reason, value: r.value }))} height={200} centerValue="41%" centerLabel="Price" hatchIndex={4} />
              </CardBody>
            </Card>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <Card className="p-5">
              <SectionLabel className="mb-4">Tick meter</SectionLabel>
              <p className="tnum text-kpi font-semibold">46<span className="text-h2 font-normal text-slate-400"> / 52</span></p>
              <TickMeter value={46} max={52} ticks={52} height={28} className="mt-3" label="Active doctors" />
            </Card>
            <Card className="p-5">
              <SectionLabel className="mb-10">Dot matrix</SectionLabel>
              <DotMatrix data={[640, 690, 520, 810, 700, 600]} labels={["Sa", "Su", "Mo", "Tu", "We", "Th"]} rows={6} peakLabel="Peak: Tue" />
            </Card>
            <Card className="flex flex-col items-center p-5">
              <SectionLabel className="mb-3 self-start">Segmented gauge</SectionLabel>
              <Gauge value={72} size={200}>
                <span className="text-caption text-slate-500">Percentile</span>
                <span className="tnum text-h1 font-semibold">P72</span>
              </Gauge>
            </Card>
            <Card className="p-5">
              <SectionLabel className="mb-4">Mini bars · icon chips · avatars</SectionLabel>
              <MiniBars data={[5, 8, 6, 9, 7, 12, 10]} height={40} />
              <div className="mt-4 flex gap-2">
                {(["teal", "sky", "iris", "peach", "rose", "mint"] as const).map((t) => (
                  <IconChip key={t} icon={Target} tone={t} size="sm" />
                ))}
              </div>
              <div className="mt-4">
                <AvatarStack names={["Farhana Rahman", "Tanvir Ahmed", "Nusrat Jahan", "Kamal Hossain", "Rahima Begum"]} size="sm" />
              </div>
            </Card>
          </div>
        </Section>

        <Section id="Overlays" title="Overlays">
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDlg(true)}>
              Open dialog
            </Button>
            <Button variant="secondary" onClick={() => setSheet(true)}>
              Open sheet
            </Button>
            <Tooltip content="Tooltips use shadow-sm, like popovers.">
              <Button variant="ghost">Hover for tooltip</Button>
            </Tooltip>
          </div>
          <Dialog
            open={dlg}
            onOpenChange={setDlg}
            title="Cancel this booking?"
            description="Serial 18 with Dr. Farhana Rahman on Thursday, 19 Nov."
            footer={
              <>
                <Button variant="secondary" onClick={() => setDlg(false)}>
                  Keep booking
                </Button>
                <Button variant="destructive" onClick={() => setDlg(false)}>
                  Cancel booking
                </Button>
              </>
            }
          />
          <Sheet open={sheet} onOpenChange={setSheet} title="Create recovery action" description="Side sheet · 12px radius" footer={<Button onClick={() => setSheet(false)}>Done</Button>}>
            <p className="text-body text-slate-500">Sheet content.</p>
          </Sheet>
        </Section>

        <Section id="Layout" title="Layout" desc="Desktop: 248px collapsible sidebar with section labels, 64px top bar with search, page title in the content area, content max 1320 on a 12-column grid with 24px gutters. Patient: single column, 16px padding, sticky bottom action bar, 44px min touch targets.">
          <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <div className="flex h-56 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <div className="w-1/5 border-r border-slate-200 bg-surface p-2">
                <div className="h-6 rounded bg-slate-100" />
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className={`mt-2 h-4 rounded ${i === 0 ? "bg-teal-50" : "bg-slate-100"}`} />
                ))}
              </div>
              <div className="flex-1">
                <div className="h-8 border-b border-slate-200 bg-surface" />
                <div className="grid grid-cols-12 gap-2 p-3">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="h-36 rounded-sm bg-teal-50 ring-1 ring-teal-100" />
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-auto flex h-56 w-28 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <div className="h-6 border-b border-slate-200 bg-surface" />
              <div className="flex-1 space-y-1.5 p-2">
                <div className="h-8 rounded bg-surface ring-1 ring-slate-200" />
                <div className="h-8 rounded bg-surface ring-1 ring-slate-200" />
              </div>
              <div className="border-t border-slate-200 bg-surface p-1.5">
                <div className="h-5 rounded bg-teal-700" />
              </div>
            </div>
          </div>
        </Section>
      </main>
    </div>
  );
}


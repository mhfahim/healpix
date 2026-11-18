"use client";
import * as React from "react";
import { BellRing, Home, Package, Plus, MessageCircle, MessageSquare, Users, ArrowUpRight, Clock } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, Badge, Field, Select, SectionLabel } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Chip, Segmented, Sheet, Switch } from "@/components/ui/controls";
import { KpiCard } from "@/components/ui/data";
import { recoveryActions, departments } from "@/data/mock";
import { bdt, cn, num } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const icons = { remind: BellRing, home: Home, package: Package } as Record<string, any>;

export default function Recovery({ searchParams }: { searchParams: { create?: string } }) {
  const [actions, setActions] = React.useState(recoveryActions);
  const [open, setOpen] = React.useState(searchParams.create === "1");
  const toast = useToast();
  const total = actions.reduce((s, a) => s + a.recovered, 0);
  return (
    <AppShell
      surface="management"
      title="Recovery actions"
      subtitle="Automated nudges that bring prescribed tests back in-house"
      management
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus /> Create action
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Active actions" value={`${actions.filter((a) => a.on).length} of ${actions.length}`} />
        <KpiCard label="Patients reached" value={num(actions.reduce((s, a) => s + a.reach, 0))} sub="this month" />
        <KpiCard label="Tests booked after nudge" value={num(actions.reduce((s, a) => s + a.conversions, 0))} delta="+18%" sub="vs. Oct" />
        <KpiCard label="Revenue recovered by actions" value={bdt(total)} sub={`of ${bdt(3240000)} total recovered`} />
      </div>

      <div className="mt-6 space-y-3">
        {actions.map((a) => {
          const Icon = icons[a.id];
          const conv = a.reach ? Math.round((a.conversions / a.reach) * 100) : 0;
          return (
            <Card key={a.id} className={cn("flex flex-wrap items-center gap-6 p-5", !a.on && "bg-slate-50")}>
              <span className={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-lg", a.on ? "bg-teal-50 text-teal-700" : "bg-slate-100 text-slate-500")}>
                <Icon className="size-5" strokeWidth={1.5} />
              </span>
              <div className="min-w-[280px] flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-h3 font-semibold">{a.title}</p>
                  <Badge tone={a.on ? "success" : "neutral"}>{a.on ? "Running" : "Paused"}</Badge>
                </div>
                <p className="text-small text-slate-500">{a.detail}</p>
              </div>
              <dl className="grid grid-cols-3 gap-8 text-right">
                <div>
                  <dt className="text-caption text-slate-500">Reach</dt>
                  <dd className="tnum text-h3 font-semibold">{a.reach ? num(a.reach) : "—"}</dd>
                </div>
                <div>
                  <dt className="text-caption text-slate-500">Conversions</dt>
                  <dd className="tnum text-h3 font-semibold">
                    {a.conversions ? num(a.conversions) : "—"} {conv > 0 && <span className="text-caption font-normal text-slate-500">{conv}%</span>}
                  </dd>
                </div>
                <div>
                  <dt className="text-caption text-slate-500">Recovered</dt>
                  <dd className="tnum text-h3 font-semibold text-teal-800">{a.recovered ? bdt(a.recovered) : "—"}</dd>
                </div>
              </dl>
              <label className="flex items-center gap-2 text-small text-slate-700">
                <Switch
                  checked={a.on}
                  onCheckedChange={(v) => {
                    setActions((s) => s.map((x) => (x.id === a.id ? { ...x, on: v } : x)));
                    toast({ title: v ? "Action resumed" : "Action paused", body: a.title, tone: "info" });
                  }}
                  aria-label={`Toggle ${a.title}`}
                />
                {a.on ? "On" : "Off"}
              </label>
            </Card>
          );
        })}
      </div>

      <CreateActionSheet
        open={open}
        onOpenChange={setOpen}
        onCreate={() => {
          setActions((s) => [
            ...s,
            { id: "remind", title: "Lipid Profile price offer for Cardiology patients", detail: "WhatsApp · Cardiology · Starts tomorrow 10:00 AM", on: true, reach: 0, conversions: 0, recovered: 0 },
          ]);
          setOpen(false);
          toast({ title: "Recovery action scheduled", body: "First messages go out tomorrow at 10:00 AM" });
        }}
      />
    </AppShell>
  );
}

function CreateActionSheet({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: () => void }) {
  const [tests, setTests] = React.useState<string[]>(["Lipid Profile"]);
  const [depts, setDepts] = React.useState<string[]>(["Cardiology"]);
  const [channel, setChannel] = React.useState<"whatsapp" | "sms">("whatsapp");
  const [type, setType] = React.useState("price");
  const toggle = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Create recovery action"
      description="From insight: Lipid Profile leaks most in Cardiology (price)"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Save as draft
          </Button>
          <Button onClick={onCreate}>Schedule action</Button>
        </>
      }
    >
      <div className="space-y-6">
        <div>
          <SectionLabel className="mb-2">Action type</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["price", "Price offer", Package],
              ["home", "Home collection", Home],
              ["remind", "Reminder", BellRing],
            ].map(([v, l, I]: any) => (
              <button
                key={v}
                onClick={() => setType(v)}
                className={cn("flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-body font-medium", type === v ? "border-teal-700 bg-teal-50 ring-1 ring-teal-700" : "border-slate-200 hover:bg-slate-50")}
              >
                <I className="size-4 text-teal-700" /> {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel className="mb-2">Target tests</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {["Lipid Profile", "Echocardiogram", "USG Whole Abdomen", "HbA1c", "TSH", "ECG"].map((t) => (
              <Chip key={t} selected={tests.includes(t)} onClick={() => toggle(tests, setTests, t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
        <div>
          <SectionLabel className="mb-2">Departments</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <Chip key={d.id} selected={depts.includes(d.name)} onClick={() => toggle(depts, setDepts, d.name)}>
                {d.name}
              </Chip>
            ))}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-small text-slate-500">
            <Users className="size-4" /> Estimated reach: <span className="tnum font-medium text-slate-900">~330 patients</span> per month
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Offer">
            <Select defaultValue="950">
              <option value="950">Lipid Profile at ৳ 950 (save ৳ 250)</option>
              <option value="1000">Lipid Profile at ৳ 1,000</option>
            </Select>
          </Field>
          <Field label="Send">
            <Select defaultValue="24">
              <option value="24">24 h after visit, if not booked</option>
              <option value="48">48 h after visit</option>
            </Select>
          </Field>
        </div>
        <div>
          <SectionLabel className="mb-2">Channel</SectionLabel>
          <Segmented
            value={channel}
            onChange={setChannel}
            options={[
              { value: "whatsapp", label: <><MessageCircle /> WhatsApp</> },
              { value: "sms", label: <><MessageSquare /> SMS</> },
            ]}
          />
        </div>
        <div>
          <SectionLabel className="mb-2">Message preview (Bangla)</SectionLabel>
          <div className="rounded-lg bg-whatsapp-bg p-4">
            <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-white p-3 text-body shadow-sm">
              <p className="font-bn">
                আসসালামু আলাইকুম রহিমা বেগম, ডা. তানভীর আহমেদ আপনার জন্য লিপিড প্রোফাইল পরীক্ষা দিয়েছেন। মেরিডিয়ান হাসপাতালে এখন মাত্র ৳ ৯৫০ (আগে ৳ ১,২০০)। রিপোর্ট সরাসরি আপনার ডাক্তারের কাছে যাবে।
              </p>
              <p className="mt-2 border-t border-slate-100 pt-2 text-center font-medium text-info-fg">পরীক্ষা বুক করুন</p>
            </div>
            <p className="mt-2 text-caption text-slate-500">{"{patient_name}"} and {"{doctor_name}"} are filled per patient. Opt-out link included.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Start">
            <Select defaultValue="tomorrow">
              <option value="tomorrow">Tomorrow, 20 Nov · 10:00 AM</option>
            </Select>
          </Field>
          <Field label="Quiet hours" hint="No messages 9 PM – 9 AM">
            <p className="flex h-9 items-center gap-1.5 text-body text-slate-700">
              <Clock className="size-4 text-slate-500" /> Respected
            </p>
          </Field>
        </div>
        <p className="flex items-center gap-1.5 text-caption text-slate-500">
          <ArrowUpRight className="size-3.5" /> Only patients with an active care-records consent receive messages.
        </p>
      </div>
    </Sheet>
  );
}

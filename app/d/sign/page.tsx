"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, KeyRound, MessageCircle, MessageSquare, Printer, Send, PenLine } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, Badge, SectionLabel } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Dialog, Segmented, Switch, Checkbox } from "@/components/ui/controls";
import { LogoMark } from "@/components/shell/logo";
import { adviceTemplates, doctors, hospital, icd, patients, prescribedTestIds, rxMeds, rxReplacement, testById, vitals } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function Sign({ searchParams }: { searchParams: { abx?: string } }) {
  const router = useRouter();
  const toast = useToast();
  const doc = doctors[0];
  const p = patients.rahima;
  const abx = searchParams.abx ?? "ciprocin";
  const meds = rxMeds
    .filter((m) => m.id !== "moxaclav")
    .concat(abx === "moxaclav" ? [rxMeds[2]] : abx === "none" ? [] : [rxReplacement]);
  const [signed, setSigned] = React.useState(false);
  const [pinOpen, setPinOpen] = React.useState(false);
  const [pin, setPin] = React.useState("");
  const [method, setMethod] = React.useState<"pin" | "signature">("pin");
  const [sendWa, setSendWa] = React.useState(true);
  const [sendSms, setSendSms] = React.useState(true);
  const [withTests, setWithTests] = React.useState(true);

  const send = () => {
    toast({ title: "Prescription sent. Test list sent to patient.", body: "WhatsApp + SMS to 01711-234567" });
    setTimeout(() => router.push("/p/tests"), 1400);
  };

  return (
    <AppShell
      surface="doctor"
      title={
        <span className="flex items-center gap-2">
          <button onClick={() => router.back()} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Back to consultation">
            <ArrowLeft className="size-4" />
          </button>
          Prescription preview
        </span>
      }
      subtitle={`${p.name} · Serial 9`}
    >
      <div className="grid grid-cols-12 gap-6">
        {/* A4 preview */}
        <div className="col-span-12 lg:col-span-8">
          <div className="mx-auto aspect-[210/297] w-full max-w-[720px] overflow-hidden rounded-sm border border-slate-200 bg-surface text-slate-900">
            {/* Letterhead */}
            <div className="flex items-start justify-between border-b-2 border-teal-700 px-10 pb-4 pt-8">
              <div>
                <p className="text-h2 font-semibold">{doc.name}</p>
                <p className="text-small text-slate-700">{doc.degrees}</p>
                <p className="text-small text-slate-700">Consultant, Medicine · BMDC Reg. A-47000</p>
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-2 text-body font-semibold">
                  <span className="inline-flex size-7 items-center justify-center rounded bg-slate-900 text-caption text-on-accent">MS</span>
                  {hospital.name}
                </p>
                <p className="text-caption text-slate-500">{hospital.address}</p>
                <p className="text-caption text-slate-500">Hotline {hospital.hotline} · Room {doc.room}</p>
              </div>
            </div>
            <div className="tnum flex flex-wrap justify-between gap-2 border-b border-slate-200 px-10 py-2.5 text-small">
              <span>
                <span className="text-slate-500">Patient:</span> <span className="font-medium">{p.name}</span>
              </span>
              <span>
                <span className="text-slate-500">Age/Sex:</span> {p.age} / F
              </span>
              <span>
                <span className="text-slate-500">ID:</span> {p.id}
              </span>
              <span>
                <span className="text-slate-500">Date:</span> 19 Nov 2026
              </span>
            </div>
            <div className="grid grid-cols-[38%_62%] text-small">
              <div className="space-y-4 border-r border-slate-200 px-6 py-5">
                <div>
                  <p className="font-semibold">C/C</p>
                  <ul className="mt-0.5 list-inside list-disc text-slate-700">
                    <li>Increased thirst, tiredness × 3 d</li>
                    <li>Burning micturition × 3 d</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">O/E</p>
                  <p className="tnum text-slate-700">
                    BP {vitals[0].value} · P 88 · T 99.4°F · SpO2 97% · RBS 13.8
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Dx</p>
                  <ul className="mt-0.5 text-slate-700">
                    {icd.map((c) => (
                      <li key={c.code}>
                        {c.label.replace(", site not specified", "")} <span className="font-mono text-caption text-slate-500">({c.code})</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Investigations</p>
                  <ul className="mt-0.5 list-inside list-disc text-slate-700">
                    {prescribedTestIds.map((id) => (
                      <li key={id}>{testById(id).name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-danger-fg">Allergy: Penicillin</p>
                </div>
              </div>
              <div className="px-6 py-5">
                <p className="font-serif text-h1 font-semibold italic">℞</p>
                <ol className="mt-2 space-y-3">
                  {meds.map((m, i) => (
                    <li key={m.id}>
                      <p className="font-semibold">
                        {i + 1}. {m.brand} <span className="font-normal text-slate-500">({m.generic})</span>
                      </p>
                      <p className="font-bn text-slate-700">
                        {m.dose} — {m.when} — {m.duration === "3 months" ? "৩ মাস" : m.duration === "5 days" ? "৫ দিন" : "৭ দিন"}
                      </p>
                    </li>
                  ))}
                </ol>
                <div className="mt-6">
                  <p className="font-semibold">উপদেশ</p>
                  <ul className="mt-1 list-inside list-disc font-bn text-slate-700">
                    {adviceTemplates.slice(0, 3).map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-2.5 font-bn text-slate-700">
                  রিপোর্ট হলে ডাক্তার অনলাইনে দেখে জানাবেন। রিপোর্ট দেখাতে আলাদা করে আসার দরকার নেই।
                  <span className="block font-sans text-caption text-slate-500">Reports will be reviewed remotely. Next visit: 19 Dec 2026.</span>
                </div>
                <div className="mt-10 flex justify-end">
                  <div className="text-center">
                    {signed ? (
                      <p className="font-serif text-h2 italic text-teal-900">F. Rahman</p>
                    ) : (
                      <p className="h-8 text-caption text-slate-400">Not signed</p>
                    )}
                    <p className="border-t border-slate-300 pt-1 text-caption text-slate-500">
                      {doc.name} {signed && "· signed 6:41 PM"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-auto flex items-center justify-center gap-1.5 border-t border-slate-100 py-2 text-caption text-slate-400">
              <LogoMark size={12} /> Digital prescription via Helpix · verify at helpix.app/v/7Q2K
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-12 space-y-4 lg:col-span-4">
          <Card className="p-5">
            <SectionLabel className="mb-3">1 · Sign</SectionLabel>
            {signed ? (
              <p className="flex items-center gap-2 text-body font-medium text-success-fg">
                <CheckCircle2 className="size-5" /> Signed with PIN at 6:41 PM
              </p>
            ) : (
              <>
                <Segmented
                  value={method}
                  onChange={setMethod}
                  className="w-full"
                  options={[
                    { value: "pin", label: <><KeyRound /> PIN</> },
                    { value: "signature", label: <><PenLine /> Signature</> },
                  ]}
                />
                <Button size="lg" className="mt-3 w-full" onClick={() => setPinOpen(true)}>
                  <PenLine /> Sign prescription
                </Button>
              </>
            )}
          </Card>
          <Card className={cn("p-5", !signed && "opacity-60")}>
            <SectionLabel className="mb-3">2 · Send to patient</SectionLabel>
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 text-body">
                <Checkbox checked={sendWa} onCheckedChange={(v) => setSendWa(!!v)} disabled={!signed} /> <MessageCircle className="size-4 text-slate-500" /> WhatsApp
              </label>
              <label className="flex items-center gap-2.5 text-body">
                <Checkbox checked={sendSms} onCheckedChange={(v) => setSendSms(!!v)} disabled={!signed} /> <MessageSquare className="size-4 text-slate-500" /> SMS with link
              </label>
              <label className="flex items-start justify-between gap-3 rounded-lg border border-teal-200 bg-teal-50 p-3">
                <span>
                  <span className="block text-body font-medium">Send test list with one-tap booking</span>
                  <span className="block text-caption text-slate-700">4 tests · ৳ 2,900 at Meridian lab prices</span>
                </span>
                <Switch checked={withTests} onCheckedChange={setWithTests} disabled={!signed} aria-label="Send test list with one-tap booking" />
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" disabled={!signed} onClick={() => window.print()}>
                <Printer /> Print
              </Button>
              <Button className="flex-1" disabled={!signed || (!sendWa && !sendSms)} onClick={send}>
                <Send /> Send to patient
              </Button>
            </div>
          </Card>
          <Badge tone="neutral">Bilingual: clinical terms in English, patient instructions in Bangla</Badge>
        </div>
      </div>

      <Dialog
        open={pinOpen}
        onOpenChange={setPinOpen}
        title={method === "pin" ? "Enter your 4-digit signing PIN" : "Sign below"}
        description="Your signature makes this prescription final. AI drafts you accepted become part of the record."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPinOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={method === "pin" && pin.length < 4}
              onClick={() => {
                setSigned(true);
                setPinOpen(false);
              }}
            >
              Sign
            </Button>
          </>
        }
      >
        {method === "pin" ? (
          <input
            autoFocus
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            className="tnum h-14 w-full rounded border border-slate-200 text-center text-h1 tracking-[0.6em] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            aria-label="Signing PIN"
            placeholder="••••"
          />
        ) : (
          <div className="flex h-32 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 font-serif text-h1 italic text-teal-900">F. Rahman</div>
        )}
      </Dialog>
    </AppShell>
  );
}

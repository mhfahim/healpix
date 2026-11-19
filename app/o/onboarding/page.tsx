"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Plus, Rocket, Trash2, FileSpreadsheet, MessageCircle, MessageSquare, PhoneCall, FlaskConical } from "lucide-react";
import { Logo } from "@/components/shell/logo";
import { ThemeToggle } from "@/components/shell/theme";
import { Button } from "@/components/ui/button";
import { Card, CardBody, Field, Input, Select, Badge, SectionLabel, Textarea, Banner, Avatar } from "@/components/ui/primitives";
import { Stepper, Dropzone } from "@/components/ui/clinical";
import { Chip, Checkbox, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/controls";
import { DataTable } from "@/components/ui/data";
import { departments, doctors, hospital, tests } from "@/data/mock";
import { bdt, cn } from "@/lib/utils";

const steps = ["Hospital & branches", "Departments", "Doctors & schedules", "Lab price list", "Integrations", "Consent & go-live"];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [depts, setDepts] = React.useState<string[]>(departments.map((d) => d.name));
  const [docsImported, setDocsImported] = React.useState(false);
  const [priceUploaded, setPriceUploaded] = React.useState(false);
  const [connected, setConnected] = React.useState<string[]>(["Lab system (LIS)"]);
  const last = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-surface">
        <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
          <Logo />
          <span className="flex items-center gap-3 text-small text-slate-500">Hospital setup · saved automatically <ThemeToggle /></span>
        </div>
      </header>
      <div className="mx-auto max-w-content px-6 py-8">
        <Stepper steps={steps} current={step} onStep={setStep} />
        <div className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-small font-medium text-teal-700">
              Step {step + 1} of {steps.length}
            </p>
            <h1 className="text-h1 font-semibold">{steps[step]}</h1>

            <Card className="mt-5">
              <CardBody className="space-y-5 py-5">
                {step === 0 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Hospital name" className="col-span-2">
                        <Input defaultValue={hospital.name} />
                      </Field>
                      <Field label="Name in Bangla" className="col-span-2">
                        <Input defaultValue={hospital.nameBn} className="font-bn" />
                      </Field>
                      <Field label="Hotline">
                        <Input defaultValue={hospital.hotline} />
                      </Field>
                      <Field label="Hospital type">
                        <Select defaultValue="private">
                          <option value="private">Private specialized hospital</option>
                          <option value="chain">Diagnostic chain</option>
                        </Select>
                      </Field>
                    </div>
                    <div>
                      <SectionLabel className="mb-2">Branches</SectionLabel>
                      {hospital.branches.map((b) => (
                        <div key={b.name} className="mb-2 flex items-center gap-3">
                          <Input defaultValue={b.name} />
                          <Button size="icon" variant="ghost" aria-label="Remove branch">
                            <Trash2 />
                          </Button>
                        </div>
                      ))}
                      <Button size="sm" variant="secondary">
                        <Plus /> Add branch
                      </Button>
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <p className="text-body text-slate-500">Pick the outpatient departments that will use Helpix. You can add more later.</p>
                    <div className="flex flex-wrap gap-2">
                      {[...departments.map((d) => d.name), "Neurology", "ENT", "Dermatology", "Nephrology"].map((d) => (
                        <Chip key={d} selected={depts.includes(d)} onClick={() => setDepts((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]))}>
                          {d}
                        </Chip>
                      ))}
                    </div>
                    <p className="tnum text-small text-slate-500">{depts.length} departments selected</p>
                  </>
                )}
                {step === 2 && (
                  <Tabs defaultValue="csv">
                    <TabsList>
                      <TabsTrigger value="csv">CSV upload</TabsTrigger>
                      <TabsTrigger value="manual">Add manually</TabsTrigger>
                    </TabsList>
                    <TabsContent value="csv" className="pt-4">
                      {docsImported ? (
                        <>
                          <Banner tone="success" title="52 doctors imported">
                            48 with chamber schedules. 4 need a schedule before go-live.
                          </Banner>
                          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                            <DataTable
                              dense
                              rows={doctors}
                              rowKey={(r) => r.id}
                              columns={[
                                { key: "n", header: "Doctor", cell: (r) => <span className="flex items-center gap-2"><Avatar initials={r.initials} size="sm" />{r.name}</span> },
                                { key: "d", header: "Department", cell: (r) => departments.find((x) => x.id === r.dept)?.name },
                                { key: "s", header: "Chamber schedule", cell: (r) => `${r.days} · ${r.time}` },
                                { key: "l", header: "Serial limit", align: "right", cell: (r) => r.queue.total },
                              ]}
                            />
                          </div>
                        </>
                      ) : (
                        <Dropzone title="Drop your doctor list (CSV or Excel)" hint="Columns: name, department, BMDC no., mobile, chamber days, time, serial limit" onFiles={() => setDocsImported(true)} />
                      )}
                      <Button variant="link" className="mt-2">
                        <FileSpreadsheet className="size-4" /> Download CSV template
                      </Button>
                    </TabsContent>
                    <TabsContent value="manual" className="grid grid-cols-2 gap-4 pt-4">
                      <Field label="Name"><Input placeholder="Dr. …" /></Field>
                      <Field label="Department"><Select>{departments.map((d) => <option key={d.id}>{d.name}</option>)}</Select></Field>
                      <Field label="Chamber days"><Input placeholder="Sat – Thu" /></Field>
                      <Field label="Time"><Input placeholder="5:00 PM – 9:00 PM" /></Field>
                    </TabsContent>
                  </Tabs>
                )}
                {step === 3 && (
                  <>
                    {priceUploaded ? (
                      <>
                        <Banner tone="success" title="148 tests imported">
                          Bangla names auto-filled for 131 tests. Review the 17 highlighted ones.
                        </Banner>
                        <div className="overflow-hidden rounded-lg border border-slate-200">
                          <DataTable
                            dense
                            rows={tests.slice(0, 6)}
                            rowKey={(r) => r.id}
                            columns={[
                              { key: "n", header: "Test", cell: (r) => r.name },
                              { key: "b", header: "Bangla", cell: (r) => <span className="font-bn">{r.bn}</span> },
                              { key: "p", header: "Price", align: "right", cell: (r) => bdt(r.price) },
                              { key: "pr", header: "Preparation", cell: (r) => <span className="text-slate-500">{r.prep}</span> },
                            ]}
                          />
                        </div>
                      </>
                    ) : (
                      <Dropzone title="Upload your lab test price list" hint="Excel, CSV or a PDF of your rate chart" onFiles={() => setPriceUploaded(true)} />
                    )}
                  </>
                )}
                {step === 4 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ["Lab system (LIS)", FlaskConical, "Required to measure capture"],
                      ["WhatsApp Business", MessageCircle, "Booking, test lists, results"],
                      ["SMS gateway", MessageSquare, "Fallback for patients without WhatsApp"],
                      ["Phone line / IVR", PhoneCall, "Call-backs and phone bookings"],
                    ].map(([n, I, d]: any) => {
                      const on = connected.includes(n);
                      return (
                        <div key={n} className={cn("flex items-start gap-3 rounded-lg border p-4", on ? "border-teal-200 bg-teal-50" : "border-slate-200")}>
                          <I className="mt-0.5 size-5 text-teal-700" strokeWidth={1.5} />
                          <div className="flex-1">
                            <p className="text-body font-semibold">{n}</p>
                            <p className="text-small text-slate-500">{d}</p>
                            {on ? (
                              <Badge tone="success" icon={CheckCircle2} className="mt-2">Connected</Badge>
                            ) : (
                              <Button size="sm" variant="secondary" className="mt-2" onClick={() => setConnected((s) => [...s, n])}>
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {step === 5 && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Consent text (Bangla)" hint="Shown to patients at booking">
                        <Textarea
                          className="font-bn"
                          rows={5}
                          defaultValue="মেরিডিয়ান আপনার চিকিৎসার জন্য আপনার ভিজিট, প্রেসক্রিপশন ও পরীক্ষার তথ্য সংরক্ষণ করবে। আপনি যেকোনো সময় এগুলো মুছে ফেলতে বলতে পারেন।"
                        />
                      </Field>
                      <Field label="Consent text (English)" hint="Prefilled template · reviewed by legal">
                        <Textarea rows={5} defaultValue="Meridian will keep your visit, prescription, and test records to care for you. You can ask us to delete them anytime." />
                      </Field>
                    </div>
                    <label className="flex items-center gap-2 text-body">
                      <Checkbox defaultChecked /> Ask separately for consent to record consultations (AI scribe)
                    </label>
                    <div>
                      <SectionLabel className="mb-2">Go-live checklist</SectionLabel>
                      <ul className="space-y-2">
                        {[
                          ["Hospital and branches", true],
                          [`${depts.length} departments`, true],
                          ["52 doctors imported", docsImported],
                          ["Lab price list (148 tests)", priceUploaded],
                          ["Lab system connected", connected.includes("Lab system (LIS)")],
                          ["WhatsApp connected", connected.includes("WhatsApp Business")],
                          ["Front desk training (2 sessions)", true],
                        ].map(([l, ok]) => (
                          <li key={l as string} className="flex items-center gap-2 text-body">
                            {ok ? <CheckCircle2 className="size-4 text-success" /> : <Circle className="size-4 text-slate-300" />}
                            <span className={ok ? "" : "text-slate-500"}>{l}</span>
                            {!ok && <Badge tone="warning" size="sm">To do</Badge>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardBody>
              <div className="flex justify-between border-t border-slate-200 px-5 py-4">
                <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft /> Back
                </Button>
                {last ? (
                  <Button size="lg" onClick={() => router.push("/m/overview?state=empty")}>
                    <Rocket /> Go live
                  </Button>
                ) : (
                  <Button onClick={() => setStep((s) => s + 1)}>
                    Continue <ArrowRight />
                  </Button>
                )}
              </div>
            </Card>
          </div>
          <aside className="col-span-12 lg:col-span-4">
            <Card className="p-5">
              <p className="text-h3 font-semibold">Need help?</p>
              <p className="mt-1 text-body text-slate-500">Your Helpix onboarding lead can do any step with you on a call.</p>
              <Button variant="secondary" className="mt-3">
                <PhoneCall /> Book a setup call
              </Button>
            </Card>
            <Card className="mt-4 p-5">
              <p className="text-small font-medium text-slate-500">Leak Audit baseline</p>
              <p className="tnum text-kpi font-semibold">58%</p>
              <p className="text-small text-slate-500">from your 30-day audit. Progress after go-live is measured against this.</p>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

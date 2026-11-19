"use client";
import { Plus, Star, GripVertical, Trash2, Clock, PenLine } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Field, Input, Select, SectionLabel, Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent, Switch } from "@/components/ui/controls";
import { Dropzone } from "@/components/ui/clinical";
import { adviceTemplates, doctors, drugDb } from "@/data/mock";

const tabs = ["Letterhead", "Signature", "Favorites & templates", "Advice (Bangla)", "Availability", "Remote review blocks", "Notifications"];

export default function DoctorSettings({ searchParams }: { searchParams: { tab?: string } }) {
  const doc = doctors[0];
  const initial = searchParams.tab === "templates" ? "Favorites & templates" : "Letterhead";
  return (
    <AppShell surface="doctor" title="Settings" subtitle={doc.name}>
      <Tabs defaultValue={initial} orientation="vertical" className="grid grid-cols-[220px_1fr] gap-6">
        <TabsList className="h-fit flex-col items-stretch gap-0.5 border-0">
          {tabs.map((t) => (
            <TabsTrigger
              key={t}
              value={t}
              className="mb-0 h-9 justify-start rounded border-b-0 px-3 data-[state=active]:bg-teal-50"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
        <div>
          <TabsContent value="Letterhead">
            <Card>
              <CardHeader title="Letterhead" description="Shown at the top of every prescription" />
              <CardBody className="grid grid-cols-2 gap-4">
                <Field label="Name on prescription">
                  <Input defaultValue={doc.name} />
                </Field>
                <Field label="Degrees">
                  <Input defaultValue={doc.degrees} />
                </Field>
                <Field label="Designation">
                  <Input defaultValue="Consultant, Medicine" />
                </Field>
                <Field label="BMDC registration">
                  <Input defaultValue="A-47000" />
                </Field>
                <Field label="Name in Bangla">
                  <Input defaultValue={doc.bn} className="font-bn" />
                </Field>
                <Field label="Layout">
                  <Select defaultValue="two">
                    <option value="two">Two columns (findings | ℞)</option>
                    <option value="one">Single column</option>
                  </Select>
                </Field>
                <div className="col-span-2 flex justify-end">
                  <Button>Save letterhead</Button>
                </div>
              </CardBody>
            </Card>
          </TabsContent>
          <TabsContent value="Signature">
            <Card>
              <CardHeader title="Signature" description="Used when you sign with PIN" />
              <CardBody className="grid grid-cols-2 gap-6">
                <div>
                  <SectionLabel className="mb-2">Current</SectionLabel>
                  <div className="flex h-28 items-center justify-center rounded-lg border border-slate-200 font-serif text-h1 italic text-teal-900">F. Rahman</div>
                  <Button variant="secondary" size="sm" className="mt-2">
                    <PenLine /> Draw new
                  </Button>
                </div>
                <Dropzone title="Upload signature image" hint="PNG with transparent background" />
                <Field label="Signing PIN" hint="4 digits · required for every prescription">
                  <Button variant="secondary" className="w-fit">Change PIN</Button>
                </Field>
              </CardBody>
            </Card>
          </TabsContent>
          <TabsContent value="Favorites & templates">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader title="Favorite medicines" icon={Star} action={<Button size="sm" variant="secondary"><Plus /> Add</Button>} />
                <CardBody className="space-y-1">
                  {drugDb.slice(0, 7).map((d) => (
                    <div key={d.brand} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-slate-50">
                      <GripVertical className="size-4 text-slate-300" />
                      <span className="flex-1 text-body font-medium">{d.brand}</span>
                      <span className="text-caption text-slate-500">{d.generic}</span>
                    </div>
                  ))}
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Prescription templates" action={<Button size="sm" variant="secondary"><Plus /> New</Button>} />
                <CardBody className="space-y-2">
                  {[
                    ["Diabetes follow-up", "Comet XR, HbA1c, Lipid Profile, Creatinine · 3 months", 128],
                    ["Uncomplicated UTI", "Ciprocin 500 · Urine R/E · 5 days", 64],
                    ["Hypertension new", "Camlodin 5 · ECG, Creatinine · 1 month", 41],
                    ["Viral fever", "Napa 500 · CBC if > 3 days", 37],
                  ].map(([n, d, u]) => (
                    <div key={n as string} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                      <div>
                        <p className="text-body font-medium">{n}</p>
                        <p className="text-caption text-slate-500">{d}</p>
                      </div>
                      <Badge tone="neutral">Used {u}×</Badge>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="Advice (Bangla)">
            <Card>
              <CardHeader title="Advice templates" description="Printed in Bangla on the patient's prescription" action={<Button size="sm" variant="secondary"><Plus /> Add advice</Button>} />
              <CardBody className="space-y-2">
                {[...adviceTemplates, "ধূমপান সম্পূর্ণ বন্ধ করুন", "রক্তে শর্করা মাপার খাতা রাখুন"].map((a) => (
                  <div key={a} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
                    <GripVertical className="size-4 text-slate-300" />
                    <span className="flex-1 font-bn text-body">{a}</span>
                    <Button size="icon-sm" variant="ghost" aria-label="Delete">
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </CardBody>
            </Card>
          </TabsContent>
          <TabsContent value="Availability">
            <Card>
              <CardHeader title="Chamber availability and serial limits" />
              <CardBody>
                <table className="w-full text-body">
                  <thead>
                    <tr className="text-left text-caption text-slate-500">
                      <th className="py-2 font-medium">Day</th>
                      <th className="py-2 font-medium">Chamber</th>
                      <th className="py-2 font-medium">Time</th>
                      <th className="py-2 font-medium">Serial limit</th>
                      <th className="py-2 font-medium">Walk-in slots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => (
                      <tr key={d} className="border-t border-slate-100">
                        <td className="py-2.5 font-medium">{d}</td>
                        <td className="py-2.5">
                          <Switch defaultChecked={d !== "Friday"} aria-label={`${d} chamber`} />
                        </td>
                        <td className="py-2.5 text-slate-700">{d === "Friday" ? "—" : "5:00 PM – 9:00 PM"}</td>
                        <td className="py-2.5">
                          <Input className="w-20" defaultValue={d === "Friday" ? "" : "32"} disabled={d === "Friday"} aria-label={`${d} serial limit`} />
                        </td>
                        <td className="py-2.5">
                          <Input className="w-20" defaultValue={d === "Friday" ? "" : "4"} disabled={d === "Friday"} aria-label={`${d} walk-in slots`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </TabsContent>
          <TabsContent value="Remote review blocks">
            <Card>
              <CardHeader title="Remote review time blocks" description="When you'd like to review reports. Patients see an expected response time." />
              <CardBody className="space-y-3">
                {[
                  ["Every day", "11:00 AM – 11:45 AM"],
                  ["Sat – Thu", "4:15 PM – 4:45 PM (before chamber)"],
                ].map(([d, t]) => (
                  <div key={d} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <Clock className="size-4 text-teal-700" />
                    <span className="w-28 font-medium">{d}</span>
                    <span className="flex-1 text-slate-700">{t}</span>
                    <Button size="sm" variant="ghost">Edit</Button>
                  </div>
                ))}
                <Field label="Daily review goal">
                  <Input className="w-24" defaultValue="14" />
                </Field>
              </CardBody>
            </Card>
          </TabsContent>
          <TabsContent value="Notifications">
            <Card>
              <CardHeader title="Notification preferences" />
              <CardBody className="divide-y divide-slate-100">
                {[
                  ["Abnormal report ready", "Push + SMS", true],
                  ["Outside report uploaded", "Push", true],
                  ["Daily review summary", "WhatsApp at 9 PM", true],
                  ["Patient running late", "In app", false],
                ].map(([l, c, on]) => (
                  <label key={l as string} className="flex items-center justify-between py-3">
                    <span>
                      <span className="block text-body font-medium">{l}</span>
                      <span className="text-caption text-slate-500">{c}</span>
                    </span>
                    <Switch defaultChecked={on as boolean} aria-label={l as string} />
                  </label>
                ))}
              </CardBody>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </AppShell>
  );
}

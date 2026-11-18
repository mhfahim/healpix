"use client";
import * as React from "react";
import { Upload, Plus, CheckCircle2, XCircle, FileText, FlaskConical, Building2, Receipt, MessageCircle, MessageSquare, PhoneCall, Plug } from "lucide-react";

const integrationIcons: Record<string, typeof Plug> = { FlaskConical, Building2, Receipt, MessageCircle, MessageSquare, PhoneCall };
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Field, Input, Select, Avatar, initialsOf } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent, Checkbox } from "@/components/ui/controls";
import { DataTable } from "@/components/ui/data";
import { departments, doctors, hospital, integrations, tests, metrics } from "@/data/mock";
import { bdt, num } from "@/lib/utils";

const roles = ["Front desk", "Doctor", "Lab", "Department head", "Management", "Admin"];
const perms = [
  ["Book and check in patients", [1, 0, 0, 0, 0, 1]],
  ["Record vitals", [1, 1, 0, 0, 0, 0]],
  ["Write and sign prescriptions", [0, 1, 0, 0, 0, 0]],
  ["Upload lab results", [0, 0, 1, 0, 0, 0]],
  ["View department dashboards", [0, 0, 0, 1, 1, 1]],
  ["View doctor-level leak data", [0, 0, 0, 0, 0, 1]],
  ["Manage recovery actions", [0, 0, 0, 0, 1, 1]],
  ["Manage users and billing", [0, 0, 0, 0, 0, 1]],
] as const;

export default function Settings() {
  return (
    <AppShell surface="management" title="Settings" subtitle={hospital.name}>
      <Tabs defaultValue="integrations">
        <TabsList className="mb-6 overflow-x-auto">
          {["Hospital profile", "Branches", "Departments", "Doctors & licenses", "Lab price list", "Integrations", "Roles & permissions", "Billing & plan"].map((t) => (
            <TabsTrigger key={t} value={t === "Integrations" ? "integrations" : t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="Hospital profile">
          <Card className="max-w-3xl">
            <CardBody className="grid grid-cols-2 gap-4">
              <Field label="Hospital name" className="col-span-2">
                <Input defaultValue={hospital.name} />
              </Field>
              <Field label="Name in Bangla" className="col-span-2">
                <Input defaultValue={hospital.nameBn} className="font-bn" />
              </Field>
              <Field label="Hotline">
                <Input defaultValue={hospital.hotline} />
              </Field>
              <Field label="Default patient language">
                <Select defaultValue="bn">
                  <option value="bn">বাংলা (Bangla)</option>
                  <option value="en">English</option>
                </Select>
              </Field>
              <Field label="Address" className="col-span-2">
                <Input defaultValue={hospital.address} />
              </Field>
              <div className="col-span-2 flex justify-end">
                <Button>Save changes</Button>
              </div>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="Branches">
          <Card className="max-w-3xl overflow-hidden">
            <CardHeader title="Branches" action={<Button size="sm" variant="secondary"><Plus /> Add branch</Button>} />
            <div className="mt-3">
              <DataTable
                rows={hospital.branches}
                rowKey={(r) => r.name}
                columns={[
                  { key: "n", header: "Branch", cell: (r) => <span className="font-medium">{r.name}</span> },
                  { key: "s", header: "Status", cell: (r) => <Badge tone={r.status === "Live" ? "success" : "info"}>{r.status}</Badge> },
                ]}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="Departments">
          <Card className="max-w-3xl overflow-hidden">
            <CardHeader title="Departments" description="Shown to patients in this order" action={<Button size="sm" variant="secondary"><Plus /> Add department</Button>} />
            <ul className="mt-3 divide-y divide-slate-100">
              {departments.map((d) => (
                <li key={d.id} className="flex items-center justify-between px-5 py-3">
                  <span>
                    <span className="font-medium">{d.name}</span> <span className="ml-2 font-bn text-small text-slate-500">{d.bn}</span>
                  </span>
                  <Button size="sm" variant="ghost">Edit</Button>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="Doctors & licenses">
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-body">
            <span className="tnum text-h2 font-semibold text-teal-800">{metrics.activeDoctors}</span>
            <span className="text-slate-700">active doctors this billing period (of {metrics.totalDoctors} licensed). Active doctor count drives your monthly invoice.</span>
          </div>
          <Card className="overflow-hidden">
            <CardHeader title="Doctors" action={<><Button size="sm" variant="secondary"><Upload /> Import CSV</Button><Button size="sm"><Plus /> Add doctor</Button></>} />
            <div className="mt-3">
              <DataTable
                rows={doctors}
                rowKey={(r) => r.id}
                columns={[
                  { key: "n", header: "Doctor", cell: (r) => <span className="flex items-center gap-2.5"><Avatar initials={r.initials} size="sm" /><span className="font-medium">{r.name}</span></span> },
                  { key: "d", header: "Department", cell: (r) => departments.find((x) => x.id === r.dept)?.name },
                  { key: "c", header: "Chamber", cell: (r) => `${r.days}, ${r.time}` },
                  { key: "bmdc", header: "BMDC reg.", cell: (r) => <span className="font-mono text-small">A-{40000 + r.fee * 7}</span> },
                  { key: "s", header: "License", cell: () => <Badge tone="success" icon={CheckCircle2}>Active</Badge> },
                ]}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="Lab price list">
          <Card className="overflow-hidden">
            <CardHeader title="Lab price list" description="148 tests · last updated 2 Nov 2026 · shown to patients on their test list" action={<Button size="sm" variant="secondary"><Upload /> Upload new list</Button>} />
            <div className="mt-3">
              <DataTable
                rows={tests}
                rowKey={(r) => r.id}
                pageSize={8}
                columns={[
                  { key: "n", header: "Test", cell: (r) => <span className="font-medium">{r.name}</span>, sort: (r) => r.name },
                  { key: "bn", header: "Bangla name", cell: (r) => <span className="font-bn">{r.bn}</span> },
                  { key: "p", header: "Price", align: "right", cell: (r) => bdt(r.price), sort: (r) => r.price },
                  { key: "prep", header: "Preparation", cell: (r) => <span className="text-slate-700">{r.prep}</span> },
                  { key: "t", header: "Report time", cell: (r) => r.tat },
                ]}
              />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {integrations.map((i) => {
              const Icon = integrationIcons[i.icon] ?? Plug;
              const ok = i.status === "Connected";
              return (
                <Card key={i.name} className="flex flex-col p-5">
                  <div className="flex items-start justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="size-5 text-slate-700" strokeWidth={1.5} />
                    </span>
                    <Badge tone={ok ? "success" : "neutral"} icon={ok ? CheckCircle2 : XCircle}>
                      {i.status}
                    </Badge>
                  </div>
                  <p className="mt-3 text-h3 font-semibold">{i.name}</p>
                  <p className="text-small text-slate-500">{i.vendor}</p>
                  {ok && <p className="mt-1 text-caption text-slate-500">Last sync 6:02 PM</p>}
                  <div className="mt-4 flex gap-2">
                    {ok ? (
                      <>
                        <Button size="sm" variant="secondary">Configure</Button>
                        <Button size="sm" variant="ghost">View logs</Button>
                      </>
                    ) : (
                      <Button size="sm">Connect</Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="Roles & permissions">
          <Card className="overflow-hidden">
            <table className="w-full text-body">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-3 text-left text-caption font-medium text-slate-500">Permission</th>
                  {roles.map((r) => (
                    <th key={r} className="px-3 py-3 text-center text-caption font-medium text-slate-500">
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {perms.map(([p, v]) => (
                  <tr key={p} className="border-b border-slate-100 last:border-0">
                    <td className="px-5 py-3">{p}</td>
                    {v.map((on, i) => (
                      <td key={i} className="px-3 py-3 text-center">
                        <Checkbox defaultChecked={!!on} aria-label={`${roles[i]}: ${p}`} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </TabsContent>

        <TabsContent value="Billing & plan">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-5">
              <p className="text-small text-slate-500">Plan</p>
              <p className="text-h2 font-semibold">Helpix Hospital</p>
              <Badge tone="teal" className="mt-2">Pilot · day 142</Badge>
            </Card>
            <Card className="p-5">
              <p className="text-small text-slate-500">Setup fee</p>
              <p className="tnum text-h2 font-semibold">{bdt(250000)}</p>
              <Badge tone="success" icon={CheckCircle2} className="mt-2">Paid 3 Jul 2026</Badge>
            </Card>
            <Card className="p-5">
              <p className="text-small text-slate-500">Monthly license</p>
              <p className="tnum text-h2 font-semibold">{bdt(46 * 6000)}</p>
              <p className="text-caption text-slate-500">46 active doctors × ৳ 6,000</p>
            </Card>
          </div>
          <Card className="mt-6 overflow-hidden">
            <CardHeader title="Invoices" />
            <div className="mt-3">
              <DataTable
                rows={[
                  { id: "INV-2611", period: "November 2026", amount: 276000, status: "Due 30 Nov" },
                  { id: "INV-2610", period: "October 2026", amount: 264000, status: "Paid" },
                  { id: "INV-2609", period: "September 2026", amount: 252000, status: "Paid" },
                ]}
                rowKey={(r) => r.id}
                columns={[
                  { key: "id", header: "Invoice", cell: (r) => <span className="font-mono text-small">{r.id}</span> },
                  { key: "p", header: "Period", cell: (r) => r.period },
                  { key: "a", header: "Amount", align: "right", cell: (r) => bdt(r.amount) },
                  { key: "s", header: "Status", cell: (r) => <Badge tone={r.status === "Paid" ? "success" : "warning"}>{r.status}</Badge> },
                  { key: "d", header: "", align: "right", cell: () => <Button size="sm" variant="ghost"><FileText /> PDF</Button> },
                ]}
              />
            </div>
          </Card>
          <p className="mt-2 text-caption text-slate-500">{num(46)} active doctors billed. Doctors without a signed prescription in the period are not billed.</p>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

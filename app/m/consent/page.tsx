"use client";
import * as React from "react";
import { Download, Search, ShieldCheck, Trash2, Eye } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, Badge, Input, Select, Banner } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent, Dialog } from "@/components/ui/controls";
import { DataTable, KpiCard } from "@/components/ui/data";
import { accessLog, consentRows, consentStats, deletionRequests } from "@/data/mock";
import { num } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

const tone = (s: string) => (s === "Active" ? "success" : s === "Withdrawn" || s === "Declined" ? "neutral" : "warning");

export default function Consent() {
  const [q, setQ] = React.useState("");
  const [confirm, setConfirm] = React.useState<string | null>(null);
  const toast = useToast();
  const rows = consentRows.filter((r) => (r.pid + r.type + r.channel + r.status).toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell
      surface="management"
      title="Consent and data"
      subtitle="Patient consent ledger and data access log"
      actions={
        <Button variant="secondary" onClick={() => toast({ title: "Audit log exported", body: "access_log_2026-11.csv" })}>
          <Download /> Export audit log
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Consents collected" value={num(consentStats.collected)} sub="all time" />
        <KpiCard label="Withdrawn" value={num(consentStats.withdrawn)} sub="0.2% of collected" deltaTone="neutral" />
        <KpiCard label="Pending" value={num(consentStats.pending)} sub="booked by phone, awaiting SMS confirm" />
        <KpiCard label="Deletion requests" value="1 open" sub="respond within 30 days" />
      </div>
      <Banner tone="info" icon={ShieldCheck} className="mt-6">
        Patient IDs are masked on this page. Opening an individual record is logged with your name, role and reason.
      </Banner>

      <Card className="mt-6 overflow-hidden">
        <Tabs defaultValue="ledger">
          <div className="px-5 pt-2">
            <TabsList>
              <TabsTrigger value="ledger">Consent ledger</TabsTrigger>
              <TabsTrigger value="access">Data access log</TabsTrigger>
              <TabsTrigger value="delete">
                Deletion requests <Badge tone="warning">1</Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="ledger">
            <div className="flex gap-3 px-5 py-4">
              <div className="relative w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input className="pl-9" placeholder="Search patient ID, type, channel" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search consents" />
              </div>
              <Select className="w-44" aria-label="Consent type" defaultValue="">
                <option value="">All consent types</option>
                <option>Care records</option>
                <option>AI scribe recording</option>
                <option>Marketing messages</option>
              </Select>
              <Select className="w-36" aria-label="Status" defaultValue="">
                <option value="">All statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Withdrawn</option>
              </Select>
            </div>
            <DataTable
              rows={rows}
              rowKey={(r) => r.pid + r.type}
              pageSize={6}
              columns={[
                { key: "pid", header: "Patient ID", cell: (r) => <span className="font-mono text-small">{r.pid}</span>, sort: (r) => r.pid },
                { key: "type", header: "Consent type", cell: (r) => r.type, sort: (r) => r.type },
                { key: "date", header: "Date", cell: (r) => <span className="text-slate-700">{r.date}</span> },
                { key: "channel", header: "Channel", cell: (r) => r.channel, sort: (r) => r.channel },
                { key: "status", header: "Status", cell: (r) => <Badge tone={tone(r.status) as any}>{r.status}</Badge>, sort: (r) => r.status },
              ]}
            />
          </TabsContent>
          <TabsContent value="access">
            <DataTable
              rows={accessLog}
              rowKey={(r) => r.who + r.when}
              columns={[
                { key: "when", header: "Time (today)", cell: (r) => <span className="tnum">{r.when}</span> },
                { key: "who", header: "Who", cell: (r) => <span className="font-medium">{r.who}</span> },
                { key: "role", header: "Role", cell: (r) => <Badge tone="outline">{r.role}</Badge> },
                { key: "action", header: "Action", cell: (r) => r.action },
                { key: "record", header: "Record", cell: (r) => <span className="font-mono text-small">{r.record}</span> },
              ]}
            />
          </TabsContent>
          <TabsContent value="delete">
            <DataTable
              rows={deletionRequests}
              rowKey={(r) => r.pid}
              columns={[
                { key: "pid", header: "Patient ID", cell: (r) => <span className="font-mono text-small">{r.pid}</span> },
                { key: "req", header: "Requested", cell: (r) => r.requested },
                { key: "scope", header: "Scope", cell: (r) => r.scope },
                { key: "status", header: "Status", cell: (r) => <Badge tone={r.status === "Completed" ? "success" : "warning"}>{r.status}</Badge> },
                {
                  key: "a",
                  header: "",
                  align: "right",
                  cell: (r) =>
                    r.status !== "Completed" && (
                      <span className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye /> Review
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setConfirm(r.pid)}>
                          <Trash2 /> Approve deletion
                        </Button>
                      </span>
                    ),
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </Card>
      <Dialog
        open={!!confirm}
        onOpenChange={() => setConfirm(null)}
        title="Delete all records for this patient?"
        description={`${confirm}: visits, prescriptions, reports and recordings will be permanently deleted. Billing records required by law are kept. This cannot be undone.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirm(null);
                toast({ title: "Deletion scheduled", body: "Patient will be notified by SMS when complete" });
              }}
            >
              Delete permanently
            </Button>
          </>
        }
      />
    </AppShell>
  );
}

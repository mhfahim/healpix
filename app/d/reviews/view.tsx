"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CloudUpload, FlaskConical, Inbox, RefreshCw, Target, ChevronRight, PartyPopper } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, Badge, Banner, EmptyState, Select, IconChip } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/controls";
import { DataTable, TickMeter } from "@/components/ui/data";
import { reviewInbox } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { ViewState } from "@/lib/screens";

type Row = (typeof reviewInbox)[number];
const prio = { High: 3, Medium: 2, Low: 1 } as Record<string, number>;

export function InboxView({ state }: { state: ViewState }) {
  const router = useRouter();
  const [source, setSource] = React.useState("all");
  const loading = state === "loading";
  const empty = state === "empty";
  const filter = (tab: string) => (empty ? [] : reviewInbox.filter((r) => r.tab === tab && (source === "all" || r.source === source)));

  const columns = [
    {
      key: "patient",
      header: "Patient",
      cell: (r: Row) => (
        <span>
          <span className="block font-medium">{r.patient}</span>
          <span className="tnum text-caption text-slate-500">
            {r.age} {r.sex}
          </span>
        </span>
      ),
      sort: (r: Row) => r.patient,
    },
    { key: "tests", header: "Tests", cell: (r: Row) => <span className="text-slate-700">{r.tests.join(", ")}</span> },
    {
      key: "source",
      header: "Source",
      cell: (r: Row) =>
        r.source === "outside" ? (
          <Badge tone="warning" icon={CloudUpload}>Outside upload</Badge>
        ) : (
          <Badge tone="teal" icon={FlaskConical}>In-house lab</Badge>
        ),
      sort: (r: Row) => r.source,
    },
    {
      key: "abn",
      header: "Abnormal",
      align: "center" as const,
      cell: (r: Row) =>
        r.abnormal > 0 ? (
          <Badge tone="danger" icon={AlertTriangle}>{r.abnormal} flagged</Badge>
        ) : (
          <span className="text-small text-slate-500">None</span>
        ),
      sort: (r: Row) => r.abnormal,
    },
    { key: "received", header: "Received", cell: (r: Row) => <span className="tnum text-slate-700">{r.received}</span> },
    {
      key: "prio",
      header: "Priority",
      cell: (r: Row) => (
        <span className="flex items-center gap-1.5 text-small font-medium">
          <span className={cn("size-2 rounded-full", r.priority === "High" ? "bg-danger" : r.priority === "Medium" ? "bg-warning" : "bg-slate-300")} />
          {r.priority}
        </span>
      ),
      sort: (r: Row) => prio[r.priority] * 10 + r.abnormal,
    },
    { key: "go", header: "", align: "right" as const, cell: () => <ChevronRight className="ml-auto size-4 text-slate-400 group-hover:text-slate-700" /> },
  ];

  const table = (tab: string) => (
    <DataTable
      loading={loading}
      rows={filter(tab)}
      rowKey={(r) => r.id}
      defaultSort={{ key: "prio", dir: "desc" }}
      onRowClick={(r) => (tab === "ready" ? router.push(`/d/reviews/${r.id}`) : undefined)}
      rowClassName={(r) => (r.id === "mizanur" ? "bg-warning-bg/40" : undefined)}
      columns={columns}
      empty={
        <EmptyState
          icon={tab === "ready" ? PartyPopper : Inbox}
          title={tab === "ready" ? "All caught up" : "Nothing here"}
          body={tab === "ready" ? "No reports are waiting for your review. New results from the lab and patient uploads will appear here." : "Reports you've reviewed will be listed here."}
          action={tab === "ready" && <Button variant="secondary" href="/d/today">Back to today</Button>}
        />
      }
    />
  );

  return (
    <AppShell surface="doctor" title="Remote reviews" subtitle="Review results in your free time · patients are notified when you respond" offline={state === "offline"}>
      {state === "error" && (
        <Banner tone="danger" className="mb-6" title="Couldn't load new reports" action={<Button size="sm" variant="secondary" onClick={() => router.replace("/d/reviews")}><RefreshCw /> Retry</Button>}>
          The lab system didn't respond. Reports already in your inbox are still available.
        </Banner>
      )}
      {state === "offline" && (
        <Banner tone="warning" className="mb-6" title="Offline: you can still review cached reports">
          Your responses are saved and will be sent to patients when you're back online.
        </Banner>
      )}

      <Card className="mb-6 flex flex-wrap items-center gap-6 p-4">
        <IconChip icon={Target} tone="teal" />
        <div className="min-w-[220px] flex-1">
          <p className="text-body font-medium">
            Daily goal: <span className="tnum">{empty ? "14 of 14" : "6 of 14"}</span> reviewed
          </p>
          <TickMeter value={empty ? 14 : 6} max={14} ticks={14} height={14} className="mt-2 max-w-sm" label="Daily review goal" />
        </div>
        <div className="flex gap-6 text-small">
          <span>
            <span className="tnum block text-h3 font-semibold">{empty ? 0 : 3}</span>
            <span className="text-slate-500">with abnormal values</span>
          </span>
          <span>
            <span className="tnum block text-h3 font-semibold">4.8 h</span>
            <span className="text-slate-500">your median response</span>
          </span>
          <span>
            <span className="tnum block text-h3 font-semibold">Next block</span>
            <span className="text-slate-500">Tomorrow 11:00 AM</span>
          </span>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Tabs defaultValue="ready">
          <div className="flex items-center justify-between px-5 pt-2">
            <TabsList className="border-0">
              <TabsTrigger value="ready">
                Ready to review <Badge tone="teal">{filter("ready").length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="waiting">
                Waiting for reports <Badge tone="neutral">{filter("waiting").length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="done">Done</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <span className="text-small text-slate-500">Source</span>
              <Select className="w-44" value={source} onChange={(e) => setSource(e.target.value)} aria-label="Filter by source">
                <option value="all">All sources</option>
                <option value="inhouse">In-house lab</option>
                <option value="outside">Outside upload</option>
              </Select>
            </div>
          </div>
          <div className="border-t border-slate-200">
            <TabsContent value="ready">{table("ready")}</TabsContent>
            <TabsContent value="waiting">{table("waiting")}</TabsContent>
            <TabsContent value="done">{table("done")}</TabsContent>
          </div>
        </Tabs>
      </Card>
      <p className="mt-3 text-caption text-slate-500">Sorted by priority: abnormal results first.</p>
    </AppShell>
  );
}

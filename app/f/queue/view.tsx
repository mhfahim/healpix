"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarX2,
  Clock,
  Globe,
  HeartPulse,
  LayoutGrid,
  List,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  RefreshCw,
  UserPlus,
  UserRound,
  Check,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, Badge, Banner, EmptyState, StatusPill, Field, Input, Skeleton, Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Dialog, Segmented, DatePicker } from "@/components/ui/controls";
import { DataTable, Progress } from "@/components/ui/data";
import { doctors, queue as baseQueue, type Channel, type Status } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import type { ViewState } from "@/lib/screens";

type Row = (typeof baseQueue)[number] & { isNew?: boolean };

const channelIcon: Record<Channel, { icon: any; label: string }> = {
  phone: { icon: Phone, label: "Phone" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp" },
  web: { icon: Globe, label: "Web" },
  walkin: { icon: UserRound, label: "Walk-in" },
};

export const newBooking: Row = {
  serial: 17,
  name: "Nurjahan Begum",
  phone: "01716-554210",
  via: "phone",
  status: "Booked",
  time: "7:45 PM",
  reason: "Lipid report follow-up, dizziness",
  age: 50,
  sex: "F",
  vitals: false,
  isNew: true,
};

export function QueueView({ state, newSerial, arrived }: { state: ViewState; newSerial?: number; arrived?: number }) {
  const router = useRouter();
  const toast = useToast();
  const [view, setView] = React.useState<"table" | "kanban">("table");
  const [date, setDate] = React.useState(new Date(2026, 10, 19));
  const [selectedDocs, setSelectedDocs] = React.useState<string[]>(["farhana"]);
  const [walkIn, setWalkIn] = React.useState(false);
  const [rows, setRows] = React.useState<Row[]>(() => {
    const r: Row[] = [...baseQueue];
    if (newSerial) r.push({ ...newBooking, status: arrived === newSerial ? "Arrived" : "Booked", vitals: arrived === newSerial });
    return r;
  });
  const loading = state === "loading";
  const empty = state === "empty";
  const data = empty ? [] : rows;

  const announced = React.useRef(false);
  React.useEffect(() => {
    if (announced.current) return; // strict-mode double effect guard
    announced.current = true;
    if (arrived) toast({ title: `Serial ${arrived} marked arrived`, body: "Vitals sent to Dr. Farhana Rahman" });
    else if (newSerial) toast({ title: `Booking added: serial ${newSerial}`, body: "SMS + WhatsApp confirmation sent" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = (serial: number, status: Status) => setRows((rs) => rs.map((r) => (r.serial === serial ? { ...r, status } : r)));

  return (
    <AppShell
      surface="frontdesk"
      title="Today's queue"
      subtitle="Thursday, 19 Nov 2026 · OPD evening session"
      offline={state === "offline"}
      actions={
        <>
          <Button variant="secondary" onClick={() => setWalkIn(true)} disabled={loading}>
            <UserPlus /> Add walk-in
          </Button>
          <Button href="/f/new-booking">
            <Plus /> New booking
          </Button>
        </>
      }
    >
      {state === "error" && (
        <Banner tone="danger" className="mb-4" title="Queue isn't updating" action={<Button size="sm" variant="secondary" onClick={() => router.replace("/f/queue")}><RefreshCw /> Retry</Button>}>
          Last update 6:20 PM. WhatsApp and web bookings after that may be missing. Phone bookings still work.
        </Banner>
      )}
      {state === "offline" && (
        <Banner tone="warning" className="mb-4" title="You're offline. Keep working.">
          Check-ins, walk-ins and status changes are saved on this computer and will sync automatically. Patients get SMS once you're back online.
        </Banner>
      )}

      {/* Per-doctor progress strip */}
      <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {doctors.map((d) => {
          const on = selectedDocs.includes(d.id);
          const started = d.queue.current > 0;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDocs((s) => (s.includes(d.id) ? s.filter((x) => x !== d.id) : [...s, d.id]))}
              aria-pressed={on}
              className={cn("rounded-lg border bg-white p-3 text-left transition-colors", on ? "border-teal-700 ring-1 ring-teal-700" : "border-slate-200 hover:border-slate-300")}
            >
              {loading ? (
                <Skeleton className="h-12 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Avatar initials={d.initials} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body font-medium">{d.name}</span>
                      <span className="tnum block text-caption text-slate-500">
                        {started ? `On serial ${d.queue.current} of ${d.queue.total}` : `Starts ${d.time.split(" – ")[0]} · ${d.queue.total} booked`}
                      </span>
                    </span>
                    {on && <Check className="size-4 text-teal-700" />}
                  </div>
                  <Progress value={(d.queue.current / d.queue.total) * 100} className="mt-2.5 h-1.5" tone={d.queue.late > 10 ? "warning" : "teal"} label={`${d.name} progress`} />
                  <p className={cn("mt-1.5 flex items-center gap-1 text-caption", d.queue.late > 10 ? "text-warning-fg" : "text-slate-500")}>
                    {d.queue.late > 10 && <AlertTriangle className="size-3" />}
                    {!started ? "Not started" : d.queue.late ? `Running ${d.queue.late} min late` : "On time"}
                  </p>
                </>
              )}
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 px-3 text-body hover:bg-slate-50">
              Doctors: {selectedDocs.length === 1 ? "Dr. Farhana Rahman" : `${selectedDocs.length} selected`} <ChevronDown className="size-4 text-slate-400" />
            </button>
            <DatePicker value={date} onChange={setDate} className="w-40" />
            <span className="tnum text-small text-slate-500">{data.length} patients</span>
          </div>
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "table", label: <><List /> Table</> },
              { value: "kanban", label: <><LayoutGrid /> Kanban</> },
            ]}
          />
        </div>

        {empty ? (
          <EmptyState
            icon={CalendarX2}
            title="No bookings yet for this session"
            body="Bookings from phone, WhatsApp and the web will appear here as they come in."
            action={
              <>
                <Button href="/f/new-booking"><Plus /> New booking</Button>
                <Button variant="secondary" onClick={() => setWalkIn(true)}><UserPlus /> Add walk-in</Button>
              </>
            }
          />
        ) : view === "table" ? (
          <DataTable
            loading={loading}
            rows={data}
            rowKey={(r) => r.serial}
            defaultSort={{ key: "serial", dir: "asc" }}
            rowClassName={(r) => cn(r.isNew && "bg-teal-50", r.status === "With doctor" && "bg-slate-50")}
            columns={[
              { key: "serial", header: "Serial", cell: (r) => <span className="tnum text-h3 font-semibold">{r.serial}</span>, sort: (r) => r.serial, width: "72px" },
              {
                key: "name",
                header: "Patient",
                cell: (r) => (
                  <span>
                    <span className="flex items-center gap-2 font-medium">
                      {r.name} {r.isNew && <Badge tone="teal" size="sm">New</Badge>}
                    </span>
                    <span className="block text-caption text-slate-500">
                      {r.age} {r.sex} · {r.reason}
                    </span>
                  </span>
                ),
                sort: (r) => r.name,
              },
              { key: "phone", header: "Phone", cell: (r) => <span className="tnum text-slate-700">{r.phone}</span> },
              {
                key: "via",
                header: "Booked via",
                cell: (r) => {
                  const c = channelIcon[r.via];
                  return (
                    <span className="inline-flex items-center gap-1.5 text-small text-slate-700">
                      <c.icon className="size-4 text-slate-500" /> {c.label}
                    </span>
                  );
                },
              },
              { key: "status", header: "Status", cell: (r) => <StatusPill status={r.status} />, sort: (r) => r.status },
              {
                key: "vitals",
                header: "Vitals",
                align: "center",
                cell: (r) => (r.vitals ? <HeartPulse className="mx-auto size-4 text-teal-600" aria-label="Vitals done" /> : <span className="text-slate-300">—</span>),
              },
              { key: "time", header: "Est. time", cell: (r) => <span className="tnum">{r.time}</span>, sort: (r) => r.serial },
              {
                key: "actions",
                header: "",
                align: "right",
                cell: (r) => (
                  <span className="flex justify-end gap-1">
                    {r.status === "Booked" && (
                      <Button size="sm" variant="secondary" href={`/f/check-in?serial=${r.serial}`}>
                        Check in
                      </Button>
                    )}
                    {r.status === "Arrived" && !r.vitals && (
                      <Button size="sm" variant="secondary" href={`/f/check-in?serial=${r.serial}`}>
                        <HeartPulse /> Vitals
                      </Button>
                    )}
                    {r.status === "Booked" && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus(r.serial, "No-show")}>
                        No-show
                      </Button>
                    )}
                    <Button size="icon-sm" variant="ghost" aria-label="More actions">
                      <MoreHorizontal />
                    </Button>
                  </span>
                ),
              },
            ]}
          />
        ) : (
          <div className="grid grid-cols-5 gap-3 overflow-x-auto bg-slate-50 p-4">
            {(["Booked", "Arrived", "With doctor", "Done", "No-show"] as Status[]).map((col) => {
              const items = data.filter((r) => r.status === col);
              return (
                <div key={col} className="min-w-[200px]">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <StatusPill status={col} />
                    <span className="tnum text-small text-slate-500">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((r) => (
                      <div key={r.serial} className={cn("rounded-lg border border-slate-200 bg-white p-3", r.isNew && "border-teal-500")}>
                        <div className="flex items-center justify-between">
                          <span className="tnum text-h3 font-semibold">#{r.serial}</span>
                          <span className="tnum flex items-center gap-1 text-caption text-slate-500">
                            <Clock className="size-3" /> {r.time}
                          </span>
                        </div>
                        <p className="mt-1 text-body font-medium">{r.name}</p>
                        <p className="truncate text-caption text-slate-500">{r.reason}</p>
                        <div className="mt-2 flex items-center gap-2 text-caption text-slate-500">
                          {React.createElement(channelIcon[r.via].icon, { className: "size-3.5" })}
                          {channelIcon[r.via].label}
                          {r.vitals && <HeartPulse className="ml-auto size-3.5 text-teal-600" aria-label="Vitals done" />}
                        </div>
                        {col === "Booked" && (
                          <Button size="sm" variant="secondary" className="mt-2 w-full" onClick={() => setStatus(r.serial, "Arrived")}>
                            Mark arrived
                          </Button>
                        )}
                      </div>
                    ))}
                    {items.length === 0 && <p className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-caption text-slate-400">None</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <WalkInDialog
        open={walkIn}
        onOpenChange={setWalkIn}
        onConfirm={(name) => {
          setRows((rs) => [...rs, { serial: 18, name, phone: "01700-000000", via: "walkin", status: "Arrived", time: "7:55 PM", reason: "Walk-in", age: 40, sex: "M", vitals: false, isNew: true }]);
          setWalkIn(false);
          toast({ title: `Walk-in added as serial 18`, body: "2 patients after them notified of a 10 min delay" });
        }}
      />
    </AppShell>
  );
}

function WalkInDialog({ open, onOpenChange, onConfirm }: { open: boolean; onOpenChange: (o: boolean) => void; onConfirm: (name: string) => void }) {
  const [name, setName] = React.useState("Kabir Hossain");
  const [mode, setMode] = React.useState<"end" | "next">("end");
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add walk-in"
      description="Dr. Farhana Rahman · today"
      className="max-w-lg"
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(name)}>Confirm walk-in</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Mobile">
          <Input placeholder="01XXX-XXXXXX" />
        </Field>
        <Field label="Reason" className="col-span-2">
          <Input placeholder="e.g. fever, follow-up" />
        </Field>
      </div>
      <div className="mt-4">
        <p className="mb-1.5 text-small font-medium text-slate-700">Insert</p>
        <Segmented
          value={mode}
          onChange={setMode}
          className="w-full"
          options={[
            { value: "end", label: "At end (serial 18)" },
            { value: "next", label: "Next (urgent)" },
          ]}
        />
      </div>
      <Banner tone={mode === "next" ? "warning" : "info"} className="mt-4" title="Delay impact">
        {mode === "next" ? (
          <>Serials 10–17 move back about <span className="font-semibold">8 min</span> each. 8 patients will get an SMS. Session ends around 9:33 PM.</>
        ) : (
          <>Est. time <span className="font-semibold">7:55 PM</span>. Nobody else is delayed. Session ends around 9:25 PM (25 min over).</>
        )}
      </Banner>
    </Dialog>
  );
}

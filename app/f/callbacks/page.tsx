"use client";
import * as React from "react";
import { Check, Clock, Phone, PhoneCall, PhoneMissed, CalendarClock } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, Badge, Banner, EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Dialog, Chip } from "@/components/ui/controls";
import { callbacks } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function Callbacks() {
  const [list, setList] = React.useState(callbacks.map((c) => ({ ...c, calling: false })));
  const [resched, setResched] = React.useState<string | null>(null);
  const toast = useToast();
  return (
    <AppShell surface="frontdesk" title="Call-backs" subtitle="Callers waiting for a call back · oldest first">
      <Banner tone="info" className="mb-4" icon={PhoneMissed}>
        Missed IVR calls and “call me back” requests from WhatsApp land here automatically. Target: call back within 15 minutes.
      </Banner>
      <Card className="overflow-hidden">
        {list.length === 0 ? (
          <EmptyState icon={PhoneCall} title="No one is waiting for a call-back" body="Nice work. New requests will appear here." />
        ) : (
          <ol>
            {list.map((c, i) => (
              <li key={c.phone} className={cn("grid grid-cols-[40px_1fr_auto_auto] items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0", c.calling && "bg-teal-50")}>
                <span className="tnum inline-flex size-8 items-center justify-center rounded-full bg-slate-100 text-small font-semibold text-slate-700">{i + 1}</span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2">
                    <span className="tnum text-h3 font-semibold">{c.phone}</span>
                    <span className="text-body text-slate-500">{c.name}</span>
                    {c.priority === "high" && <Badge tone="danger">Waiting long</Badge>}
                  </p>
                  <p className="text-body text-slate-700">{c.reason}</p>
                  <p className="tnum mt-0.5 flex items-center gap-3 text-caption text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> Requested {c.requested} · waiting {c.waiting}
                    </span>
                    <span>
                      {c.attempts} attempt{c.attempts === 1 ? "" : "s"}
                    </span>
                  </p>
                </div>
                {c.calling ? (
                  <span className="flex items-center gap-2 text-small font-medium text-teal-800">
                    <span className="relative inline-flex size-2.5 rounded-full bg-teal-600">
                      <span className="absolute inset-0 animate-ping rounded-full bg-teal-500" />
                    </span>
                    Calling…
                  </span>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => setList((l) => l.map((x) => (x.phone === c.phone ? { ...x, calling: !x.calling, attempts: x.calling ? x.attempts : x.attempts + 1 } : x)))}
                    variant={c.calling ? "secondary" : "primary"}
                  >
                    <Phone /> {c.calling ? "End call" : "Call"}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setList((l) => l.filter((x) => x.phone !== c.phone));
                      toast({ title: "Call-back done", body: c.phone });
                    }}
                  >
                    <Check /> Mark done
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setResched(c.phone)}>
                    <CalendarClock /> Reschedule
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
      <Dialog
        open={!!resched}
        onOpenChange={() => setResched(null)}
        title="Reschedule call-back"
        description={resched ?? ""}
        footer={
          <Button
            onClick={() => {
              toast({ title: "Call-back rescheduled", body: `${resched} · in 30 min`, tone: "info" });
              setResched(null);
            }}
          >
            Save
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <Chip>In 15 min</Chip>
          <Chip selected>In 30 min</Chip>
          <Chip>In 1 hour</Chip>
          <Chip>Tomorrow 10 AM</Chip>
        </div>
      </Dialog>
    </AppShell>
  );
}

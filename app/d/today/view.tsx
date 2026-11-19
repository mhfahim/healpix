"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BellRing, CalendarX2, CheckCircle2, Clock, HeartPulse, Inbox, MapPin, RefreshCw, UserRound, Users } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, Badge, Banner, Skeleton, EmptyState, StatusPill, IconChip, Avatar, initialsOf } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { queue, today } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";
import type { ViewState } from "@/lib/screens";

export function TodayView({ state }: { state: ViewState }) {
  const router = useRouter();
  const toast = useToast();
  const [current, setCurrent] = React.useState(9);
  const loading = state === "loading";
  const empty = state === "empty";
  const rows = queue.filter((q) => q.status !== "Cancelled");
  const seen = rows.filter((r) => r.status === "Done").length + 4; // serials 1-4 done earlier
  const callNext = () => {
    const next = rows.find((r) => r.serial > current && r.status !== "No-show" && r.status !== "Done");
    if (next) {
      setCurrent(next.serial);
      toast({ title: `Calling serial ${next.serial}: ${next.name}`, body: "Shown on the waiting-room screen and sent by SMS", tone: "info" });
    }
  };

  return (
    <AppShell
      surface="doctor"
      title="Today"
      subtitle={`${today.label} · Chamber Room 304, 3rd floor · 5:00 – 9:00 PM`}
      offline={state === "offline"}
      actions={
        !empty && (
          <Button onClick={callNext} disabled={loading}>
            <BellRing /> Call next patient
          </Button>
        )
      }
    >
      {state === "error" && (
        <Banner tone="danger" className="mb-6" title="Queue couldn't refresh" action={<Button size="sm" variant="secondary" onClick={() => router.replace("/d/today")}><RefreshCw /> Retry</Button>}>
          Showing the queue as of 6:20 PM. New arrivals from the front desk may be missing.
        </Banner>
      )}
      {state === "offline" && (
        <Banner tone="warning" className="mb-6" title="You're offline. You can keep working.">
          Notes and prescriptions save on this device and sync when the connection returns. Sending to patients will wait until then.
        </Banner>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Queue list */}
        <Card className="col-span-12 overflow-hidden lg:col-span-8">
          <CardHeader
            title="Queue"
            description={empty ? "No serials booked" : "32 serials · running 15 min late"}
            action={
              !empty && (
                <div className="flex gap-2 text-caption text-slate-500">
                  <Badge tone="teal" icon={HeartPulse}>Vitals done</Badge>
                </div>
              )
            }
          />
          <div className="mt-3 border-t border-slate-200">
            {loading &&
              Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-slate-100 px-5 py-3.5">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="ml-auto h-5 w-20 rounded-full" />
                </div>
              ))}
            {empty && (
              <EmptyState
                icon={CalendarX2}
                title="No patients booked for this session yet"
                body="Bookings from the front desk, WhatsApp and web will appear here. You can use the time for remote reviews."
                action={
                  <Button href="/d/reviews" variant="secondary">
                    <Inbox /> Open remote reviews
                  </Button>
                }
              />
            )}
            {!loading && !empty && (
              <ul>
                {rows.map((r) => {
                  const isCurrent = r.serial === current;
                  const status = isCurrent ? "With doctor" : r.serial < current && r.status === "With doctor" ? "Done" : r.status;
                  return (
                    <li key={r.serial}>
                      <Link
                        href="/d/patient/rahima"
                        className={cn(
                          "grid grid-cols-[48px_1fr_auto_auto] items-center gap-4 border-b border-slate-100 px-5 py-3 hover:bg-slate-50",
                          isCurrent && "border-l-4 border-l-teal-700 bg-teal-50 pl-4 hover:bg-teal-50",
                          (status === "Done" || status === "No-show") && "text-slate-500"
                        )}
                        aria-current={isCurrent ? "true" : undefined}
                      >
                        <span className={cn("tnum inline-flex size-9 items-center justify-center rounded-full text-body font-semibold", isCurrent ? "bg-teal-700 text-on-accent" : "bg-slate-100 text-slate-700")}>
                          {r.serial}
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2">
                            <span className={cn("truncate text-body font-medium", status === "Done" || status === "No-show" ? "text-slate-500" : "text-slate-900")}>{r.name}</span>
                            <span className="tnum text-small text-slate-500">
                              {r.age} {r.sex}
                            </span>
                            {r.vitals && <HeartPulse className="size-4 text-teal-600" aria-label="Vitals done" />}
                          </span>
                          <span className="block truncate text-small text-slate-500">{r.reason}</span>
                        </span>
                        <span className="tnum flex items-center gap-1 text-small text-slate-500">
                          <Clock className="size-3.5" /> {r.time}
                        </span>
                        <StatusPill status={status} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </Card>

        {/* Summary */}
        <div className="col-span-12 grid grid-cols-2 content-start gap-4 lg:col-span-4">
          {[
            { label: "Patients today", value: empty ? 0 : 32, icon: Users, tone: "sky" as const },
            { label: "Seen", value: empty ? 0 : seen, icon: CheckCircle2, tone: "mint" as const },
            { label: "Remaining", value: empty ? 0 : 32 - seen - 1, icon: UserRound, tone: "iris" as const },
            { label: "Running late", value: empty ? "—" : "15 min", icon: Clock, tone: "peach" as const },
          ].map((k) => (
            <Card key={k.label} className="p-5">
              {loading ? (
                <>
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-3 h-8 w-12" />
                </>
              ) : (
                <>
                  <p className="flex items-center gap-2 text-small font-medium text-slate-600">
                    <IconChip icon={k.icon} tone={k.tone} size="sm" /> {k.label}
                  </p>
                  <p className="tnum mt-3 text-kpi font-semibold">{k.value}</p>
                </>
              )}
            </Card>
          ))}
          <Card className="col-span-2 border-teal-200 bg-teal-50 p-4">
            <p className="flex items-center gap-1.5 text-small font-medium text-teal-800">
              <Inbox className="size-4" /> Remote reviews waiting
            </p>
            <p className="tnum mt-1 text-kpi font-semibold text-teal-900">{empty ? 0 : 8}</p>
            <p className="text-small text-slate-700">3 with abnormal values · oldest from yesterday 8:30 PM</p>
            <Link href="/d/reviews" className="mt-3 inline-flex items-center gap-1 text-body font-medium text-teal-800 hover:underline">
              Review now <ArrowRight className="size-4" />
            </Link>
          </Card>
          <Card className="col-span-2 p-4">
            <p className="text-small font-medium text-slate-500">Up next</p>
            {loading ? (
              <Skeleton className="mt-2 h-10 w-full" />
            ) : empty ? (
              <p className="mt-1 text-body text-slate-500">Nobody waiting</p>
            ) : (
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-body font-medium">Serial 10 · Mizanur Rahman</p>
                  <p className="flex items-center gap-1 text-small text-slate-500">
                    <MapPin className="size-3.5" /> Arrived 6:21 PM · vitals done
                  </p>
                </div>
                <StatusPill status="Arrived" />
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

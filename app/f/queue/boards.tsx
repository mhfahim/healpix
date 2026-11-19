"use client";
/**
 * F1 alternative views:
 * - KanbanBoard: status columns with Canvaso-style task cards.
 * - ScheduleBoard: Pickolab-style time grid (doctors × evening session) with
 *   tinted appointment cards, a "now" line, a hatched prayer break and a
 *   detail popover.
 */
import * as React from "react";
import { CalendarClock, Clock, ExternalLink, HeartPulse, Plus, Hash, X, Coffee } from "lucide-react";
import { Avatar, Badge, initialsOf, tint, type TintTone } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { doctors, type Status } from "@/data/mock";
import { cn } from "@/lib/utils";

type Row = {
  serial: number;
  name: string;
  phone: string;
  via: string;
  status: Status;
  time: string;
  reason: string;
  age: number;
  sex: "M" | "F";
  vitals: boolean;
  isNew?: boolean;
};

const statusTone: Record<string, { tone: TintTone; dot: string }> = {
  Booked: { tone: "sky", dot: "bg-sky" },
  Arrived: { tone: "mint", dot: "bg-mint" },
  "With doctor": { tone: "teal", dot: "bg-teal-600" },
  Done: { tone: "slate", dot: "bg-slate-400" },
  "No-show": { tone: "peach", dot: "bg-peach" },
  Cancelled: { tone: "slate", dot: "bg-slate-300" },
};

const channelLabel: Record<string, string> = { phone: "Phone", whatsapp: "WhatsApp", web: "Web", walkin: "Walk-in" };

/* Kanban ------------------------------------------------------------------ */
export function KanbanBoard({ rows, onArrive, onCheckIn }: { rows: Row[]; onArrive: (serial: number) => void; onCheckIn: (serial: number) => string }) {
  const cols: Status[] = ["Booked", "Arrived", "With doctor", "Done", "No-show"];
  return (
    <div className="grid grid-cols-5 gap-4 overflow-x-auto bg-slate-50/60 p-4">
      {cols.map((col) => {
        const items = rows.filter((r) => r.status === col);
        const st = statusTone[col];
        return (
          <section key={col} className="flex min-w-[220px] flex-col rounded-lg bg-slate-100/70 p-2">
            <header className="mb-2 flex items-center gap-2 px-2 py-1.5">
              <span className={cn("size-2 rounded-full", st.dot)} aria-hidden />
              <h4 className="flex-1 text-small font-semibold">{col}</h4>
              <span className="tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-surface px-1.5 text-caption font-medium text-slate-600 shadow-card">{items.length}</span>
              <button className="rounded-[6px] p-0.5 text-slate-400 hover:bg-surface hover:text-slate-700" aria-label={`Add to ${col}`}>
                <Plus className="size-4" />
              </button>
            </header>
            <div className="flex flex-col gap-2">
              {items.map((r) => (
                <article
                  key={r.serial}
                  className={cn("rounded-[14px] border border-slate-200/80 bg-surface p-3.5 shadow-card transition-shadow hover:shadow-sm", r.isNew && "ring-2 ring-teal-500/40")}
                >
                  <div className="flex items-center justify-between">
                    <Badge tone={st.tone === "slate" ? "neutral" : (st.tone as any)} size="sm">
                      {channelLabel[r.via]}
                    </Badge>
                    <span className="tnum inline-flex items-center gap-0.5 text-caption font-medium text-slate-400">
                      <Hash className="size-3" />
                      {r.serial}
                    </span>
                  </div>
                  <p className="mt-2.5 text-body font-semibold leading-snug">{r.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-small text-slate-500">{r.reason}</p>
                  <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-2.5 text-caption text-slate-500">
                    <span className="tnum inline-flex items-center gap-1">
                      <Clock className="size-3.5" /> {r.time}
                    </span>
                    <span className="tnum">
                      {r.age}
                      {r.sex}
                    </span>
                    {r.vitals && <HeartPulse className="ml-auto size-3.5 text-teal-600" aria-label="Vitals done" />}
                  </div>
                  {col === "Booked" && (
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      <Button size="sm" variant="secondary" className="h-7" onClick={() => onArrive(r.serial)}>
                        Arrived
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7" href={onCheckIn(r.serial)}>
                        Vitals
                      </Button>
                    </div>
                  )}
                </article>
              ))}
              {items.length === 0 && <p className="rounded-[14px] border border-dashed border-slate-300 p-5 text-center text-caption text-slate-400">No patients</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* Schedule ---------------------------------------------------------------- */
const START = 16 * 60; // 4:00 PM
const END = 21 * 60; // 9:00 PM
const PX = 3; // px per minute
const NOW = 18 * 60 + 24; // 6:24 PM
const BREAK = { from: 19 * 60 + 30, to: 19 * 60 + 50 };

const fmt = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${((h + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};
const toMin = (t: string) => {
  const [hm, ap] = t.split(" ");
  const [h, m] = hm.split(":").map(Number);
  return ((h % 12) + (ap === "PM" ? 12 : 0)) * 60 + m;
};

type Appt = { id: string; doctor: string; name: string; code: string; condition: string; start: number; dur: number; status: Status; serial: number; note: string };

const otherAppts: Appt[] = [
  // Dr. Tanvir Ahmed — Cardiology
  ...[
    ["Abdul Karim", "CAD", "Coronary artery disease", "Done"],
    ["Selim Reza", "HTN", "Hypertension", "Done"],
    ["Rokeya Sultana", "AF", "Atrial fibrillation", "Done"],
    ["Mahbub Alam", "CHF", "Heart failure", "Done"],
    ["Farida Yasmin", "HTN", "Hypertension", "With doctor"],
    ["Nazrul Islam", "CAD", "Chest pain review", "Arrived"],
    ["Shahana Parvin", "ECG", "Abnormal ECG follow-up", "Booked"],
    ["Kamrul Hasan", "LIP", "Dyslipidemia", "Booked"],
  ].map(([n, c, cond, st], i) => ({ id: `t${i}`, doctor: "tanvir", name: n, code: c, condition: cond, start: 16 * 60 + i * 18, dur: 15, status: st as Status, serial: i + 1, note: "Echo booked in-house last visit." })),
  // Dr. Nusrat Jahan — Gynecology & Obstetrics
  ...[
    ["Tania Akter", "ANC", "Antenatal check, 28 weeks", "Done"],
    ["Mousumi Das", "PCOS", "Polycystic ovary syndrome", "Done"],
    ["Rupa Begum", "ANC", "Antenatal check, 34 weeks", "Done"],
    ["Lima Khatun", "GDM", "Gestational diabetes", "Done"],
    ["Sumaiya Rahman", "ANC", "Antenatal check, 20 weeks", "With doctor"],
    ["Jesmin Nahar", "PCOS", "Polycystic ovary syndrome", "Arrived"],
    ["Afroza Haque", "USG", "Ultrasound review", "Booked"],
    ["Nipa Sarkar", "ANC", "Antenatal check, 36 weeks", "Booked"],
  ].map(([n, c, cond, st], i) => ({ id: `n${i}`, doctor: "nusrat", name: n, code: c, condition: cond, start: 15 * 60 + 60 + i * 20 + 40, dur: 15, status: st as Status, serial: i + 9, note: "Prefers Bangla instructions." })),
  // Dr. Kamal Hossain — Endocrinology (starts 6 PM)
  ...[
    ["Rafiq Uddin", "DM", "Type 2 diabetes", "Arrived"],
    ["Hasina Mamun", "THY", "Hypothyroidism", "Booked"],
    ["Sohel Rana", "DM", "Type 2 diabetes", "Booked"],
    ["Parvin Akter", "OBS", "Obesity", "Booked"],
    ["Jahid Hasan", "DM", "Type 1 diabetes", "Booked"],
  ].map(([n, c, cond, st], i) => ({ id: `k${i}`, doctor: "kamal", name: n, code: c, condition: cond, start: 18 * 60 + i * 24, dur: 20, status: st as Status, serial: i + 1, note: "HbA1c due this visit." })),
];

const codeFor = (reason: string) =>
  /thyroid/i.test(reason) ? ["THY", "Thyroid follow-up"] : /diabet|thirst/i.test(reason) ? ["DM", "Type 2 diabetes"] : /BP|chest/i.test(reason) ? ["HTN", "Hypertension"] : /lipid/i.test(reason) ? ["LIP", "Dyslipidemia"] : /fever|cough/i.test(reason) ? ["URTI", "Respiratory infection"] : /acid|bloat/i.test(reason) ? ["GERD", "Reflux disease"] : /joint|back/i.test(reason) ? ["MSK", "Musculoskeletal pain"] : ["GEN", "General consultation"];

export function ScheduleBoard({ rows, onCheckIn }: { rows: Row[]; onCheckIn: (serial: number) => string }) {
  const [open, setOpen] = React.useState<Appt | null>(null);
  const farhana: Appt[] = rows
    .filter((r) => r.status !== "Cancelled")
    .map((r) => {
      const [code, cond] = codeFor(r.reason);
      return { id: `f${r.serial}`, doctor: "farhana", name: r.name, code, condition: cond, start: toMin(r.time) - 25, dur: 10, status: r.status, serial: r.serial, note: r.reason };
    });
  const appts = [...farhana, ...otherAppts];
  const hours = Array.from({ length: (END - START) / 60 + 1 }, (_, i) => START + i * 60);
  const height = (END - START) * PX;
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    ref.current?.scrollTo({ top: (NOW - START) * PX - 160 });
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-3 text-caption text-slate-500">
          {(["Booked", "Arrived", "With doctor", "Done", "No-show"] as Status[]).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", statusTone[s].dot)} /> {s}
            </span>
          ))}
        </div>
        <span className="inline-flex items-center gap-1.5 text-caption text-slate-500">
          <CalendarClock className="size-3.5" /> Evening session · 4:00 – 9:00 PM
        </span>
      </div>
      <div ref={ref} className="relative max-h-[620px] overflow-auto">
        {/* Column headers */}
        <div className="sticky top-0 z-20 grid grid-cols-[64px_repeat(4,minmax(200px,1fr))] border-b border-slate-200 bg-surface/95 backdrop-blur">
          <div className="border-r border-slate-200" />
          {doctors.map((d) => (
            <div key={d.id} className="flex items-center gap-2.5 border-r border-slate-200 px-3 py-2.5 last:border-r-0">
              <Avatar initials={d.initials} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-small font-semibold">{d.name}</p>
                <p className="tnum truncate text-caption text-slate-500">
                  Room {d.room} · {d.queue.current ? `on serial ${d.queue.current}` : "starts 6 PM"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative grid grid-cols-[64px_repeat(4,minmax(200px,1fr))]" style={{ height }}>
          {/* time gutter */}
          <div className="relative border-r border-slate-200">
            {hours.map((h) => (
              <span key={h} className="tnum absolute right-2 -translate-y-1/2 text-micro text-slate-400" style={{ top: (h - START) * PX }}>
                {fmt(h).replace(":00", "")}
              </span>
            ))}
          </div>
          {doctors.map((d) => (
            <div key={d.id} className="relative border-r border-slate-200 last:border-r-0">
              {hours.map((h) => (
                <div key={h} className="absolute inset-x-0 border-t border-dashed border-slate-200" style={{ top: (h - START) * PX }} />
              ))}
              {appts
                .filter((a) => a.doctor === d.id)
                .map((a) => {
                  const st = statusTone[a.status];
                  const isOpen = open?.id === a.id;
                  return (
                    <button
                      key={a.id}
                      onClick={() => setOpen(isOpen ? null : a)}
                      className={cn(
                        "absolute inset-x-1.5 flex items-center gap-2 overflow-hidden rounded-[10px] px-2 text-left transition-shadow hover:z-10 hover:shadow-sm",
                        tint[st.tone],
                        "ring-1 ring-inset ring-slate-900/5",
                        a.status === "Done" && "opacity-60",
                        a.status === "No-show" && "hatch",
                        isOpen && "z-10 ring-2 ring-teal-500"
                      )}
                      style={{ top: (a.start - START) * PX + 1, height: Math.max(20, a.dur * PX - 2) }}
                      aria-label={`${a.name}, ${a.condition}, ${fmt(a.start)}, ${a.status}`}
                    >
                      {a.dur * PX >= 44 ? (
                        <>
                          <Avatar initials={initialsOf(a.name)} size="xs" className="ring-2 ring-surface/60" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-caption font-semibold text-slate-900">{a.name}</span>
                            <span className="tnum block truncate text-[10px] text-slate-500">
                              {fmt(a.start)} – {fmt(a.start + a.dur)}
                            </span>
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="min-w-0 flex-1 truncate text-caption font-semibold text-slate-900">{a.name}</span>
                          <span className="tnum hidden shrink-0 text-[10px] text-slate-500 2xl:inline">{fmt(a.start).replace(" PM", "")}</span>
                        </>
                      )}
                      <span className="shrink-0 self-start pt-1.5 text-[10px] font-semibold tracking-wide">{a.code}</span>
                    </button>
                  );
                })}
            </div>
          ))}

          {/* prayer break */}
          <div
            className="hatch pointer-events-none absolute right-0 flex items-center justify-center bg-surface/60 text-slate-200"
            style={{ left: 64, top: (BREAK.from - START) * PX, height: (BREAK.to - BREAK.from) * PX }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 shadow-card">
              <Coffee className="size-3" /> Maghrib break
            </span>
          </div>

          {/* now line */}
          <div className="pointer-events-none absolute right-0 z-10 flex items-center" style={{ left: 0, top: (NOW - START) * PX }}>
            <span className="tnum ml-1.5 rounded-[6px] bg-teal-700 px-1.5 py-0.5 text-[10px] font-semibold text-on-accent">6:24</span>
            <span className="h-px flex-1 border-t border-dashed border-teal-600" />
          </div>
        </div>

        {/* Detail popover */}
        {open && (
          <div className="fixed bottom-6 right-6 z-50 w-[340px] animate-pop-in rounded-xl border border-slate-200 bg-surface-raised p-4 shadow-sm" role="dialog" aria-label="Appointment details">
            <div className="flex items-center justify-between">
              <p className="text-small font-semibold">
                Appointment <span className="ml-1 rounded-[6px] bg-slate-100 px-1.5 py-0.5 font-mono text-caption font-normal text-slate-600">#A-{1456990 + open.serial}</span>
              </p>
              <button onClick={() => setOpen(null)} className="rounded-[8px] p-1 text-slate-400 hover:bg-slate-100" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-3 rounded-[14px] border border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <Avatar initials={initialsOf(open.name)} size="md" />
                <div className="min-w-0">
                  <p className="text-body font-semibold">{open.name}</p>
                  <p className="truncate text-small text-slate-500">{open.condition}</p>
                </div>
                <Badge tone={statusTone[open.status].tone === "slate" ? "neutral" : (statusTone[open.status].tone as any)} className="ml-auto">
                  {open.code}
                </Badge>
              </div>
              <p className="mt-3 border-t border-slate-100 pt-3 text-small text-slate-600">{open.note}</p>
            </div>
            <div className="mt-2 grid grid-cols-[64px_1fr] overflow-hidden rounded-[14px] border border-slate-200">
              <div className="flex flex-col items-center justify-center border-r border-slate-200 bg-slate-50 py-3">
                <span className="text-caption font-medium uppercase text-slate-500">Nov</span>
                <span className="tnum text-h2 font-semibold">19</span>
              </div>
              <dl className="grid grid-cols-[64px_1fr] gap-y-1.5 px-3 py-3 text-small">
                <dt className="text-slate-500">Doctor</dt>
                <dd className="truncate font-medium">{doctors.find((d) => d.id === open.doctor)?.name}</dd>
                <dt className="text-slate-500">Time</dt>
                <dd className="tnum font-medium">
                  {fmt(open.start)} – {fmt(open.start + open.dur)}
                </dd>
                <dt className="text-slate-500">Status</dt>
                <dd className="font-medium">{open.status}</dd>
              </dl>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" href={onCheckIn(open.serial)}>
                <HeartPulse /> Vitals
              </Button>
              <Button href="/d/patient/rahima">
                Patient <ExternalLink />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


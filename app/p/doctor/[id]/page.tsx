"use client";
import * as React from "react";
import { Clock, MapPin, Wallet, Info } from "lucide-react";
import { PatientFrame, PHeader, PButton, useLang } from "@/components/shell/patient";
import { Avatar } from "@/components/ui/primitives";
import { departments, doctors } from "@/data/mock";
import { cn, lakh } from "@/lib/utils";

const days = [
  { d: 19, en: "Thu", bn: "বৃহঃ", left: 14, serial: 18, time: ["সন্ধ্যা ৭:০০", "7:00 PM"] },
  { d: 20, en: "Fri", bn: "শুক্র", left: 0, serial: 0, time: ["", ""] },
  { d: 21, en: "Sat", bn: "শনি", left: 22, serial: 11, time: ["সন্ধ্যা ৬:১০", "6:10 PM"] },
  { d: 22, en: "Sun", bn: "রবি", left: 6, serial: 27, time: ["রাত ৮:২০", "8:20 PM"] },
  { d: 23, en: "Mon", bn: "সোম", left: 18, serial: 15, time: ["সন্ধ্যা ৬:৪০", "6:40 PM"] },
  { d: 24, en: "Tue", bn: "মঙ্গল", left: 25, serial: 8, time: ["সন্ধ্যা ৫:৪০", "5:40 PM"] },
  { d: 25, en: "Wed", bn: "বুধ", left: 29, serial: 4, time: ["বিকাল ৫:২০", "5:20 PM"] },
];

export default function DoctorProfile({ params, searchParams }: { params: { id: string }; searchParams: { from?: string } }) {
  const { t, n } = useLang();
  const doc = doctors.find((d) => d.id === params.id) ?? doctors[0];
  const dept = departments.find((d) => d.id === doc.dept)!;
  const fromVisit = searchParams.from === "visit";
  const [sel, setSel] = React.useState(fromVisit ? 3 : 0);
  const day = days[sel];
  return (
    <PatientFrame
      header={<PHeader title={t("সিরিয়াল বেছে নিন", "Choose a serial")} back={fromVisit ? "/p/response/visit" : `/p/doctors?dept=${doc.dept}`} />}
      bottom={
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-small text-slate-500">{t("সিরিয়াল", "Serial")}</p>
            <p className="truncate font-semibold">
              {n(day.serial)} · {t(day.time[0], day.time[1])}
            </p>
          </div>
          <PButton href={`/p/details${fromVisit ? "?from=visit" : ""}`} className="w-auto flex-1">
            {t("পরবর্তী", "Continue")}
          </PButton>
        </div>
      }
    >
      <div className="space-y-5 px-4 py-5">
        {fromVisit && (
          <p className="rounded-lg border border-info/25 bg-info-bg p-3 text-body text-info-fg">
            {t("ডাক্তার আপনার জন্য রবিবারের একটি সিরিয়াল রেখেছেন।", "Your doctor held a serial for you on Sunday.")}
          </p>
        )}
        <div className="flex gap-4">
          <Avatar initials={doc.initials} size="xl" />
          <div>
            <h1 className="text-h2 font-semibold">{t(doc.bn, doc.name)}</h1>
            <p className="text-small text-slate-500">{doc.degrees}</p>
            <p className="text-small text-slate-700">{t(dept.bn, dept.name)}</p>
          </div>
        </div>
        <dl className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white p-4 text-body">
          <div className="flex items-center gap-3">
            <MapPin className="size-5 text-slate-500" />
            <dd>
              {t(`রুম ${n(doc.room)}, ${n(3)} তলা`, `Room ${doc.room}, ${doc.floor}`)}
            </dd>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-slate-500" />
            <dd>
              {t(doc.daysBn, doc.days)} · {t(doc.timeBn, doc.time)}
            </dd>
          </div>
          <div className="flex items-center gap-3">
            <Wallet className="size-5 text-slate-500" />
            <dd>
              {t("ফি", "Consultation fee")} ৳ {n(lakh(doc.fee))} · {t("রিপোর্ট দেখানো ফ্রি", "report review free")}
            </dd>
          </div>
        </dl>

        <section>
          <h2 className="mb-2 text-h3 font-semibold">{t("তারিখ", "Date")} · {t("নভেম্বর", "November")}</h2>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none" role="radiogroup" aria-label="Date">
            {days.map((d, i) => {
              const closed = d.left === 0;
              return (
                <button
                  key={d.d}
                  role="radio"
                  aria-checked={sel === i}
                  disabled={closed}
                  onClick={() => setSel(i)}
                  className={cn(
                    "flex min-w-[64px] flex-col items-center rounded-lg border px-2 py-2.5",
                    sel === i ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white",
                    closed && "border-dashed bg-slate-50 text-slate-400"
                  )}
                >
                  <span className={cn("text-small", sel === i ? "text-teal-100" : "text-slate-500")}>{i === 0 ? t("আজ", "Today") : t(d.bn, d.en)}</span>
                  <span className="text-h2 font-semibold">{n(d.d)}</span>
                  <span className={cn("text-caption", sel === i ? "text-teal-100" : closed ? "text-slate-400" : "text-teal-700")}>
                    {closed ? t("বন্ধ", "Closed") : t(`${n(d.left)} বাকি`, `${d.left} left`)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <p className="text-small text-teal-800">{t("পরবর্তী খালি সিরিয়াল", "Next available serial")}</p>
          <p className="mt-1 text-h2 font-semibold">
            {t(`সিরিয়াল ${n(day.serial)}, আনুমানিক ${day.time[0]}`, `Serial ${day.serial}, around ${day.time[1]}`)}
          </p>
          <p className="mt-2 flex items-start gap-1.5 text-small text-slate-700">
            <Info className="mt-0.5 size-4 shrink-0" />
            {t("সময় একটু আগে-পরে হতে পারে। লাইভ আপডেট WhatsApp-এ পাবেন।", "Time may shift a little. You'll get live updates on WhatsApp.")}
          </p>
        </div>
      </div>
    </PatientFrame>
  );
}

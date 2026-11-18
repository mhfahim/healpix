"use client";
import * as React from "react";
import { CalendarDays, Wallet } from "lucide-react";
import { PatientFrame, PHeader, PLink, useLang } from "@/components/shell/patient";
import { Chip } from "@/components/ui/controls";
import { Avatar } from "@/components/ui/primitives";
import { departments, doctors } from "@/data/mock";
import { lakh } from "@/lib/utils";

export default function DoctorList({ searchParams }: { searchParams: { dept?: string } }) {
  const { t, n } = useLang();
  const dept = departments.find((d) => d.id === searchParams.dept) ?? departments[0];
  const [when, setWhen] = React.useState("today");
  // Medicine shows Dr. Farhana plus two colleagues for a realistic list.
  const list =
    dept.id === "medicine"
      ? [
          doctors[0],
          { ...doctors[0], id: "x1", name: "Dr. Mahbubur Rahman", bn: "ডা. মাহবুবুর রহমান", initials: "MR", degrees: "MBBS, MD (Internal Medicine)", fee: 800, nextSerial: 9, nextTime: "5:40 PM", days: "Sun, Tue", daysBn: "রবি, মঙ্গল" },
          { ...doctors[0], id: "x2", name: "Dr. Sabina Yasmin", bn: "ডা. সাবিনা ইয়াসমিন", initials: "SY", degrees: "MBBS, FCPS (Medicine)", fee: 1000, nextSerial: 0, nextTime: "", days: "Sat, Mon", daysBn: "শনি, সোম" },
        ]
      : doctors.filter((d) => d.dept === dept.id);
  return (
    <PatientFrame header={<PHeader title={t(dept.bn, dept.name)} back="/p/home" sub={t(`${n(list.length)} জন ডাক্তার`, `${list.length} doctors`)} />}>
      <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 py-3 scrollbar-none">
        {[
          ["today", t("আজ", "Today")],
          ["tomorrow", t("আগামীকাল", "Tomorrow")],
          ["week", t("এই সপ্তাহ", "This week")],
        ].map(([v, l]) => (
          <Chip key={v as string} size="lg" selected={when === v} onClick={() => setWhen(v as string)}>
            {l}
          </Chip>
        ))}
      </div>
      <ul className="space-y-3 px-4 py-4">
        {list.map((d) => {
          const available = d.nextSerial > 0 && !(when === "today" && d.id === "x1");
          return (
            <li key={d.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex gap-3">
                <Avatar initials={d.initials} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-h3 font-semibold">{t(d.bn, d.name)}</p>
                  <p className="text-small text-slate-500">{d.degrees}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-small text-slate-700">
                    <CalendarDays className="size-4 text-slate-500" /> {t(d.daysBn, d.days)} · {t(d.timeBn, d.time)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-small text-slate-700">
                    <Wallet className="size-4 text-slate-500" /> {t("ফি", "Fee")} ৳ {n(lakh(d.fee))}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <p className="text-small">
                  {available ? (
                    <>
                      <span className="text-slate-500">{t("পরবর্তী সিরিয়াল", "Next serial")}</span>
                      <br />
                      <span className="font-semibold text-teal-800">
                        {n(d.nextSerial)} · {t("আজ", "today")}
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-500">{t("আজ সিরিয়াল নেই", "No serials today")}</span>
                  )}
                </p>
                <PLink
                  href={`/p/doctor/${d.id === "x1" || d.id === "x2" ? "farhana" : d.id}`}
                  className="inline-flex h-11 items-center rounded bg-teal-700 px-5 text-base font-medium text-white hover:bg-teal-800"
                >
                  {t("সিরিয়াল নিন", "Book serial")}
                </PLink>
              </div>
            </li>
          );
        })}
      </ul>
    </PatientFrame>
  );
}

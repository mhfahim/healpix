"use client";
import { CalendarCheck, ChevronRight, FileText, Headphones, ListOrdered, Search, Clock } from "lucide-react";
import { PatientFrame, HospitalHeader, PLink, useLang, HotlineLink, PoweredBy } from "@/components/shell/patient";
import { deptIcon } from "@/components/shell/dept-icons";
import { departments } from "@/data/mock";
import { IconChip } from "@/components/ui/primitives";

export default function PatientHome() {
  const { t, n } = useLang();
  return (
    <PatientFrame header={<HospitalHeader />}>
      <div className="space-y-6 px-4 py-5">
        <div>
          <h1 className="text-h1 font-semibold">{t("আজ কাকে দেখাতে চান?", "Who would you like to see?")}</h1>
          <label className="relative mt-3 block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
            <input
              className="h-12 w-full rounded border border-slate-200 bg-surface pl-12 pr-4 text-base placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder={t("ডাক্তার, বিভাগ বা সমস্যা লিখুন", "Doctor, department or symptom") as string}
              aria-label={t("খুঁজুন", "Search") as string}
            />
          </label>
          <div className="mt-2 flex flex-wrap gap-2 text-small text-slate-500">
            {(t(["জ্বর", "ডায়াবেটিস", "বুকে ব্যথা"], ["Fever", "Diabetes", "Chest pain"]) as string[]).map((s) => (
              <span key={s} className="rounded-full bg-surface px-3 py-1 ring-1 ring-slate-200">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Upcoming visit */}
        <PLink href="/p/tracker" className="block rounded-lg bg-teal-700 p-4 text-on-accent shadow-card [&_.text-slate-700]:text-on-accent/80 [&_.text-teal-800]:text-on-accent/80 [&_.text-teal-700]:text-on-accent">
          <p className="flex items-center gap-2 text-small font-medium text-teal-800">
            <CalendarCheck className="size-4" /> {t("আপনার পরবর্তী ভিজিট", "Your upcoming visit")}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-h3 font-semibold">{t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman")}</p>
              <p className="text-body text-slate-700">
                {t("আজ", "Today")} · {t("সিরিয়াল", "Serial")} {n(18)} · {t("আনুমানিক সন্ধ্যা ৭:০৫", "around 7:05 PM")}
              </p>
            </div>
            <ChevronRight className="size-5 text-teal-700" />
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-small text-slate-700">
            <Clock className="size-4" /> {t("ডাক্তার এখন সিরিয়াল ৯ দেখছেন", "Doctor is now on serial 9")}
          </p>
        </PLink>

        <section>
          <h2 className="mb-3 text-h3 font-semibold">{t("বিভাগসমূহ", "Departments")}</h2>
          <div className="grid grid-cols-3 gap-2">
            {departments.map((d, i) => {
              const Icon = deptIcon[d.icon];
              const tone = (["teal", "rose", "iris", "sky", "peach", "mint", "teal"] as const)[i];
              return (
                <PLink
                  key={d.id}
                  href={`/p/doctors?dept=${d.id}`}
                  className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-lg bg-surface shadow-card ring-1 ring-slate-200/70 p-2 text-center hover:border-teal-500"
                >
                  <IconChip icon={Icon} tone={tone} />
                  <span className="text-small font-medium leading-tight">{t(d.bn, d.name)}</span>
                </PLink>
              );
            })}
            <span className="flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 p-2 text-center text-small text-slate-500">
              {t("সব বিভাগ", "All departments")}
            </span>
          </div>
        </section>

        <section className="divide-y divide-slate-100 rounded-lg bg-surface shadow-card ring-1 ring-slate-200/70">
          {[
            { icon: ListOrdered, label: t("আমার সিরিয়াল ট্র্যাক করুন", "Track my serial"), href: "/p/tracker" },
            { icon: FileText, label: t("আমার রিপোর্ট", "My reports"), href: "/p/record" },
          ].map((l, i) => (
            <PLink key={i} href={l.href} className="flex min-h-14 items-center gap-3 px-4">
              <l.icon className="size-5 text-slate-500" strokeWidth={1.5} />
              <span className="flex-1 font-medium">{l.label}</span>
              <ChevronRight className="size-5 text-slate-400" />
            </PLink>
          ))}
          <div className="flex min-h-14 items-center gap-3 px-4">
            <Headphones className="size-5 text-slate-500" strokeWidth={1.5} />
            <span className="flex-1 font-medium">{t("সাহায্য", "Help")}</span>
            <HotlineLink />
          </div>
        </section>
        <PoweredBy />
      </div>
    </PatientFrame>
  );
}

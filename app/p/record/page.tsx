"use client";
import * as React from "react";
import { ChevronRight, FileText, FlaskConical, Stethoscope } from "lucide-react";
import { PatientFrame, PHeader, PLink, useLang } from "@/components/shell/patient";
import { cn } from "@/lib/utils";

type Tab = "visits" | "rx" | "reports";

export default function Record() {
  const { t } = useLang();
  const [tab, setTab] = React.useState<Tab>("visits");
  const data: Record<Tab, { date: React.ReactNode; title: React.ReactNode; sub: React.ReactNode; href: string; badge?: React.ReactNode }[]> = {
    visits: [
      { date: t("১৯ নভেম্বর ২০২৬", "19 Nov 2026"), title: t("মেডিসিন · চেম্বার ভিজিট", "Medicine · chamber visit"), sub: t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman"), href: "/p/response" },
      { date: t("২ জুন ২০২৬", "2 Jun 2026"), title: t("মেডিসিন · চেম্বার ভিজিট", "Medicine · chamber visit"), sub: t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman"), href: "/p/response" },
      { date: t("১৪ জানুয়ারি ২০২৬", "14 Jan 2026"), title: t("মেডিসিন · চেম্বার ভিজিট", "Medicine · chamber visit"), sub: t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman"), href: "/p/response" },
    ],
    rx: [
      { date: t("২০ নভেম্বর ২০২৬", "20 Nov 2026"), title: t("আপডেট প্রেসক্রিপশন (রিপোর্ট দেখে)", "Updated prescription (after reports)"), sub: t("ডা. ফারহানা রহমান · অনলাইনে", "Dr. Farhana Rahman · remote"), href: "/p/response", badge: t("নতুন", "New") },
      { date: t("১৯ নভেম্বর ২০২৬", "19 Nov 2026"), title: t("প্রেসক্রিপশন", "Prescription"), sub: t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman"), href: "/p/response" },
      { date: t("২ জুন ২০২৬", "2 Jun 2026"), title: t("প্রেসক্রিপশন", "Prescription"), sub: t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman"), href: "/p/response" },
    ],
    reports: [
      { date: t("২০ নভেম্বর ২০২৬", "20 Nov 2026"), title: "HbA1c, Lipid Profile, Serum Creatinine, Urine R/E", sub: t("মেরিডিয়ান ল্যাব · ডাক্তার দেখেছেন", "Meridian lab · reviewed by doctor"), href: "/p/report-status" },
      { date: t("৩ জুন ২০২৬", "3 Jun 2026"), title: "HbA1c, Lipid Profile", sub: t("মেরিডিয়ান ল্যাব", "Meridian lab"), href: "/p/report-status" },
    ],
  };
  const icon = { visits: Stethoscope, rx: FileText, reports: FlaskConical }[tab];
  const Icon = icon;
  return (
    <PatientFrame header={<PHeader title={t("আমার স্বাস্থ্য রেকর্ড", "My health record")} back="/p/home" sub={t("রহিমা বেগম · MSH-240318", "Rahima Begum · MSH-240318")} />}>
      <div role="tablist" className="sticky top-0 z-10 grid grid-cols-3 border-b border-slate-200 bg-white">
        {(
          [
            ["visits", t("ভিজিট", "Visits")],
            ["rx", t("প্রেসক্রিপশন", "Prescriptions")],
            ["reports", t("রিপোর্ট", "Reports")],
          ] as [Tab, React.ReactNode][]
        ).map(([v, l]) => (
          <button
            key={v}
            role="tab"
            aria-selected={tab === v}
            onClick={() => setTab(v)}
            className={cn("h-12 border-b-2 text-body font-medium", tab === v ? "border-teal-700 text-teal-800" : "border-transparent text-slate-500")}
          >
            {l}
          </button>
        ))}
      </div>
      <ol className="relative px-4 py-5">
        <span className="absolute bottom-8 left-[35px] top-8 w-px bg-slate-200" aria-hidden />
        {data[tab].map((e, i) => (
          <li key={i} className="relative mb-3 flex gap-3">
            <span className="z-10 mt-3 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white">
              <Icon className="size-5 text-teal-700" strokeWidth={1.5} />
            </span>
            <PLink href={e.href} className="flex min-h-[72px] flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white p-3">
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-small text-slate-500">
                  {e.date}
                  {e.badge && <span className="rounded-full bg-info-bg px-2 text-caption font-medium text-info-fg">{e.badge}</span>}
                </span>
                <span className="block font-semibold">{e.title}</span>
                <span className="block text-small text-slate-700">{e.sub}</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-slate-400" />
            </PLink>
          </li>
        ))}
      </ol>
    </PatientFrame>
  );
}

"use client";
import { Bell } from "lucide-react";
import { PatientFrame, PHeader, useLang, PLink } from "@/components/shell/patient";
import { TimelineItem } from "@/components/ui/clinical";

export default function ReportStatus() {
  const { t } = useLang();
  const steps = [
    { title: t("বুক হয়েছে", "Booked"), time: t("১৯ নভেম্বর, সন্ধ্যা ৬:৪৫", "19 Nov, 6:45 PM"), state: "done" as const },
    { title: t("নমুনা নেওয়া হয়েছে", "Sample collected"), time: t("২০ নভেম্বর, সকাল ৮:১২", "20 Nov, 8:12 AM"), state: "done" as const },
    { title: t("পরীক্ষা চলছে", "Processing"), time: t("সকাল ৮:৪০ থেকে", "From 8:40 AM"), state: "done" as const },
    { title: t("রিপোর্ট তৈরি", "Report ready"), time: t("দুপুর ২:১০", "2:10 PM"), state: "done" as const },
    {
      title: t("ডাক্তার দেখছেন", "Doctor reviewing"),
      time: t("সাধারণত ৬ ঘণ্টার মধ্যে উত্তর দেন", "Usually replies within 6 hours"),
      state: "current" as const,
      body: t("ডা. ফারহানা রহমান আজ সন্ধ্যার আগে দেখবেন।", "Dr. Farhana Rahman will review before this evening."),
    },
    { title: t("ডাক্তার উত্তর দিয়েছেন", "Doctor responded"), time: t("উত্তর এলে WhatsApp-এ জানাব", "We'll notify you on WhatsApp"), state: "pending" as const },
  ];
  return (
    <PatientFrame header={<PHeader title={t("রিপোর্টের অবস্থা", "Report status")} back="/p/home" sub={t("বুকিং LB-26-118204 · ৪টি পরীক্ষা", "Booking LB-26-118204 · 4 tests")} />}>
      <div className="px-4 py-5">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <ol>
            {steps.map((s, i) => (
              <TimelineItem key={i} big title={s.title} time={s.time} state={s.state} body={(s as any).body} last={i === steps.length - 1} />
            ))}
          </ol>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-100 p-3 text-body text-slate-700">
          <Bell className="size-5 shrink-0 text-slate-500" />
          {t("রিপোর্ট দেখাতে চেম্বারে আসার দরকার নেই।", "You don't need to visit the chamber to show the report.")}
        </div>
        <PLink href="/p/record" className="mt-4 flex h-12 items-center justify-center rounded border border-slate-200 bg-white font-medium">
          {t("রিপোর্ট PDF দেখুন", "View report PDF")}
        </PLink>
      </div>
    </PatientFrame>
  );
}

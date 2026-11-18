"use client";
import { CalendarPlus, CheckCircle2, MessageCircle, Settings2 } from "lucide-react";
import { PatientFrame, PButton, useLang, LangToggle, HotlineLink } from "@/components/shell/patient";

export default function Confirmed({ searchParams }: { searchParams: { from?: string } }) {
  const { t, n } = useLang();
  const visit = searchParams.from === "visit";
  const s = visit
    ? { serial: 27, date: t("রবিবার, ২২ নভেম্বর", "Sunday, 22 Nov"), time: t("আনুমানিক রাত ৮:২০", "around 8:20 PM") }
    : { serial: 18, date: t("আজ, বৃহস্পতিবার ১৯ নভেম্বর", "Today, Thursday 19 Nov"), time: t("আনুমানিক সন্ধ্যা ৭:০০", "around 7:00 PM") };
  return (
    <PatientFrame
      bg="bg-white"
      bottom={
        <div className="space-y-2">
          <PButton href="/p/tracker">
            <Settings2 /> {t("বুকিং দেখুন ও পরিবর্তন করুন", "Manage booking")}
          </PButton>
          <PButton variant="secondary">
            <CalendarPlus /> {t("ক্যালেন্ডারে যোগ করুন", "Add to calendar")}
          </PButton>
        </div>
      }
    >
      <div className="flex justify-end px-4 pt-3">
        <LangToggle />
      </div>
      <div className="px-6 pb-6 pt-6 text-center">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-success-bg">
          <CheckCircle2 className="size-9 text-success" strokeWidth={1.75} />
        </span>
        <h1 className="mt-4 text-h1 font-semibold">{t("বুকিং নিশ্চিত হয়েছে", "Booking confirmed")}</h1>
        <div className="mt-6 rounded-xl border border-slate-200 p-5">
          <p className="text-body text-slate-500">{t("আপনার সিরিয়াল নম্বর", "Your serial number")}</p>
          <p className="tnum mt-1 text-hero font-semibold text-teal-800">{n(s.serial)}</p>
          <dl className="mt-4 space-y-3 border-t border-slate-100 pt-4 text-left">
            {[
              [t("তারিখ", "Date"), s.date],
              [t("সময়", "Time"), s.time],
              [t("ডাক্তার", "Doctor"), t("ডা. ফারহানা রহমান (মেডিসিন)", "Dr. Farhana Rahman (Medicine)")],
              [t("রুম", "Room"), t(`রুম ${n(304)}, ${n(3)} তলা`, "Room 304, 3rd floor")],
              [t("ফি", "Fee"), t("৳ ১,০০০ · কাউন্টারে দিন", "৳ 1,000 · pay at counter")],
            ].map(([k, v], i) => (
              <div key={i} className="flex justify-between gap-4">
                <dt className="text-slate-500">{k}</dt>
                <dd className="text-right font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-teal-50 p-3 text-left text-body text-teal-900">
          <MessageCircle className="mt-0.5 size-5 shrink-0 text-teal-700" />
          {t("সিরিয়ালের আপডেট WhatsApp ও SMS-এ আসবে। আপনার আগে ৩ জন থাকলে আমরা জানাব।", "Updates will come on WhatsApp and SMS. We'll tell you when 3 patients are ahead of you.")}
        </p>
        <div className="mt-4">
          <HotlineLink />
        </div>
      </div>
    </PatientFrame>
  );
}

"use client";
import { CheckCircle2, MapPin, Clock, ShieldCheck, Square } from "lucide-react";
import { PatientFrame, PButton, useLang, LangToggle } from "@/components/shell/patient";

export default function TestsConfirmed() {
  const { t, n } = useLang();
  const checklist = [
    t("রাত ৯টার পর থেকে কিছু খাবেন না (পানি খেতে পারবেন)", "Nothing to eat after 9 PM (water is fine)"),
    t("সকালের প্রথম প্রস্রাব পাত্রে আনুন (কাউন্টার থেকে পাত্র নিন)", "Bring your first morning urine (get a container at the counter)"),
    t("সকালের ডায়াবেটিসের ওষুধ নমুনা দেওয়ার পরে খাবেন", "Take your morning diabetes medicine after the sample"),
    t("এই বুকিং আইডি সাথে রাখুন", "Keep this booking ID with you"),
  ];
  return (
    <PatientFrame bg="bg-surface" bottom={<PButton href="/p/report-status">{t("রিপোর্টের অবস্থা দেখুন", "Track report status")}</PButton>}>
      <div className="flex justify-end px-4 pt-3">
        <LangToggle />
      </div>
      <div className="px-5 pb-6 pt-4">
        <div className="text-center">
          <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-success-bg">
            <CheckCircle2 className="size-9 text-success" strokeWidth={1.75} />
          </span>
          <h1 className="mt-4 text-h1 font-semibold">{t("পরীক্ষা বুক হয়েছে", "Tests booked")}</h1>
          <p className="mt-1 text-slate-500">{t("বুকিং আইডি", "Booking ID")}</p>
          <p className="tnum text-h2 font-semibold tracking-wider">LB-{n("26-118204")}</p>
        </div>
        <dl className="mt-6 space-y-3 rounded-xl bg-surface shadow-card ring-1 ring-slate-200/70 p-4">
          <div className="flex gap-3">
            <Clock className="mt-0.5 size-5 shrink-0 text-teal-700" />
            <div>
              <dt className="text-small text-slate-500">{t("নমুনা সংগ্রহের সময়", "Collection time")}</dt>
              <dd className="font-semibold">{t("আগামীকাল, শুক্রবার ২০ নভেম্বর · সকাল ৮:০০", "Tomorrow, Fri 20 Nov · 8:00 AM")}</dd>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-5 shrink-0 text-teal-700" />
            <div>
              <dt className="text-small text-slate-500">{t("কোথায়", "Where")}</dt>
              <dd className="font-semibold">{t("নিচতলা, ল্যাব কাউন্টার ২", "Ground floor, Lab counter 2")}</dd>
            </div>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-3">
            <dt className="text-slate-500">{t("মোট (কাউন্টারে দিন)", "Total (pay at counter)")}</dt>
            <dd className="tnum font-semibold">৳ {n("2,900")}</dd>
          </div>
        </dl>
        <h2 className="mt-6 font-semibold">{t("প্রস্তুতি", "How to prepare")}</h2>
        <ul className="mt-2 space-y-2">
          {checklist.map((c, i) => (
            <li key={i} className="flex gap-3 rounded-lg border border-slate-200 p-3">
              <Square className="mt-0.5 size-5 shrink-0 text-slate-300" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-start gap-2 rounded-lg bg-teal-50 p-3 text-teal-900">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-teal-700" />
          {t("আপনার রিপোর্ট সরাসরি ডাক্তারের কাছে যাবে। তিনি দেখে WhatsApp-এ জানাবেন।", "Your report goes straight to your doctor. They'll review it and reply on WhatsApp.")}
        </div>
      </div>
    </PatientFrame>
  );
}

"use client";
import { CalendarCheck, Stethoscope } from "lucide-react";
import { PatientFrame, PHeader, PButton, useLang, HotlineLink } from "@/components/shell/patient";
import { Avatar } from "@/components/ui/primitives";

export default function ResponseVisit() {
  const { t, n } = useLang();
  return (
    <PatientFrame
      header={<PHeader title={t("ডাক্তারের উত্তর", "Doctor's response")} back="/p/record" />}
      bottom={
        <PButton href="/p/doctor/farhana?from=visit">
          <CalendarCheck /> {t("সিরিয়াল নিন", "Book serial")}
        </PButton>
      }
    >
      <div className="space-y-5 px-4 py-6">
        <div className="text-center">
          <Avatar initials="FR" size="xl" className="mx-auto" />
          <h1 className="mt-4 text-h1 font-semibold">{t("ডা. রহমান আপনাকে সরাসরি দেখতে চান", "Dr. Rahman wants to see you in person")}</h1>
          <p className="mt-2 text-slate-700">{t("আপনার রিপোর্ট নিয়ে সামনাসামনি কথা বলা দরকার।", "They'd like to discuss your report face to face.")}</p>
        </div>
        <div className="rounded-lg bg-teal-50 p-4 font-bn text-teal-900">
          <Stethoscope className="mb-1 size-4 text-teal-700" />
          রিপোর্ট নিয়ে সরাসরি কথা বলা দরকার। অনুগ্রহ করে চেম্বারে আসুন।
        </div>
        <div className="rounded-xl border border-teal-200 bg-white p-4">
          <p className="text-small text-slate-500">{t("আপনার জন্য রাখা সিরিয়াল", "Serial held for you")}</p>
          <p className="mt-1 text-h2 font-semibold">
            {t(`রবিবার, ২২ নভেম্বর · সিরিয়াল ${n(27)}`, "Sunday, 22 Nov · Serial 27")}
          </p>
          <p className="text-slate-700">{t("আনুমানিক রাত ৮:২০ · রুম ৩০৪", "Around 8:20 PM · Room 304")}</p>
          <p className="mt-2 text-small text-slate-500">{t("৪৮ ঘণ্টার মধ্যে নিশ্চিত করুন", "Please confirm within 48 hours")}</p>
        </div>
        <div className="text-center">
          <HotlineLink />
        </div>
      </div>
    </PatientFrame>
  );
}

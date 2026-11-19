"use client";
import * as React from "react";
import { Mic, ShieldCheck, Square } from "lucide-react";
import { PatientFrame, PHeader, PButton, useLang } from "@/components/shell/patient";
import { Segmented, Checkbox } from "@/components/ui/controls";
import { cn } from "@/lib/utils";

const fieldCls =
  "h-12 w-full rounded border border-slate-200 bg-surface px-4 text-base placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20";

export default function Details({ searchParams }: { searchParams: { from?: string } }) {
  const { t, ts, n } = useLang();
  const [forWhom, setForWhom] = React.useState<"self" | "family">("self");
  const [sex, setSex] = React.useState<"F" | "M" | "O">("F");
  const [agree, setAgree] = React.useState(true);
  const [rec, setRec] = React.useState<"idle" | "rec" | "done">("done");
  const visit = searchParams.from === "visit";

  return (
    <PatientFrame
      header={<PHeader title={t("রোগীর তথ্য", "Patient details")} back="/p/doctor/farhana" sub={t(`ডা. ফারহানা রহমান · আজ · সিরিয়াল ${n(18)}`, "Dr. Farhana Rahman · Today · Serial 18")} />}
      bottom={
        <PButton href={`/p/otp${visit ? "?from=visit" : ""}`} disabled={!agree}>
          {t("বুকিং নিশ্চিত করুন", "Confirm booking")}
        </PButton>
      }
    >
      <form className="space-y-5 px-4 py-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <p className="mb-2 font-medium">{t("কার জন্য বুক করছেন?", "Booking for")}</p>
          <Segmented
            size="lg"
            className="w-full"
            value={forWhom}
            onChange={setForWhom}
            options={[
              { value: "self", label: t("নিজের জন্য", "Myself") },
              { value: "family", label: t("পরিবারের সদস্য", "Family member") },
            ]}
          />
        </div>
        {forWhom === "family" && (
          <label className="block">
            <span className="mb-1.5 block font-medium">{t("রোগীর সাথে সম্পর্ক", "Relationship to patient")}</span>
            <select className={fieldCls} defaultValue="mother">
              <option value="mother">{ts("মা", "Mother")}</option>
              <option value="father">{ts("বাবা", "Father")}</option>
              <option value="spouse">{ts("স্বামী/স্ত্রী", "Spouse")}</option>
              <option value="child">{ts("সন্তান", "Child")}</option>
            </select>
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block font-medium">{t("রোগীর নাম", "Patient name")}</span>
          <input className={fieldCls} defaultValue={ts("রহিমা বেগম", "Rahima Begum")} autoComplete="name" />
        </label>
        <div className="grid grid-cols-[96px_1fr] gap-3">
          <label className="block">
            <span className="mb-1.5 block font-medium">{t("বয়স", "Age")}</span>
            <input className={cn(fieldCls, "tnum")} defaultValue={n(58)} inputMode="numeric" />
          </label>
          <div>
            <span className="mb-1.5 block font-medium">{t("লিঙ্গ", "Sex")}</span>
            <Segmented
              size="lg"
              className="w-full"
              value={sex}
              onChange={setSex}
              options={[
                { value: "F", label: t("মহিলা", "Female") },
                { value: "M", label: t("পুরুষ", "Male") },
                { value: "O", label: t("অন্য", "Other") },
              ]}
            />
          </div>
        </div>
        <label className="block">
          <span className="mb-1.5 block font-medium">{t("মোবাইল নম্বর", "Mobile number")}</span>
          <div className="flex">
            <span className="inline-flex h-12 items-center rounded-l border border-r-0 border-slate-200 bg-slate-100 px-3 text-slate-700">+৮৮০</span>
            <input className={cn(fieldCls, "tnum rounded-l-none")} defaultValue={ts("০১৭১১-২৩৪৫৬৭", "01711-234567")} inputMode="tel" autoComplete="tel" />
          </div>
          <span className="mt-1 block text-small text-slate-500">{t("এই নম্বরে একটি কোড পাঠানো হবে", "We'll send a code to this number")}</span>
        </label>
        <div>
          <span className="mb-1.5 block font-medium">
            {t("কেন দেখাতে চান?", "Reason for visit")} <span className="font-normal text-slate-500">({t("ঐচ্ছিক", "optional")})</span>
          </span>
          <textarea className={cn(fieldCls, "h-auto min-h-[72px] py-3")} placeholder={ts("লিখুন অথবা ভয়েস নোট দিন", "Type or record a voice note")} />
          <button
            type="button"
            onClick={() => setRec(rec === "rec" ? "done" : "rec")}
            className={cn("mt-2 flex h-12 w-full items-center justify-center gap-2 rounded border text-base font-medium", rec === "rec" ? "border-danger bg-danger-bg text-danger-fg" : "border-slate-200 bg-surface")}
          >
            {rec === "rec" ? (
              <>
                <Square className="size-5" /> {t("রেকর্ড বন্ধ করুন ০:০৮", "Stop recording 0:08")}
              </>
            ) : (
              <>
                <Mic className="size-5 text-teal-700" /> {rec === "done" ? t("ভয়েস নোট যুক্ত হয়েছে (০:১৪) · আবার রেকর্ড", "Voice note added (0:14) · re-record") : t("ভয়েস নোট রেকর্ড করুন", "Record a voice note")}
              </>
            )}
          </button>
        </div>

        <div className="rounded-lg bg-surface shadow-card ring-1 ring-slate-200/70 p-4">
          <p className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="size-5 text-teal-700" /> {t("আপনার তথ্যের সুরক্ষা", "Your records")}
          </p>
          <p className="mt-2 text-body text-slate-700">
            {t(
              "মেরিডিয়ান আপনার চিকিৎসার জন্য আপনার ভিজিট, প্রেসক্রিপশন ও পরীক্ষার তথ্য সংরক্ষণ করবে। আপনি যেকোনো সময় এগুলো মুছে ফেলতে বলতে পারেন।",
              "Meridian will keep your visit, prescription, and test records to care for you. You can ask us to delete them anytime."
            )}
          </p>
          <label className="mt-3 flex min-h-11 items-center gap-3">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(!!v)} className="size-6" />
            <span className="font-medium">{t("আমি রাজি", "I agree")}</span>
          </label>
          <a href="#" className="text-body font-medium text-teal-700 underline">
            {t("আরও জানুন", "Learn more")}
          </a>
        </div>
      </form>
    </PatientFrame>
  );
}

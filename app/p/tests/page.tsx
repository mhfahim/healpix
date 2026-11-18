"use client";
import * as React from "react";
import { FlaskConical, Home, Info, ShieldCheck } from "lucide-react";
import { PatientFrame, PHeader, PButton, PLink, useLang } from "@/components/shell/patient";
import { Chip, Switch } from "@/components/ui/controls";
import { homeCollectionFee, prescribedTestIds, testById } from "@/data/mock";
import { lakh } from "@/lib/utils";

export default function PrescribedTests() {
  const { t, n } = useLang();
  const [home, setHome] = React.useState(false);
  const [slot, setSlot] = React.useState("t-8");
  const list = prescribedTestIds.map(testById);
  const subtotal = list.reduce((s, x) => s + x.price, 0);
  const total = subtotal + (home ? homeCollectionFee : 0);
  const money = (v: number) => `৳ ${n(lakh(v))}`;
  const slots = [
    { id: "t-8", day: t("আগামীকাল", "Tomorrow"), time: t("সকাল ৮:০০", "8:00 AM") },
    { id: "t-9", day: t("আগামীকাল", "Tomorrow"), time: t("সকাল ৯:০০", "9:00 AM") },
    { id: "t-10", day: t("আগামীকাল", "Tomorrow"), time: t("সকাল ১০:০০", "10:00 AM") },
    { id: "d-8", day: t("শনিবার", "Saturday"), time: t("সকাল ৮:০০", "8:00 AM") },
  ];

  return (
    <PatientFrame
      header={<PHeader title={t("আপনার পরীক্ষা", "Your tests")} sub={t("মেরিডিয়ান স্পেশালাইজড হাসপাতাল", "Meridian Specialized Hospital")} />}
      bottom={
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-slate-700">{t(`মোট (${n(list.length)}টি পরীক্ষা)`, `Total (${list.length} tests)`)}</span>
            <span className="tnum text-h2 font-semibold">{money(total)}</span>
          </div>
          <PButton href="/p/tests/confirmed">{t("সব পরীক্ষা বুক করুন", "Book all tests")}</PButton>
          <PLink href="/p/upload" className="mt-2 flex min-h-11 items-center justify-center text-body font-medium text-slate-500 underline">
            {t("আমি অন্য জায়গায় পরীক্ষা করাব", "I'll test somewhere else")}
          </PLink>
        </div>
      }
    >
      <div className="space-y-5 px-4 py-5">
        <div>
          <h1 className="text-h1 font-semibold">{t(`ডা. ফারহানা রহমান ${n(4)}টি পরীক্ষা দিয়েছেন`, "Dr. Farhana Rahman prescribed 4 tests")}</h1>
          <p className="mt-1 text-slate-500">{t("আজ, ১৯ নভেম্বর · রহিমা বেগম", "Today, 19 Nov · Rahima Begum")}</p>
        </div>

        <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
          {list.map((x) => (
            <li key={x.id} className="flex items-start gap-3 p-4">
              <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-50">
                <FlaskConical className="size-5 text-teal-700" strokeWidth={1.5} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{t(x.bn, x.name)}</p>
                <p className="flex items-center gap-1 text-small text-slate-700">
                  <Info className="size-3.5 shrink-0 text-slate-500" /> {t(x.prepBn, x.prep)}
                </p>
              </div>
              <span className="tnum shrink-0 font-semibold">{money(x.price)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-2 rounded-lg bg-teal-50 p-3 text-body text-teal-900">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-teal-700" />
          {t("রিপোর্ট সরাসরি ডা. রহমানের কাছে যাবে। রিপোর্ট দেখাতে আবার আসতে হবে না।", "Your report goes straight to Dr. Rahman. No need to come back just to show it.")}
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <Home className="size-6 shrink-0 text-teal-700" strokeWidth={1.5} />
          <span className="flex-1">
            <span className="block font-semibold">{t("বাসা থেকে নমুনা সংগ্রহ", "Home sample collection")}</span>
            <span className="block text-small text-slate-500">
              {t(`ধানমন্ডি, মোহাম্মদপুর, কলাবাগান · ফি ${money(homeCollectionFee)}`, `Dhanmondi, Mohammadpur, Kalabagan · fee ${money(homeCollectionFee)}`)}
            </span>
          </span>
          <Switch checked={home} onCheckedChange={setHome} className="scale-125" aria-label="Home sample collection" />
        </label>

        <section>
          <h2 className="mb-1 font-semibold">{home ? t("কখন আসবেন আমাদের লোক?", "When should we come?") : t("কখন নমুনা দেবেন?", "When will you give the sample?")}</h2>
          <p className="mb-3 text-small text-slate-500">{t("লিপিড প্রোফাইলের জন্য সকালে খালি পেটে আসুন", "Come in the morning on an empty stomach for the Lipid Profile")}</p>
          <div className="grid grid-cols-2 gap-2">
            {slots.map((s) => (
              <Chip key={s.id} size="lg" selected={slot === s.id} onClick={() => setSlot(s.id)} className="justify-center">
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-small opacity-80">{s.day}</span>
                  <span>{s.time}</span>
                </span>
              </Chip>
            ))}
          </div>
          {!home && <p className="mt-3 text-small text-slate-500">{t("নমুনা সংগ্রহ: নিচতলা, ল্যাব কাউন্টার ২", "Sample collection: Ground floor, Lab counter 2")}</p>}
        </section>
        <div className="flex justify-between text-small text-slate-500">
          <span>{t("পরীক্ষার দাম", "Tests")}</span>
          <span className="tnum">{money(subtotal)}</span>
        </div>
      </div>
    </PatientFrame>
  );
}

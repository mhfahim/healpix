"use client";
import { Download, FileText, Stethoscope, Pill } from "lucide-react";
import { PatientFrame, PHeader, PButton, useLang } from "@/components/shell/patient";
import { Avatar } from "@/components/ui/primitives";

export default function ResponseRx() {
  const { t } = useLang();
  const meds = [
    { name: "Comet XR 1000 mg", dose: "০+০+১", when: "রাতে খাবারের পরে", whenEn: "after dinner", dur: "৩ মাস", durEn: "3 months", changed: t("মাত্রা বাড়ানো হয়েছে", "Dose increased") },
    { name: "Camlodin 5 mg", dose: "১+০+০", when: "খাবারের পরে", whenEn: "after food", dur: "৩ মাস", durEn: "3 months" },
    { name: "Rosuva 10 mg", dose: "০+০+১", when: "রাতে খাবারের পরে", whenEn: "after dinner", dur: "৩ মাস", durEn: "3 months", changed: t("নতুন", "New") },
    { name: "Ciprocin 500 mg", dose: "১+০+১", when: "খাবারের পরে", whenEn: "after food", dur: "কোর্স শেষ করুন", durEn: "finish the course" },
  ];
  return (
    <PatientFrame
      header={<PHeader title={t("ডাক্তারের উত্তর", "Doctor's response")} back="/p/record" />}
      bottom={
        <div className="grid grid-cols-2 gap-2">
          <PButton variant="secondary">
            <FileText /> {t("পুরো প্রেসক্রিপশন", "Full prescription")}
          </PButton>
          <PButton>
            <Download /> {t("ডাউনলোড", "Download")}
          </PButton>
        </div>
      }
    >
      <div className="space-y-5 px-4 py-5">
        <div className="rounded-lg bg-surface shadow-card ring-1 ring-slate-200/70 p-4">
          <div className="flex items-center gap-3">
            <Avatar initials="FR" />
            <div>
              <p className="font-semibold">{t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman")}</p>
              <p className="text-small text-slate-500">{t("আপনার রিপোর্ট দেখেছেন · আজ বিকাল ৪:২০", "Reviewed your report · today 4:20 PM")}</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-teal-50 p-3 font-bn text-teal-900">
            <Stethoscope className="mb-1 size-4 text-teal-700" />
            আপনার রিপোর্ট দেখেছি। ডায়াবেটিস এখনো নিয়ন্ত্রণে নেই, তাই রাতের ওষুধের মাত্রা বাড়ানো হলো। কোলেস্টেরলের জন্য নতুন একটি ওষুধ দেওয়া হলো। ৩ মাস পর আবার HbA1c পরীক্ষা করবেন।
          </div>
        </div>

        <section>
          <h2 className="mb-2 flex items-center gap-2 text-h3 font-semibold">
            <Pill className="size-5 text-teal-700" /> {t("নতুন ওষুধের তালিকা", "Updated medicines")}
          </h2>
          <ul className="space-y-2">
            {meds.map((m) => (
              <li key={m.name} className="rounded-lg bg-surface shadow-card ring-1 ring-slate-200/70 p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold">{m.name}</p>
                  {m.changed && <span className="rounded-full bg-info-bg px-2 py-0.5 text-caption font-medium text-info-fg">{m.changed}</span>}
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-1 font-bn text-h3 font-semibold">{m.dose}</span>
                  <span className="font-bn">{m.when}</span>
                </p>
                <p className="mt-1 text-small text-slate-500">
                  {t(m.dur, m.durEn)} {t("", `· ${m.whenEn}`)}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-small text-slate-500">
            {t("১+০+১ মানে: সকালে ১টি, দুপুরে ০টি, রাতে ১টি", "১+০+১ means: 1 in the morning, 0 at midday, 1 at night")}
          </p>
        </section>
      </div>
    </PatientFrame>
  );
}

"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Camera, ImagePlus, X, FileImage } from "lucide-react";
import { PatientFrame, PHeader, PButton, useLang } from "@/components/shell/patient";
import { Chip } from "@/components/ui/controls";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export default function Upload() {
  const { t, ts, n } = useLang();
  const router = useRouter();
  const toast = useToast();
  const [pages, setPages] = React.useState(2);
  const [lab, setLab] = React.useState("");
  const [reason, setReason] = React.useState<string | null>("near");
  const labs = ["Northgate Diagnostics", "Riverside Lab", "Unity Path Center"];
  const reasons = [
    ["price", t("কম দাম", "Lower price")],
    ["near", t("বাসার কাছে", "Closer to home")],
    ["trust", t("ওই ল্যাবে ভরসা", "Trust that lab")],
    ["fast", t("দ্রুত রিপোর্ট", "Faster report")],
    ["suggest", t("কেউ বলেছে", "Someone suggested")],
    ["none", t("বলতে চাই না", "Prefer not to say")],
  ] as const;
  return (
    <PatientFrame
      header={<PHeader title={t("বাইরের রিপোর্ট পাঠান", "Send outside report")} back="/p/tests" />}
      bottom={
        <PButton
          disabled={pages === 0}
          onClick={() => {
            toast({ title: ts("ডাক্তারের কাছে পাঠানো হয়েছে", "Sent to your doctor"), body: ts("উত্তর এলে WhatsApp-এ জানাব", "We'll notify you on WhatsApp") });
            // Prototype flow 6 continues on the doctor side: the upload lands in D5.
            setTimeout(() => router.push("/d/reviews"), 1200);
          }}
        >
          {t("ডাক্তারকে পাঠান", "Send to my doctor")}
        </PButton>
      }
    >
      <div className="space-y-6 px-4 py-5">
        <p className="text-slate-700">
          {t("অন্য ল্যাবে পরীক্ষা করালেও সমস্যা নেই। রিপোর্টের ছবি দিন, ডা. রহমান দেখে জানাবেন।", "No problem if you tested elsewhere. Send photos of the report and Dr. Rahman will review it.")}
        </p>
        <section>
          <h2 className="mb-2 font-semibold">{t("রিপোর্টের ছবি", "Report photos")}</h2>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <div key={i} className="relative flex aspect-[3/4] flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-100">
                <FileImage className="size-8 text-slate-400" strokeWidth={1.5} />
                <span className="mt-1 text-caption text-slate-500">{t(`পাতা ${n(i + 1)}`, `Page ${i + 1}`)}</span>
                <button aria-label="Remove" onClick={() => setPages((p) => p - 1)} className="absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-full bg-slate-900/70 text-white">
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <button onClick={() => setPages((p) => p + 1)} className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-teal-500 bg-teal-50 text-small font-medium text-teal-800">
              <Camera className="size-7" strokeWidth={1.5} />
              {t("ছবি তুলুন", "Take photo")}
            </button>
          </div>
          <button onClick={() => setPages((p) => p + 1)} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded border border-slate-200 bg-white font-medium">
            <ImagePlus className="size-5 text-teal-700" /> {t("গ্যালারি থেকে যোগ করুন", "Add from gallery")}
          </button>
        </section>

        <section>
          <label htmlFor="lab" className="mb-2 block font-semibold">
            {t("কোথায় পরীক্ষা করিয়েছেন?", "Where did you do the test?")}
          </label>
          <input
            id="lab"
            value={lab}
            onChange={(e) => setLab(e.target.value)}
            placeholder={ts("ল্যাবের নাম", "Lab name")}
            className="h-12 w-full rounded border border-slate-200 bg-white px-4 text-base focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {labs
              .filter((l) => l.toLowerCase().includes(lab.toLowerCase()) && l !== lab)
              .map((l) => (
                <button key={l} onClick={() => setLab(l)} className="min-h-11 rounded-full border border-slate-200 bg-white px-4 text-small">
                  {l}
                </button>
              ))}
          </div>
        </section>

        <section>
          <h2 className="mb-1 font-semibold">{t("কেন অন্য ল্যাব বেছে নিয়েছেন?", "Why did you choose another lab?")}</h2>
          <p className="mb-3 text-small text-slate-500">{t("এতে আমরা সেবা উন্নত করতে পারি", "This helps us improve")}</p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup">
            {reasons.map(([v, l]) => (
              <Chip key={v} size="lg" selected={reason === v} onClick={() => setReason(v)} className={cn("justify-center")}>
                {l}
              </Chip>
            ))}
          </div>
        </section>
      </div>
    </PatientFrame>
  );
}

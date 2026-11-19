"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare } from "lucide-react";
import { PatientFrame, PHeader, useLang } from "@/components/shell/patient";
import { cn, toBn } from "@/lib/utils";

export default function Otp({ searchParams }: { searchParams: { from?: string } }) {
  const { t, n, href, lang } = useLang();
  const router = useRouter();
  const [digits, setDigits] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [secs, setSecs] = React.useState(42);
  const [verifying, setVerifying] = React.useState(false);
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const dest = searchParams.from === "visit" ? "/p/confirmed?from=visit" : "/p/confirmed";

  React.useEffect(() => {
    refs.current[0]?.focus();
    const i = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(i);
  }, []);

  const set = (i: number, v: string) => {
    const d = v.replace(/[^0-9০-৯]/g, "").slice(-1);
    const next = [...digits];
    next[i] = d;
    setDigits(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) {
      setVerifying(true);
      setTimeout(() => router.push(href(dest)), 900); // auto-submit
    }
  };
  const demoFill = () => {
    const code = "482916".split("");
    setDigits(code);
    setVerifying(true);
    setTimeout(() => router.push(href(dest)), 900);
  };

  return (
    <PatientFrame header={<PHeader title={t("নম্বর যাচাই", "Verify number")} back="/p/details" />}>
      <div className="px-4 py-8">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-teal-50">
          <MessageSquare className="size-6 text-teal-700" strokeWidth={1.5} />
        </span>
        <h1 className="mt-4 text-h1 font-semibold">{t("৬ সংখ্যার কোড দিন", "Enter the 6-digit code")}</h1>
        <p className="mt-1 text-slate-700">
          {t("কোড পাঠানো হয়েছে", "Sent to")} <span className="tnum font-semibold">+880 {n("1711-234567")}</span>
        </p>
        <div className="mt-6 flex justify-between gap-2" role="group" aria-label="One-time code">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={lang === "bn" ? toBn(d) : d}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => e.key === "Backspace" && !digits[i] && i > 0 && refs.current[i - 1]?.focus()}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`Digit ${i + 1}`}
              className={cn(
                "tnum h-14 w-12 rounded border bg-surface text-center text-h1 font-semibold focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
                d ? "border-teal-700" : "border-slate-300"
              )}
            />
          ))}
        </div>
        {verifying ? (
          <p className="mt-5 flex items-center gap-2 font-medium text-teal-800">
            <Loader2 className="size-5 animate-spin" /> {t("যাচাই হচ্ছে…", "Verifying…")}
          </p>
        ) : (
          <p className="mt-5 text-slate-700">
            {secs > 0 ? (
              <>
                {t("আবার কোড পাঠানো যাবে", "Resend code in")} <span className="tnum font-semibold">{n(`0:${String(secs).padStart(2, "0")}`)}</span>
              </>
            ) : (
              <button className="font-medium text-teal-700 underline" onClick={() => setSecs(60)}>
                {t("আবার কোড পাঠান", "Resend code")}
              </button>
            )}
          </p>
        )}
        <button onClick={demoFill} className="mt-10 text-small text-slate-400 underline">
          {t("ডেমো: কোড স্বয়ংক্রিয়ভাবে বসান", "Demo: auto-fill code")}
        </button>
      </div>
    </PatientFrame>
  );
}

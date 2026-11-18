"use client";
import * as React from "react";
import { CalendarClock, Clock, Footprints, RefreshCw, XCircle, MapPin } from "lucide-react";
import { PatientFrame, PHeader, PButton, useLang } from "@/components/shell/patient";
import { Dialog, Chip } from "@/components/ui/controls";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function Tracker() {
  const { t, n } = useLang();
  const toast = useToast();
  const [serial, setSerial] = React.useState(18);
  const [late, setLate] = React.useState(false);
  const [cancel, setCancel] = React.useState(false);
  const [reason, setReason] = React.useState<string | null>(null);
  const [cancelled, setCancelled] = React.useState(false);
  const current = 9;
  const ahead = serial - current - 1;
  const eta = serial === 18 ? t("সন্ধ্যা ৭:০৫", "7:05 PM") : t("সন্ধ্যা ৭:৩৫", "7:35 PM");
  const progress = (current / serial) * 100;

  return (
    <PatientFrame
      header={<PHeader title={t("আমার বুকিং", "My booking")} back="/p/home" />}
      bottom={
        !cancelled && (
          <div className="grid grid-cols-3 gap-2">
            <button onClick={() => setLate(true)} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded border border-slate-200 bg-white text-small font-medium">
              <Footprints className="size-5 text-teal-700" /> {t("দেরি হবে", "Running late")}
            </button>
            <button className="flex min-h-16 flex-col items-center justify-center gap-1 rounded border border-slate-200 bg-white text-small font-medium">
              <CalendarClock className="size-5 text-teal-700" /> {t("সময় বদলান", "Reschedule")}
            </button>
            <button onClick={() => setCancel(true)} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded border border-slate-200 bg-white text-small font-medium text-danger-fg">
              <XCircle className="size-5" /> {t("বাতিল", "Cancel")}
            </button>
          </div>
        )
      }
    >
      <div className="space-y-4 px-4 py-5">
        {cancelled ? (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
            <XCircle className="mx-auto size-10 text-slate-400" />
            <p className="mt-3 text-h2 font-semibold">{t("বুকিং বাতিল হয়েছে", "Booking cancelled")}</p>
            <p className="mt-1 text-slate-500">{t("আপনার সিরিয়াল অন্য রোগীকে দেওয়া হবে।", "Your serial will be offered to another patient.")}</p>
            <PButton href="/p/doctor/farhana" className="mt-5">
              {t("নতুন সিরিয়াল নিন", "Book a new serial")}
            </PButton>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-teal-200 bg-white p-5" aria-live="polite">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 text-small font-medium text-success-fg">
                  <span className="relative inline-flex size-2 rounded-full bg-success">
                    <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />
                  </span>
                  {t("লাইভ", "Live")}
                </span>
                <button className="inline-flex items-center gap-1 text-small text-slate-500" aria-label="Refresh">
                  <RefreshCw className="size-4" /> {t("১ মিনিট আগে", "1 min ago")}
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-small text-slate-500">{t("ডাক্তার এখন দেখছেন", "Doctor is on serial")}</p>
                  <p className="tnum text-display font-semibold">{n(current)}</p>
                </div>
                <div className="rounded-lg bg-teal-700 p-3 text-white">
                  <p className="text-small text-teal-100">{t("আপনার সিরিয়াল", "You are serial")}</p>
                  <p className="tnum text-display font-semibold">{n(serial)}</p>
                </div>
              </div>
              <div className="mt-5">
                <div className="h-3 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full bg-teal-600" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-slate-700">{t(`আপনার আগে আরও ${n(ahead)} জন`, `${ahead} patients ahead of you`)}</p>
              </div>
              <p className="mt-4 flex items-center gap-2 text-h3 font-semibold">
                <Clock className="size-5 text-teal-700" /> {t(`আনুমানিক ${eta}`, `Estimated ${eta}`)}
              </p>
              <p className="text-small text-warning-fg">{t("ডাক্তার ১৫ মিনিট দেরিতে চলছেন", "Doctor is running 15 min late")}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="font-semibold">{t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman")}</p>
              <p className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="size-4 text-slate-500" /> {t("রুম ৩০৪, ৩ তলা · মেরিডিয়ান, ধানমন্ডি", "Room 304, 3rd floor · Meridian, Dhanmondi")}
              </p>
              <p className="mt-2 text-small text-slate-500">{t("পৌঁছে কাউন্টারে সিরিয়াল নম্বর বলুন।", "On arrival, tell the counter your serial number.")}</p>
            </div>
          </>
        )}
      </div>

      <Dialog
        open={late}
        onOpenChange={setLate}
        title={t("দেরি হবে?", "Running late?") as string}
        description={t("আমরা আপনাকে কয়েকটি সিরিয়াল পিছিয়ে দেব, বাতিল হবে না।", "We'll move you a few serials back instead of cancelling.") as string}
        footer={
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              setSerial(21);
              setLate(false);
              toast({ title: t("সিরিয়াল ২১-এ সরানো হয়েছে", "Moved to serial 21") as string, body: t("আনুমানিক সন্ধ্যা ৭:৩৫", "Around 7:35 PM") as string });
            }}
          >
            {t("৩ সিরিয়াল পিছিয়ে দিন", "Move me back 3 serials")}
          </Button>
        }
      >
        <p className="text-body">{t("নতুন সিরিয়াল: ২১ · আনুমানিক সন্ধ্যা ৭:৩৫", "New serial: 21 · around 7:35 PM")}</p>
      </Dialog>

      <Dialog
        open={cancel}
        onOpenChange={setCancel}
        title={t("বুকিং বাতিল করবেন?", "Cancel this booking?") as string}
        description={t("কেন বাতিল করছেন? (ঐচ্ছিক)", "Why are you cancelling? (optional)") as string}
        footer={
          <div className="flex w-full flex-col gap-2">
            <Button
              size="lg"
              variant="destructive"
              onClick={() => {
                setCancel(false);
                setCancelled(true);
              }}
            >
              {t("হ্যাঁ, বাতিল করুন", "Yes, cancel booking")}
            </Button>
            <Button size="lg" variant="secondary" onClick={() => setCancel(false)}>
              {t("না, রেখে দিন", "Keep booking")}
            </Button>
          </div>
        }
      >
        <div className="flex flex-wrap gap-2">
          {[
            t("অসুস্থতা কমেছে", "Feeling better"),
            t("সময় মিলছে না", "Time doesn't suit"),
            t("অন্য ডাক্তার দেখাব", "Seeing another doctor"),
            t("অনেক দূর", "Too far"),
            t("অন্য কারণ", "Other"),
          ].map((r, i) => (
            <Chip key={i} size="lg" selected={reason === String(i)} onClick={() => setReason(String(i))}>
              {r}
            </Chip>
          ))}
        </div>
      </Dialog>
    </PatientFrame>
  );
}

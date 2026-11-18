"use client";
import { WhatsAppFrame, Bubble, WaButton, DayDivider, PdfAttachment } from "@/components/shell/whatsapp";
import { useLang } from "@/components/shell/patient";

export default function WaTests() {
  const { t } = useLang();
  return (
    <WhatsAppFrame>
      <DayDivider>{t("আজ", "Today")}</DayDivider>
      <Bubble from="bot" time="6:41 PM">
        <PdfAttachment name="Prescription_RahimaBegum_19Nov.pdf" meta="1 page · PDF" />
        {t("ডা. ফারহানা রহমানের প্রেসক্রিপশন। ওষুধ নিয়মিত খাবেন।", "Your prescription from Dr. Farhana Rahman. Please take medicines regularly.")}
      </Bubble>
      <Bubble
        from="bot"
        time="6:41 PM"
        buttons={
          <>
            <WaButton href="/p/tests" icon="link">
              {t("সব পরীক্ষা বুক করুন", "Book all tests")}
            </WaButton>
            <WaButton>{t("বাসা থেকে নমুনা দিন (+৳৩০০)", "Home collection (+৳300)")}</WaButton>
            <WaButton href="/p/upload">{t("অন্য জায়গায় করাব", "I'll test elsewhere")}</WaButton>
          </>
        }
      >
        <p className="font-semibold">🧪 {t("ডাক্তার ৪টি পরীক্ষা দিয়েছেন", "Your doctor prescribed 4 tests")}</p>
        <table className="mt-2 w-full text-body">
          <tbody>
            {[
              [t("এইচবিএওয়ানসি", "HbA1c"), "১,১০০", "1,100"],
              [t("লিপিড প্রোফাইল", "Lipid Profile"), "১,২০০", "1,200"],
              [t("সিরাম ক্রিয়েটিনিন", "Serum Creatinine"), "৩৫০", "350"],
              [t("ইউরিন আর/ই", "Urine R/E"), "২৫০", "250"],
            ].map(([n, bn, en], i) => (
              <tr key={i}>
                <td className="py-0.5">{n}</td>
                <td className="tnum py-0.5 text-right">৳{t(bn as string, en as string)}</td>
              </tr>
            ))}
            <tr className="border-t border-slate-200 font-semibold">
              <td className="pt-1">{t("মোট", "Total")}</td>
              <td className="tnum pt-1 text-right">৳{t("২,৯০০", "2,900")}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-small">
          ⚠️ {t("লিপিড প্রোফাইলের জন্য ১০–১২ ঘণ্টা না খেয়ে আসুন। সকালের প্রথম প্রস্রাব আনুন।", "Fast 10–12 hours for the Lipid Profile. Bring first morning urine.")}
        </p>
        <p className="mt-1 text-small text-slate-500">{t("রিপোর্ট সরাসরি ডাক্তারের কাছে যাবে।", "Your report goes straight to your doctor.")}</p>
      </Bubble>
      <Bubble from="me" time="6:44 PM">
        {t("সব পরীক্ষা বুক করুন", "Book all tests")}
      </Bubble>
      <Bubble from="bot" time="6:44 PM">
        ✅ {t("বুক হয়েছে! আগামীকাল সকাল ৮টা, নিচতলা ল্যাব কাউন্টার ২। বুকিং আইডি LB-26-118204", "Booked! Tomorrow 8:00 AM, Ground floor Lab counter 2. Booking ID LB-26-118204")}
      </Bubble>
    </WhatsAppFrame>
  );
}

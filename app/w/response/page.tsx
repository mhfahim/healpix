"use client";
import { WhatsAppFrame, Bubble, WaButton, DayDivider, PdfAttachment } from "@/components/shell/whatsapp";
import { useLang } from "@/components/shell/patient";

export default function WaResponse() {
  const { t } = useLang();
  return (
    <WhatsAppFrame>
      <DayDivider>{t("শুক্রবার, ২০ নভেম্বর", "Friday, 20 Nov")}</DayDivider>
      <Bubble from="bot" time="2:12 PM">
        📄 {t("আপনার রিপোর্ট তৈরি হয়েছে এবং ডা. ফারহানা রহমানের কাছে পাঠানো হয়েছে। তিনি দেখে জানাবেন।", "Your report is ready and has been sent to Dr. Farhana Rahman. They'll review it and reply.")}
      </Bubble>
      <Bubble from="bot" time="4:20 PM" buttons={<WaButton href="/p/response" icon="link">{t("প্রেসক্রিপশন দেখুন", "View prescription")}</WaButton>}>
        <PdfAttachment name="Updated_Prescription_20Nov.pdf" meta="1 page · PDF" />
        <p className="font-semibold">🩺 {t("আপনার রিপোর্ট দেখা হয়েছে", "Your report has been reviewed")}</p>
        <p className="mt-1">
          {t(
            "ডা. রহমান রাতের ডায়াবেটিসের ওষুধ বাড়িয়েছেন এবং কোলেস্টেরলের একটি নতুন ওষুধ দিয়েছেন। নতুন প্রেসক্রিপশন সংযুক্ত।",
            "Dr. Rahman increased your night diabetes medicine and added a new cholesterol medicine. Updated prescription attached."
          )}
        </p>
      </Bubble>
      <DayDivider>{t("অন্য উদাহরণ: সরাসরি দেখা দরকার", "Other variant: visit needed")}</DayDivider>
      <Bubble
        from="bot"
        time="4:22 PM"
        buttons={
          <>
            <WaButton href="/p/response/visit" icon="link">
              {t("সিরিয়াল নিশ্চিত করুন", "Confirm serial")}
            </WaButton>
            <WaButton>{t("অন্য দিন বেছে নিন", "Choose another day")}</WaButton>
          </>
        }
      >
        <p className="font-semibold">🩺 {t("অনুগ্রহ করে চেম্বারে আসুন", "Please visit the chamber")}</p>
        <p className="mt-1">
          {t("ডা. রহমান আপনার রিপোর্ট নিয়ে সরাসরি কথা বলতে চান। রবিবার ২২ নভেম্বর, সিরিয়াল ২৭ (আনুমানিক রাত ৮:২০) রাখা হয়েছে।", "Dr. Rahman wants to discuss your report in person. Serial 27 on Sunday 22 Nov (around 8:20 PM) is held for you.")}
        </p>
      </Bubble>
    </WhatsAppFrame>
  );
}

"use client";
import { WhatsAppFrame, Bubble, WaButton, WaList, DayDivider } from "@/components/shell/whatsapp";
import { useLang } from "@/components/shell/patient";

export default function WaBooking() {
  const { t } = useLang();
  return (
    <WhatsAppFrame>
      <DayDivider>{t("আজ", "Today")}</DayDivider>
      <Bubble from="me" time="5:02 PM">
        {t("আসসালামু আলাইকুম, ডাক্তার দেখাতে চাই", "Hi, I want to see a doctor")}
      </Bubble>
      <Bubble
        from="bot"
        time="5:02 PM"
        buttons={<WaButton icon="list">{t("বিভাগ বেছে নিন", "Choose department")}</WaButton>}
      >
        {t("ওয়ালাইকুম আসসালাম! মেরিডিয়ান স্পেশালাইজড হাসপাতালে স্বাগতম। কোন বিভাগে দেখাতে চান?", "Welcome to Meridian Specialized Hospital! Which department would you like?")}
      </Bubble>
      <WaList
        title={t("বিভাগ", "Departments") as string}
        selected={t("মেডিসিন", "Medicine") as string}
        items={[
          { label: t("মেডিসিন", "Medicine") as string },
          { label: t("হৃদরোগ", "Cardiology") as string },
          { label: t("গাইনি ও প্রসূতি", "Gynecology & Obstetrics") as string },
          { label: t("ডায়াবেটিস ও হরমোন", "Endocrinology") as string },
        ]}
      />
      <Bubble from="me" time="5:03 PM">
        {t("মেডিসিন", "Medicine")}
      </Bubble>
      <Bubble
        from="bot"
        time="5:03 PM"
        buttons={
          <>
            <WaButton>{t("ডা. ফারহানা রহমান · ৳১,০০০", "Dr. Farhana Rahman · ৳1,000")}</WaButton>
            <WaButton>{t("ডা. মাহবুবুর রহমান · ৳৮০০", "Dr. Mahbubur Rahman · ৳800")}</WaButton>
          </>
        }
      >
        {t("আজ মেডিসিনে এই ডাক্তাররা বসবেন:", "These Medicine doctors are available today:")}
      </Bubble>
      <Bubble from="me" time="5:03 PM">
        {t("ডা. ফারহানা রহমান", "Dr. Farhana Rahman")}
      </Bubble>
      <Bubble
        from="bot"
        time="5:03 PM"
        buttons={
          <div className="grid grid-cols-3 gap-0.5">
            <WaButton>{t("আজ", "Today")}</WaButton>
            <WaButton>{t("শনি ২১", "Sat 21")}</WaButton>
            <WaButton>{t("রবি ২২", "Sun 22")}</WaButton>
          </div>
        }
      >
        {t("কবে আসবেন? আজ ১৪টি সিরিয়াল বাকি।", "Which day? 14 serials left today.")}
      </Bubble>
      <Bubble from="me" time="5:04 PM">
        {t("আজ", "Today")}
      </Bubble>
      <Bubble from="bot" time="5:04 PM" buttons={<WaButton href="/p/tracker" icon="link">{t("লাইভ সিরিয়াল দেখুন", "Track live serial")}</WaButton>}>
        <p className="font-semibold">✅ {t("বুকিং নিশ্চিত", "Booking confirmed")}</p>
        <p className="mt-1">
          {t("রোগী: রহিমা বেগম", "Patient: Rahima Begum")}
          <br />
          {t("ডাক্তার: ডা. ফারহানা রহমান", "Doctor: Dr. Farhana Rahman")}
          <br />
          {t("সিরিয়াল: ১৮", "Serial: 18")}
          <br />
          {t("সময়: আনুমানিক সন্ধ্যা ৭:০০", "Time: around 7:00 PM")}
          <br />
          {t("রুম ৩০৪, ৩ তলা", "Room 304, 3rd floor")}
        </p>
        <p className="mt-1 text-small text-slate-500">{t("আপনার আগে ৩ জন থাকলে জানাব।", "We'll message you when 3 patients are ahead.")}</p>
      </Bubble>
    </WhatsAppFrame>
  );
}

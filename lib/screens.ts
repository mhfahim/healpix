export type Screen = { code: string; title: string; path: string; states?: boolean; note?: string };
export type Group = { id: string; label: string; surface: string; viewport: string; screens: Screen[] };

export const groups: Group[] = [
  {
    id: "ds",
    label: "Design system",
    surface: "Foundations",
    viewport: "1440",
    screens: [{ code: "DS", title: "Design System", path: "/design-system" }],
  },
  {
    id: "m",
    label: "D · Management dashboard",
    surface: "Hospital management",
    viewport: "1440 × 900",
    screens: [
      { code: "M1", title: "Overview", path: "/m/overview", states: true },
      { code: "M2", title: "Leak Insights", path: "/m/leaks" },
      { code: "M3", title: "Department Detail", path: "/m/departments/cardiology" },
      { code: "M4", title: "Recovery Actions", path: "/m/recovery" },
      { code: "M5", title: "Capacity & Follow-up", path: "/m/capacity" },
      { code: "M6", title: "Doctor Adoption", path: "/m/adoption" },
      { code: "M7", title: "Peer Benchmark", path: "/m/benchmark", note: "?state=empty for locked variant" },
      { code: "M8", title: "Leak Audit Report", path: "/m/audit-report" },
      { code: "M9", title: "Consent & Data Ledger", path: "/m/consent" },
      { code: "M10", title: "Settings", path: "/m/settings" },
    ],
  },
  {
    id: "d",
    label: "C · Doctor",
    surface: "Doctor (desktop / tablet)",
    viewport: "1440 × 900 · 1024 × 768",
    screens: [
      { code: "D1", title: "Today", path: "/d/today", states: true },
      { code: "D2", title: "Patient Snapshot", path: "/d/patient/rahima" },
      { code: "D3", title: "Consultation Workspace", path: "/d/consult" },
      { code: "D4", title: "Prescription Preview & Sign", path: "/d/sign" },
      { code: "D5", title: "Remote Reviews Inbox", path: "/d/reviews", states: true },
      { code: "D6", title: "Report Review Detail", path: "/d/reviews/rahima", note: "Outside upload: /d/reviews/mizanur" },
      { code: "D7", title: "Doctor Settings", path: "/d/settings" },
    ],
  },
  {
    id: "f",
    label: "B · Front desk / call center",
    surface: "Front desk",
    viewport: "1440 × 900",
    screens: [
      { code: "F1", title: "Today's Queue Board", path: "/f/queue", states: true },
      { code: "F2", title: "New Booking", path: "/f/new-booking" },
      { code: "F3", title: "Call-back List", path: "/f/callbacks" },
      { code: "F4", title: "Check-in & Vitals", path: "/f/check-in" },
      { code: "F5", title: "Leak Audit Capture", path: "/f/leak-audit" },
    ],
  },
  {
    id: "p",
    label: "A · Patient (mobile web) + WhatsApp",
    surface: "Patient",
    viewport: "390 × 844 · Bangla default",
    screens: [
      { code: "P1", title: "Hospital Booking Home", path: "/p/home", note: "EN: ?lang=en" },
      { code: "P2", title: "Department Doctor List", path: "/p/doctors" },
      { code: "P3", title: "Doctor Profile & Serial", path: "/p/doctor/farhana" },
      { code: "P4", title: "Patient Details & Consent", path: "/p/details" },
      { code: "P5", title: "OTP Verification", path: "/p/otp" },
      { code: "P6", title: "Booking Confirmed", path: "/p/confirmed", note: "EN: ?lang=en" },
      { code: "P7", title: "Live Serial Tracker", path: "/p/tracker" },
      { code: "P8", title: "Prescribed Tests", path: "/p/tests", note: "EN: ?lang=en" },
      { code: "P9", title: "Test Booking Confirmed", path: "/p/tests/confirmed" },
      { code: "P10", title: "Report Status", path: "/p/report-status" },
      { code: "P11", title: "Upload Outside Report", path: "/p/upload" },
      { code: "P12a", title: "Doctor Response · Updated Rx", path: "/p/response" },
      { code: "P12b", title: "Doctor Response · Visit Needed", path: "/p/response/visit" },
      { code: "P13", title: "My Health Record", path: "/p/record" },
      { code: "W1", title: "WhatsApp · Booking", path: "/w/booking" },
      { code: "W2", title: "WhatsApp · Test List", path: "/w/tests" },
      { code: "W3", title: "WhatsApp · Doctor Response", path: "/w/response" },
    ],
  },
  {
    id: "o",
    label: "E · Auth & onboarding",
    surface: "Auth / Admin",
    viewport: "1440 × 900",
    screens: [
      { code: "O1", title: "Login", path: "/o/login" },
      { code: "O2", title: "Role Switcher", path: "/o/role" },
      { code: "O3", title: "Hospital Onboarding Wizard", path: "/o/onboarding" },
    ],
  },
];

export const flows = [
  { n: 1, title: "Patient web booking", steps: ["P1", "P2", "P3", "P4", "P5", "P6", "P7"] },
  { n: 2, title: "WhatsApp booking", steps: ["W1", "P7"] },
  { n: 3, title: "Phone booking and arrival", steps: ["F2", "F1", "F4", "F1"] },
  { n: 4, title: "Consultation to test capture (core)", steps: ["D1", "D2", "D3", "D4", "P8", "P9"] },
  { n: 5, title: "Remote review", steps: ["P10", "D5", "D6", "P12a"], alt: ["D6", "P12b", "P3"] },
  { n: 6, title: "Outside report (leak data capture)", steps: ["P8", "P11", "D5", "M2"] },
  { n: 7, title: "Management insight to action", steps: ["M1", "M3", "M2", "M4"] },
  { n: 8, title: "Leak Audit", steps: ["F5", "M8"] },
  { n: 9, title: "Onboarding", steps: ["O1", "O3", "M1"] },
];

const all = groups.flatMap((g) => g.screens);
export const screenByCode = (c: string) => all.find((s) => s.code === c);
export function screenByPath(p: string) {
  return all.find((s) => s.path === p) ?? (p.startsWith("/d/reviews/") ? screenByCode("D6") : p.startsWith("/p/doctor/") ? screenByCode("P3") : p.startsWith("/m/departments/") ? screenByCode("M3") : p.startsWith("/d/patient/") ? screenByCode("D2") : undefined);
}

export type ViewState = "default" | "loading" | "empty" | "error" | "offline";
export function viewState(sp: { state?: string | string[] }): ViewState {
  const s = Array.isArray(sp.state) ? sp.state[0] : sp.state;
  return (["loading", "empty", "error", "offline"].includes(s ?? "") ? s : "default") as ViewState;
}

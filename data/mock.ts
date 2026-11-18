/**
 * Helpix prototype mock data — Section 4 of the brief.
 * Every screen reads from here so numbers match everywhere.
 * Hospital, doctors, patients and labs are fictional.
 */

export const hospital = {
  name: "Meridian Specialized Hospital",
  nameBn: "মেরিডিয়ান স্পেশালাইজড হাসপাতাল",
  short: "Meridian",
  branch: "Dhanmondi, Dhaka",
  branchBn: "ধানমন্ডি, ঢাকা",
  hotline: "10655",
  address: "House 42, Road 7/A, Dhanmondi, Dhaka 1209",
  branches: [
    { name: "Dhanmondi (Main)", status: "Live" },
    { name: "Uttara", status: "Onboarding" },
  ],
};

export const today = {
  iso: "2026-11-19",
  label: "Thursday, 19 Nov 2026",
  short: "19 Nov",
  bn: "বৃহস্পতিবার, ১৯ নভেম্বর",
  month: "November 2026",
};

export const departments = [
  { id: "medicine", name: "Medicine", bn: "মেডিসিন", icon: "Stethoscope" },
  { id: "cardiology", name: "Cardiology", bn: "হৃদরোগ", icon: "HeartPulse" },
  { id: "gynecology", name: "Gynecology & Obstetrics", bn: "গাইনি ও প্রসূতি", icon: "Baby" },
  { id: "endocrinology", name: "Endocrinology", bn: "ডায়াবেটিস ও হরমোন", icon: "Droplet" },
  { id: "orthopedics", name: "Orthopedics", bn: "হাড় ও জোড়া", icon: "Bone" },
  { id: "pediatrics", name: "Pediatrics", bn: "শিশু", icon: "Smile" },
  { id: "gastroenterology", name: "Gastroenterology", bn: "পরিপাকতন্ত্র", icon: "Activity" },
] as const;

export type DeptId = (typeof departments)[number]["id"];

export const doctors = [
  {
    id: "farhana",
    name: "Dr. Farhana Rahman",
    bn: "ডা. ফারহানা রহমান",
    initials: "FR",
    dept: "medicine" as DeptId,
    degrees: "MBBS, FCPS (Medicine)",
    days: "Sat – Thu",
    daysBn: "শনি – বৃহস্পতি",
    time: "5:00 PM – 9:00 PM",
    timeBn: "বিকাল ৫টা – রাত ৯টা",
    room: "304",
    floor: "3rd floor",
    fee: 1000,
    nextSerial: 18,
    nextTime: "7:00 PM",
    queue: { current: 9, total: 32, late: 15 },
  },
  {
    id: "tanvir",
    name: "Dr. Tanvir Ahmed",
    bn: "ডা. তানভীর আহমেদ",
    initials: "TA",
    dept: "cardiology" as DeptId,
    degrees: "MBBS, MD (Cardiology)",
    days: "Sun, Tue, Thu",
    daysBn: "রবি, মঙ্গল, বৃহস্পতি",
    time: "4:00 PM – 8:00 PM",
    timeBn: "বিকাল ৪টা – রাত ৮টা",
    room: "512",
    floor: "5th floor",
    fee: 1200,
    nextSerial: 11,
    nextTime: "6:15 PM",
    queue: { current: 5, total: 24, late: 0 },
  },
  {
    id: "nusrat",
    name: "Dr. Nusrat Jahan",
    bn: "ডা. নুসরাত জাহান",
    initials: "NJ",
    dept: "gynecology" as DeptId,
    degrees: "MBBS, FCPS (Obs & Gynae)",
    days: "Sat, Mon, Wed",
    daysBn: "শনি, সোম, বুধ",
    time: "3:00 PM – 7:00 PM",
    timeBn: "বিকাল ৩টা – সন্ধ্যা ৭টা",
    room: "408",
    floor: "4th floor",
    fee: 1000,
    nextSerial: 15,
    nextTime: "5:20 PM",
    queue: { current: 12, total: 28, late: 5 },
  },
  {
    id: "kamal",
    name: "Dr. Kamal Hossain",
    bn: "ডা. কামাল হোসেন",
    initials: "KH",
    dept: "endocrinology" as DeptId,
    degrees: "MBBS, MD (Endocrinology)",
    days: "Sun – Thu",
    daysBn: "রবি – বৃহস্পতি",
    time: "6:00 PM – 10:00 PM",
    timeBn: "সন্ধ্যা ৬টা – রাত ১০টা",
    room: "310",
    floor: "3rd floor",
    fee: 1000,
    nextSerial: 7,
    nextTime: "7:10 PM",
    queue: { current: 0, total: 20, late: 0 },
  },
];

export const patients = {
  rahima: {
    id: "MSH-240318",
    name: "Rahima Begum",
    bn: "রহিমা বেগম",
    age: 58,
    sex: "F",
    phone: "01711-234567",
    visit: 6,
    allergies: ["Penicillin"],
    problems: ["Type 2 diabetes mellitus (since 2016)", "Hypertension", "Dyslipidemia"],
    meds: ["Comet XR 500 mg (Metformin) ১+০+১", "Camlodin 5 mg (Amlodipine) ১+০+০"],
    reason: "Increased thirst, tiredness, burning urination × 3 days",
    reasonBn: "বেশি পিপাসা, দুর্বলতা, প্রস্রাবে জ্বালাপোড়া, ৩ দিন",
  },
  abdul: { id: "MSH-231907", name: "Abdul Karim", bn: "আব্দুল করিম", age: 62, sex: "M", phone: "01819-552310" },
  sadia: { id: "MSH-250114", name: "Sadia Islam", bn: "সাদিয়া ইসলাম", age: 29, sex: "F", phone: "01552-781204" },
  mizanur: { id: "MSH-238842", name: "Mizanur Rahman", bn: "মিজানুর রহমান", age: 45, sex: "M", phone: "01923-410087" },
};

export const vitals = [
  { key: "bp", label: "BP", value: "150/95", unit: "mmHg", abnormal: true, ref: "< 130/80" },
  { key: "pulse", label: "Pulse", value: "88", unit: "bpm", abnormal: false, ref: "60–100" },
  { key: "temp", label: "Temp", value: "99.4", unit: "°F", abnormal: false, ref: "97–99.5" },
  { key: "weight", label: "Weight", value: "71", unit: "kg", abnormal: false, ref: "BMI 28.4" },
  { key: "spo2", label: "SpO2", value: "97", unit: "%", abnormal: false, ref: "≥ 95" },
  { key: "rbs", label: "RBS", value: "13.8", unit: "mmol/L", abnormal: true, ref: "< 7.8" },
];

/** In-house lab price list (BDT) */
export const tests = [
  { id: "cbc", name: "CBC", bn: "সিবিসি (রক্তের পূর্ণ পরীক্ষা)", price: 400, prep: "No preparation", prepBn: "কোনো প্রস্তুতি লাগবে না", outside: 350, tat: "4 h" },
  { id: "lipid", name: "Lipid Profile", bn: "লিপিড প্রোফাইল", price: 1200, prep: "Fasting 10–12 hours", prepBn: "১০–১২ ঘণ্টা না খেয়ে আসুন", outside: 850, tat: "6 h" },
  { id: "hba1c", name: "HbA1c", bn: "এইচবিএওয়ানসি", price: 1100, prep: "No fasting needed", prepBn: "না খেয়ে আসার দরকার নেই", outside: 900, tat: "6 h" },
  { id: "fbs", name: "Fasting Blood Sugar", bn: "ফাস্টিং ব্লাড সুগার", price: 150, prep: "Fasting 8 hours", prepBn: "৮ ঘণ্টা না খেয়ে আসুন", outside: 120, tat: "2 h" },
  { id: "tsh", name: "TSH", bn: "টিএসএইচ", price: 900, prep: "Morning sample preferred", prepBn: "সকালে নমুনা দেওয়া ভালো", outside: 750, tat: "8 h" },
  { id: "creatinine", name: "Serum Creatinine", bn: "সিরাম ক্রিয়েটিনিন", price: 350, prep: "No preparation", prepBn: "কোনো প্রস্তুতি লাগবে না", outside: 300, tat: "4 h" },
  { id: "urine", name: "Urine R/E", bn: "ইউরিন আর/ই", price: 250, prep: "First morning urine", prepBn: "সকালের প্রথম প্রস্রাব আনুন", outside: 200, tat: "3 h" },
  { id: "ecg", name: "ECG", bn: "ইসিজি", price: 500, prep: "No preparation", prepBn: "কোনো প্রস্তুতি লাগবে না", outside: 400, tat: "30 min" },
  { id: "echo", name: "Echocardiogram", bn: "ইকোকার্ডিওগ্রাম", price: 3000, prep: "No preparation", prepBn: "কোনো প্রস্তুতি লাগবে না", outside: 2400, tat: "Same day" },
  { id: "usg", name: "USG Whole Abdomen", bn: "আল্ট্রাসনোগ্রাম (পুরো পেট)", price: 2200, prep: "Full bladder, fasting 6 hours", prepBn: "৬ ঘণ্টা না খেয়ে, প্রস্রাব আটকে আসুন", outside: 1700, tat: "Same day" },
  { id: "xray", name: "X-ray Chest PA", bn: "বুকের এক্স-রে", price: 600, prep: "No preparation", prepBn: "কোনো প্রস্তুতি লাগবে না", outside: 500, tat: "2 h" },
];

export const testById = (id: string) => tests.find((t) => t.id === id)!;

/** Rahima's prescribed tests (D3 → P8) */
export const prescribedTestIds = ["hba1c", "lipid", "creatinine", "urine"];
export const homeCollectionFee = 300;

/* ------------------------------------------------------------------ */
/* Management metrics — this month (November 2026)                      */
/* ------------------------------------------------------------------ */

export const metrics = {
  prescribed: 12480,
  captured: 8860,
  captureRate: 71,
  baselineRate: 58,
  leaked: 3620,
  recovered: 3240000,
  avgOrder: 2000,
  reportVisitsAvoided: 1140,
  slotsFreed: 1140,
  activeDoctors: 46,
  totalDoctors: 52,
  medianTurnaroundH: 5.2,
  newPatientsInFreedSlots: 780,
  digitalRxPct: 84,
  aiAcceptance: 78,
  remoteReviews: 3960,
  reasonsKnownPct: 64,
  // Spark data (6 months)
  spark: {
    captureRate: [58, 61, 64, 67, 69, 71],
    prescribed: [8620, 10120, 11040, 11650, 12010, 12480],
    captured: [5000, 6170, 7070, 7810, 8290, 8860],
    leaked: [3620, 3950, 3970, 3840, 3720, 3620],
    recovered: [0, 760000, 1320000, 2100000, 2640000, 3240000],
    slotsFreed: [0, 310, 620, 870, 1010, 1140],
  },
};

export const captureTrend = [
  { month: "Jun", label: "Jun (Audit)", rate: 58, baseline: 58, remote: 0, inPerson: 1320 },
  { month: "Jul", label: "Jul", rate: 61, baseline: 58, remote: 1240, inPerson: 1010 },
  { month: "Aug", label: "Aug", rate: 64, baseline: 58, remote: 2210, inPerson: 760 },
  { month: "Sep", label: "Sep", rate: 67, baseline: 58, remote: 2980, inPerson: 540 },
  { month: "Oct", label: "Oct", rate: 69, baseline: 58, remote: 3520, inPerson: 430 },
  { month: "Nov", label: "Nov", rate: 71, baseline: 58, remote: 3960, inPerson: 380 },
];

export const funnel = [
  { stage: "Prescribed", value: 12480 },
  { stage: "Booked", value: 9420 },
  { stage: "Sample collected", value: 8860 },
  { stage: "Reported", value: 8710 },
  { stage: "Reviewed by doctor", value: 7980 },
];

/** Department capture — sums to 12,480 prescribed / 8,860 captured */
export const deptCapture = [
  { id: "cardiology", name: "Cardiology", prescribed: 2280, captured: 1345, rate: 59, baseline: 49, trend: [49, 51, 54, 56, 58, 59] },
  { id: "gastroenterology", name: "Gastroenterology", prescribed: 1200, captured: 759, rate: 63, baseline: 52, trend: [52, 55, 57, 60, 62, 63] },
  { id: "orthopedics", name: "Orthopedics", prescribed: 1120, captured: 750, rate: 67, baseline: 55, trend: [55, 58, 61, 64, 66, 67] },
  { id: "medicine", name: "Medicine", prescribed: 3420, captured: 2531, rate: 74, baseline: 61, trend: [61, 64, 67, 70, 72, 74] },
  { id: "endocrinology", name: "Endocrinology", prescribed: 1540, captured: 1155, rate: 75, baseline: 62, trend: [62, 65, 68, 71, 73, 75] },
  { id: "gynecology", name: "Gynecology & Obstetrics", prescribed: 1860, captured: 1451, rate: 78, baseline: 64, trend: [64, 68, 71, 74, 76, 78] },
  { id: "pediatrics", name: "Pediatrics", prescribed: 1060, captured: 869, rate: 82, baseline: 70, trend: [70, 73, 76, 79, 81, 82] },
];

export const topLeakingTests = [
  { test: "Lipid Profile", prescribed: 1840, captured: 1030, price: 1200 },
  { test: "USG Whole Abdomen", prescribed: 980, captured: 610, price: 2200 },
  { test: "Echocardiogram", prescribed: 620, captured: 372, price: 3000 },
  { test: "HbA1c", prescribed: 1420, captured: 980, price: 1100 },
  { test: "TSH", prescribed: 860, captured: 560, price: 900 },
  { test: "CBC", prescribed: 2960, captured: 2280, price: 400 },
].map((t) => ({
  ...t,
  rate: Math.round((t.captured / t.prescribed) * 100),
  lost: (t.prescribed - t.captured) * t.price,
}));

export const insights = [
  {
    tone: "leak",
    title: "Lipid Profile leaks most in Cardiology.",
    body: "52% of patients who left cited price. Our price is ৳ 350 above the average reported outside price.",
    href: "/m/leaks",
    cta: "See price gap",
  },
  {
    tone: "win",
    title: "Home collection lifted Medicine capture by 6 pts.",
    body: "1,212 of 3,420 Medicine orders this month used home sample collection.",
    href: "/m/recovery",
    cta: "See recovery actions",
  },
  {
    tone: "info",
    title: "Echocardiogram demand is up 18% vs. October.",
    body: "Evening slots are full by 6 PM on Sun, Tue and Thu. Adding one slot could capture ~40 more tests.",
    href: "/m/capacity",
    cta: "Open capacity",
  },
];

export const leakReasons = [
  { reason: "Price", value: 41 },
  { reason: "Closer to home", value: 23 },
  { reason: "Trust another lab", value: 14 },
  { reason: "Faster report", value: 9 },
  { reason: "Not stated", value: 7 },
  { reason: "Someone suggested", value: 6 },
];

export const outsideLabs = [
  { lab: "Northgate Diagnostics", uploads: 412 },
  { lab: "Riverside Lab", uploads: 291 },
  { lab: "Unity Path Center", uploads: 205 },
  { lab: "Other / not stated", uploads: 172 },
];

export const priceGap = tests
  .filter((t) => ["lipid", "echo", "usg", "hba1c", "tsh", "cbc"].includes(t.id))
  .map((t) => ({
    test: t.name,
    ours: t.price,
    outside: t.outside,
    gap: t.price - t.outside,
    leakRate: { lipid: 44, echo: 40, usg: 38, hba1c: 31, tsh: 35, cbc: 23 }[t.id as "lipid"],
  }))
  .sort((a, b) => b.leakRate - a.leakRate);

/** Cardiology department detail (M3) */
export const cardiologyTests = [
  { test: "Lipid Profile", prescribed: 640, captured: 307, rate: 48 },
  { test: "Echocardiogram", prescribed: 420, captured: 239, rate: 57 },
  { test: "ECG", prescribed: 610, captured: 403, rate: 66 },
  { test: "Serum Creatinine", prescribed: 280, captured: 185, rate: 66 },
  { test: "HbA1c", prescribed: 190, captured: 129, rate: 68 },
  { test: "CBC", prescribed: 140, captured: 82, rate: 59 },
];

export const recoveryActions = [
  {
    id: "remind",
    title: "Remind patients who haven't booked prescribed tests",
    detail: "WhatsApp, 24 h after visit · All departments",
    on: true,
    reach: 2140,
    conversions: 612,
    recovered: 1224000,
  },
  {
    id: "home",
    title: "Home sample collection offer for high-leak tests",
    detail: "SMS + WhatsApp · Lipid Profile, HbA1c, CBC",
    on: true,
    reach: 1580,
    conversions: 404,
    recovered: 808000,
  },
  {
    id: "package",
    title: "Package price for frequently paired tests",
    detail: "Diabetes panel: HbA1c + Lipid Profile + Serum Creatinine at ৳ 2,350",
    on: false,
    reach: 0,
    conversions: 0,
    recovered: 0,
  },
];

export const adoptionByDept = [
  { dept: "Medicine", doctors: 12, active: 12, digitalRx: 93, ai: 84, prescriptions: 4120 },
  { dept: "Cardiology", doctors: 8, active: 7, digitalRx: 86, ai: 79, prescriptions: 2310 },
  { dept: "Gynecology & Obstetrics", doctors: 9, active: 8, digitalRx: 81, ai: 74, prescriptions: 1980 },
  { dept: "Endocrinology", doctors: 5, active: 5, digitalRx: 91, ai: 82, prescriptions: 1470 },
  { dept: "Orthopedics", doctors: 7, active: 6, digitalRx: 72, ai: 70, prescriptions: 1140 },
  { dept: "Pediatrics", doctors: 6, active: 5, digitalRx: 78, ai: 76, prescriptions: 1060 },
  { dept: "Gastroenterology", doctors: 5, active: 3, digitalRx: 69, ai: 71, prescriptions: 880 },
];

export const inactiveDoctors = [
  { name: "Dr. Shahidul Islam", dept: "Orthopedics", status: "Training scheduled", date: "24 Nov" },
  { name: "Dr. Mahmuda Khatun", dept: "Pediatrics", status: "Invited", date: "Invited 12 Nov" },
  { name: "Dr. Rafiqul Alam", dept: "Gastroenterology", status: "Not started", date: "—" },
  { name: "Dr. Selina Parvin", dept: "Gynecology & Obstetrics", status: "Trained, no login yet", date: "Trained 15 Nov" },
  { name: "Dr. Arif Chowdhury", dept: "Cardiology", status: "Invited", date: "Invited 16 Nov" },
  { name: "Dr. Imran Kabir", dept: "Gastroenterology", status: "Not started", date: "—" },
];

export const benchmark = [
  { name: "Medicine", you: 74, p25: 60, median: 66, p75: 73 },
  { name: "Cardiology", you: 59, p25: 52, median: 58, p75: 65 },
  { name: "Gynecology & Obstetrics", you: 78, p25: 63, median: 70, p75: 77 },
  { name: "Endocrinology", you: 75, p25: 61, median: 68, p75: 74 },
  { name: "Orthopedics", you: 67, p25: 55, median: 61, p75: 68 },
  { name: "Pediatrics", you: 82, p25: 68, median: 74, p75: 80 },
  { name: "Gastroenterology", you: 63, p25: 54, median: 60, p75: 67 },
];

export const benchmarkCategory = [
  { name: "Blood biochemistry", you: 73, p25: 60, median: 67, p75: 74 },
  { name: "Hematology", you: 77, p25: 66, median: 71, p75: 78 },
  { name: "Imaging (USG, X-ray)", you: 62, p25: 50, median: 57, p75: 64 },
  { name: "Cardiac (ECG, Echo)", you: 64, p25: 55, median: 61, p75: 68 },
  { name: "Hormone (TSH etc.)", you: 65, p25: 54, median: 60, p75: 67 },
];

/** Leak Audit (June 2026, 30 days) — basis for the 58% baseline */
export const audit = {
  period: "1 – 30 June 2026",
  prescriptions: 3480,
  prescribed: 8620,
  captured: 5000,
  rate: 58,
  leaked: 3620,
  leakedValue: 7240000,
  byDept: [
    { name: "Cardiology", rate: 49, leakedValue: 1720000 },
    { name: "Gastroenterology", rate: 52, leakedValue: 860000 },
    { name: "Orthopedics", rate: 55, leakedValue: 780000 },
    { name: "Medicine", rate: 61, leakedValue: 2040000 },
    { name: "Endocrinology", rate: 62, leakedValue: 820000 },
    { name: "Gynecology & Obstetrics", rate: 64, leakedValue: 690000 },
    { name: "Pediatrics", rate: 70, leakedValue: 330000 },
  ],
  byTest: [
    { name: "Lipid Profile", rate: 47, leakedValue: 1580000 },
    { name: "USG Whole Abdomen", rate: 51, leakedValue: 1320000 },
    { name: "Echocardiogram", rate: 50, leakedValue: 1140000 },
    { name: "HbA1c", rate: 60, leakedValue: 880000 },
    { name: "TSH", rate: 56, leakedValue: 610000 },
  ],
};

/* ------------------------------------------------------------------ */
/* Front desk                                                          */
/* ------------------------------------------------------------------ */

export type Status = "Booked" | "Arrived" | "With doctor" | "Done" | "No-show" | "Cancelled";
export type Channel = "phone" | "whatsapp" | "web" | "walkin";

export const queue: {
  serial: number;
  name: string;
  phone: string;
  via: Channel;
  status: Status;
  time: string;
  reason: string;
  age: number;
  sex: "M" | "F";
  vitals: boolean;
}[] = [
  { serial: 5, name: "Nasima Akter", phone: "01712-908144", via: "phone", status: "Done", time: "5:40 PM", reason: "Follow-up, thyroid", age: 41, sex: "F", vitals: true },
  { serial: 6, name: "Jamal Uddin", phone: "01815-330912", via: "whatsapp", status: "Done", time: "5:50 PM", reason: "Fever, cough × 5 days", age: 37, sex: "M", vitals: true },
  { serial: 7, name: "Shirin Sultana", phone: "01913-221876", via: "web", status: "No-show", time: "6:00 PM", reason: "Joint pain", age: 52, sex: "F", vitals: false },
  { serial: 8, name: "Abdul Karim", phone: "01819-552310", via: "phone", status: "Done", time: "6:10 PM", reason: "Chest discomfort, BP review", age: 62, sex: "M", vitals: true },
  { serial: 9, name: "Rahima Begum", phone: "01711-234567", via: "whatsapp", status: "With doctor", time: "6:25 PM", reason: "Thirst, tiredness, burning urination", age: 58, sex: "F", vitals: true },
  { serial: 10, name: "Mizanur Rahman", phone: "01923-410087", via: "web", status: "Arrived", time: "6:35 PM", reason: "Lipid report follow-up", age: 45, sex: "M", vitals: true },
  { serial: 11, name: "Sadia Islam", phone: "01552-781204", via: "web", status: "Arrived", time: "6:45 PM", reason: "Fatigue, hair fall", age: 29, sex: "F", vitals: false },
  { serial: 12, name: "Habibur Rahman", phone: "01611-457720", via: "phone", status: "Booked", time: "6:55 PM", reason: "Acidity, bloating", age: 48, sex: "M", vitals: false },
  { serial: 13, name: "Taslima Khatun", phone: "01716-098812", via: "walkin", status: "Booked", time: "7:05 PM", reason: "Headache", age: 33, sex: "F", vitals: false },
  { serial: 14, name: "Rafiq Mia", phone: "01818-662043", via: "whatsapp", status: "Booked", time: "7:15 PM", reason: "Diabetes review", age: 55, sex: "M", vitals: false },
  { serial: 15, name: "Momena Begum", phone: "01912-773519", via: "phone", status: "Cancelled", time: "7:25 PM", reason: "Back pain", age: 60, sex: "F", vitals: false },
  { serial: 16, name: "Anwar Hossain", phone: "01715-882031", via: "web", status: "Booked", time: "7:35 PM", reason: "BP check", age: 66, sex: "M", vitals: false },
];

export const callbacks = [
  { phone: "01714-339012", name: "Unknown caller", requested: "5:12 PM", waiting: "48 min", attempts: 1, reason: "Wants Cardiology serial for tomorrow", priority: "high" },
  { phone: "01819-552310", name: "Abdul Karim", requested: "5:30 PM", waiting: "30 min", attempts: 0, reason: "Ask about Echo report time", priority: "normal" },
  { phone: "01611-200984", name: "Kulsum Ara", requested: "5:41 PM", waiting: "19 min", attempts: 2, reason: "Reschedule Gynae appointment", priority: "normal" },
  { phone: "01923-118765", name: "Unknown caller", requested: "5:48 PM", waiting: "12 min", attempts: 0, reason: "Home sample collection price", priority: "normal" },
  { phone: "01552-901233", name: "Shafiq Rahman", requested: "5:55 PM", waiting: "5 min", attempts: 0, reason: "Missed call from IVR menu", priority: "low" },
];

/* ------------------------------------------------------------------ */
/* Doctor                                                              */
/* ------------------------------------------------------------------ */

export const reports = {
  hba1c: { name: "HbA1c", unit: "%", ref: "< 5.7", history: [7.1, 7.6, 8.2], dates: ["Jan", "Jun", "Nov"] },
  creatinine: { name: "Serum Creatinine", unit: "mg/dL", ref: "0.5 – 1.1", history: [1.0, 1.1, 1.3], dates: ["Jan", "Jun", "Nov"] },
  ldl: { name: "LDL Cholesterol", unit: "mg/dL", ref: "< 100", history: [128, 140, 152], dates: ["Jan", "Jun", "Nov"] },
};

export const reviewInbox = [
  { id: "rahima", patient: "Rahima Begum", age: 58, sex: "F", tests: ["HbA1c", "Lipid Profile", "Serum Creatinine", "Urine R/E"], source: "inhouse", abnormal: 6, received: "Today, 2:10 PM", priority: "High", tab: "ready" },
  { id: "abdul", patient: "Abdul Karim", age: 62, sex: "M", tests: ["Lipid Profile", "ECG"], source: "inhouse", abnormal: 2, received: "Today, 1:05 PM", priority: "High", tab: "ready" },
  { id: "mizanur", patient: "Mizanur Rahman", age: 45, sex: "M", tests: ["Lipid Profile"], source: "outside", abnormal: 2, received: "Today, 11:40 AM", priority: "Medium", tab: "ready" },
  { id: "rafiq", patient: "Rafiq Mia", age: 55, sex: "M", tests: ["HbA1c", "Fasting Blood Sugar"], source: "inhouse", abnormal: 1, received: "Today, 10:15 AM", priority: "Medium", tab: "ready" },
  { id: "nasima", patient: "Nasima Akter", age: 41, sex: "F", tests: ["TSH"], source: "outside", abnormal: 1, received: "Yesterday, 8:30 PM", priority: "Medium", tab: "ready" },
  { id: "sadia", patient: "Sadia Islam", age: 29, sex: "F", tests: ["TSH", "CBC"], source: "inhouse", abnormal: 0, received: "Today, 9:50 AM", priority: "Low", tab: "ready" },
  { id: "jamal", patient: "Jamal Uddin", age: 37, sex: "M", tests: ["CBC", "X-ray Chest PA"], source: "inhouse", abnormal: 0, received: "Today, 9:05 AM", priority: "Low", tab: "ready" },
  { id: "anwar", patient: "Anwar Hossain", age: 66, sex: "M", tests: ["Serum Creatinine", "Urine R/E"], source: "inhouse", abnormal: 0, received: "Today, 8:40 AM", priority: "Low", tab: "waiting" },
  { id: "habib", patient: "Habibur Rahman", age: 48, sex: "M", tests: ["USG Whole Abdomen"], source: "inhouse", abnormal: 0, received: "Expected 7:30 PM", priority: "Low", tab: "waiting" },
  { id: "taslima", patient: "Taslima Khatun", age: 33, sex: "F", tests: ["CBC"], source: "inhouse", abnormal: 0, received: "Sent 6:12 PM", priority: "Low", tab: "done" },
];

export const rahimaLabValues = [
  { group: "Diabetes", test: "HbA1c", value: 8.2, unit: "%", ref: "< 5.7", flag: "H", prev: 7.6 },
  { group: "Lipid Profile", test: "Total Cholesterol", value: 228, unit: "mg/dL", ref: "< 200", flag: "H", prev: 214 },
  { group: "Lipid Profile", test: "LDL Cholesterol", value: 152, unit: "mg/dL", ref: "< 100", flag: "H", prev: 140 },
  { group: "Lipid Profile", test: "HDL Cholesterol", value: 38, unit: "mg/dL", ref: "> 50", flag: "L", prev: 41 },
  { group: "Lipid Profile", test: "Triglycerides", value: 210, unit: "mg/dL", ref: "< 150", flag: "H", prev: 188 },
  { group: "Kidney", test: "Serum Creatinine", value: 1.3, unit: "mg/dL", ref: "0.5 – 1.1", flag: "H", prev: 1.1 },
  { group: "Urine R/E", test: "Pus cells", value: "3–5", unit: "/HPF", ref: "0 – 5", flag: "", prev: "12–15" },
  { group: "Urine R/E", test: "Glucose", value: "++", unit: "", ref: "Nil", flag: "H", prev: "+" },
];

export const mizanurExtracted = [
  { test: "Total Cholesterol", value: "246", unit: "mg/dL", ref: "< 200", flag: "H", conf: 98 },
  { test: "LDL Cholesterol", value: "168", unit: "mg/dL", ref: "< 100", flag: "H", conf: 96 },
  { test: "HDL Cholesterol", value: "44", unit: "mg/dL", ref: "> 40", flag: "", conf: 97 },
  { test: "Triglycerides", value: "172", unit: "mg/dL", ref: "< 150", flag: "H", conf: 81 },
];

export const rxMeds = [
  { id: "comet", brand: "Comet XR 500 mg", generic: "Metformin HCl (extended release)", dose: "১+০+১", when: "খাবারের পরে", duration: "3 months", ai: true },
  { id: "camlodin", brand: "Camlodin 5 mg", generic: "Amlodipine", dose: "১+০+০", when: "খাবারের পরে", duration: "3 months", ai: true },
  { id: "moxaclav", brand: "Moxaclav 625 mg", generic: "Amoxicillin + Clavulanic acid", dose: "১+০+১", when: "খাবারের পরে", duration: "7 days", ai: true },
];

export const rxReplacement = { id: "ciprocin", brand: "Ciprocin 500 mg", generic: "Ciprofloxacin", dose: "১+০+১", when: "খাবারের পরে", duration: "5 days", ai: false };

export const adviceTemplates = [
  "চিনি ও মিষ্টি জাতীয় খাবার এড়িয়ে চলুন",
  "প্রতিদিন অন্তত ৩০ মিনিট হাঁটুন",
  "প্রচুর পানি পান করুন (দিনে ৮–১০ গ্লাস)",
  "লবণ কম খান",
  "ওষুধ নিয়মিত খাবেন, নিজে থেকে বন্ধ করবেন না",
];

export const drugDb = [
  { brand: "Comet 500 mg", generic: "Metformin HCl", company: "Square" },
  { brand: "Comet XR 500 mg", generic: "Metformin HCl (XR)", company: "Square" },
  { brand: "Camlodin 5 mg", generic: "Amlodipine", company: "Square" },
  { brand: "Ciprocin 500 mg", generic: "Ciprofloxacin", company: "Square" },
  { brand: "Moxaclav 625 mg", generic: "Amoxicillin + Clavulanic acid", company: "Square" },
  { brand: "Napa 500 mg", generic: "Paracetamol", company: "Beximco" },
  { brand: "Seclo 20 mg", generic: "Omeprazole", company: "Square" },
  { brand: "Rosuva 10 mg", generic: "Rosuvastatin", company: "Square" },
  { brand: "Atova 10 mg", generic: "Atorvastatin", company: "Beximco" },
  { brand: "Losectil 20 mg", generic: "Omeprazole", company: "Eskayef" },
];

export const icd = [
  { code: "E11.65", label: "Type 2 diabetes mellitus with hyperglycemia" },
  { code: "I10", label: "Essential (primary) hypertension" },
  { code: "N39.0", label: "Urinary tract infection, site not specified" },
];

/* ------------------------------------------------------------------ */
/* Consent & data                                                      */
/* ------------------------------------------------------------------ */

export const consentStats = { collected: 18420, withdrawn: 37, pending: 214 };

export const consentRows = [
  { pid: "MSH-24••18", type: "Care records", date: "19 Nov 2026, 6:02 PM", channel: "WhatsApp", status: "Active" },
  { pid: "MSH-25••14", type: "Care records", date: "19 Nov 2026, 5:47 PM", channel: "Web", status: "Active" },
  { pid: "MSH-23••07", type: "AI scribe recording", date: "19 Nov 2026, 5:31 PM", channel: "In chamber", status: "Active" },
  { pid: "MSH-23••42", type: "Care records", date: "18 Nov 2026, 8:15 PM", channel: "Front desk", status: "Active" },
  { pid: "MSH-22••90", type: "Marketing messages", date: "18 Nov 2026, 11:02 AM", channel: "SMS", status: "Withdrawn" },
  { pid: "MSH-25••61", type: "Care records", date: "17 Nov 2026, 4:20 PM", channel: "Phone (IVR)", status: "Pending" },
  { pid: "MSH-21••33", type: "AI scribe recording", date: "17 Nov 2026, 7:44 PM", channel: "In chamber", status: "Declined" },
];

export const accessLog = [
  { who: "Dr. Farhana Rahman", role: "Doctor", action: "Viewed reports", record: "MSH-24••18", when: "6:31 PM" },
  { who: "Shamima (Front desk)", role: "Front desk", action: "Recorded vitals", record: "MSH-24••18", when: "6:18 PM" },
  { who: "Lab: Rubel Hasan", role: "Lab", action: "Uploaded result", record: "MSH-23••07", when: "5:52 PM" },
  { who: "COO office", role: "Management", action: "Exported department report", record: "Cardiology (aggregate)", when: "3:10 PM" },
  { who: "Admin: Nazmul", role: "Admin", action: "Changed role permissions", record: "Department head", when: "11:24 AM" },
];

export const deletionRequests = [
  { pid: "MSH-22••90", requested: "18 Nov", scope: "All records", status: "Under review" },
  { pid: "MSH-19••02", requested: "14 Nov", scope: "Voice recordings", status: "Completed" },
];

export const integrations = [
  { name: "Lab system (LIS)", vendor: "LabTrack v5", status: "Connected", icon: "FlaskConical" },
  { name: "Hospital system (HIS)", vendor: "MediCore HIS", status: "Connected", icon: "Building2" },
  { name: "Billing", vendor: "MediCore Billing", status: "Connected", icon: "Receipt" },
  { name: "WhatsApp Business", vendor: "+880 1700-010655", status: "Connected", icon: "MessageCircle" },
  { name: "SMS gateway", vendor: "Not configured", status: "Not connected", icon: "MessageSquare" },
  { name: "Phone / IVR", vendor: "Hotline 10655", status: "Connected", icon: "PhoneCall" },
];

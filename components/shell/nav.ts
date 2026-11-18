import {
  LayoutDashboard,
  TrendingDown,
  Building2,
  Rocket,
  CalendarClock,
  UserCheck,
  BarChart3,
  FileText,
  ShieldCheck,
  Settings,
  CalendarDays,
  Inbox,
  Users,
  LayoutTemplate,
  ListOrdered,
  PhoneCall,
  PlusCircle,
  HeartPulse,
  ScanLine,
  type LucideIcon,
} from "lucide-react";

export type Surface = "management" | "doctor" | "frontdesk";
export type NavItem = { label: string; href: string; icon: LucideIcon; badge?: string; match?: string };

export const nav: Record<Surface, NavItem[]> = {
  management: [
    { label: "Overview", href: "/m/overview", icon: LayoutDashboard },
    { label: "Leak insights", href: "/m/leaks", icon: TrendingDown },
    { label: "Departments", href: "/m/departments/cardiology", icon: Building2, match: "/m/departments" },
    { label: "Recovery actions", href: "/m/recovery", icon: Rocket },
    { label: "Capacity", href: "/m/capacity", icon: CalendarClock },
    { label: "Doctor adoption", href: "/m/adoption", icon: UserCheck },
    { label: "Benchmark", href: "/m/benchmark", icon: BarChart3 },
    { label: "Leak Audit report", href: "/m/audit-report", icon: FileText },
    { label: "Consent & data", href: "/m/consent", icon: ShieldCheck },
    { label: "Settings", href: "/m/settings", icon: Settings },
  ],
  doctor: [
    { label: "Today", href: "/d/today", icon: CalendarDays, match: "/d/today" },
    { label: "Remote reviews", href: "/d/reviews", icon: Inbox, badge: "8" },
    { label: "Patients", href: "/d/patient/rahima", icon: Users, match: "/d/patient" },
    { label: "Templates", href: "/d/settings?tab=templates", icon: LayoutTemplate, match: "/d/templates" },
    { label: "Settings", href: "/d/settings", icon: Settings },
  ],
  frontdesk: [
    { label: "Today's queue", href: "/f/queue", icon: ListOrdered },
    { label: "New booking", href: "/f/new-booking", icon: PlusCircle },
    { label: "Call-backs", href: "/f/callbacks", icon: PhoneCall, badge: "5" },
    { label: "Check-in & vitals", href: "/f/check-in", icon: HeartPulse },
    { label: "Leak Audit capture", href: "/f/leak-audit", icon: ScanLine },
  ],
};

export const users: Record<Surface, { name: string; role: string; initials: string }> = {
  management: { name: "Sharmin Haque", role: "Chief Operating Officer", initials: "SH" },
  doctor: { name: "Dr. Farhana Rahman", role: "Medicine · Room 304", initials: "FR" },
  frontdesk: { name: "Shamima Akter", role: "Front desk · Ground floor", initials: "SA" },
};

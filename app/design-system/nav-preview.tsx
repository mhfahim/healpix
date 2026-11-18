import { CalendarDays, Inbox, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavPreview() {
  const items = [
    { label: "Today", icon: CalendarDays, active: true },
    { label: "Remote reviews", icon: Inbox, badge: "8" },
    { label: "Patients", icon: Users },
  ];
  return (
    <ul className="w-56 rounded-lg border border-slate-200 bg-white p-2">
      {items.map((it) => (
        <li key={it.label}>
          <span
            className={cn(
              "flex h-9 items-center gap-2.5 rounded px-2.5 text-body font-medium",
              it.active ? "bg-teal-50 text-teal-800" : "text-slate-700"
            )}
          >
            <it.icon className={cn("size-[18px]", it.active ? "text-teal-700" : "text-slate-500")} strokeWidth={1.5} />
            <span className="flex-1">{it.label}</span>
            {it.badge && <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-700 px-1.5 text-caption font-semibold text-white">{it.badge}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

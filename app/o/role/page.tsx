"use client";
import Link from "next/link";
import { ArrowRight, BarChart3, ListOrdered, Stethoscope, Settings2 } from "lucide-react";
import { Logo } from "@/components/shell/logo";
import { ThemeToggle } from "@/components/shell/theme";

const roles = [
  { title: "Front desk", body: "Today's queue, bookings, check-in and vitals", href: "/f/queue", icon: ListOrdered },
  { title: "Doctor", body: "Your chamber, consultations and remote reviews", href: "/d/today", icon: Stethoscope },
  { title: "Management", body: "Capture rate, leaks, recovery and adoption", href: "/m/overview", icon: BarChart3 },
];

export default function RoleSwitcher() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-10">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Logo />
        <ThemeToggle />
      </div>
      <div className="mt-16 w-full max-w-3xl">
        <h1 className="text-center text-h1 font-semibold">Welcome back, Sharmin</h1>
        <p className="mt-1 text-center text-body text-slate-500">You have access to more than one workspace. Where would you like to start?</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {roles.map((r) => (
            <Link key={r.title} href={r.href} className="group flex flex-col rounded-lg border border-slate-200 bg-surface p-6 transition-colors hover:border-teal-500 focus-visible:border-teal-500">
              <span className="inline-flex size-12 items-center justify-center rounded-lg bg-teal-50">
                <r.icon className="size-6 text-teal-700" strokeWidth={1.5} />
              </span>
              <p className="mt-4 text-h3 font-semibold">{r.title}</p>
              <p className="mt-1 flex-1 text-body text-slate-500">{r.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-body font-medium text-teal-700">
                Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
        <Link href="/o/onboarding" className="mx-auto mt-6 flex w-fit items-center gap-2 text-small font-medium text-slate-500 hover:text-slate-900">
          <Settings2 className="size-4" /> Hospital admin: onboarding & setup
        </Link>
      </div>
    </div>
  );
}

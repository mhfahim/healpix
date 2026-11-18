"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronsUpDown, Download, PanelLeftClose, PanelLeftOpen, Search, LogOut, Repeat, CalendarRange, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { hospital } from "@/data/mock";
import { nav, users, type Surface } from "./nav";
import { Logo, LogoMark } from "./logo";
import { Avatar } from "@/components/ui/primitives";
import { OfflineBadge } from "@/components/ui/clinical";
import { Button } from "@/components/ui/button";

export function AppShell({
  surface,
  title,
  subtitle,
  actions,
  children,
  offline,
  management,
  contentClassName,
  fullBleed,
}: {
  surface: Surface;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  offline?: boolean;
  /** Show management top bar controls: date range, branch, export */
  management?: boolean;
  contentClassName?: string;
  fullBleed?: boolean;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();
  const items = nav[surface];
  const user = users[surface];
  const [userMenu, setUserMenu] = React.useState(false);
  // Tablet (1024 × 768) and small laptops: start with the icon rail to give content room.
  React.useEffect(() => {
    if (window.innerWidth < 1280) setCollapsed(true);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "no-print sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200",
          collapsed ? "w-16" : "w-sidebar"
        )}
      >
        <div className={cn("flex h-topbar items-center border-b border-slate-200", collapsed ? "justify-center px-2" : "justify-between px-4")}>
          <Link href="/" aria-label="Helpix prototype index">
            {collapsed ? <LogoMark size={28} /> : <Logo />}
          </Link>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Collapse sidebar">
              <PanelLeftClose className="size-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        {/* Hospital switcher */}
        <div className={cn("border-b border-slate-200", collapsed ? "p-2" : "p-3")}>
          <button
            className={cn("flex w-full items-center gap-2.5 rounded-lg text-left hover:bg-slate-50", collapsed ? "justify-center p-1.5" : "border border-slate-200 p-2")}
            aria-label="Switch hospital"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded bg-slate-900 text-caption font-semibold text-white">MS</span>
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-small font-medium text-slate-900">{hospital.name}</span>
                  <span className="block truncate text-caption text-slate-500">{hospital.branch}</span>
                </span>
                <ChevronsUpDown className="size-4 shrink-0 text-slate-400" />
              </>
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2" aria-label="Main">
          <ul className="flex flex-col gap-0.5">
            {items.map((it) => {
              const base = it.href.split("?")[0];
              const active = pathname === base || (it.match ? pathname.startsWith(it.match) : pathname.startsWith(base + "/"));
              const Icon = it.icon;
              return (
                <li key={it.label}>
                  <Link
                    href={it.href}
                    title={collapsed ? it.label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex h-9 items-center gap-2.5 rounded px-2.5 text-body font-medium transition-colors",
                      active ? "bg-teal-50 text-teal-800" : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Icon className={cn("size-[18px] shrink-0", active ? "text-teal-700" : "text-slate-500 group-hover:text-slate-700")} strokeWidth={1.5} />
                    {!collapsed && <span className="flex-1 truncate">{it.label}</span>}
                    {!collapsed && it.badge && (
                      <span className="tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-teal-700 px-1.5 text-caption font-semibold text-white">
                        {it.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {collapsed && (
          <div className="flex justify-center p-2">
            <button onClick={() => setCollapsed(false)} className="rounded p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Expand sidebar">
              <PanelLeftOpen className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        )}

        {/* User menu */}
        <div className="relative border-t border-slate-200 p-2">
          <button
            onClick={() => setUserMenu((o) => !o)}
            className={cn("flex w-full items-center gap-2.5 rounded p-2 text-left hover:bg-slate-50", collapsed && "justify-center")}
            aria-haspopup="menu"
            aria-expanded={userMenu}
          >
            <Avatar initials={user.initials} size="sm" />
            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-small font-medium">{user.name}</span>
                <span className="block truncate text-caption text-slate-500">{user.role}</span>
              </span>
            )}
          </button>
          {userMenu && (
            <div role="menu" className="absolute bottom-full left-2 right-2 mb-1 min-w-[200px] rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <Link role="menuitem" href="/o/role" className="flex items-center gap-2 rounded px-2.5 py-2 text-body hover:bg-slate-50">
                <Repeat className="size-4 text-slate-500" /> Switch role
              </Link>
              <Link role="menuitem" href="/o/login" className="flex items-center gap-2 rounded px-2.5 py-2 text-body hover:bg-slate-50">
                <LogOut className="size-4 text-slate-500" /> Sign out
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-30 flex h-topbar shrink-0 items-center gap-4 border-b border-slate-200 bg-white/95 px-6 backdrop-blur">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-h2 font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="-mt-0.5 truncate text-caption text-slate-500">{subtitle}</p>}
          </div>
          {offline && <OfflineBadge />}
          <div className="relative hidden w-64 lg:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder={surface === "management" ? "Search tests, departments…" : "Search patient, phone, ID…"}
              className="h-9 w-full rounded border border-slate-200 bg-slate-50 pl-9 pr-12 text-body placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              aria-label="Search"
            />
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-sm border border-slate-200 bg-white px-1 text-caption text-slate-400">⌘K</span>
          </div>
          {management && (
            <>
              <button className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-body hover:bg-slate-50" aria-label="Date range">
                <CalendarRange className="size-4 text-slate-500" /> This month
                <span className="text-caption text-slate-500">1–19 Nov</span>
              </button>
              <button className="inline-flex h-9 items-center gap-2 rounded border border-slate-200 bg-white px-3 text-body hover:bg-slate-50" aria-label="Branch">
                <MapPin className="size-4 text-slate-500" /> Dhanmondi
              </button>
              <Button variant="secondary" aria-label="Export PDF or CSV">
                <Download /> Export
              </Button>
            </>
          )}
          {actions}
          <button className="relative rounded p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications, 3 unread">
            <Bell className="size-5" strokeWidth={1.5} />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-white bg-danger" />
          </button>
        </header>
        <main className={cn(fullBleed ? "flex-1" : "mx-auto w-full max-w-content flex-1 px-6 py-6", contentClassName)}>{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions, className }: { title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-h1 font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-body text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

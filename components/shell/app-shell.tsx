"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronsUpDown, Download, PanelLeftClose, PanelLeftOpen, Search, LogOut, Repeat, CalendarRange, MapPin, Moon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { hospital } from "@/data/mock";
import { nav, users, type Surface, type NavItem } from "./nav";
import { Logo, LogoMark } from "./logo";
import { Avatar } from "@/components/ui/primitives";
import { OfflineBadge } from "@/components/ui/clinical";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/controls";
import { ThemeToggle, useTheme } from "./theme";

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
  /** Show management controls: date range, branch, export */
  management?: boolean;
  contentClassName?: string;
  /** Full-height workspace (D3, D6): compact header bar, no content padding */
  fullBleed?: boolean;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const pathname = usePathname();
  const { sections, footer } = nav[surface];
  const user = users[surface];
  const [userMenu, setUserMenu] = React.useState(false);
  const { dark, setPref } = useTheme();

  // Tablet (1024 × 768) and small laptops: start with the icon rail to give content room.
  React.useEffect(() => {
    if (window.innerWidth < 1280) setCollapsed(true);
  }, []);

  const isActive = (it: NavItem) => {
    const base = it.href.split("?")[0];
    return pathname === base || (it.match ? pathname.startsWith(it.match) : pathname.startsWith(base + "/"));
  };

  const item = (it: NavItem) => {
    const active = isActive(it);
    const Icon = it.icon;
    return (
      <li key={it.label}>
        <Link
          href={it.href}
          title={collapsed ? it.label : undefined}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group relative flex h-10 items-center gap-3 rounded-[10px] px-3 text-body transition-colors",
            active ? "bg-teal-50 font-medium text-teal-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            collapsed && "justify-center px-0"
          )}
        >
          <Icon className={cn("size-[18px] shrink-0", active ? "text-teal-700" : "text-slate-400 group-hover:text-slate-600")} strokeWidth={1.75} />
          {!collapsed && <span className="flex-1 truncate">{it.label}</span>}
          {it.badge &&
            (collapsed ? (
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-teal-600" />
            ) : (
              <span
                className={cn(
                  "tnum inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-caption font-semibold",
                  active ? "bg-teal-700 text-on-accent" : "bg-slate-100 text-slate-700"
                )}
              >
                {it.badge}
              </span>
            ))}
        </Link>
      </li>
    );
  };

  const header = (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-3", fullBleed ? "min-h-16 border-b border-slate-200 bg-surface px-6 py-3" : "mb-6")}>
      <div className="min-w-[200px] flex-1">
        <h1 className={cn("font-semibold text-slate-900", fullBleed ? "text-h2 tracking-tight" : "text-title")}>{title}</h1>
        {subtitle && <p className={cn("text-slate-500", fullBleed ? "text-caption" : "mt-1 text-body")}>{subtitle}</p>}
      </div>
      {(management || actions) && (
        <div className="flex flex-wrap items-center gap-2">
          {management && (
            <>
              <button className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded border border-slate-200 bg-surface px-3.5 text-body shadow-card hover:bg-slate-50" aria-label="Date range">
                <CalendarRange className="size-4 text-slate-400" /> This month
                <span className="hidden text-caption text-slate-400 xl:inline">1–19 Nov</span>
                <ChevronDown className="size-4 text-slate-400" />
              </button>
              <button className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded border border-slate-200 bg-surface px-3.5 text-body shadow-card hover:bg-slate-50" aria-label="Branch">
                <MapPin className="size-4 text-slate-400" /> Dhanmondi
                <ChevronDown className="size-4 text-slate-400" />
              </button>
              <Button variant="secondary" aria-label="Export PDF or CSV">
                <Download /> Export
              </Button>
            </>
          )}
          {actions}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "no-print sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-surface transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-sidebar"
        )}
      >
        <div className={cn("flex h-topbar shrink-0 items-center", collapsed ? "justify-center px-2" : "justify-between pl-5 pr-3")}>
          <Link href="/" aria-label="Helpix prototype index">
            {collapsed ? <LogoMark size={30} /> : <Logo />}
          </Link>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="rounded-[8px] p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Collapse sidebar">
              <PanelLeftClose className="size-[18px]" strokeWidth={1.75} />
            </button>
          )}
        </div>

        {/* Hospital switcher */}
        <div className={cn(collapsed ? "px-3 pb-2" : "px-4 pb-2")}>
          <button
            className={cn("flex w-full items-center gap-2.5 rounded-[12px] text-left transition-colors hover:bg-slate-50", collapsed ? "justify-center p-1" : "border border-slate-200 p-2 shadow-card")}
            aria-label="Switch hospital"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[9px] bg-slate-900 text-caption font-semibold text-on-accent">MS</span>
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

        <nav className={cn("flex-1 overflow-y-auto pb-4", collapsed ? "px-3" : "px-4")} aria-label="Main">
          {sections.map((s) => (
            <div key={s.label} className="mt-4">
              {!collapsed ? (
                <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[0.08em] text-slate-400">{s.label}</p>
              ) : (
                <div className="mx-auto mb-2 h-px w-6 bg-slate-200" />
              )}
              <ul className="flex flex-col gap-0.5">{s.items.map(item)}</ul>
            </div>
          ))}
        </nav>

        <div className={cn("border-t border-slate-200", collapsed ? "px-3 py-3" : "px-4 py-3")}>
          {footer.length > 0 && <ul className="mb-1 flex flex-col gap-0.5">{footer.map(item)}</ul>}
          {collapsed ? (
            <div className="flex flex-col items-center gap-1">
              <ThemeToggle />
              <button onClick={() => setCollapsed(false)} className="rounded-[8px] p-2 text-slate-400 hover:bg-slate-100" aria-label="Expand sidebar">
                <PanelLeftOpen className="size-[18px]" strokeWidth={1.75} />
              </button>
            </div>
          ) : (
            <label className="flex h-10 cursor-pointer items-center gap-3 rounded-[10px] px-3 text-body text-slate-600 hover:bg-slate-100">
              <Moon className="size-[18px] text-slate-400" strokeWidth={1.75} />
              <span className="flex-1">Dark mode</span>
              <Switch checked={dark} onCheckedChange={(v) => setPref(v ? "dark" : "light")} aria-label="Dark mode" />
            </label>
          )}

          {/* User card */}
          <div className="relative mt-2">
            <button
              onClick={() => setUserMenu((o) => !o)}
              className={cn("flex w-full items-center gap-2.5 rounded-[12px] text-left hover:bg-slate-50", collapsed ? "justify-center p-1" : "border border-slate-200 p-2 shadow-card")}
              aria-haspopup="menu"
              aria-expanded={userMenu}
            >
              <Avatar initials={user.initials} size="sm" />
              {!collapsed && (
                <>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-small font-medium">{user.name}</span>
                    <span className="block truncate text-caption text-slate-500">{user.role}</span>
                  </span>
                  <ChevronsUpDown className="size-4 shrink-0 text-slate-400" />
                </>
              )}
            </button>
            {userMenu && (
              <div role="menu" className="absolute bottom-full left-0 z-40 mb-2 w-56 animate-pop-in rounded-[12px] border border-slate-200 bg-surface-raised p-1 shadow-sm">
                <Link role="menuitem" href="/o/role" className="flex items-center gap-2 rounded-[8px] px-2.5 py-2 text-body hover:bg-slate-100">
                  <Repeat className="size-4 text-slate-400" /> Switch role
                </Link>
                <Link role="menuitem" href="/o/login" className="flex items-center gap-2 rounded-[8px] px-2.5 py-2 text-body hover:bg-slate-100">
                  <LogOut className="size-4 text-slate-400" /> Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="no-print sticky top-0 z-30 flex h-topbar shrink-0 items-center gap-3 border-b border-slate-200 bg-surface/85 px-6 backdrop-blur-md">
          <div className="relative w-full max-w-[360px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder={surface === "management" ? "Search tests, departments, reports" : "Search patient, phone or ID"}
              className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-14 text-body placeholder:text-slate-400 focus:border-teal-500 focus:bg-surface focus:shadow-ring focus:outline-none"
              aria-label="Search"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-[6px] border border-slate-200 bg-surface px-1.5 text-caption text-slate-400">⌘K</span>
          </div>
          <div className="flex-1" />
          {offline && <OfflineBadge />}
          <ThemeToggle />
          <button className="relative inline-flex size-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Notifications, 3 unread">
            <Bell className="size-[18px]" strokeWidth={1.75} />
            <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-surface bg-danger" />
          </button>
        </header>
        {fullBleed ? (
          <main className={cn("flex flex-1 flex-col", contentClassName)}>
            {header}
            {children}
          </main>
        ) : (
          <main className={cn("mx-auto w-full max-w-content flex-1 px-6 py-7 xl:px-8", contentClassName)}>
            {header}
            {children}
          </main>
        )}
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions, className }: { title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-title font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-body text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

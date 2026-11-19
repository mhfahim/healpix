"use client";
/**
 * Light / dark theme. The choice (light | dark | system) is a per-viewer
 * convenience kept in localStorage; an inline script applies it before first
 * paint so there's no flash of the wrong theme.
 */
import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Pref = "light" | "dark" | "system";
const KEY = "helpix-theme";

export const themeScript = `(function(){try{var p=localStorage.getItem('${KEY}')||'system';var d=p==='dark'||(p==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

const Ctx = React.createContext<{ pref: Pref; dark: boolean; setPref: (p: Pref) => void }>({ pref: "system", dark: false, setPref: () => {} });
export const useTheme = () => React.useContext(Ctx);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [pref, setPrefState] = React.useState<Pref>("system");
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    let p: Pref = "system";
    try {
      p = (localStorage.getItem(KEY) as Pref) || "system";
    } catch {}
    setPrefState(p);
  }, []);

  React.useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const d = pref === "dark" || (pref === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", d);
      setDark(d);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [pref]);

  const setPref = (p: Pref) => {
    setPrefState(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {}
  };
  return <Ctx.Provider value={{ pref, dark, setPref }}>{children}</Ctx.Provider>;
}

/** Icon button: flips between light and dark (explicit choice overrides the system setting). */
export function ThemeToggle({ className }: { className?: string }) {
  const { dark, setPref } = useTheme();
  return (
    <button
      onClick={() => setPref(dark ? "light" : "dark")}
      className={cn("inline-flex size-10 items-center justify-center rounded-full bg-surface text-slate-700 shadow-card ring-1 ring-slate-200/60 transition-colors hover:text-slate-900", className)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
    >
      {dark ? <Sun className="size-[18px]" strokeWidth={1.75} /> : <Moon className="size-[18px]" strokeWidth={1.75} />}
    </button>
  );
}

/** Three-way segmented choice for settings surfaces. */
export function ThemeSegment({ className }: { className?: string }) {
  const { pref, setPref } = useTheme();
  const opts: { v: Pref; icon: typeof Sun; label: string }[] = [
    { v: "light", icon: Sun, label: "Light" },
    { v: "dark", icon: Moon, label: "Dark" },
    { v: "system", icon: Monitor, label: "System" },
  ];
  return (
    <div role="radiogroup" aria-label="Theme" className={cn("inline-flex rounded-full bg-slate-100 p-0.5", className)}>
      {opts.map((o) => (
        <button
          key={o.v}
          role="radio"
          aria-checked={pref === o.v}
          aria-label={o.label}
          title={o.label}
          onClick={() => setPref(o.v)}
          className={cn("inline-flex h-7 w-8 items-center justify-center rounded-full text-slate-500", pref === o.v && "bg-surface text-slate-900 shadow-card")}
        >
          <o.icon className="size-3.5" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}

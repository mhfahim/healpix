"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shell/logo";
import { ThemeToggle } from "@/components/shell/theme";
import { Button } from "@/components/ui/button";
import { Field, Input, Divider } from "@/components/ui/primitives";
import { Segmented } from "@/components/ui/controls";
import { tokens } from "@/lib/tokens";

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = React.useState<"phone" | "email">("phone");
  const [step, setStep] = React.useState<"id" | "otp">("id");
  const [otp, setOtp] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const verify = (v: string) => {
    setOtp(v);
    if (v.length === 6) {
      setBusy(true);
      // Users with more than one role go to the role switcher; others route straight to their home.
      setTimeout(() => router.push("/o/role"), 700);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-8 py-8 sm:px-16">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="text-h1 font-semibold">Sign in to Helpix</h1>
          <p className="mt-1 text-body text-slate-500">Meridian Specialized Hospital</p>

          {step === "id" ? (
            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("otp");
              }}
            >
              <Segmented
                className="w-full"
                value={mode}
                onChange={setMode}
                options={[
                  { value: "phone", label: "Phone" },
                  { value: "email", label: "Email" },
                ]}
              />
              {mode === "phone" ? (
                <Field label="Mobile number" htmlFor="phone">
                  <Input id="phone" className="tnum h-11" defaultValue="01711-908233" inputMode="tel" autoComplete="tel" />
                </Field>
              ) : (
                <Field label="Work email" htmlFor="email">
                  <Input id="email" className="h-11" defaultValue="sharmin.haque@meridian.example" type="email" autoComplete="email" />
                </Field>
              )}
              <Button type="submit" size="lg" className="w-full">
                Send code <ArrowRight />
              </Button>
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              <Field label="6-digit code" hint="Sent to 01711-908233 · resend in 0:38" htmlFor="otp">
                <Input
                  id="otp"
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => verify(e.target.value.replace(/\D/g, ""))}
                  className="tnum h-12 text-center text-h2 tracking-[0.5em]"
                  placeholder="••••••"
                />
              </Field>
              <Button size="lg" className="w-full" disabled={busy} onClick={() => verify("123456")}>
                {busy ? <Loader2 className="animate-spin" /> : null} {busy ? "Signing in…" : "Verify (demo: auto-fill)"}
              </Button>
              <button className="text-small font-medium text-teal-700 hover:underline" onClick={() => setStep("id")}>
                Use a different number
              </button>
            </div>
          )}

          <div className="my-6 flex items-center gap-3">
            <Divider className="flex-1" />
            <span className="text-caption text-slate-500">or</span>
            <Divider className="flex-1" />
          </div>
          <Button variant="secondary" size="lg" className="w-full" onClick={() => router.push("/o/role")}>
            <Building2 /> Sign in with hospital SSO
          </Button>
          <p className="mt-6 flex items-center gap-1.5 text-caption text-slate-500">
            <ShieldCheck className="size-3.5" /> Access is role-based and every record view is logged.
          </p>
        </div>
        <p className="text-caption text-slate-400">© 2026 Helpix · Privacy · Terms</p>
      </div>

      <div className="relative hidden overflow-hidden bg-brand-deep lg:block">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <circle cx="480" cy="160" r="260" fill={tokens.teal[800]} />
          <circle cx="120" cy="720" r="200" fill={tokens.teal[800]} />
          <path d="M120 520 C 220 420, 300 440, 360 360 S 470 220, 520 190" fill="none" stroke={tokens.teal[500]} strokeWidth="4" strokeLinecap="round" />
          <path d="M500 175 L520 190 L505 212" fill="none" stroke={tokens.teal[500]} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="relative flex h-full flex-col justify-end p-16 text-white">
          <p className="text-display font-semibold leading-tight">We show hospitals the revenue walking out their door, and bring it back.</p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-6">
            <div>
              <p className="tnum text-kpi font-semibold">71%</p>
              <p className="text-small text-teal-100">tests captured in-house, up from 58%</p>
            </div>
            <div>
              <p className="tnum text-kpi font-semibold">1,140</p>
              <p className="text-small text-teal-100">chamber slots freed this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, UserCheck, FlaskConical, FileText, CornerDownLeft, Phone, Clock } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Field, Input, Select, Kbd, SectionLabel, Banner } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Chip, Segmented, DatePicker } from "@/components/ui/controls";
import { doctors, departments } from "@/data/mock";
import { cn } from "@/lib/utils";

const known = { phone: "01716-554210", name: "Nurjahan Begum", age: "50", sex: "F", id: "MSH-229014" };

export default function NewBooking() {
  const router = useRouter();
  const [phone, setPhone] = React.useState("");
  const found = phone.replace(/\D/g, "").startsWith("01716554");
  const [doc, setDoc] = React.useState("farhana");
  const [date, setDate] = React.useState(new Date(2026, 10, 19));
  const [reason, setReason] = React.useState("Lipid report follow-up, dizziness");
  const [sex, setSex] = React.useState<"F" | "M">("F");
  const phoneRef = React.useRef<HTMLInputElement>(null);

  const confirm = React.useCallback(() => router.push("/f/queue?new=17"), [router]);

  React.useEffect(() => {
    phoneRef.current?.focus();
    const h = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) confirm();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [confirm]);

  return (
    <AppShell surface="frontdesk" title="New booking" subtitle="Phone booking · search by mobile number first">
      <div className="grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              confirm();
            }}
          >
            <CardBody className="space-y-5">
              <div>
                <Field label="Caller's mobile number" hint={found ? undefined : "Try 01716-554210 for an existing patient"}>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      ref={phoneRef}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXX-XXXXXX"
                      className="tnum h-11 pl-9 text-h3"
                      inputMode="tel"
                      aria-label="Mobile number"
                    />
                    {found && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Badge tone="success" icon={UserCheck}>Existing patient · {known.id}</Badge>
                      </span>
                    )}
                  </div>
                </Field>
              </div>
              <div className="grid grid-cols-6 gap-4">
                <Field label="Patient name" className="col-span-3">
                  <Input value={found ? known.name : ""} readOnly={found} placeholder="Full name" className={cn(found && "bg-teal-50/50")} />
                </Field>
                <Field label="Age" className="col-span-1">
                  <Input value={found ? known.age : ""} readOnly={found} className={cn("tnum", found && "bg-teal-50/50")} />
                </Field>
                <Field label="Sex" className="col-span-2">
                  <Segmented value={sex} onChange={setSex} className="w-full" options={[{ value: "F", label: "Female" }, { value: "M", label: "Male" }]} />
                </Field>
                <Field label="Doctor" className="col-span-3">
                  <Select value={doc} onChange={(e) => setDoc(e.target.value)}>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} · {departments.find((x) => x.id === d.dept)?.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Date" className="col-span-3">
                  <DatePicker value={date} onChange={setDate} />
                </Field>
                <div className="col-span-6">
                  <SectionLabel className="mb-2">Serial (auto-suggested next available)</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    <Chip selected>
                      <span className="tnum">17 · ~7:45 PM</span>
                    </Chip>
                    <Chip>
                      <span className="tnum">19 · ~8:05 PM</span>
                    </Chip>
                    <Chip>
                      <span className="tnum">22 · ~8:35 PM</span>
                    </Chip>
                    <Chip disabled>18 · held for walk-ins</Chip>
                  </div>
                </div>
                <Field label="Reason for visit" className="col-span-6">
                  <Input value={reason} onChange={(e) => setReason(e.target.value)} />
                </Field>
              </div>
              <Banner tone="info" icon={Clock}>
                Dr. Rahman is running 15 min late. The patient will be told “around 7:45 PM” and get live updates on WhatsApp.
              </Banner>
            </CardBody>
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
              <p className="flex items-center gap-3 text-caption text-slate-500">
                <span className="flex items-center gap-1">
                  <Kbd>Tab</Kbd> next field
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>Enter</Kbd> confirm
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>Esc</Kbd> clear
                </span>
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" type="button" onClick={() => setPhone("")}>
                  Clear
                </Button>
                <Button type="submit" size="lg">
                  Confirm booking <CornerDownLeft />
                </Button>
              </div>
            </div>
          </form>
        </Card>

        <div className="col-span-12 space-y-4 lg:col-span-4">
          {found ? (
            <>
              <Card>
                <CardHeader title="Last visits" icon={FileText} />
                <CardBody className="space-y-2">
                  {[
                    ["12 Aug 2026", "Dr. Farhana Rahman", "Dyslipidemia, vertigo"],
                    ["2 Mar 2026", "Dr. Tanvir Ahmed", "Palpitation · ECG normal"],
                  ].map(([d, doc, n]) => (
                    <div key={d} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-body font-medium">{d}</p>
                      <p className="text-small text-slate-500">
                        {doc} · {n}
                      </p>
                    </div>
                  ))}
                </CardBody>
              </Card>
              <Card className="border-warning/40">
                <CardHeader title="Pending tests" icon={FlaskConical} description="Prescribed 12 Aug, not done in our lab" />
                <CardBody className="space-y-2">
                  {["Lipid Profile · ৳ 1,200", "TSH · ৳ 900"].map((t) => (
                    <div key={t} className="flex items-center justify-between text-body">
                      {t} <Badge tone="warning">Not booked</Badge>
                    </div>
                  ))}
                  <Button size="sm" variant="secondary" className="mt-1 w-full">
                    Offer to book with this visit
                  </Button>
                </CardBody>
              </Card>
            </>
          ) : (
            <Card className="p-6 text-center">
              <Search className="mx-auto size-6 text-slate-400" strokeWidth={1.5} />
              <p className="mt-2 text-body font-medium">Patient history appears here</p>
              <p className="text-small text-slate-500">Type the caller's number to find an existing patient.</p>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}

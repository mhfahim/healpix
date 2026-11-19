"use client";
import { CloudUpload as KCloudUpload, LogOut as KLogOut, Wallet as KWallet } from "lucide-react";
import { ArrowRight, Info, MessageSquareQuote } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Badge, Banner } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { DataTable, KpiCard, TickMeter } from "@/components/ui/data";
import { Donut, SimpleBars, Legendary } from "@/components/ui/charts";
import { leakReasons, metrics, outsideLabs, priceGap } from "@/data/mock";
import { categorical, tokens } from "@/lib/tokens";
import { bdt, num } from "@/lib/utils";

export default function LeakInsights() {
  const totalUploads = outsideLabs.reduce((s, l) => s + l.uploads, 0);
  return (
    <AppShell surface="management" title="Leak insights" subtitle="Where patients took their tests, and why · November 2026" management>
      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard icon={KLogOut} tone="peach" label="Estimated leaked tests" value={num(metrics.leaked)} delta="-2.7%" deltaTone="down-good" sub="vs. Oct" />
        <KpiCard icon={KWallet} tone="rose" label="Estimated value leaked" value={bdt(metrics.leaked * metrics.avgOrder)} sub="at ৳ 2,000 avg order" />
        <KpiCard icon={KCloudUpload} tone="sky" label="Outside reports uploaded" value={num(totalUploads)} sub="for remote review" />
        <Card className="p-5">
          <p className="text-small font-medium text-slate-600">Reason coverage</p>
          <p className="tnum mt-1 text-kpi font-semibold">{metrics.reasonsKnownPct}%</p>
          <TickMeter value={metrics.reasonsKnownPct} ticks={32} height={24} className="mt-3" label="Reasons known" />
          <p className="mt-1.5 text-caption text-slate-500">Reasons known for 64% of leaked tests</p>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <Card className="col-span-12 lg:col-span-5">
          <CardHeader title="Why patients left" description="Patient-reported, when uploading an outside report or replying to a reminder" />
          <CardBody>
            <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
              <Donut data={leakReasons.map((r) => ({ name: r.reason, value: r.value }))} centerValue="41%" centerLabel="Price" height={220} hatchIndex={4} />
              <ul className="space-y-2">
                {leakReasons.map((r, i) => (
                  <li key={r.reason} className="flex items-center justify-between gap-2 text-body">
                    <span className="flex items-center gap-2">
                      <span className={i === 4 ? "hatch size-2.5 rounded-[3px] bg-slate-100 text-slate-400" : "size-2.5 rounded-full"} style={i === 4 ? undefined : { background: categorical[i] }} />
                      {r.reason}
                    </span>
                    <span className="tnum font-semibold">{r.value}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>

        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            title="Top outside labs"
            description="Patient-reported"
            action={<Legendary items={[{ label: "Outside report uploads", color: tokens.chart.leaked }]} />}
          />
          <CardBody>
            <SimpleBars data={outsideLabs} dataKey="uploads" nameKey="lab" layout="vertical" height={200} />
            <p className="mt-3 flex items-center gap-1.5 text-caption text-slate-500">
              <Info className="size-3.5" /> Based on outside reports uploaded for remote review. Lab names are as reported by patients.
            </p>
          </CardBody>
        </Card>

        <Card className="col-span-12 overflow-hidden lg:col-span-8">
          <CardHeader title="Price gap" description="Our price vs. average price reported for the same test outside" action={<Button size="sm" href="/m/recovery?create=1">Create recovery action <ArrowRight /></Button>} />
          <div className="mt-3">
            <DataTable
              rows={priceGap}
              rowKey={(r) => r.test}
              defaultSort={{ key: "leak", dir: "desc" }}
              columns={[
                { key: "test", header: "Test", cell: (r) => <span className="font-medium">{r.test}</span>, sort: (r) => r.test },
                { key: "ours", header: "Our price", align: "right", cell: (r) => bdt(r.ours), sort: (r) => r.ours },
                { key: "outside", header: "Avg. outside price", align: "right", cell: (r) => bdt(r.outside), sort: (r) => r.outside },
                {
                  key: "gap",
                  header: "Gap",
                  align: "right",
                  cell: (r) => (
                    <span className="font-medium text-danger-fg">
                      +{bdt(r.gap)} <span className="text-caption text-slate-500">({Math.round((r.gap / r.outside) * 100)}%)</span>
                    </span>
                  ),
                  sort: (r) => r.gap,
                },
                {
                  key: "leak",
                  header: "Leak rate",
                  align: "right",
                  cell: (r) => (
                    <Badge tone={r.leakRate >= 40 ? "danger" : r.leakRate >= 30 ? "warning" : "neutral"}>{r.leakRate}%</Badge>
                  ),
                  sort: (r) => r.leakRate,
                },
              ]}
            />
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader title="What patients said" icon={MessageSquareQuote} description="Recent free-text reasons (translated)" />
          <CardBody className="space-y-3">
            {[
              ["Lipid Profile", "“Northgate is ৳ 300 cheaper and near my house.”", "Price"],
              ["Echocardiogram", "“My cousin works at Riverside, report comes same evening.”", "Faster report"],
              ["USG Whole Abdomen", "“I didn't know you did home collection.”", "Closer to home"],
            ].map(([t, q, r]) => (
              <div key={q} className="rounded-lg border border-slate-200 p-3">
                <p className="text-body text-slate-900">{q}</p>
                <p className="mt-1.5 flex items-center gap-2 text-caption text-slate-500">
                  {t} <Badge tone="neutral" size="sm">{r}</Badge>
                </p>
              </div>
            ))}
            <Banner tone="info">Reasons come only from patients who chose to say. 36% of leaked tests have no reason yet.</Banner>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}

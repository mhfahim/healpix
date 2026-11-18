"use client";
import { ShieldCheck, Lock, Building2 } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { Card, CardHeader, CardBody, Banner, EmptyState } from "@/components/ui/primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/controls";
import { BenchmarkRow } from "@/components/ui/charts";
import { KpiCard } from "@/components/ui/data";
import { benchmark, benchmarkCategory } from "@/data/mock";

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-caption text-slate-500">
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-full border-2 border-white bg-chart-captured ring-1 ring-teal-700" /> Your hospital
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-6 rounded-sm bg-slate-200" /> Peer range P25–P75
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-3 w-0.5 bg-chart-baseline" /> Peer median
      </span>
    </div>
  );
}

function Scale() {
  return (
    <div className="grid grid-cols-[180px_1fr_72px] gap-4 border-b border-slate-200 pb-1">
      <span />
      <div className="tnum flex justify-between text-caption text-slate-400">
        {[40, 50, 60, 70, 80, 90].map((v) => (
          <span key={v}>{v}%</span>
        ))}
      </div>
      <span className="text-right text-caption text-slate-500">You</span>
    </div>
  );
}

export default function Benchmark({ searchParams }: { searchParams: { state?: string } }) {
  const locked = searchParams.state === "empty";
  return (
    <AppShell surface="management" title="Peer benchmark" subtitle="Capture rate compared with similar private hospitals in Dhaka" management>
      {locked ? (
        <Card>
          <EmptyState
            icon={Lock}
            title="Benchmark unlocks when 3 or more hospitals are live"
            body="We compare your capture rate only against anonymized peers. 2 hospitals are live on Helpix in your region so far, so there isn't enough data to protect everyone's privacy yet."
          />
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <KpiCard label="Your capture rate" value="71%" sub="all departments" />
            <KpiCard label="Peer median" value="66%" sub="11 hospitals" deltaTone="neutral" />
            <KpiCard label="Your percentile" value="P72" sub="above 72% of peers" />
            <KpiCard label="Departments above P75" value="4 of 7" />
          </div>
          <Banner tone="info" icon={ShieldCheck} className="mt-6" title="Peer data is anonymized. No hospital names are shared.">
            Peers: 11 private hospitals and diagnostic chains with 100–400 beds. Bands are shown only when at least 3 hospitals contribute.
          </Banner>
          <Card className="mt-6">
            <Tabs defaultValue="dept">
              <div className="flex items-center justify-between px-5 pt-2">
                <TabsList className="border-0">
                  <TabsTrigger value="dept">
                    <Building2 className="size-4" /> By department
                  </TabsTrigger>
                  <TabsTrigger value="cat">By test category</TabsTrigger>
                </TabsList>
                <Legend />
              </div>
              <CardBody className="border-t border-slate-200">
                <TabsContent value="dept">
                  <Scale />
                  {benchmark.map((b) => (
                    <BenchmarkRow key={b.name} {...b} />
                  ))}
                </TabsContent>
                <TabsContent value="cat">
                  <Scale />
                  {benchmarkCategory.map((b) => (
                    <BenchmarkRow key={b.name} {...b} />
                  ))}
                </TabsContent>
              </CardBody>
            </Tabs>
          </Card>
          <p className="mt-3 text-caption text-slate-500">Green: at or above peer P75. Red: below peer P25. Updated weekly.</p>
        </>
      )}
    </AppShell>
  );
}

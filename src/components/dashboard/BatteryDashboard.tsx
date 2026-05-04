"use client";

import { EventLog } from "@/components/dashboard/EventLog";
import { Header } from "@/components/dashboard/Header";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { SystemHealth } from "@/components/dashboard/SystemHealth";
import { TelemetryChart } from "@/components/dashboard/TelemetryChart";
import { BatterySimProvider } from "@/hooks/useBatterySim";
import type { BatteryDashboardProps } from "@/types/battery";

export function BatteryDashboard({ seededAt }: BatteryDashboardProps) {
  return (
    <BatterySimProvider seededAt={seededAt}>
      <div className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-mask opacity-[0.28]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_22rem),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_26rem)]" />
        <div className="pointer-events-none absolute left-[-8rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-emerald-500/[0.08] blur-[140px]" />
        <div className="pointer-events-none absolute bottom-[-10rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/[0.08] blur-[160px]" />

        <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <Header seededAt={seededAt} />
          <StatsGrid />
          <SystemHealth />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
            <TelemetryChart />
            <EventLog />
          </div>
        </main>
      </div>
    </BatterySimProvider>
  );
}

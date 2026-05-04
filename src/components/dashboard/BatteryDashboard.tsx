"use client";

import { useEffect, useState } from "react";

import { EventLog } from "@/components/dashboard/EventLog";
import { Header } from "@/components/dashboard/Header";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { TelemetryChart } from "@/components/dashboard/TelemetryChart";
import { useBatterySim } from "@/hooks/useBatterySim";
import type { BatteryDashboardProps } from "@/types/battery";

export function BatteryDashboard({ seededAt }: BatteryDashboardProps) {
  const { currentReading, history, events } = useBatterySim(seededAt);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date(seededAt));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-mask opacity-[0.16]" />
      <div className="pointer-events-none absolute left-[-8rem] top-[-8rem] h-[24rem] w-[24rem] rounded-full bg-emerald-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-10rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-blue-500/10 blur-[160px]" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Header currentTime={currentTime} />
        <StatsGrid reading={currentReading} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <TelemetryChart history={history} />
          <EventLog events={events} />
        </div>
      </main>
    </div>
  );
}

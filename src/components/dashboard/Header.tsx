import { Activity, BatteryCharging, Clock3 } from "lucide-react";

import type { HeaderProps } from "@/types/battery";

const formatSystemTime = (value: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(value);
};

export function Header({ currentTime }: HeaderProps) {
  return (
    <header className="panel relative overflow-hidden p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-panel">
              <BatteryCharging className="h-6 w-6 text-emerald-400" />
            </div>

            <div>
              <p className="eyebrow">IoT Battery Monitoring Dashboard</p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">VoltStream</h1>
            </div>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
            High-fidelity pack telemetry for voltage, thermal load, charge state, and live current behavior.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Telemetry
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/70 px-3.5 py-1.5 text-xs text-zinc-400">
              <Activity className="h-3.5 w-3.5 text-blue-400" />
              2s sampling cadence
            </div>
          </div>
        </div>

        <div className="min-w-[280px] rounded-3xl border border-zinc-800/80 bg-zinc-950/75 p-5 shadow-panel">
          <p className="eyebrow">Current System Time</p>
          <time
            className="numeric mt-3 block text-2xl font-semibold tracking-tight text-zinc-50 sm:text-[1.75rem]"
            dateTime={currentTime.toISOString()}
            suppressHydrationWarning
          >
            {formatSystemTime(currentTime)}
          </time>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-400">
            <Clock3 className="h-4 w-4 text-zinc-500" />
            Synced to local runtime
          </div>
        </div>
      </div>
    </header>
  );
}

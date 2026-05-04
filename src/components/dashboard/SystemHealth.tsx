"use client";

import { memo } from "react";
import { Gauge, ShieldAlert, ShieldCheck } from "lucide-react";

import { useBatteryHealth } from "@/hooks/useBatterySim";

const fillTone = (packHealth: number): string => {
  if (packHealth < 90) {
    return "from-red-500 to-amber-500";
  }

  if (packHealth < 95) {
    return "from-amber-500 to-emerald-500";
  }

  return "from-emerald-500 to-blue-500";
};

export const SystemHealth = memo(function SystemHealth() {
  const health = useBatteryHealth();
  const isWarning = health.status !== "Nominal";
  const statusIconClass = isWarning ? "text-amber-300" : "text-emerald-300";
  const StatusIcon = isWarning ? ShieldAlert : ShieldCheck;

  return (
    <section className="panel p-6 sm:p-7">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow">Lifecycle Model</p>
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">System Health</h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/76 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">
              <Gauge className="h-3.5 w-3.5 text-blue-400" />
              Degradation Watch
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Pack health blends observed thermal stress, current throughput, and reserve cycling into a live degradation estimate.
          </p>
        </div>

        <div className="w-full max-w-3xl rounded-[1.5rem] border border-slate-300/80 bg-white/76 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-slate-50/90 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">
                <StatusIcon className={`h-3.5 w-3.5 ${statusIconClass}`} />
                {health.status}
              </div>
              <p className="mt-3 text-sm text-slate-500">Degradation score tracks irreversible wear against pack service life.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[320px]">
              <div>
                <p className="eyebrow">Pack Health</p>
                <p className="numeric-hardware mt-2 text-2xl font-semibold text-slate-950">{health.packHealth.toFixed(2)}%</p>
              </div>
              <div>
                <p className="eyebrow">Stress Index</p>
                <p className="numeric mt-2 text-2xl font-semibold text-slate-950">{health.stressIndex.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-slate-500">
              <span>Battery degradation</span>
              <span className="numeric">{health.degradation.toFixed(2)}% wear</span>
            </div>

            <div className="relative h-4 overflow-hidden rounded-full border border-slate-300/80 bg-slate-100">
              <div
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${fillTone(health.packHealth)}`}
                style={{ width: `${health.packHealth}%` }}
              >
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.22)_0_10px,transparent_10px_18px)] opacity-50" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.18em] text-slate-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

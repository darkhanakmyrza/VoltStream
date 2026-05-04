"use client";

import { useEffect, useState } from "react";
import { Activity, BatteryCharging, CheckCheck, Clock3, Download } from "lucide-react";

import type { DownloadToastProps, HeaderProps } from "@/types/battery";

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

function DownloadToast({ message }: DownloadToastProps) {
  if (message === null) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-emerald-500/25 bg-white/85 p-4 shadow-[0_22px_80px_rgba(148,163,184,0.28)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2">
          <CheckCheck className="h-4 w-4 text-emerald-600" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">Report staging started</p>
          <p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
        </div>
      </div>
    </div>
  );
}

export function Header({ seededAt }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date(seededAt));
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastCycle, setToastCycle] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (toastMessage === null) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setToastMessage(null);
    }, 2800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [toastCycle, toastMessage]);

  const handleDownloadReport = () => {
    setToastMessage("Latest telemetry packet queued with the current chart window and event log.");
    setToastCycle((previousCycle) => previousCycle + 1);
  };

  return (
    <>
      <header className="panel relative overflow-hidden p-6 sm:p-7">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-emerald-500/10 to-transparent" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-300/80 bg-white/75 shadow-panel">
                <BatteryCharging className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <p className="eyebrow">IoT Battery Monitoring Dashboard</p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">VoltStream</h1>
              </div>
            </div>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              High-fidelity pack telemetry for voltage, thermal load, charge state, and live current behavior.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/72 px-3.5 py-1.5 text-xs text-slate-600">
                <Activity className="h-3.5 w-3.5 text-blue-500" />
                2s sampling cadence
              </div>

              <button
                type="button"
                onClick={handleDownloadReport}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/78 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-700 transition hover:border-emerald-400/45 hover:bg-emerald-50 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              >
                <Download className="h-3.5 w-3.5 text-emerald-600" />
                Download Report
              </button>
            </div>
          </div>

          <div className="min-w-[280px] rounded-3xl border border-slate-300/80 bg-white/78 p-5 shadow-panel">
            <p className="eyebrow">Current System Time</p>
            <time
              className="numeric mt-3 block text-2xl font-semibold tracking-tight text-slate-950 sm:text-[1.75rem]"
              dateTime={currentTime.toISOString()}
              suppressHydrationWarning
            >
              {formatSystemTime(currentTime)}
            </time>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
              <Clock3 className="h-4 w-4 text-slate-500" />
              Synced to local runtime
            </div>
          </div>
        </div>
      </header>

      <DownloadToast message={toastMessage} />
    </>
  );
}

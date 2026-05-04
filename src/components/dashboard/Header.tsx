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
    <div className="fixed bottom-6 right-6 z-50 w-[min(360px,calc(100vw-2rem))] rounded-2xl border border-emerald-500/25 bg-[#0f1821]/85 p-4 shadow-[0_22px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2">
          <CheckCheck className="h-4 w-4 text-emerald-300" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-100">Report staging started</p>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{message}</p>
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#24313d] bg-[#0b1218]/90 shadow-panel">
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

              <div className="inline-flex items-center gap-2 rounded-full border border-[#24313d] bg-[#0b1218]/80 px-3.5 py-1.5 text-xs text-zinc-400">
                <Activity className="h-3.5 w-3.5 text-blue-400" />
                2s sampling cadence
              </div>

              <button
                type="button"
                onClick={handleDownloadReport}
                className="inline-flex items-center gap-2 rounded-full border border-[#2a3947] bg-[#0d151d]/85 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-200 transition hover:border-emerald-400/45 hover:bg-[#121c25] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              >
                <Download className="h-3.5 w-3.5 text-emerald-300" />
                Download Report
              </button>
            </div>
          </div>

          <div className="min-w-[280px] rounded-3xl border border-[#22303d] bg-[#0b1218]/82 p-5 shadow-panel">
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

      <DownloadToast message={toastMessage} />
    </>
  );
}

"use client";

import { memo } from "react";
import { ShieldCheck } from "lucide-react";

import { useBatteryEvents } from "@/hooks/useBatterySim";
import type { EventSeverity } from "@/types/battery";

const severityStyles: Record<EventSeverity, string> = {
  info: "border-blue-500/25 bg-blue-500/[0.08] text-blue-300",
  success: "border-emerald-500/25 bg-emerald-500/[0.08] text-emerald-300",
  warning: "border-amber-500/25 bg-amber-500/[0.08] text-amber-300",
  critical: "border-red-500/25 bg-red-500/[0.08] text-red-300",
};

const severityDotStyles: Record<EventSeverity, string> = {
  info: "bg-blue-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  critical: "bg-red-400",
};

export const EventLog = memo(function EventLog() {
  const events = useBatteryEvents();

  return (
    <aside className="panel flex min-h-[420px] flex-col p-6 sm:p-7">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Diagnostics Stream</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-50">Event Log</h2>
        </div>

        <div className="rounded-2xl border border-[#24313d] bg-[#0b1218]/80 px-4 py-3 text-right">
          <div className="numeric text-lg font-semibold text-zinc-100">{events.length.toString().padStart(2, "0")}</div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">Entries</div>
        </div>
      </div>

      <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#24313d] bg-[#0b1218]/75 px-3.5 py-1.5 text-xs uppercase tracking-[0.18em] text-zinc-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
        Monitoring Active
      </div>

      <div className="volt-scrollbar -mr-2 flex-1 space-y-3 overflow-auto pr-2">
        {events.map((event) => (
          <article key={event.id} className="rounded-2xl border border-[#22303d]/90 bg-[#0b1218]/72 p-4">
            <div className="flex items-start gap-3">
              <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${severityDotStyles[event.severity]}`} />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium leading-6 text-zinc-100">{event.message}</p>
                  <time className="numeric shrink-0 text-xs text-zinc-500">{event.timestamp.slice(11, 19)}</time>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.18em] ${severityStyles[event.severity]}`}>
                    {event.severity}
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">Battery Cluster</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
});

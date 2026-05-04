"use client";

import { memo, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Activity } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useBatteryHistory } from "@/hooks/useBatterySim";
import type { TelemetryTooltipProps } from "@/types/battery";

const chartMonoFont = "'JetBrains Mono', 'Geist Mono', 'IBM Plex Mono', monospace";

const formatChartTime = (timestamp: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
};

function TelemetryTooltip({ active, label, payload }: TelemetryTooltipProps) {
  if (!active || payload === undefined || payload.length === 0) {
    return null;
  }

  return (
    <div className="min-w-[196px] rounded-2xl border border-slate-300/80 bg-white/88 p-3 shadow-[0_24px_60px_rgba(148,163,184,0.28)] backdrop-blur-xl">
      <p className="numeric text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className="mt-3 space-y-2">
        {payload.map((item, index) => (
          <div key={`${item.name ?? "metric"}-${index}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color ?? "#3b82f6" }} />
              <span className="text-sm text-slate-700">{item.name}</span>
            </div>
            <span className="numeric text-sm font-medium text-slate-950">
              {Number(item.value ?? 0).toFixed(2)} {item.name === "Voltage" ? "V" : "°C"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const TelemetryChart = memo(function TelemetryChart() {
  const history = useBatteryHistory();
  const deferredHistory = useDeferredValue(history);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    return deferredHistory.map((reading) => ({
      ...reading,
      label: mounted ? formatChartTime(reading.timestamp) : reading.timestamp.slice(11, 19),
    }));
  }, [deferredHistory, mounted]);

  return (
    <section className="panel p-6 sm:p-7">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Historical Telemetry</p>
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Voltage vs Temperature</h2>
            <span className="rounded-full border border-slate-300/80 bg-white/76 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-600">
              20 Point Buffer
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">Dual-axis trend view across the most recent 20 live telemetry samples.</p>
        </div>

        <div className="hidden rounded-2xl border border-slate-300/80 bg-white/74 p-3 text-sm text-slate-600 lg:block">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            Smooth telemetry stream
          </div>
        </div>
      </div>

      {mounted ? (
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.5)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                minTickGap={24}
                tick={{ fill: "#64748b", fontSize: 12, fontFamily: chartMonoFont }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                width={52}
                domain={[3.2, 4.2]}
                tickFormatter={(value: number | string) => `${Number(value).toFixed(2)}V`}
                tick={{ fill: "#93c5fd", fontSize: 12, fontFamily: chartMonoFont }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={56}
                domain={[20, 60]}
                tickFormatter={(value: number | string) => `${Number(value).toFixed(2)}°`}
                tick={{ fill: "#6ee7b7", fontSize: 12, fontFamily: chartMonoFont }}
              />
              <Tooltip
                cursor={{ stroke: "rgba(100, 116, 139, 0.9)", strokeDasharray: "4 4" }}
                content={<TelemetryTooltip />}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  color: "#475569",
                  fontSize: "12px",
                  paddingBottom: "20px",
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="voltage"
                name="Voltage"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: "#60a5fa" }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 0, fill: "#34d399" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-[380px] items-center justify-center rounded-3xl border border-dashed border-slate-300/80 bg-white/70 text-sm text-slate-500">
          Initializing live chart renderer...
        </div>
      )}
    </section>
  );
});

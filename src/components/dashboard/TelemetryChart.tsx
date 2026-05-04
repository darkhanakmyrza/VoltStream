"use client";

import { useEffect, useMemo, useState } from "react";
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

import type { TelemetryChartProps } from "@/types/battery";

const formatChartTime = (timestamp: string): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(timestamp));
};

export function TelemetryChart({ history }: TelemetryChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = useMemo(() => {
    return history.map((reading) => ({
      ...reading,
      label: mounted ? formatChartTime(reading.timestamp) : reading.timestamp.slice(11, 19),
    }));
  }, [history, mounted]);

  return (
    <section className="panel p-6 sm:p-7">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Historical Telemetry</p>
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-50">Voltage vs Temperature</h2>
            <span className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1 text-xs uppercase tracking-[0.18em] text-zinc-400">
              20 Point Buffer
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-400">Dual-axis trend view across the most recent 20 live telemetry samples.</p>
        </div>

        <div className="hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3 text-sm text-zinc-400 lg:block">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-400" />
            Smooth telemetry stream
          </div>
        </div>
      </div>

      {mounted ? (
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="rgba(63, 63, 70, 0.55)" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                minTickGap={24}
                tick={{ fill: "#a1a1aa", fontSize: 12, fontFamily: "var(--font-mono)" }}
              />
              <YAxis
                yAxisId="left"
                axisLine={false}
                tickLine={false}
                width={52}
                domain={[3.2, 4.2]}
                tickFormatter={(value: number | string) => `${Number(value).toFixed(2)}V`}
                tick={{ fill: "#93c5fd", fontSize: 12, fontFamily: "var(--font-mono)" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                width={56}
                domain={[20, 60]}
                tickFormatter={(value: number | string) => `${Number(value).toFixed(2)}°`}
                tick={{ fill: "#6ee7b7", fontSize: 12, fontFamily: "var(--font-mono)" }}
              />
              <Tooltip
                cursor={{ stroke: "rgba(82, 82, 91, 0.9)", strokeDasharray: "4 4" }}
                contentStyle={{
                  backgroundColor: "rgba(24, 24, 27, 0.96)",
                  border: "1px solid rgba(63, 63, 70, 0.85)",
                  borderRadius: "18px",
                  boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
                }}
                itemStyle={{ color: "#e4e4e7" }}
                labelStyle={{ color: "#a1a1aa", fontFamily: "var(--font-mono)" }}
                formatter={(value: number | string, name: string) => {
                  return [
                    `${Number(value).toFixed(2)} ${name === "Voltage" ? "V" : "°C"}`,
                    name,
                  ];
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  color: "#d4d4d8",
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
        <div className="flex h-[380px] items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/50 text-sm text-zinc-500">
          Initializing live chart renderer...
        </div>
      )}
    </section>
  );
}

"use client";

import { memo } from "react";
import { Activity, BatteryFull, Thermometer, Zap } from "lucide-react";

import { useBatteryMetric } from "@/hooks/useBatterySim";
import type { MetricCardProps, MetricTone } from "@/types/battery";

const toneStyles: Record<MetricTone, string> = {
  data: "border-blue-500/20 bg-blue-500/[0.08] text-blue-700",
  safe: "border-emerald-500/20 bg-emerald-500/[0.08] text-emerald-700",
  warning: "border-amber-500/30 bg-amber-500/[0.12] text-amber-700",
  critical: "border-red-500/30 bg-red-500/[0.12] text-red-700",
};

const valueStyles: Record<MetricTone, string> = {
  data: "text-blue-700",
  safe: "text-emerald-700",
  warning: "text-amber-700",
  critical: "text-red-700",
};

const panelBorderStyles: Record<MetricTone, string> = {
  data: "border-slate-300/80",
  safe: "border-slate-300/80",
  warning: "border-amber-500/45",
  critical: "border-red-500/45",
};

const formatValue = (value: number): string => {
  return value.toFixed(2);
};

const metricCards: MetricCardProps[] = [
  {
    title: "Voltage",
    metricKey: "voltage",
    unit: "V",
    icon: Zap,
  },
  {
    title: "Temperature",
    metricKey: "temperature",
    unit: "°C",
    icon: Thermometer,
  },
  {
    title: "State Of Charge",
    metricKey: "soc",
    unit: "%",
    icon: BatteryFull,
  },
  {
    title: "Amperage",
    metricKey: "current",
    unit: "A",
    icon: Activity,
  },
];

const metricMeta = (metricKey: MetricCardProps["metricKey"], value: number): Pick<MetricCardProps, never> & {
  subtitle: string;
  tone: MetricTone;
} => {
  switch (metricKey) {
    case "voltage":
      return {
        tone: value < 3.4 || value > 4.12 ? "warning" : "data",
        subtitle:
          value < 3.4
            ? "Pack voltage is trending near the low threshold."
            : "Pack voltage is operating in the nominal window.",
      };
    case "temperature":
      return {
        tone: value > 55 ? "critical" : value > 50 ? "warning" : "safe",
        subtitle:
          value > 55
            ? "Critical thermal load detected. Immediate attention recommended."
            : value > 50
              ? "Thermal envelope elevated. Watch cooling and current throughput."
              : "Thermal envelope remains stable under present load.",
      };
    case "soc":
      return {
        tone: value < 15 ? "warning" : "safe",
        subtitle:
          value < 15
            ? "Remaining capacity is entering the reserve band."
            : "Available charge capacity is within the active operating band.",
      };
    case "current":
      return {
        tone: Math.abs(value) > 38 ? "warning" : "data",
        subtitle:
          value >= 0
            ? "Positive current indicates an active charging condition."
            : "Negative current indicates a live downstream load draw.",
      };
  }
};

const MetricCard = memo(function MetricCard({ title, metricKey, unit, icon: Icon }: MetricCardProps) {
  const value = useBatteryMetric(metricKey);
  const { subtitle, tone } = metricMeta(metricKey, value);

  return (
    <article className={`panel relative overflow-hidden p-5 sm:p-6 ${panelBorderStyles[tone]}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{title}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className={`numeric-hardware text-3xl font-semibold tracking-tight sm:text-4xl ${valueStyles[tone]}`}>
              {formatValue(value)}
            </span>
            <span className="mb-1 font-mono text-sm uppercase tracking-[0.2em] text-slate-500">{unit}</span>
          </div>
        </div>

        <div className={`rounded-2xl border p-3 ${toneStyles[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-5 text-sm text-slate-600">{subtitle}</p>
    </article>
  );
});

export const StatsGrid = memo(function StatsGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </section>
  );
});

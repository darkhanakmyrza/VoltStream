import { Activity, BatteryFull, Thermometer, Zap } from "lucide-react";

import type { MetricCardProps, MetricTone, StatsGridProps } from "@/types/battery";

const toneStyles: Record<MetricTone, string> = {
  data: "border-blue-500/25 bg-blue-500/[0.06] text-blue-300",
  safe: "border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-300",
  warning: "border-amber-500/35 bg-amber-500/[0.08] text-amber-300",
  critical: "border-red-500/35 bg-red-500/[0.08] text-red-300",
};

const valueStyles: Record<MetricTone, string> = {
  data: "text-blue-300",
  safe: "text-emerald-300",
  warning: "text-amber-300",
  critical: "text-red-300",
};

const panelBorderStyles: Record<MetricTone, string> = {
  data: "border-zinc-800/80",
  safe: "border-zinc-800/80",
  warning: "border-amber-500/45",
  critical: "border-red-500/45",
};

const formatValue = (value: number): string => {
  return value.toFixed(2);
};

function MetricCard({ title, value, unit, subtitle, tone, icon: Icon }: MetricCardProps) {
  return (
    <article
      className={`panel relative overflow-hidden p-5 sm:p-6 ${panelBorderStyles[tone]}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{title}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className={`numeric text-3xl font-semibold tracking-tight sm:text-4xl ${valueStyles[tone]}`}>
              {value}
            </span>
            <span className="mb-1 font-mono text-sm uppercase tracking-[0.2em] text-zinc-500">{unit}</span>
          </div>
        </div>

        <div className={`rounded-2xl border p-3 ${toneStyles[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-5 text-sm text-zinc-400">{subtitle}</p>
    </article>
  );
}

export function StatsGrid({ reading }: StatsGridProps) {
  const temperatureTone: MetricTone =
    reading.temperature > 55 ? "critical" : reading.temperature > 50 ? "warning" : "safe";

  const voltageTone: MetricTone =
    reading.voltage < 3.4 || reading.voltage > 4.12 ? "warning" : "data";

  const socTone: MetricTone = reading.soc < 15 ? "warning" : "safe";
  const currentTone: MetricTone = Math.abs(reading.current) > 38 ? "warning" : "data";

  const metrics: MetricCardProps[] = [
    {
      title: "Voltage",
      value: formatValue(reading.voltage),
      unit: "V",
      subtitle: reading.voltage < 3.4 ? "Pack voltage is trending near the low threshold." : "Pack voltage is operating in the nominal window.",
      tone: voltageTone,
      icon: Zap,
    },
    {
      title: "Temperature",
      value: formatValue(reading.temperature),
      unit: "°C",
      subtitle:
        reading.temperature > 55
          ? "Critical thermal load detected. Immediate attention recommended."
          : reading.temperature > 50
            ? "Thermal envelope elevated. Watch cooling and current throughput."
            : "Thermal envelope remains stable under present load.",
      tone: temperatureTone,
      icon: Thermometer,
    },
    {
      title: "State Of Charge",
      value: formatValue(reading.soc),
      unit: "%",
      subtitle: reading.soc < 15 ? "Remaining capacity is entering the reserve band." : "Available charge capacity is within the active operating band.",
      tone: socTone,
      icon: BatteryFull,
    },
    {
      title: "Amperage",
      value: formatValue(reading.current),
      unit: "A",
      subtitle:
        reading.current >= 0
          ? "Positive current indicates an active charging condition."
          : "Negative current indicates a live downstream load draw.",
      tone: currentTone,
      icon: Activity,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.title} {...metric} />
      ))}
    </section>
  );
}

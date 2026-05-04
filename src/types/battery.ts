import type { LucideIcon } from "lucide-react";

export interface BatteryReading {
  voltage: number;
  temperature: number;
  soc: number;
  current: number;
  timestamp: string;
}

export type EventSeverity = "info" | "success" | "warning" | "critical";

export interface BatteryEvent {
  id: string;
  message: string;
  severity: EventSeverity;
  timestamp: string;
}

export interface UseBatterySimResult {
  currentReading: BatteryReading;
  history: BatteryReading[];
  events: BatteryEvent[];
}

export interface BatteryDashboardProps {
  seededAt: number;
}

export interface HeaderProps {
  currentTime: Date;
}

export interface StatsGridProps {
  reading: BatteryReading;
}

export interface TelemetryChartProps {
  history: BatteryReading[];
}

export interface EventLogProps {
  events: BatteryEvent[];
}

export type MetricTone = "data" | "safe" | "warning" | "critical";

export interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  subtitle: string;
  tone: MetricTone;
  icon: LucideIcon;
}

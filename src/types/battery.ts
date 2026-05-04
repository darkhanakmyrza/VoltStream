import type { ReactNode } from "react";
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

export interface BatteryHealth {
  packHealth: number;
  degradation: number;
  stressIndex: number;
  status: "Nominal" | "Thermal Watch" | "Service Watch";
}

export interface BatterySnapshot {
  currentReading: BatteryReading;
  history: BatteryReading[];
  events: BatteryEvent[];
  health: BatteryHealth;
}

export interface BatteryStore {
  getSnapshot: () => BatterySnapshot;
  subscribe: (listener: () => void) => () => void;
  start: () => () => void;
}

export interface BatterySimProviderProps {
  seededAt: number;
  children: ReactNode;
}

export interface BatteryDashboardProps {
  seededAt: number;
}

export interface HeaderProps {
  seededAt: number;
}

export type BatteryMetricKey = keyof Pick<BatteryReading, "voltage" | "temperature" | "soc" | "current">;

export type MetricTone = "data" | "safe" | "warning" | "critical";

export interface MetricCardProps {
  title: string;
  metricKey: BatteryMetricKey;
  unit: string;
  icon: LucideIcon;
}

export interface DownloadToastProps {
  message: string | null;
}

export interface TelemetryTooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

export interface TelemetryTooltipProps {
  active?: boolean;
  label?: string;
  payload?: TelemetryTooltipPayloadItem[];
}

import { createContext, createElement, useContext, useEffect, useRef, useSyncExternalStore } from "react";

import type {
  BatteryEvent,
  BatteryHealth,
  BatteryMetricKey,
  BatteryReading,
  BatterySimProviderProps,
  BatterySnapshot,
  BatteryStore,
  EventSeverity,
} from "@/types/battery";

const HISTORY_LIMIT = 20;
const LOG_LIMIT = 18;
const TICK_MS = 2000;

type BatteryVector = Pick<BatteryReading, "voltage" | "temperature" | "soc" | "current">;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const createSeededRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;

    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const randomBetween = (min: number, max: number, randomSource: () => number = Math.random): number => {
  return randomSource() * (max - min) + min;
};

const round2 = (value: number): number => {
  return Number(value.toFixed(2));
};

const healthStatus = (packHealth: number, stressIndex: number): BatteryHealth["status"] => {
  if (packHealth < 90 || stressIndex > 75) {
    return "Service Watch";
  }

  if (packHealth < 95 || stressIndex > 55) {
    return "Thermal Watch";
  }

  return "Nominal";
};

const createSeedState = (randomSource: () => number = Math.random): BatteryVector => {
  const soc = round2(randomBetween(54, 88, randomSource));
  const current = round2(randomBetween(-18, 26, randomSource));
  const voltage = round2(
    clamp(3.25 + soc / 100 + current * 0.0014 + randomBetween(-0.03, 0.03, randomSource), 3.2, 4.2),
  );
  const temperature = round2(clamp(24 + Math.abs(current) * 0.45 + randomBetween(-2, 2, randomSource), 20, 60));

  return { voltage, temperature, soc, current };
};

const toReading = (snapshot: BatteryVector, timestamp: number): BatteryReading => {
  return {
    voltage: round2(snapshot.voltage),
    temperature: round2(snapshot.temperature),
    soc: round2(snapshot.soc),
    current: round2(snapshot.current),
    timestamp: new Date(timestamp).toISOString(),
  };
};

const deriveStressIndex = (reading: BatteryReading): number => {
  const thermalLoad = ((reading.temperature - 20) / 40) * 48;
  const amperageLoad = (Math.abs(reading.current) / 50) * 34;
  const reserveLoad = ((100 - reading.soc) / 100) * 18;

  return round2(clamp(thermalLoad + amperageLoad + reserveLoad, 0, 100));
};

const createInitialHealth = (reading: BatteryReading, seededAt: number): BatteryHealth => {
  const randomSource = createSeededRandom(seededAt ^ 0x6d2b79f5);
  const baselineWear = randomBetween(1.8, 5.4, randomSource);
  const thermalWear = (reading.temperature - 20) * 0.04;
  const currentWear = Math.abs(reading.current) * 0.035;
  const packHealth = round2(clamp(100 - baselineWear - thermalWear - currentWear, 88.2, 99.4));
  const stressIndex = deriveStressIndex(reading);

  return {
    packHealth,
    degradation: round2(100 - packHealth),
    stressIndex,
    status: healthStatus(packHealth, stressIndex),
  };
};

const evolveHealth = (previous: BatteryHealth, reading: BatteryReading): BatteryHealth => {
  const stressIndex = deriveStressIndex(reading);
  const thermalPenalty = reading.temperature > 50 ? 0.0018 : 0.0006;
  const loadPenalty = (Math.abs(reading.current) / 50) * 0.0014;
  const wearRate = thermalPenalty + loadPenalty + (stressIndex / 100) * 0.0012;
  const packHealth = round2(clamp(previous.packHealth - wearRate, 82, 99.4));

  return {
    packHealth,
    degradation: round2(100 - packHealth),
    stressIndex,
    status: healthStatus(packHealth, stressIndex),
  };
};

const evolveState = (previous: BatteryVector, randomSource: () => number = Math.random): BatteryVector => {
  const nextCurrent = clamp(previous.current + randomBetween(-12, 12, randomSource), -50, 50);
  const nextSoc = clamp(previous.soc + nextCurrent * 0.02 + randomBetween(-0.18, 0.18, randomSource), 0, 100);
  const voltageTarget = 3.2 + nextSoc / 100 + nextCurrent * 0.0018;
  const nextVoltage = clamp(
    previous.voltage + (voltageTarget - previous.voltage) * 0.45 + randomBetween(-0.02, 0.02, randomSource),
    3.2,
    4.2,
  );
  const thermalTarget = 24 + Math.abs(nextCurrent) * 0.55 + (nextSoc > 85 ? 3 : 0);
  const nextTemperature = clamp(
    previous.temperature + (thermalTarget - previous.temperature) * 0.35 + randomBetween(-1.4, 1.4, randomSource),
    20,
    60,
  );

  return {
    voltage: round2(nextVoltage),
    temperature: round2(nextTemperature),
    soc: round2(nextSoc),
    current: round2(nextCurrent),
  };
};

const createEvent = (
  message: string,
  severity: EventSeverity,
  timestamp: string,
  index: number,
): BatteryEvent => {
  return {
    id: `${timestamp}-${index}-${message.toLowerCase().replace(/\s+/g, "-")}`,
    message,
    severity,
    timestamp,
  };
};

const deriveEvent = (current: BatteryReading, previous: BatteryReading, tick: number): Omit<BatteryEvent, "id" | "timestamp"> => {
  if (previous.current < 0 && current.current >= 0) {
    return { message: "Charging Started", severity: "success" };
  }

  if (previous.current >= 0 && current.current < 0) {
    return { message: "Discharge Cycle Active", severity: "info" };
  }

  if (previous.temperature <= 55 && current.temperature > 55) {
    return { message: "Thermal Limit Approaching", severity: "critical" };
  }

  if (previous.temperature <= 50 && current.temperature > 50) {
    return { message: "Thermal Watch Raised", severity: "warning" };
  }

  if (previous.voltage >= 3.35 && current.voltage < 3.35) {
    return { message: "Voltage Sag Detected", severity: "warning" };
  }

  if (previous.voltage <= 4.12 && current.voltage > 4.12) {
    return { message: "Charge Ceiling Approaching", severity: "warning" };
  }

  if (Math.abs(previous.current) <= 38 && Math.abs(current.current) > 38) {
    return { message: "High Current Throughput", severity: "warning" };
  }

  if (previous.soc >= 15 && current.soc < 15) {
    return { message: "Low State Of Charge", severity: "warning" };
  }

  if (tick % 3 === 0) {
    return { message: "Voltage Normal", severity: "success" };
  }

  return { message: "Telemetry Heartbeat", severity: "info" };
};

const buildInitialHistory = (seededAt: number): BatteryReading[] => {
  const randomSource = createSeededRandom(seededAt);
  let state = createSeedState(randomSource);
  const history: BatteryReading[] = [];

  for (let index = 0; index < HISTORY_LIMIT; index += 1) {
    if (index > 0) {
      state = evolveState(state, randomSource);
    }

    const timestamp = seededAt - (HISTORY_LIMIT - 1 - index) * TICK_MS;
    history.push(toReading(state, timestamp));
  }

  return history;
};

const buildInitialEvents = (history: BatteryReading[]): BatteryEvent[] => {
  const latest = history[history.length - 1];
  const currentMessage = latest.current >= 0 ? "Charging Started" : "Discharge Cycle Active";
  const thermalMessage = latest.temperature > 50 ? "Thermal Watch Raised" : "Thermal Envelope Stable";
  const voltageMessage = latest.voltage < 3.4 ? "Voltage Sag Detected" : "Voltage Normal";

  return [
    createEvent(currentMessage, latest.current >= 0 ? "success" : "info", latest.timestamp, 4),
    createEvent(thermalMessage, latest.temperature > 50 ? "warning" : "success", history[16].timestamp, 3),
    createEvent(voltageMessage, latest.voltage < 3.4 ? "warning" : "success", history[10].timestamp, 2),
    createEvent("Telemetry Link Established", "success", history[4].timestamp, 1),
    createEvent("System Boot", "info", history[0].timestamp, 0),
  ];
};

const buildInitialSnapshot = (seededAt: number): BatterySnapshot => {
  const history = buildInitialHistory(seededAt);
  const events = buildInitialEvents(history);
  const currentReading = history[history.length - 1];

  return {
    currentReading,
    history,
    events,
    health: createInitialHealth(currentReading, seededAt),
  };
};

const createBatteryStore = (seededAt: number): BatteryStore => {
  let snapshot = buildInitialSnapshot(seededAt);
  let intervalId: number | null = null;
  let tickCount = snapshot.events.length;
  const listeners = new Set<() => void>();

  const emitChange = () => {
    listeners.forEach((listener) => {
      listener();
    });
  };

  const updateSnapshot = () => {
    const previous = snapshot.currentReading;
    const nextReading = toReading(evolveState(previous), Date.now());
    const nextEvent = deriveEvent(nextReading, previous, tickCount);

    tickCount += 1;

    snapshot = {
      currentReading: nextReading,
      history: [...snapshot.history.slice(-(HISTORY_LIMIT - 1)), nextReading],
      events: [
        createEvent(nextEvent.message, nextEvent.severity, nextReading.timestamp, tickCount),
        ...snapshot.events,
      ].slice(0, LOG_LIMIT),
      health: evolveHealth(snapshot.health, nextReading),
    };

    emitChange();
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },
    start: () => {
      if (intervalId !== null) {
        return () => {
          if (intervalId !== null) {
            window.clearInterval(intervalId);
            intervalId = null;
          }
        };
      }

      intervalId = window.setInterval(updateSnapshot, TICK_MS);

      return () => {
        if (intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      };
    },
  };
};

const BatterySimContext = createContext<BatteryStore | null>(null);

const useBatteryStore = (): BatteryStore => {
  const store = useContext(BatterySimContext);

  if (store === null) {
    throw new Error("Battery store is unavailable outside BatterySimProvider.");
  }

  return store;
};

export function BatterySimProvider({ seededAt, children }: BatterySimProviderProps) {
  const storeRef = useRef<BatteryStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createBatteryStore(seededAt);
  }

  useEffect(() => {
    return storeRef.current?.start();
  }, []);

  return createElement(BatterySimContext.Provider, { value: storeRef.current }, children);
}

export const useBatterySelector = <T,>(selector: (snapshot: BatterySnapshot) => T): T => {
  const store = useBatteryStore();

  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getSnapshot()),
    () => selector(store.getSnapshot()),
  );
};

export const useBatteryMetric = (metricKey: BatteryMetricKey): number => {
  return useBatterySelector((snapshot) => snapshot.currentReading[metricKey]);
};

export const useBatteryHistory = (): BatteryReading[] => {
  return useBatterySelector((snapshot) => snapshot.history);
};

export const useBatteryEvents = (): BatteryEvent[] => {
  return useBatterySelector((snapshot) => snapshot.events);
};

export const useBatteryHealth = (): BatteryHealth => {
  return useBatterySelector((snapshot) => snapshot.health);
};

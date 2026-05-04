# VoltStream — Real-Time IoT Battery Analytics Dashboard

**Live Demo:** [habitgram.dev/voltstream/](https://habitgram.dev/voltstream/)

VoltStream is a professional-grade telemetry dashboard for real-time battery cluster monitoring. It is built as a high-clarity engineering interface that simulates a live IoT sensor feed and visualizes critical battery metrics such as Voltage, Temperature, State of Charge (SOC), and current throughput.

## Key Features

- **Real-Time Telemetry:** Simulated live sensor updates every 2 seconds.
- **Interactive Analytics:** Dual-axis line charts for voltage and temperature trend analysis.
- **Visual Alerting System:** Dynamic UI states for thermal, charge, and current thresholds.
- **System Event Logging:** Live event stream for system boot, telemetry status, and warning conditions.
- **System Health Tracking:** Degradation and stress indicators for long-term battery condition monitoring.
- **Engineering-Focused UI:** Hardware-inspired typography, modular panels, and high-contrast operational states.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Visualizations:** Recharts
- **Icons:** Lucide React

## Architecture

The project follows a modular structure for maintainability and scalability:

- **`src/hooks/useBatterySim.ts`:** Encapsulates the telemetry simulation engine and client-side state store.
- **`src/types/battery.ts`:** Centralized battery and dashboard TypeScript contracts.
- **`src/components/dashboard/`:** Modular UI units for header, metrics, charting, health panel, and event logs.
- **Selective subscriptions:** Dashboard sections subscribe only to the data they need, reducing unnecessary re-renders.

## Project Structure

```text
src/
  app/
    globals.css
    layout.tsx
    page.tsx
  components/
    dashboard/
      BatteryDashboard.tsx
      EventLog.tsx
      Header.tsx
      StatsGrid.tsx
      SystemHealth.tsx
      TelemetryChart.tsx
  hooks/
    useBatterySim.ts
  types/
    battery.ts
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 3. Type check

```bash
npm run typecheck
```

### 4. Production build

```bash
npm run build
```

## Notes

- The dashboard uses a simulated telemetry stream, not a real backend or WebSocket source.
- The UI is optimized for both desktop engineering workstations and mobile inspection.
- All telemetry values are formatted to 2 decimal places.

import { BatteryDashboard } from "@/components/dashboard/BatteryDashboard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <BatteryDashboard seededAt={Date.now()} />;
}

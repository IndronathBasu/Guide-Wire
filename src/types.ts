export const PLATFORMS = ["Zepto", "Blinkit"] as const;
export type Platform = typeof PLATFORMS[number];

export type Warehouse = {
  id: string;
  name: string;
  zone: string;
  platform: Platform;
};

export type Driver = {
  id: string;
  name: string;
  platform: Platform;
  zone: string;
  warehouseId: string;
  active: boolean;
  weeklyIncome: number;
  riskScore: number;
  weeklyPremium: number;
  coveragePercent: number; // 0.7 = 70%
};

export type EventType = "HEAVY_RAIN" | "HEATWAVE" | "STRIKE";
export type EventData = { id: string; type: EventType; zone: string; dropPercent: number; timestamp: string; };
export type ClaimStatus = "PENDING" | "APPROVED" | "PAID" | "REJECTED";

export type Claim = {
  id: string;
  driverId: string;
  driverName: string;
  warehouseId: string;
  eventId: string;
  eventType: string;
  zone: string;
  type: string;
  loss: number;
  payout: number;
  status: ClaimStatus;
  timestamp: string;
};

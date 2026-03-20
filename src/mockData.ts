import type { Warehouse, Driver } from "./types";

export const WAREHOUSES: Warehouse[] = [
  { id: "WP-01", name: "Zepto Hub Whitefield", zone: "Whitefield", platform: "Zepto" },
  { id: "BK-02", name: "Blinkit Store Indiranagar", zone: "Indiranagar", platform: "Blinkit" },
  { id: "WP-03", name: "Zepto Dark Store MG Road", zone: "MG Road", platform: "Zepto" },
  { id: "BK-04", name: "Blinkit Hub Koramangala", zone: "Koramangala", platform: "Blinkit" },
];

export const MOCK_DRIVERS: Driver[] = [
  { id: "D-101", name: "Ravi Kumar", platform: "Zepto", zone: "Whitefield", warehouseId: "WP-01", active: true, weeklyIncome: 4000, riskScore: 85, weeklyPremium: 35, coveragePercent: 0.7 },
  { id: "D-102", name: "Amit Singh", platform: "Zepto", zone: "Whitefield", warehouseId: "WP-01", active: true, weeklyIncome: 3800, riskScore: 92, weeklyPremium: 35, coveragePercent: 0.7 },
  { id: "D-103", name: "Suresh", platform: "Blinkit", zone: "Indiranagar", warehouseId: "BK-02", active: false, weeklyIncome: 3500, riskScore: 60, weeklyPremium: 30, coveragePercent: 0.6 },
  { id: "D-104", name: "Priya", platform: "Zepto", zone: "MG Road", warehouseId: "WP-03", active: true, weeklyIncome: 4200, riskScore: 88, weeklyPremium: 40, coveragePercent: 0.8 },
  { id: "D-105", name: "Raj", platform: "Blinkit", zone: "Koramangala", warehouseId: "BK-04", active: true, weeklyIncome: 3900, riskScore: 95, weeklyPremium: 35, coveragePercent: 0.7 },
];

export const DRIVERS = MOCK_DRIVERS;

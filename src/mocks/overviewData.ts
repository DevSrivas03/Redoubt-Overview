import type { OverviewData } from "@/types/overview";

const entities = [
  { id: "e1", name: "Rivian Corp.", riskScore: 91, riskLevel: "extreme" as const, country: "US", tier: 1 },
  { id: "e2", name: "NexGen Semiconductors", riskScore: 84, riskLevel: "high" as const, country: "TW", tier: 1 },
  { id: "e3", name: "Atlas Logistics GmbH", riskScore: 78, riskLevel: "high" as const, country: "DE", tier: 2 },
  { id: "e4", name: "Pacific Components Ltd", riskScore: 71, riskLevel: "high" as const, country: "CN", tier: 1 },
  { id: "e5", name: "Summit Manufacturing", riskScore: 65, riskLevel: "medium" as const, country: "MX", tier: 2 },
  { id: "e6", name: "Nordic Steel AB", riskScore: 42, riskLevel: "medium" as const, country: "SE", tier: 3 },
  { id: "e7", name: "Sahel Trading Co", riskScore: 38, riskLevel: "low" as const, country: "NG", tier: 4 },
  { id: "e8", name: "Kyoto Precision", riskScore: 55, riskLevel: "medium" as const, country: "JP", tier: 2 },
];

const alerts = [
  { id: "1", title: "OFAC match on Tier-1 supplier", category: "compliance", impact: "extreme" as const, createdAt: "2026-06-25T08:12:00Z", isRead: false, isReviewed: false },
  { id: "2", title: "Cyber incident reported in APAC", category: "cyber", impact: "high" as const, createdAt: "2026-06-25T06:45:00Z", isRead: false },
  { id: "3", title: "Lead time extension — semiconductor parts", category: "supply_chain", impact: "medium" as const, createdAt: "2026-06-24T19:30:00Z", isRead: true },
  { id: "4", title: "Geopolitical tariff update — EU imports", category: "geopolitical", impact: "high" as const, createdAt: "2026-06-24T14:00:00Z", isRead: true, region: "EU" },
  { id: "5", title: "Phishing campaign targeting suppliers", category: "cyber", impact: "extreme" as const, createdAt: "2026-06-23T11:00:00Z", isRead: false },
  { id: "6", title: "Regulatory filing deadline change", category: "compliance", impact: "medium" as const, createdAt: "2026-06-22T09:00:00Z", isRead: true, isReviewed: true },
  { id: "7", title: "Port disruption — Southeast Asia", category: "operational", impact: "high" as const, createdAt: "2026-06-21T16:00:00Z", isRead: true },
  { id: "8", title: "Sanctions list update", category: "compliance", impact: "high" as const, createdAt: "2026-06-20T10:00:00Z", isRead: false, isReviewed: false },
  { id: "9", title: "Trade restriction — APAC corridor", category: "geopolitical", impact: "medium" as const, createdAt: "2026-06-19T08:00:00Z", isRead: true, region: "APAC" },
  { id: "10", title: "Inventory shortage alert", category: "supply_chain", impact: "low" as const, createdAt: "2026-06-18T12:00:00Z", isRead: true },
  { id: "11", title: "Breach notification — vendor portal", category: "cyber", impact: "extreme" as const, createdAt: "2026-06-17T07:00:00Z", isRead: false },
  { id: "12", title: "Policy violation — data retention", category: "compliance", impact: "medium" as const, createdAt: "2026-06-16T15:00:00Z", isRead: true, isReviewed: false },
];

/** Mock data for local redesign — replace with API calls later. */
export const mockOverviewData: OverviewData = {
  stats: {
    totalAlerts: 847,
    extremeAlerts: 12,
    highAlerts: 48,
    mediumAlerts: 156,
    lowAlerts: 631,
    unreadAlerts: 23,
    entitiesAtRisk: 34,
    activeCommandCenters: 7,
    avgRiskScore: 62,
    riskScoreDelta: 5,
    complianceScore: 78,
    revenueAtRisk: 24_500_000,
    penaltiesExposure: 3_200_000,
  },
  alerts,
  recentAlerts: [...alerts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4),
  topRiskEntities: [...entities].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
  entities,
  commandCenters: [
    { id: "cc1", name: "APAC Supply Disruption", status: "ACTIVE", alertCount: 14 },
    { id: "cc2", name: "OFAC Screening Review", status: "ACTIVE", alertCount: 8 },
    { id: "cc3", name: "Cyber Response — Tier 1", status: "ACTIVE", alertCount: 5 },
  ],
  riskTrend: [
    { month: "Jul", value: 58 },
    { month: "Aug", value: 61 },
    { month: "Sep", value: 59 },
    { month: "Oct", value: 64 },
    { month: "Nov", value: 60 },
    { month: "Jun", value: 62 },
  ],
  mapNodes: [
    { id: "m1", name: "Rivian Corp.", lat: 33.749, lng: -84.388, riskLevel: "extreme", tier: 1 },
    { id: "m2", name: "NexGen Semiconductors", lat: 25.033, lng: 121.565, riskLevel: "high", tier: 1 },
    { id: "m3", name: "Atlas Logistics GmbH", lat: 52.52, lng: 13.405, riskLevel: "high", tier: 2 },
    { id: "m4", name: "Pacific Components Ltd", lat: 31.23, lng: 121.473, riskLevel: "high", tier: 1 },
    { id: "m5", name: "Summit Manufacturing", lat: 19.432, lng: -99.133, riskLevel: "medium", tier: 2 },
    { id: "m6", name: "Nordic Steel AB", lat: 59.329, lng: 18.068, riskLevel: "medium", tier: 3 },
    { id: "m7", name: "Kyoto Precision", lat: 35.011, lng: 135.768, riskLevel: "medium", tier: 2 },
    { id: "m8", name: "Sahel Trading Co", lat: 9.082, lng: 8.675, riskLevel: "low", tier: 4 },
    { id: "m9", name: "Sydney Logistics", lat: -33.868, lng: 151.209, riskLevel: "low", tier: 3 },
    { id: "m10", name: "Toronto Components", lat: 43.653, lng: -79.383, riskLevel: "medium", tier: 2 },
  ],
};

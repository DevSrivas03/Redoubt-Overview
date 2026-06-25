export type RiskLevel = "extreme" | "high" | "medium" | "low";

export interface OverviewStats {
  totalAlerts: number;
  extremeAlerts: number;
  highAlerts: number;
  mediumAlerts: number;
  lowAlerts: number;
  unreadAlerts: number;
  entitiesAtRisk: number;
  activeCommandCenters: number;
  avgRiskScore: number;
  riskScoreDelta: number | null;
  complianceScore: number;
  revenueAtRisk: number;
  penaltiesExposure: number;
}

export interface OverviewAlert {
  id: string;
  title: string;
  category: string;
  impact: RiskLevel;
  createdAt: string;
  isRead: boolean;
  isReviewed?: boolean;
  region?: string;
}

export interface OverviewEntity {
  id: string;
  name: string;
  riskScore: number;
  riskLevel: RiskLevel;
  country?: string;
  tier?: number;
}

export interface OverviewCommandCenter {
  id: string;
  name: string;
  status: string;
  alertCount: number;
}

export interface RiskTrendPoint {
  month: string;
  value: number;
}

export interface MapNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  riskLevel: RiskLevel;
  tier?: number;
}

export interface OverviewData {
  stats: OverviewStats;
  alerts: OverviewAlert[];
  recentAlerts: OverviewAlert[];
  topRiskEntities: OverviewEntity[];
  entities: OverviewEntity[];
  commandCenters: OverviewCommandCenter[];
  riskTrend: RiskTrendPoint[];
  mapNodes: MapNode[];
}

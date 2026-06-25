import type { OverviewData, OverviewEntity, RiskLevel } from "@/types/overview";

export interface OverviewAnalytics {
  categoryBreakdown: [string, number][];
  tierCounts: Record<number, number>;
  tierRiskAvg: Record<number, number>;
  countryHighRisk: [string, number][];
  countryAvgRisk: [string, number][];
  regionGeoCounts: [string, number][];
  complianceScore: number;
  securityPostureScore: number;
  capacityPercent: number;
  certificationPercent: number;
  budgetUtilizationPercent: number;
  financialExposure: {
    total: number;
    highRisk: number;
    mitigated: number;
  };
  revenueAtRisk: number;
  cyberThreatLevel: string;
  supplyChainStatus: string;
  auditReviewed: number;
  auditTotal: number;
  riskTrendPoints: { month: string; value: number }[];
}

function alertsByCategory(data: OverviewData): [string, number][] {
  const counts: Record<string, number> = {};
  data.alerts.forEach((a) => {
    counts[a.category] = (counts[a.category] ?? 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function entitiesByCountry(
  entities: OverviewEntity[],
  highRiskOnly = false,
): [string, number][] {
  const counts: Record<string, number> = {};
  entities.forEach((e) => {
    if (!e.country) return;
    if (highRiskOnly && e.riskLevel !== "extreme" && e.riskLevel !== "high") {
      return;
    }
    counts[e.country] = (counts[e.country] ?? 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function countryAvgRisk(entities: OverviewEntity[]): [string, number][] {
  const buckets: Record<string, number[]> = {};
  entities.forEach((e) => {
    if (!e.country) return;
    buckets[e.country] = buckets[e.country] ?? [];
    buckets[e.country].push(e.riskScore);
  });
  return Object.entries(buckets)
    .map(([country, scores]) => [
      country,
      Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
    ] as [string, number])
    .sort((a, b) => b[1] - a[1]);
}

export function computeOverviewAnalytics(data: OverviewData): OverviewAnalytics {
  const { stats, entities, alerts } = data;
  const tierCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
  const tierScores: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [] };
  entities.forEach((e) => {
    const tier = e.tier ?? 1;
    tierCounts[tier] = (tierCounts[tier] ?? 0) + 1;
    tierScores[tier] = tierScores[tier] ?? [];
    tierScores[tier].push(e.riskScore);
  });
  const tierRiskAvg: Record<number, number> = {};
  [1, 2, 3, 4].forEach((tier) => {
    const scores = tierScores[tier];
    tierRiskAvg[tier] =
      scores.length > 0
        ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
        : 0;
  });

  const complianceAlerts = alerts.filter((a) => a.category === "compliance");
  const reviewed = complianceAlerts.filter((a) => a.isReviewed).length;
  const lowRiskEntities = entities.filter(
    (e) => e.riskLevel === "low" || e.riskLevel === "medium",
  ).length;
  const cyberAlerts = alerts.filter((a) => a.category === "cyber");

  const geoAlerts = alerts.filter((a) => a.category === "geopolitical");
  const regionCounts: Record<string, number> = {};
  geoAlerts.forEach((a) => {
    const region = a.region ?? "Unknown";
    regionCounts[region] = (regionCounts[region] ?? 0) + 1;
  });

  const highRiskExposure = Math.round(stats.revenueAtRisk * 0.42);
  const totalExposure = stats.revenueAtRisk + stats.penaltiesExposure;

  let cyberThreatLevel = "Low";
  const extremeCyber = cyberAlerts.filter((a) => a.impact === "extreme").length;
  const highCyber = cyberAlerts.filter((a) => a.impact === "high").length;
  if (extremeCyber > 2) cyberThreatLevel = "Extreme";
  else if (extremeCyber > 0 || highCyber > 3) cyberThreatLevel = "High";
  else if (highCyber > 0) cyberThreatLevel = "Moderate";

  const atRisk = entities.filter(
    (e) => e.riskLevel === "extreme" || e.riskLevel === "high",
  ).length;
  let supplyChainStatus = "Healthy";
  if (atRisk > entities.length * 0.4) supplyChainStatus = "At Risk";
  else if (atRisk > entities.length * 0.2) supplyChainStatus = "Needs Attention";

  return {
    categoryBreakdown: alertsByCategory(data).slice(0, 6),
    tierCounts,
    tierRiskAvg,
    countryHighRisk: entitiesByCountry(entities, true).slice(0, 6),
    countryAvgRisk: countryAvgRisk(entities).slice(0, 6),
    regionGeoCounts: Object.entries(regionCounts).sort((a, b) => b[1] - a[1]),
    complianceScore: stats.complianceScore,
    securityPostureScore: Math.max(0, 100 - stats.avgRiskScore),
    capacityPercent: Math.round((lowRiskEntities / Math.max(entities.length, 1)) * 100),
    certificationPercent: Math.round((lowRiskEntities / Math.max(entities.length, 1)) * 100),
    budgetUtilizationPercent:
      totalExposure > 0 ? Math.round((highRiskExposure / totalExposure) * 100) : 0,
    financialExposure: {
      total: totalExposure,
      highRisk: highRiskExposure,
      mitigated: Math.max(0, totalExposure - highRiskExposure),
    },
    revenueAtRisk: stats.revenueAtRisk,
    cyberThreatLevel,
    supplyChainStatus,
    auditReviewed: reviewed,
    auditTotal: complianceAlerts.length,
    riskTrendPoints: data.riskTrend,
  };
}

export function filterAlerts(
  data: OverviewData,
  predicate: (a: OverviewData["alerts"][number]) => boolean,
) {
  return data.alerts.filter(predicate);
}

export function impactCount(
  alerts: OverviewData["alerts"],
  impact?: RiskLevel,
): number {
  return alerts.filter((a) => !impact || a.impact === impact).length;
}

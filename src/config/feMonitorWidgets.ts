/**
 * Scraped inventory of Overview dashboard widgets from `redoubt-fe-monitor`.
 *
 * Source repo: Exiger-Redoubt/redoubt-fe-monitor
 * Registry:    src/stores/dashboardStore.ts
 * Grid:        src/overview/components/DashboardWidgets.tsx
 * Widgets:     src/overview/components/widgets/*.tsx
 *
 * 43 of 44 widgets use live API data. Only `risk_trend_chart` is a stub.
 */
import type { RoleType, WidgetCategory, WidgetType } from "./dashboardConfig";
import {
  CATEGORY_LABELS,
  ROLE_CONFIGS,
  WIDGET_METADATA,
} from "./dashboardConfig";

/** How the widget gets its data in fe-monitor. */
export type FeMonitorDataSource =
  | "alerts" // ALERTS_QUERY via getAlerts()
  | "companies" // LIST_COMPANIES (Apollo)
  | "cases" // CASES_QUERY → taskForces
  | "analytics" // computeAllAnalytics(companies, alerts)
  | "supply_chain_map" // SUPPLY_CHAIN_NODES_QUERY + ALERTS_QUERY (GlobalRiskMap)
  | "self_fetch_alerts" // Widget calls getAlerts() directly
  | "stub"; // No live data wired

export interface FeMonitorWidget {
  id: WidgetType;
  label: string;
  category: WidgetCategory;
  /** Component file under redoubt-fe-monitor/src/overview/ */
  componentPath: string;
  dataSources: FeMonitorDataSource[];
  hasRealData: boolean;
  /** What the widget displays from live APIs */
  dataDescription: string;
  /** Role presets that include this widget (from DEFAULT_PERSONA_CONFIGS) */
  personas: RoleType[];
  /** fe-monitor notes — heuristics, filters, or gaps */
  notes?: string;
}

const FE_MONITOR_REPO = "Exiger-Redoubt/redoubt-fe-monitor";
const WIDGETS_DIR = `${FE_MONITOR_REPO}/src/overview/components/widgets`;

/** Role → widget IDs from fe-monitor DEFAULT_PERSONA_CONFIGS */
const PERSONA_WIDGETS: Record<RoleType, WidgetType[]> = {
  default: [
    "quick_stats_grid",
    "global_risk_map",
    "risk_distribution",
    "top_risks_entities",
    "recent_activity",
    "risk_by_category",
  ],
  head_of_risk: [
    "risk_score_overview",
    "critical_issues",
    "global_risk_map",
    "risk_distribution",
    "risk_trend_chart",
    "top_risks_entities",
    "risk_heatmap",
    "compliance_score",
    "financial_exposure",
  ],
  ciso: [
    "cyber_threat_level",
    "security_posture",
    "cyber_incidents",
    "breach_alerts",
    "vulnerability_scan",
    "phishing_attempts",
    "compliance_score",
    "recent_activity",
  ],
  chief_supply_chain: [
    "supply_chain_health",
    "tier_breakdown",
    "single_source_risk",
    "supplier_risk_map",
    "lead_time_alerts",
    "supplier_performance",
    "disruption_tracker",
    "inventory_alerts",
  ],
  compliance_officer: [
    "compliance_score",
    "regulatory_updates",
    "audit_status",
    "ofac_sanctions",
    "certification_tracker",
    "policy_violations",
    "sanctions_monitor",
    "recent_activity",
  ],
  cfo: [
    "revenue_at_risk",
    "financial_exposure",
    "cost_impact_analysis",
    "budget_utilization",
    "currency_risk",
    "risk_score_overview",
    "tariff_tracker",
    "trade_war_impact",
  ],
  operations_director: [
    "active_cases",
    "cases_list",
    "disruption_tracker",
    "capacity_status",
    "inventory_alerts",
    "lead_time_alerts",
    "supply_chain_health",
    "recent_activity",
  ],
};

function personasForWidget(id: WidgetType): RoleType[] {
  return (Object.entries(PERSONA_WIDGETS) as [RoleType, WidgetType[]][])
    .filter(([, widgets]) => widgets.includes(id))
    .map(([role]) => role);
}

export const FE_MONITOR_WIDGETS: FeMonitorWidget[] = [
  // ── Overview ──────────────────────────────────────────────────────────────
  {
    id: "total_alerts_summary",
    label: "Total Alerts Summary",
    category: "overview",
    componentPath: `${WIDGETS_DIR}/TotalAlertsWidget.tsx`,
    dataSources: ["self_fetch_alerts"],
    hasRealData: true,
    dataDescription:
      "Total non-archived alerts with extreme, high, and unread breakdown chips.",
    personas: personasForWidget("total_alerts_summary"),
  },
  {
    id: "risk_score_overview",
    label: "Risk Score Overview",
    category: "overview",
    componentPath: `${WIDGETS_DIR}/RiskScoreOverviewWidget.tsx`,
    dataSources: ["companies", "analytics"],
    hasRealData: true,
    dataDescription:
      "Portfolio average intelligence.riskScore and period-over-period delta.",
    personas: personasForWidget("risk_score_overview"),
  },
  {
    id: "critical_issues",
    label: "Critical Issues",
    category: "overview",
    componentPath: `${WIDGETS_DIR}/CriticalIssuesWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Count of EXTREME-impact alerts requiring attention.",
    personas: personasForWidget("critical_issues"),
  },
  {
    id: "quick_stats_grid",
    label: "Quick Stats Grid",
    category: "overview",
    componentPath: `${WIDGETS_DIR}/QuickStatsGridWidget.tsx`,
    dataSources: ["alerts", "companies", "cases"],
    hasRealData: true,
    dataDescription:
      "Four-cell grid: extreme/high alerts, companies at risk, active command centers.",
    personas: personasForWidget("quick_stats_grid"),
  },
  {
    id: "recent_activity",
    label: "Recent Activity",
    category: "overview",
    componentPath: `${WIDGETS_DIR}/RecentActivityWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Four most recent non-archived alerts.",
    personas: personasForWidget("recent_activity"),
  },
  {
    id: "global_risk_map",
    label: "Global Risk Map",
    category: "overview",
    componentPath: `${WIDGETS_DIR}/GlobalRiskMapWidget.tsx`,
    dataSources: ["supply_chain_map"],
    hasRealData: true,
    dataDescription:
      "Leaflet map of tier-1 suppliers, alert overlays, and supply-chain edges.",
    personas: personasForWidget("global_risk_map"),
    notes: "Delegates to GlobalRiskMap.tsx (SUPPLY_CHAIN_NODES_QUERY + ALERTS_QUERY).",
  },

  // ── Risk ──────────────────────────────────────────────────────────────────
  {
    id: "risk_distribution",
    label: "Risk Distribution",
    category: "risk",
    componentPath: `${WIDGETS_DIR}/RiskDistributionWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Stacked bar of alert counts by impact level (extreme → low).",
    personas: personasForWidget("risk_distribution"),
  },
  {
    id: "top_risks_entities",
    label: "Top Risk Companies",
    category: "risk",
    componentPath: `${WIDGETS_DIR}/TopRiskEntitiesWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "Top 5 entities ranked by intelligence.riskScore.",
    personas: personasForWidget("top_risks_entities"),
  },
  {
    id: "risk_by_category",
    label: "Risk by Category",
    category: "risk",
    componentPath: `${WIDGETS_DIR}/RiskByCategoryWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Top 4 alert categories by volume.",
    personas: personasForWidget("risk_by_category"),
  },
  {
    id: "risk_trend_chart",
    label: "Risk Trend Chart",
    category: "risk",
    componentPath: `${WIDGETS_DIR}/RiskTrendChartWidget.tsx`,
    dataSources: ["stub"],
    hasRealData: false,
    dataDescription: "Twelve-month risk score trend (not implemented).",
    personas: personasForWidget("risk_trend_chart"),
    notes: "getRiskTrend() in riskService.ts returns []. Shows empty state.",
  },
  {
    id: "risk_heatmap",
    label: "Risk Heatmap",
    category: "risk",
    componentPath: `${WIDGETS_DIR}/RiskHeatmapWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Category × impact-level matrix with cell counts.",
    personas: personasForWidget("risk_heatmap"),
  },

  // ── Cyber Security ────────────────────────────────────────────────────────
  {
    id: "cyber_threat_level",
    label: "Cyber Threat Level",
    category: "cyber",
    componentPath: `${WIDGETS_DIR}/CyberThreatLevelWidget.tsx`,
    dataSources: ["alerts", "analytics"],
    hasRealData: true,
    dataDescription:
      "Threat level (Low/Moderate/High/Extreme) from active cyber-category alerts.",
    personas: personasForWidget("cyber_threat_level"),
  },
  {
    id: "cyber_incidents",
    label: "Cyber Incidents",
    category: "cyber",
    componentPath: `${WIDGETS_DIR}/CyberIncidentsWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Count of active alerts where category === cyber.",
    personas: personasForWidget("cyber_incidents"),
  },
  {
    id: "vulnerability_scan",
    label: "Vulnerability Scan",
    category: "cyber",
    componentPath: `${WIDGETS_DIR}/VulnerabilityScanWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Cyber alerts broken down by impact level.",
    personas: personasForWidget("vulnerability_scan"),
  },
  {
    id: "security_posture",
    label: "Security Posture",
    category: "cyber",
    componentPath: `${WIDGETS_DIR}/SecurityPostureWidget.tsx`,
    dataSources: ["analytics", "companies"],
    hasRealData: true,
    dataDescription:
      "Portfolio security posture label and progress from avg entity risk score.",
    personas: personasForWidget("security_posture"),
  },
  {
    id: "breach_alerts",
    label: "Breach Alerts",
    category: "cyber",
    componentPath: `${WIDGETS_DIR}/BreachAlertsWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Latest 4 cyber-category alerts.",
    personas: personasForWidget("breach_alerts"),
    notes: "Uses cyber filter, not breach-specific fields.",
  },
  {
    id: "phishing_attempts",
    label: "Phishing Attempts",
    category: "cyber",
    componentPath: `${WIDGETS_DIR}/PhishingAttemptsWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Total and critical cyber alert counts.",
    personas: personasForWidget("phishing_attempts"),
    notes: "All cyber alerts — not phishing-specific filter.",
  },

  // ── Compliance ────────────────────────────────────────────────────────────
  {
    id: "compliance_score",
    label: "Compliance Score",
    category: "compliance",
    componentPath: `${WIDGETS_DIR}/ComplianceScoreWidget.tsx`,
    dataSources: ["analytics", "companies"],
    hasRealData: true,
    dataDescription:
      "% of entity relationships with status APPROVED (compliance proxy).",
    personas: personasForWidget("compliance_score"),
  },
  {
    id: "regulatory_updates",
    label: "Regulatory Updates",
    category: "compliance",
    componentPath: `${WIDGETS_DIR}/RegulatoryUpdatesWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Latest 4 compliance-category alerts.",
    personas: personasForWidget("regulatory_updates"),
  },
  {
    id: "audit_status",
    label: "Audit Status",
    category: "compliance",
    componentPath: `${WIDGETS_DIR}/AuditStatusWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Compliance alerts: total, reviewed, and % complete.",
    personas: personasForWidget("audit_status"),
  },
  {
    id: "ofac_sanctions",
    label: "OFAC Sanctions",
    category: "compliance",
    componentPath: `${WIDGETS_DIR}/OfacSanctionsWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Compliance-category alert count.",
    personas: personasForWidget("ofac_sanctions"),
    notes: "Compliance filter — not OFAC-specific screening data.",
  },
  {
    id: "certification_tracker",
    label: "Certification Tracker",
    category: "compliance",
    componentPath: `${WIDGETS_DIR}/CertificationTrackerWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "% of entities with low/medium risk used as certified proxy.",
    personas: personasForWidget("certification_tracker"),
    notes: "Heuristic — not actual certification records.",
  },
  {
    id: "policy_violations",
    label: "Policy Violations",
    category: "compliance",
    componentPath: `${WIDGETS_DIR}/PolicyViolationsWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Compliance alerts with unreviewed count.",
    personas: personasForWidget("policy_violations"),
  },

  // ── Supply Chain ──────────────────────────────────────────────────────────
  {
    id: "supply_chain_health",
    label: "Supply Chain Health",
    category: "supply_chain",
    componentPath: `${WIDGETS_DIR}/SupplyChainHealthWidget.tsx`,
    dataSources: ["companies", "analytics"],
    hasRealData: true,
    dataDescription:
      "Health status from entity relationship statuses (Healthy / At Risk / etc.).",
    personas: personasForWidget("supply_chain_health"),
  },
  {
    id: "supplier_risk_map",
    label: "Supplier Risk Map",
    category: "supply_chain",
    componentPath: `${WIDGETS_DIR}/SupplierRiskMapWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "Top 6 countries by high-risk supplier concentration.",
    personas: personasForWidget("supplier_risk_map"),
  },
  {
    id: "tier_breakdown",
    label: "Tier Breakdown",
    category: "supply_chain",
    componentPath: `${WIDGETS_DIR}/TierBreakdownWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "Entity counts per supply chain tier (1–4).",
    personas: personasForWidget("tier_breakdown"),
  },
  {
    id: "single_source_risk",
    label: "Single Source Risk",
    category: "supply_chain",
    componentPath: `${WIDGETS_DIR}/SingleSourceRiskWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "Tier-1 entities at high or extreme risk.",
    personas: personasForWidget("single_source_risk"),
    notes: "Heuristic — not true single-source dependency analysis.",
  },
  {
    id: "lead_time_alerts",
    label: "Lead Time Alerts",
    category: "supply_chain",
    componentPath: `${WIDGETS_DIR}/LeadTimeAlertsWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Supply-chain category alerts with critical count.",
    personas: personasForWidget("lead_time_alerts"),
  },
  {
    id: "supplier_performance",
    label: "Supplier Performance",
    category: "supply_chain",
    componentPath: `${WIDGETS_DIR}/SupplierPerformanceWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "Average risk score overall and per tier.",
    personas: personasForWidget("supplier_performance"),
  },

  // ── Financial ─────────────────────────────────────────────────────────────
  {
    id: "revenue_at_risk",
    label: "Revenue at Risk",
    category: "financial",
    componentPath: `${WIDGETS_DIR}/RevenueAtRiskWidget.tsx`,
    dataSources: ["alerts", "analytics"],
    hasRealData: true,
    dataDescription: "Sum of alert.atRiskRevenue and affected company count.",
    personas: personasForWidget("revenue_at_risk"),
  },
  {
    id: "financial_exposure",
    label: "Financial Exposure",
    category: "financial",
    componentPath: `${WIDGETS_DIR}/FinancialExposureWidget.tsx`,
    dataSources: ["analytics", "alerts"],
    hasRealData: true,
    dataDescription:
      "Total vs high-risk exposure (atRiskRevenue + potentialPenalties).",
    personas: personasForWidget("financial_exposure"),
  },
  {
    id: "cost_impact_analysis",
    label: "Cost Impact Analysis",
    category: "financial",
    componentPath: `${WIDGETS_DIR}/CostImpactAnalysisWidget.tsx`,
    dataSources: ["analytics", "alerts"],
    hasRealData: true,
    dataDescription: "Total, high-risk, and mitigated exposure breakdown.",
    personas: personasForWidget("cost_impact_analysis"),
  },
  {
    id: "budget_utilization",
    label: "Budget Utilization",
    category: "financial",
    componentPath: `${WIDGETS_DIR}/BudgetUtilizationWidget.tsx`,
    dataSources: ["analytics", "alerts"],
    hasRealData: true,
    dataDescription: "Ratio of high-risk to total financial exposure as %.",
    personas: personasForWidget("budget_utilization"),
    notes: "Heuristic — no actual budget ledger data.",
  },
  {
    id: "currency_risk",
    label: "Currency Risk",
    category: "financial",
    componentPath: `${WIDGETS_DIR}/CurrencyRiskWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "Region count and non-US entity count from hqCountry.",
    personas: personasForWidget("currency_risk"),
  },

  // ── Operational ───────────────────────────────────────────────────────────
  {
    id: "active_cases",
    label: "Active Command Centers",
    category: "operational",
    componentPath: `${WIDGETS_DIR}/ActiveCommandCentersWidget.tsx`,
    dataSources: ["cases"],
    hasRealData: true,
    dataDescription: "Count of active task forces (command centers).",
    personas: personasForWidget("active_cases"),
  },
  {
    id: "cases_list",
    label: "Command Centers",
    category: "operational",
    componentPath: `${WIDGETS_DIR}/CommandCentersListWidget.tsx`,
    dataSources: ["cases"],
    hasRealData: true,
    dataDescription: "Top 3 task forces with linked alert counts.",
    personas: personasForWidget("cases_list"),
  },
  {
    id: "disruption_tracker",
    label: "Disruption Tracker",
    category: "operational",
    componentPath: `${WIDGETS_DIR}/DisruptionTrackerWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Latest 4 operational and supply_chain category alerts.",
    personas: personasForWidget("disruption_tracker"),
  },
  {
    id: "capacity_status",
    label: "Capacity Status",
    category: "operational",
    componentPath: `${WIDGETS_DIR}/CapacityStatusWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "% of entities with low/empty risk as healthy-capacity proxy.",
    personas: personasForWidget("capacity_status"),
    notes: "Heuristic — not actual capacity metrics.",
  },
  {
    id: "inventory_alerts",
    label: "Inventory Alerts",
    category: "operational",
    componentPath: `${WIDGETS_DIR}/InventoryAlertsWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Supply-chain and operational alert counts by severity.",
    personas: personasForWidget("inventory_alerts"),
  },

  // ── Geopolitical ──────────────────────────────────────────────────────────
  {
    id: "geopolitical_alerts",
    label: "Geopolitical Alerts",
    category: "geopolitical",
    componentPath: `${WIDGETS_DIR}/GeopoliticalAlertsWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Latest 4 geopolitical-category alerts with region.",
    personas: personasForWidget("geopolitical_alerts"),
  },
  {
    id: "trade_war_impact",
    label: "Trade War Impact",
    category: "geopolitical",
    componentPath: `${WIDGETS_DIR}/TradeWarImpactWidget.tsx`,
    dataSources: ["alerts", "companies"],
    hasRealData: true,
    dataDescription:
      "Geo alerts, affected regions, and international entity exposure.",
    personas: personasForWidget("trade_war_impact"),
  },
  {
    id: "tariff_tracker",
    label: "Tariff Tracker",
    category: "geopolitical",
    componentPath: `${WIDGETS_DIR}/TariffTrackerWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Top regions by geopolitical alert count.",
    personas: personasForWidget("tariff_tracker"),
  },
  {
    id: "country_risk_map",
    label: "Country Risk Map",
    category: "geopolitical",
    componentPath: `${WIDGETS_DIR}/CountryRiskMapWidget.tsx`,
    dataSources: ["companies"],
    hasRealData: true,
    dataDescription: "Top 6 countries by average entity risk score.",
    personas: personasForWidget("country_risk_map"),
  },
  {
    id: "sanctions_monitor",
    label: "Sanctions Monitor",
    category: "geopolitical",
    componentPath: `${WIDGETS_DIR}/SanctionsMonitorWidget.tsx`,
    dataSources: ["alerts"],
    hasRealData: true,
    dataDescription: "Compliance + geopolitical alerts: total, critical, pending.",
    personas: personasForWidget("sanctions_monitor"),
  },
];

/** Shared GraphQL / service layer used by the Overview grid */
export const FE_MONITOR_DATA_LAYER = {
  alerts: {
    query: "ALERTS_QUERY",
    service: "src/overview/services/alertsService.ts → getAlerts()",
  },
  companies: {
    query: "LIST_COMPANIES",
    hook: "useQuery in DashboardWidgets.tsx",
  },
  cases: {
    query: "CASES_QUERY",
    field: "taskForces",
  },
  analytics: {
    service: "src/overview/services/analyticsService.ts → computeAllAnalytics()",
    computes: [
      "securityPosture",
      "complianceScore",
      "financialExposure",
      "revenueAtRisk",
      "riskScoreDelta",
      "cyberThreatLevel",
      "supplyChainHealth",
    ],
  },
  supplyChainMap: {
    queries: ["SUPPLY_CHAIN_NODES_QUERY", "ALERTS_QUERY"],
    component: "src/overview/components/GlobalRiskMap.tsx",
  },
  layout: {
    query: "DASHBOARD_CONFIG_QUERY",
    mutation: "SAVE_DASHBOARD_CONFIG",
    store: "src/stores/dashboardStore.ts",
  },
} as const;

export const FE_MONITOR_WIDGET_SUMMARY = {
  total: FE_MONITOR_WIDGETS.length,
  withRealData: FE_MONITOR_WIDGETS.filter((w) => w.hasRealData).length,
  stubs: FE_MONITOR_WIDGETS.filter((w) => !w.hasRealData).map((w) => w.id),
  byCategory: FE_MONITOR_WIDGETS.reduce(
    (acc, widget) => {
      acc[widget.category] = (acc[widget.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<WidgetCategory, number>,
  ),
} as const;

export function getFeMonitorWidgetsWithRealData(): FeMonitorWidget[] {
  return FE_MONITOR_WIDGETS.filter((w) => w.hasRealData);
}

export function getFeMonitorWidgetById(id: WidgetType): FeMonitorWidget | undefined {
  return FE_MONITOR_WIDGETS.find((w) => w.id === id);
}

export function getFeMonitorWidgetsByCategory(
  category: WidgetCategory,
): FeMonitorWidget[] {
  return FE_MONITOR_WIDGETS.filter((w) => w.category === category);
}

/**
 * Titles as rendered in fe-monitor widget cards (may differ from registry `label`).
 * Scraped from src/overview/components/widgets/*.tsx
 */
export const FE_MONITOR_UI_TITLES: Partial<Record<WidgetType, string>> = {
  risk_score_overview: "Avg Risk Score",
  critical_issues: "Critical Issues",
  global_risk_map: "Global Risk Map", // map has no card title — filter bar only
  risk_distribution: "Risk Distribution",
  risk_trend_chart: "Risk Trend (12 months)",
  top_risks_entities: "Top Risk Companies",
  risk_heatmap: "Risk Heatmap",
  compliance_score: "Compliance",
  financial_exposure: "Financial Exposure",
  quick_stats_grid: "Quick Stats Grid",
  recent_activity: "Recent Activity",
  active_cases: "Active Command Centers",
  cases_list: "Command Centers",
  supply_chain_health: "Supply Chain Health",
  cyber_threat_level: "Cyber Threat Level",
  revenue_at_risk: "Revenue at Risk",
};

/**
 * Widget order per persona on fe-monitor Overview when not customized.
 * Matches DEFAULT_PERSONA_CONFIGS in redoubt-fe-monitor/src/stores/dashboardStore.ts
 *
 * Screenshot reference: "Head of Risk & Compliance" shows this layout (row 1–4
 * in viewport); Financial Exposure is row 5 (scroll). Sub-header "44 widgets
 * active" means a customized layout with every widget type enabled — not the
 * default persona preset.
 */
export const FE_MONITOR_PERSONA_WIDGETS: Record<RoleType, WidgetType[]> = {
  default: [
    "quick_stats_grid",
    "global_risk_map",
    "risk_distribution",
    "top_risks_entities",
    "recent_activity",
    "risk_by_category",
  ],
  head_of_risk: [
    "risk_score_overview",
    "critical_issues",
    "global_risk_map",
    "risk_distribution",
    "risk_trend_chart",
    "top_risks_entities",
    "risk_heatmap",
    "compliance_score",
    "financial_exposure",
  ],
  ciso: [
    "cyber_threat_level",
    "security_posture",
    "cyber_incidents",
    "breach_alerts",
    "vulnerability_scan",
    "phishing_attempts",
    "compliance_score",
    "recent_activity",
  ],
  chief_supply_chain: [
    "supply_chain_health",
    "tier_breakdown",
    "single_source_risk",
    "supplier_risk_map",
    "lead_time_alerts",
    "supplier_performance",
    "disruption_tracker",
    "inventory_alerts",
  ],
  compliance_officer: [
    "compliance_score",
    "regulatory_updates",
    "audit_status",
    "ofac_sanctions",
    "certification_tracker",
    "policy_violations",
    "sanctions_monitor",
    "recent_activity",
  ],
  cfo: [
    "revenue_at_risk",
    "financial_exposure",
    "cost_impact_analysis",
    "budget_utilization",
    "currency_risk",
    "risk_score_overview",
    "tariff_tracker",
    "trade_war_impact",
  ],
  operations_director: [
    "active_cases",
    "cases_list",
    "disruption_tracker",
    "capacity_status",
    "inventory_alerts",
    "lead_time_alerts",
    "supply_chain_health",
    "recent_activity",
  ],
};

/** Head of Risk layout as shown in fe-monitor Overview screenshot (grid order). */
export const FE_MONITOR_HEAD_OF_RISK_SCREENSHOT_WIDGETS = [
  {
    order: 1,
    id: "risk_score_overview" as const,
    uiTitle: "Avg Risk Score",
    gridSize: "medium" as const,
    visibleInScreenshot: true,
  },
  {
    order: 2,
    id: "critical_issues" as const,
    uiTitle: "Critical Issues",
    gridSize: "medium" as const,
    visibleInScreenshot: true,
  },
  {
    order: 3,
    id: "global_risk_map" as const,
    uiTitle: "(map — no title)",
    gridSize: "full" as const,
    visibleInScreenshot: true,
    notes: "Filter bar: Relationships, Extreme/High/Medium/Low, With alerts",
  },
  {
    order: 4,
    id: "risk_distribution" as const,
    uiTitle: "Risk Distribution",
    gridSize: "medium" as const,
    visibleInScreenshot: true,
  },
  {
    order: 5,
    id: "risk_trend_chart" as const,
    uiTitle: "Risk Trend (12 months)",
    gridSize: "large" as const,
    visibleInScreenshot: true,
    notes: "Stub — shows empty state",
  },
  {
    order: 6,
    id: "top_risks_entities" as const,
    uiTitle: "Top Risk Companies",
    gridSize: "medium" as const,
    visibleInScreenshot: true,
  },
  {
    order: 7,
    id: "risk_heatmap" as const,
    uiTitle: "Risk Heatmap",
    gridSize: "large" as const,
    visibleInScreenshot: true,
  },
  {
    order: 8,
    id: "compliance_score" as const,
    uiTitle: "Compliance",
    gridSize: "small" as const,
    visibleInScreenshot: true,
  },
  {
    order: 9,
    id: "financial_exposure" as const,
    uiTitle: "Financial Exposure",
    gridSize: "large" as const,
    visibleInScreenshot: false,
    notes: "Below fold in screenshot",
  },
];

/** Every widget type in catalog order (44 total), sorted by category then label. */
export const ALL_WIDGET_TYPES: WidgetType[] = (
  Object.keys(WIDGET_METADATA) as WidgetType[]
).sort((a, b) => {
  const catOrder: WidgetCategory[] = [
    "overview",
    "risk",
    "cyber",
    "compliance",
    "supply_chain",
    "financial",
    "operational",
    "geopolitical",
  ];
  const catDiff =
    catOrder.indexOf(WIDGET_METADATA[a].category) -
    catOrder.indexOf(WIDGET_METADATA[b].category);
  if (catDiff !== 0) return catDiff;
  return WIDGET_METADATA[a].label.localeCompare(WIDGET_METADATA[b].label);
});

export interface AllWidgetsCatalogEntry {
  id: WidgetType;
  label: string;
  uiTitle: string;
  category: WidgetCategory;
  categoryLabel: string;
  /** Role presets that ship this widget; empty = customize-only */
  roles: RoleType[];
  hasRealData: boolean;
  description: string;
  feMonitorComponent: string;
}

function rolesForWidget(id: WidgetType): RoleType[] {
  return ROLE_CONFIGS.filter((role) => role.widgets.includes(id)).map(
    (role) => role.id,
  );
}

/** Full catalog — all 44 widgets across every role (not one role preset). */
export const ALL_WIDGETS_CATALOG: AllWidgetsCatalogEntry[] = ALL_WIDGET_TYPES.map(
  (id) => {
    const meta = WIDGET_METADATA[id];
    const feMonitor = FE_MONITOR_WIDGETS.find((w) => w.id === id);
    return {
      id,
      label: meta.label,
      uiTitle: FE_MONITOR_UI_TITLES[id] ?? meta.label,
      category: meta.category,
      categoryLabel: CATEGORY_LABELS[meta.category],
      roles: rolesForWidget(id),
      hasRealData: feMonitor?.hasRealData ?? true,
      description: meta.description,
      feMonitorComponent:
        feMonitor?.componentPath ??
        `${FE_MONITOR_REPO}/src/overview/components/widgets/${id}.tsx`,
    };
  },
);

/** Widgets only available via Customize — not in any role preset. */
export const CUSTOMIZE_ONLY_WIDGETS = ALL_WIDGETS_CATALOG.filter(
  (w) => w.roles.length === 0,
).map((w) => w.id);

export function getAllWidgetsByCategory(): Record<
  WidgetCategory,
  AllWidgetsCatalogEntry[]
> {
  const grouped = {
    overview: [],
    risk: [],
    cyber: [],
    compliance: [],
    supply_chain: [],
    financial: [],
    operational: [],
    geopolitical: [],
  } as Record<WidgetCategory, AllWidgetsCatalogEntry[]>;

  for (const entry of ALL_WIDGETS_CATALOG) {
    grouped[entry.category].push(entry);
  }
  return grouped;
}

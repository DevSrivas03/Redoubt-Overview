/**
 * Chart convertibility for all 44 fe-monitor Overview widgets.
 *
 * Criteria:
 * - **Chartable** — aggregate/dimensional data (counts by category, tier, region,
 *   impact, % complete). Natural fit for bar, line, donut, gauge, or heatmap.
 * - **Not chartable** — maps, activity feeds, entity lists, or single scalar KPIs
 *   where a chart adds little vs a stat card / status label.
 */
import type { WidgetType } from "./dashboardConfig";
import { WIDGET_METADATA } from "./dashboardConfig";

export type WidgetVisualizationType =
  | "chart" // already chart-like
  | "kpi" // single number or status label
  | "list" // ranked rows or activity feed
  | "map" // geographic
  | "grid" // multi-tile KPI grid
  | "comparison"; // 2–3 side-by-side metrics (convertible to grouped bar)

export type SuggestedChartType =
  | "stacked-bar"
  | "horizontal-bar"
  | "column-bar"
  | "grouped-bar"
  | "line"
  | "heatmap"
  | "donut"
  | "gauge";

export interface WidgetChartability {
  id: WidgetType;
  label: string;
  canConvertToChart: boolean;
  currentVisualization: WidgetVisualizationType;
  /** Recommended chart when canConvertToChart is true */
  suggestedChartType?: SuggestedChartType;
  reason: string;
}

export const WIDGET_CHARTABILITY: WidgetChartability[] = [
  // ── Chartable (27) ────────────────────────────────────────────────────────
  {
    id: "risk_distribution",
    label: "Risk Distribution",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "stacked-bar",
    reason: "Alert counts by impact level — already a stacked bar.",
  },
  {
    id: "risk_heatmap",
    label: "Risk Heatmap",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "heatmap",
    reason: "Category × impact matrix — already a heatmap.",
  },
  {
    id: "risk_trend_chart",
    label: "Risk Trend Chart",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "line",
    reason: "Time-series risk scores — line chart (data stub today).",
  },
  {
    id: "risk_by_category",
    label: "Risk by Category",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "column-bar",
    reason: "Top alert categories with counts — column or bar chart.",
  },
  {
    id: "top_risks_entities",
    label: "Top Risk Companies",
    canConvertToChart: true,
    currentVisualization: "list",
    suggestedChartType: "horizontal-bar",
    reason: "Ranked entities by risk score — horizontal bar is a direct conversion.",
  },
  {
    id: "tier_breakdown",
    label: "Tier Breakdown",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "column-bar",
    reason: "Entity counts per supply-chain tier — column bar.",
  },
  {
    id: "supplier_performance",
    label: "Supplier Performance",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "column-bar",
    reason: "Average risk score per tier — bar with progress-style encoding.",
  },
  {
    id: "supplier_risk_map",
    label: "Supplier Risk Map",
    canConvertToChart: true,
    currentVisualization: "list",
    suggestedChartType: "horizontal-bar",
    reason: "Countries by high-risk supplier count — horizontal bar (not a geo map).",
  },
  {
    id: "country_risk_map",
    label: "Country Risk Map",
    canConvertToChart: true,
    currentVisualization: "list",
    suggestedChartType: "horizontal-bar",
    reason: "Countries ranked by avg risk score — horizontal bar (name is misleading).",
  },
  {
    id: "tariff_tracker",
    label: "Tariff Tracker",
    canConvertToChart: true,
    currentVisualization: "list",
    suggestedChartType: "column-bar",
    reason: "Geo alerts grouped by region — regional bar chart.",
  },
  {
    id: "vulnerability_scan",
    label: "Vulnerability Scan",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "stacked-bar",
    reason: "Cyber alerts by impact level with progress bars — stacked bar.",
  },
  {
    id: "cost_impact_analysis",
    label: "Cost Impact Analysis",
    canConvertToChart: true,
    currentVisualization: "comparison",
    suggestedChartType: "grouped-bar",
    reason: "Total, high-risk, and mitigated exposure — grouped bar.",
  },
  {
    id: "financial_exposure",
    label: "Financial Exposure",
    canConvertToChart: true,
    currentVisualization: "comparison",
    suggestedChartType: "grouped-bar",
    reason: "Total vs high-risk exposure — side-by-side bar.",
  },
  {
    id: "audit_status",
    label: "Audit Status",
    canConvertToChart: true,
    currentVisualization: "comparison",
    suggestedChartType: "donut",
    reason: "Reviewed vs total compliance alerts — donut or progress ring.",
  },
  {
    id: "certification_tracker",
    label: "Certification Tracker",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "gauge",
    reason: "% entities certified — gauge or donut.",
  },
  {
    id: "security_posture",
    label: "Security Posture",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "gauge",
    reason: "Portfolio score with progress bar — radial gauge.",
  },
  {
    id: "compliance_score",
    label: "Compliance Score",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "gauge",
    reason: "Approval rate % — gauge or donut.",
  },
  {
    id: "capacity_status",
    label: "Capacity Status",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "gauge",
    reason: "Healthy-capacity % — gauge or donut.",
  },
  {
    id: "budget_utilization",
    label: "Budget Utilization",
    canConvertToChart: true,
    currentVisualization: "chart",
    suggestedChartType: "gauge",
    reason: "High-risk share of exposure as % — gauge or donut.",
  },
  {
    id: "inventory_alerts",
    label: "Inventory Alerts",
    canConvertToChart: true,
    currentVisualization: "kpi",
    suggestedChartType: "stacked-bar",
    reason: "Total with critical/high breakdown — stacked or donut chart.",
  },
  {
    id: "sanctions_monitor",
    label: "Sanctions Monitor",
    canConvertToChart: true,
    currentVisualization: "comparison",
    suggestedChartType: "grouped-bar",
    reason: "Total, critical, and pending counts — grouped bar.",
  },
  {
    id: "phishing_attempts",
    label: "Phishing Attempts",
    canConvertToChart: true,
    currentVisualization: "kpi",
    suggestedChartType: "donut",
    reason: "Total vs critical cyber alerts — donut or stacked bar.",
  },
  {
    id: "policy_violations",
    label: "Policy Violations",
    canConvertToChart: true,
    currentVisualization: "kpi",
    suggestedChartType: "donut",
    reason: "Open vs resolved compliance items — donut.",
  },
  {
    id: "trade_war_impact",
    label: "Trade War Impact",
    canConvertToChart: true,
    currentVisualization: "comparison",
    suggestedChartType: "grouped-bar",
    reason: "Trade alerts, regions, and entity counts — grouped bar.",
  },
  {
    id: "currency_risk",
    label: "Currency Risk",
    canConvertToChart: true,
    currentVisualization: "comparison",
    suggestedChartType: "column-bar",
    reason: "Region count vs non-US entities — column comparison.",
  },
  {
    id: "single_source_risk",
    label: "Single Source Risk",
    canConvertToChart: true,
    currentVisualization: "comparison",
    suggestedChartType: "grouped-bar",
    reason: "Tier-1 total vs at-risk count — grouped bar.",
  },
  {
    id: "total_alerts_summary",
    label: "Total Alerts Summary",
    canConvertToChart: true,
    currentVisualization: "kpi",
    suggestedChartType: "donut",
    reason: "Total with extreme/high/unread chips — donut or stacked bar.",
  },

  // ── Not chartable (17) ────────────────────────────────────────────────────
  {
    id: "global_risk_map",
    label: "Global Risk Map",
    canConvertToChart: false,
    currentVisualization: "map",
    reason: "Interactive Leaflet map with geo markers and edges — map, not a chart.",
  },
  {
    id: "recent_activity",
    label: "Recent Activity",
    canConvertToChart: false,
    currentVisualization: "list",
    reason: "Chronological alert feed with titles and timestamps — list UX.",
  },
  {
    id: "breach_alerts",
    label: "Breach Alerts",
    canConvertToChart: false,
    currentVisualization: "list",
    reason: "Latest cyber alert titles — activity list, not aggregate data.",
  },
  {
    id: "regulatory_updates",
    label: "Regulatory Updates",
    canConvertToChart: false,
    currentVisualization: "list",
    reason: "Latest compliance alert headlines — feed/list.",
  },
  {
    id: "disruption_tracker",
    label: "Disruption Tracker",
    canConvertToChart: false,
    currentVisualization: "list",
    reason: "Recent disruption alert titles — feed/list.",
  },
  {
    id: "geopolitical_alerts",
    label: "Geopolitical Alerts",
    canConvertToChart: false,
    currentVisualization: "list",
    reason: "Latest geo alert headlines with region — feed/list.",
  },
  {
    id: "cases_list",
    label: "Command Centers List",
    canConvertToChart: false,
    currentVisualization: "list",
    reason: "Named command centers with alert counts — entity list.",
  },
  {
    id: "quick_stats_grid",
    label: "Quick Stats Grid",
    canConvertToChart: false,
    currentVisualization: "grid",
    reason: "Four unrelated KPI tiles — not one chartable series.",
  },
  {
    id: "critical_issues",
    label: "Critical Issues",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Single extreme-alert count — stat card is the right pattern.",
  },
  {
    id: "risk_score_overview",
    label: "Risk Score Overview",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Single avg score + delta text — KPI, not a distribution.",
  },
  {
    id: "cyber_threat_level",
    label: "Cyber Threat Level",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Ordinal status label (Low/Moderate/High) — badge, not numeric series.",
  },
  {
    id: "cyber_incidents",
    label: "Cyber Incidents",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Single active cyber alert count — scalar KPI.",
  },
  {
    id: "supply_chain_health",
    label: "Supply Chain Health",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Categorical status label (Healthy/At Risk) — status badge.",
  },
  {
    id: "active_cases",
    label: "Active Command Centers",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Single command-center count — scalar KPI.",
  },
  {
    id: "revenue_at_risk",
    label: "Revenue at Risk",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Single currency total — hero metric, not a breakdown chart.",
  },
  {
    id: "lead_time_alerts",
    label: "Lead Time Alerts",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Single supply-chain alert count — scalar KPI.",
  },
  {
    id: "ofac_sanctions",
    label: "OFAC Sanctions",
    canConvertToChart: false,
    currentVisualization: "kpi",
    reason: "Single compliance alert count — scalar KPI.",
  },
];

export const CHARTABLE_WIDGETS = WIDGET_CHARTABILITY.filter(
  (w) => w.canConvertToChart,
);

export const NON_CHARTABLE_WIDGETS = WIDGET_CHARTABILITY.filter(
  (w) => !w.canConvertToChart,
);

export const WIDGET_CHARTABILITY_SUMMARY = {
  total: WIDGET_CHARTABILITY.length,
  chartable: CHARTABLE_WIDGETS.length,
  notChartable: NON_CHARTABLE_WIDGETS.length,
  alreadyCharts: WIDGET_CHARTABILITY.filter(
    (w) => w.canConvertToChart && w.currentVisualization === "chart",
  ).length,
  bySuggestedType: CHARTABLE_WIDGETS.reduce(
    (acc, w) => {
      const type = w.suggestedChartType ?? "unknown";
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ),
} as const;

export function getWidgetChartability(
  id: WidgetType,
): WidgetChartability | undefined {
  return WIDGET_CHARTABILITY.find((w) => w.id === id);
}

/** Merge chartability with catalog label if missing */
export function getChartableWidgetsByType(
  chartType: SuggestedChartType,
): WidgetChartability[] {
  return CHARTABLE_WIDGETS.filter((w) => w.suggestedChartType === chartType);
}

// Ensure every widget type is classified
const _allTypes = Object.keys(WIDGET_METADATA) as WidgetType[];
const _classified = new Set(WIDGET_CHARTABILITY.map((w) => w.id));
if (_allTypes.some((t) => !_classified.has(t))) {
  throw new Error("WIDGET_CHARTABILITY is missing widget types");
}

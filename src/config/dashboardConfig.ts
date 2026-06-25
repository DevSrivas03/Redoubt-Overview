import { filterAvailableWidgets } from "./excludedWidgets";

export type WidgetSize = "small" | "medium" | "large" | "full";

export type WidgetCategory =
  | "overview"
  | "risk"
  | "cyber"
  | "compliance"
  | "supply_chain"
  | "financial"
  | "operational"
  | "geopolitical";

export type WidgetType =
  | "total_alerts_summary"
  | "risk_score_overview"
  | "critical_issues"
  | "quick_stats_grid"
  | "recent_activity"
  | "risk_distribution"
  | "top_risks_entities"
  | "risk_by_category"
  | "risk_trend_chart"
  | "risk_heatmap"
  | "cyber_threat_level"
  | "cyber_incidents"
  | "vulnerability_scan"
  | "security_posture"
  | "breach_alerts"
  | "phishing_attempts"
  | "compliance_score"
  | "regulatory_updates"
  | "audit_status"
  | "ofac_sanctions"
  | "certification_tracker"
  | "policy_violations"
  | "supply_chain_health"
  | "supplier_risk_map"
  | "tier_breakdown"
  | "single_source_risk"
  | "lead_time_alerts"
  | "supplier_performance"
  | "revenue_at_risk"
  | "financial_exposure"
  | "cost_impact_analysis"
  | "budget_utilization"
  | "currency_risk"
  | "active_cases"
  | "cases_list"
  | "disruption_tracker"
  | "capacity_status"
  | "inventory_alerts"
  | "geopolitical_alerts"
  | "trade_war_impact"
  | "tariff_tracker"
  | "country_risk_map"
  | "sanctions_monitor"
  | "global_risk_map";

export interface WidgetMetadata {
  category: WidgetCategory;
  defaultSize: WidgetSize;
  icon: string;
  color: string;
  label: string;
  description: string;
}

export type RoleType =
  | "default"
  | "head_of_risk"
  | "ciso"
  | "chief_supply_chain"
  | "compliance_officer"
  | "cfo"
  | "operations_director";

export type RoleAccentToken =
  | "var(--status-informational)"
  | "var(--risk-high)"
  | "var(--tertiary)"
  | "var(--status-success)"
  | "var(--status-warning)"
  | "var(--risk-medium)";

export interface RoleConfig {
  id: RoleType;
  label: string;
  icon: string;
  /** DS semantic color token for borders, icons, and accents */
  color: RoleAccentToken;
  widgets: WidgetType[];
  featured?: boolean;
}

export const CATEGORY_LABELS: Record<WidgetCategory, string> = {
  overview: "Overview",
  risk: "Risk",
  cyber: "Cyber Security",
  compliance: "Compliance",
  supply_chain: "Supply Chain",
  financial: "Financial",
  operational: "Operational",
  geopolitical: "Geopolitical",
};

export const WIDGET_METADATA: Record<WidgetType, WidgetMetadata> = {
  total_alerts_summary: {
    category: "overview",
    defaultSize: "large",
    icon: "TriangleAlert",
    color: "#3B82F6",
    label: "Total Alerts Summary",
    description: "Total alert count with extreme, high, and unread breakdown.",
  },
  risk_score_overview: {
    category: "overview",
    defaultSize: "small",
    icon: "Gauge",
    color: "#8B5CF6",
    label: "Risk Score Overview",
    description: "Average entity risk score and period-over-period delta.",
  },
  critical_issues: {
    category: "overview",
    defaultSize: "small",
    icon: "AlertTriangle",
    color: "#DC2626",
    label: "Critical Issues",
    description: "Count of extreme-impact alerts requiring immediate attention.",
  },
  quick_stats_grid: {
    category: "overview",
    defaultSize: "large",
    icon: "Grid3X3",
    color: "#3B82F6",
    label: "Quick Stats Grid",
    description: "At-a-glance counts for alerts, companies at risk, and command centers.",
  },
  recent_activity: {
    category: "overview",
    defaultSize: "large",
    icon: "Activity",
    color: "#10B981",
    label: "Recent Activity",
    description: "Latest non-archived alerts across your supply chain.",
  },
  risk_distribution: {
    category: "risk",
    defaultSize: "large",
    icon: "PieChart",
    color: "#F59E0B",
    label: "Risk Distribution",
    description: "Alert volume stacked by impact level — extreme through low.",
  },
  top_risks_entities: {
    category: "risk",
    defaultSize: "large",
    icon: "Building2",
    color: "#DC2626",
    label: "Top Risk Companies",
    description: "Highest-risk entities ranked by intelligence risk score.",
  },
  risk_by_category: {
    category: "risk",
    defaultSize: "large",
    icon: "BarChart3",
    color: "#3B82F6",
    label: "Risk by Category",
    description: "Top alert categories with counts and severity mix.",
  },
  risk_trend_chart: {
    category: "risk",
    defaultSize: "large",
    icon: "TrendingUp",
    color: "#8B5CF6",
    label: "Risk Trend Chart",
    description: "Twelve-month risk score trend across your portfolio.",
  },
  risk_heatmap: {
    category: "risk",
    defaultSize: "large",
    icon: "Grid3X3",
    color: "#EA580C",
    label: "Risk Heatmap",
    description: "Category × impact matrix for alert concentration.",
  },
  cyber_threat_level: {
    category: "cyber",
    defaultSize: "small",
    icon: "ShieldAlert",
    color: "#DC2626",
    label: "Cyber Threat Level",
    description: "Computed threat level from active cyber-category alerts.",
  },
  cyber_incidents: {
    category: "cyber",
    defaultSize: "small",
    icon: "Bug",
    color: "#F59E0B",
    label: "Cyber Incidents",
    description: "Open cyber incidents and breach-related alerts.",
  },
  vulnerability_scan: {
    category: "cyber",
    defaultSize: "medium",
    icon: "Scan",
    color: "#3B82F6",
    label: "Vulnerability Scan",
    description: "Cyber alerts broken down by impact with remediation progress.",
  },
  security_posture: {
    category: "cyber",
    defaultSize: "small",
    icon: "Shield",
    color: "#10B981",
    label: "Security Posture",
    description: "Portfolio security posture derived from average risk score.",
  },
  breach_alerts: {
    category: "cyber",
    defaultSize: "large",
    icon: "Lock",
    color: "#DC2626",
    label: "Breach Alerts",
    description: "Recent cyber alerts with breach or data-exposure indicators.",
  },
  phishing_attempts: {
    category: "cyber",
    defaultSize: "small",
    icon: "Mail",
    color: "#F59E0B",
    label: "Phishing Attempts",
    description: "Phishing and social-engineering alert counts.",
  },
  compliance_score: {
    category: "compliance",
    defaultSize: "small",
    icon: "CheckCircle",
    color: "#10B981",
    label: "Compliance Score",
    description: "Percentage of approved relationships and compliance delta.",
  },
  regulatory_updates: {
    category: "compliance",
    defaultSize: "large",
    icon: "FileText",
    color: "#3B82F6",
    label: "Regulatory Updates",
    description: "Recent compliance and regulatory change alerts.",
  },
  audit_status: {
    category: "compliance",
    defaultSize: "medium",
    icon: "ClipboardCheck",
    color: "#8B5CF6",
    label: "Audit Status",
    description: "Reviewed vs. total compliance alerts in current period.",
  },
  ofac_sanctions: {
    category: "compliance",
    defaultSize: "small",
    icon: "Ban",
    color: "#DC2626",
    label: "OFAC Sanctions",
    description: "Sanctions-screening alerts and critical match counts.",
  },
  certification_tracker: {
    category: "compliance",
    defaultSize: "medium",
    icon: "Award",
    color: "#10B981",
    label: "Certification Tracker",
    description: "Entity certification coverage across your supplier base.",
  },
  policy_violations: {
    category: "compliance",
    defaultSize: "medium",
    icon: "AlertOctagon",
    color: "#F59E0B",
    label: "Policy Violations",
    description: "Open compliance violations and unresolved items.",
  },
  supply_chain_health: {
    category: "supply_chain",
    defaultSize: "small",
    icon: "Link",
    color: "#3B82F6",
    label: "Supply Chain Health",
    description: "Overall supply chain health status and entity coverage.",
  },
  supplier_risk_map: {
    category: "supply_chain",
    defaultSize: "large",
    icon: "Globe",
    color: "#8B5CF6",
    label: "Supplier Risk Map",
    description: "Countries ranked by high-risk supplier concentration.",
  },
  tier_breakdown: {
    category: "supply_chain",
    defaultSize: "medium",
    icon: "Layers",
    color: "#3B82F6",
    label: "Tier Breakdown",
    description: "Entity counts across supply chain tiers 1–4.",
  },
  single_source_risk: {
    category: "supply_chain",
    defaultSize: "medium",
    icon: "Zap",
    color: "#F59E0B",
    label: "Single Source Risk",
    description: "Tier-1 suppliers at high or extreme risk exposure.",
  },
  lead_time_alerts: {
    category: "supply_chain",
    defaultSize: "small",
    icon: "Clock",
    color: "#EA580C",
    label: "Lead Time Alerts",
    description: "Supply-chain alerts related to lead time and delays.",
  },
  supplier_performance: {
    category: "supply_chain",
    defaultSize: "medium",
    icon: "Gauge",
    color: "#10B981",
    label: "Supplier Performance",
    description: "Average risk score and per-tier performance bars.",
  },
  revenue_at_risk: {
    category: "financial",
    defaultSize: "small",
    icon: "DollarSign",
    color: "#F59E0B",
    label: "Revenue at Risk",
    description: "Total revenue exposure from active risk alerts.",
  },
  financial_exposure: {
    category: "financial",
    defaultSize: "medium",
    icon: "Wallet",
    color: "#DC2626",
    label: "Financial Exposure",
    description: "Total vs. high-risk financial exposure comparison.",
  },
  cost_impact_analysis: {
    category: "financial",
    defaultSize: "medium",
    icon: "Calculator",
    color: "#8B5CF6",
    label: "Cost Impact Analysis",
    description: "Total, high-risk, and mitigated exposure breakdown.",
  },
  budget_utilization: {
    category: "financial",
    defaultSize: "small",
    icon: "PieChart",
    color: "#3B82F6",
    label: "Budget Utilization",
    description: "High-risk share of total financial exposure.",
  },
  currency_risk: {
    category: "financial",
    defaultSize: "small",
    icon: "Coins",
    color: "#14B8A6",
    label: "Currency Risk",
    description: "Regional and non-US entity currency exposure.",
  },
  active_cases: {
    category: "operational",
    defaultSize: "small",
    icon: "Radio",
    color: "#EC4899",
    label: "Active Command Centers",
    description: "Count of active command center investigations.",
  },
  cases_list: {
    category: "operational",
    defaultSize: "large",
    icon: "FileText",
    color: "#3B82F6",
    label: "Command Centers List",
    description: "Top command centers with linked alert counts.",
  },
  disruption_tracker: {
    category: "operational",
    defaultSize: "large",
    icon: "Siren",
    color: "#DC2626",
    label: "Disruption Tracker",
    description: "Recent operational and supply-chain disruptions.",
  },
  capacity_status: {
    category: "operational",
    defaultSize: "small",
    icon: "Gauge",
    color: "#10B981",
    label: "Capacity Status",
    description: "Healthy-capacity percentage across low-risk entities.",
  },
  inventory_alerts: {
    category: "operational",
    defaultSize: "small",
    icon: "Package",
    color: "#F59E0B",
    label: "Inventory Alerts",
    description: "Supply and operational inventory alert counts.",
  },
  geopolitical_alerts: {
    category: "geopolitical",
    defaultSize: "large",
    icon: "Globe2",
    color: "#14B8A6",
    label: "Geopolitical Alerts",
    description: "Recent geopolitical risk alerts by region.",
  },
  trade_war_impact: {
    category: "geopolitical",
    defaultSize: "medium",
    icon: "Swords",
    color: "#F59E0B",
    label: "Trade War Impact",
    description: "Trade-related alerts, affected regions, and international entities.",
  },
  tariff_tracker: {
    category: "geopolitical",
    defaultSize: "medium",
    icon: "Receipt",
    color: "#3B82F6",
    label: "Tariff Tracker",
    description: "Tariff and trade-policy alert tracking.",
  },
  country_risk_map: {
    category: "geopolitical",
    defaultSize: "large",
    icon: "Map",
    color: "#8B5CF6",
    label: "Country Risk Map",
    description: "Countries ranked by average entity risk score.",
  },
  sanctions_monitor: {
    category: "geopolitical",
    defaultSize: "medium",
    icon: "Ban",
    color: "#DC2626",
    label: "Sanctions Monitor",
    description: "Sanctions and compliance alerts with critical counts.",
  },
  global_risk_map: {
    category: "overview",
    defaultSize: "full",
    icon: "Globe",
    color: "#3B82F6",
    label: "Global Risk Map",
    description: "Interactive map of supply chain nodes and alert hotspots.",
  },
};

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: "default",
    label: "Default view",
    icon: "LayoutGrid",
    color: "var(--status-informational)",
    featured: true,
    widgets: [
      "quick_stats_grid",
      "risk_distribution",
      "top_risks_entities",
      "recent_activity",
      "risk_by_category",
      "total_alerts_summary",
    ],
  },
  {
    id: "head_of_risk",
    label: "Head of Risk and Compliance",
    icon: "ShieldCheck",
    color: "var(--risk-high)",
    featured: true,
    widgets: [
      "risk_score_overview",
      "critical_issues",
      "risk_distribution",
      "risk_trend_chart",
      "top_risks_entities",
      "risk_heatmap",
      "compliance_score",
      "financial_exposure",
    ],
  },
  {
    id: "ciso",
    label: "CISO",
    icon: "Lock",
    color: "var(--tertiary)",
    featured: true,
    widgets: [
      "cyber_threat_level",
      "security_posture",
      "cyber_incidents",
      "breach_alerts",
      "vulnerability_scan",
      "phishing_attempts",
      "compliance_score",
      "recent_activity",
    ],
  },
  {
    id: "chief_supply_chain",
    label: "Chief Supply Chain Officer",
    icon: "Box",
    color: "var(--status-success)",
    featured: true,
    widgets: [
      "supply_chain_health",
      "tier_breakdown",
      "single_source_risk",
      "supplier_risk_map",
      "lead_time_alerts",
      "supplier_performance",
      "disruption_tracker",
      "inventory_alerts",
    ],
  },
  {
    id: "compliance_officer",
    label: "Compliance Officer",
    icon: "Scale",
    color: "var(--status-success)",
    widgets: [
      "compliance_score",
      "regulatory_updates",
      "audit_status",
      "ofac_sanctions",
      "certification_tracker",
      "policy_violations",
      "sanctions_monitor",
      "recent_activity",
    ],
  },
  {
    id: "cfo",
    label: "CFO",
    icon: "DollarSign",
    color: "var(--status-warning)",
    widgets: [
      "revenue_at_risk",
      "financial_exposure",
      "cost_impact_analysis",
      "budget_utilization",
      "currency_risk",
      "risk_score_overview",
      "tariff_tracker",
      "trade_war_impact",
    ],
  },
  {
    id: "operations_director",
    label: "Operations Director",
    icon: "Settings",
    color: "var(--risk-medium)",
    widgets: [
      "active_cases",
      "cases_list",
      "disruption_tracker",
      "capacity_status",
      "inventory_alerts",
      "lead_time_alerts",
      "supply_chain_health",
      "recent_activity",
    ],
  },
];

export const FEATURED_ROLES = ROLE_CONFIGS.filter((r) => r.featured);

export function getWidgetLabel(type: WidgetType): string {
  return WIDGET_METADATA[type].label;
}

export function getWidgetsByCategory(): Record<WidgetCategory, WidgetType[]> {
  const grouped = {} as Record<WidgetCategory, WidgetType[]>;
  (Object.keys(CATEGORY_LABELS) as WidgetCategory[]).forEach((cat) => {
    grouped[cat] = [];
  });
  filterAvailableWidgets(Object.keys(WIDGET_METADATA) as WidgetType[]).forEach(
    (type) => {
      grouped[WIDGET_METADATA[type].category].push(type);
    },
  );
  return grouped;
}

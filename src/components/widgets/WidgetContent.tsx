import React from "react";
import { Box, Typography } from "ds/index";
import type { WidgetType } from "@/config/dashboardConfig";
import { getWidgetChartability } from "@/config/widgetChartability";
import {
  ColumnBarChart,
  DonutChart,
  formatCurrency,
  GaugeChart,
  GroupedBarChart,
  HeatmapChart,
  HorizontalBarChart,
  LineChart,
  QuickStatsGrid,
  StackedBarChart,
} from "@/components/charts/OverviewCharts";
import {
  computeOverviewAnalytics,
  filterAlerts,
  impactCount,
} from "@/lib/overviewAnalytics";
import { chartColorAt, formatCategoryKey } from "@/lib/chartLabels";
import { DS } from "@/lib/dsTokens";
import { chartFadeInSx, useChartEnter } from "@/lib/chartMotion";
import { RISK_COLORS, RISK_LEVELS } from "@/lib/riskColors";
import type { OverviewData } from "@/types/overview";

interface WidgetContentProps {
  type: WidgetType;
  data: OverviewData;
}

function Kpi({
  value,
  subtitle,
  color,
}: {
  value: React.ReactNode;
  subtitle?: string;
  color?: string;
}): React.ReactElement {
  const entered = useChartEnter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "var(--2xs)",
        minHeight: "100%",
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(8px)",
        ...chartFadeInSx(0),
      }}
    >
      <Typography
        variant="h2"
        component="p"
        sx={{
          fontWeight: 700,
          fontSize: { xs: 36, sm: 42 },
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: color ?? DS.onSurface,
          fontFamily: DS.fontFamily,
        }}
      >
        {value}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{
            color: DS.onSurfaceVariant,
            fontSize: "var(--body-2-size)",
            lineHeight: 1.4,
            maxWidth: 280,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function AlertList({
  items,
  empty = "No items",
}: {
  items: { id: string; title: string; meta?: string }[];
  empty?: string;
}): React.ReactElement {
  if (items.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "var(--on-surface-variant)" }}>
        {empty}
      </Typography>
    );
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--2xs)" }}>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: "var(--sm)",
            py: "var(--xs)",
            borderBottom: "1px solid var(--outline-variant)",
            "&:last-child": { borderBottom: "none" },
          }}
        >
          <Typography variant="body2" sx={{ color: "var(--on-surface)", minWidth: 0 }}>
            {item.title}
          </Typography>
          {item.meta && (
            <Typography variant="caption" sx={{ color: "var(--on-surface-variant)", flexShrink: 0 }}>
              {item.meta}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

export function WidgetContent({ type, data }: WidgetContentProps): React.ReactElement {
  const { stats } = data;
  const analytics = React.useMemo(() => computeOverviewAnalytics(data), [data]);
  const chartability = getWidgetChartability(type);

  if (chartability?.canConvertToChart) {
    switch (type) {
      case "risk_distribution":
        return (
          <StackedBarChart
            segments={RISK_LEVELS.map((l) => ({
              label: l.label,
              value:
                l.key === "extreme"
                  ? stats.extremeAlerts
                  : l.key === "high"
                    ? stats.highAlerts
                    : l.key === "medium"
                      ? stats.mediumAlerts
                      : stats.lowAlerts,
              color: RISK_COLORS[l.key],
            }))}
          />
        );
      case "risk_by_category":
        return (
          <ColumnBarChart
            items={analytics.categoryBreakdown.map(([key, value], i) => ({
              label: formatCategoryKey(key),
              value,
              color: chartColorAt(i),
            }))}
          />
        );
      case "top_risks_entities":
        return (
          <HorizontalBarChart
            items={data.topRiskEntities.map((e) => ({
              label: e.name,
              value: e.riskScore,
              color: RISK_COLORS[e.riskLevel],
            }))}
          />
        );
      case "tier_breakdown":
        return (
          <ColumnBarChart
            items={[1, 2, 3, 4].map((tier) => ({
              label: `T${tier}`,
              value: analytics.tierCounts[tier] ?? 0,
              color: "var(--primary)",
            }))}
          />
        );
      case "supplier_performance":
        return (
          <HorizontalBarChart
            items={[1, 2, 3, 4].map((tier) => ({
              label: `Tier ${tier}`,
              value: analytics.tierRiskAvg[tier] ?? 0,
              color: "var(--status-success)",
            }))}
            maxValue={100}
          />
        );
      case "supplier_risk_map":
        return (
          <HorizontalBarChart
            items={analytics.countryHighRisk.map(([country, value]) => ({
              label: country,
              value,
              color: "var(--risk-high)",
            }))}
          />
        );
      case "country_risk_map":
        return (
          <HorizontalBarChart
            items={analytics.countryAvgRisk.map(([country, value]) => ({
              label: country,
              value,
              color: "var(--tertiary)",
            }))}
            maxValue={100}
          />
        );
      case "tariff_tracker":
        return (
          <ColumnBarChart
            items={analytics.regionGeoCounts.slice(0, 5).map(([label, value]) => ({
              label,
              value,
              color: "var(--primary)",
            }))}
          />
        );
      case "vulnerability_scan": {
        const cyber = filterAlerts(data, (a) => a.category === "cyber");
        return (
          <StackedBarChart
            segments={RISK_LEVELS.map((l) => ({
              label: l.label,
              value: impactCount(cyber, l.key),
              color: RISK_COLORS[l.key],
            }))}
          />
        );
      }
      case "financial_exposure":
        return (
          <GroupedBarChart
            formatValue={formatCurrency}
            groups={[
              { label: "Total", value: analytics.financialExposure.total, color: RISK_COLORS.medium },
              { label: "High risk", value: analytics.financialExposure.highRisk, color: RISK_COLORS.high },
            ]}
          />
        );
      case "cost_impact_analysis":
        return (
          <GroupedBarChart
            formatValue={formatCurrency}
            groups={[
              { label: "Total", value: analytics.financialExposure.total, color: DS.primary },
              { label: "High risk", value: analytics.financialExposure.highRisk, color: RISK_COLORS.high },
              { label: "Mitigated", value: analytics.financialExposure.mitigated, color: DS.statusSuccess },
            ]}
          />
        );
      case "audit_status":
        return (
          <DonutChart
            centerLabel={`${analytics.auditTotal > 0 ? Math.round((analytics.auditReviewed / analytics.auditTotal) * 100) : 0}%`}
            segments={[
              { label: "Reviewed", value: analytics.auditReviewed, color: "var(--status-success)" },
              {
                label: "Pending",
                value: Math.max(0, analytics.auditTotal - analytics.auditReviewed),
                color: "var(--outline-variant)",
              },
            ]}
          />
        );
      case "certification_tracker":
        return (
          <GaugeChart value={analytics.certificationPercent} label="Entities certified" color="var(--status-success)" />
        );
      case "security_posture":
        return (
          <GaugeChart value={analytics.securityPostureScore} label="Portfolio posture" color="var(--tertiary)" />
        );
      case "compliance_score":
        return (
          <GaugeChart value={analytics.complianceScore} label="Approved relationships" color="var(--status-success)" />
        );
      case "capacity_status":
        return (
          <GaugeChart value={analytics.capacityPercent} label="Healthy capacity" color="var(--status-success)" />
        );
      case "budget_utilization":
        return (
          <GaugeChart
            value={analytics.budgetUtilizationPercent}
            label="Allocated to high risk"
            color="var(--primary)"
          />
        );
      case "inventory_alerts": {
        const inv = filterAlerts(
          data,
          (a) => a.category === "supply_chain" || a.category === "operational",
        );
        return (
          <DonutChart
            centerLabel={String(inv.length)}
            segments={[
              { label: "Extreme", value: impactCount(inv, "extreme"), color: RISK_COLORS.extreme },
              { label: "High", value: impactCount(inv, "high"), color: RISK_COLORS.high },
              {
                label: "Other",
                value: Math.max(0, inv.length - impactCount(inv, "extreme") - impactCount(inv, "high")),
                color: "var(--outline-variant)",
              },
            ]}
          />
        );
      }
      case "sanctions_monitor": {
        const s = filterAlerts(
          data,
          (a) => a.category === "compliance" || a.category === "geopolitical",
        );
        return (
          <GroupedBarChart
            groups={[
              { label: "Total", value: s.length, color: "var(--on-surface)" },
              { label: "Critical", value: impactCount(s, "extreme"), color: "var(--risk-high)" },
              { label: "Pending", value: s.filter((a) => !a.isReviewed).length, color: "var(--risk-medium)" },
            ]}
          />
        );
      }
      case "phishing_attempts": {
        const cyber = filterAlerts(data, (a) => a.category === "cyber");
        return (
          <DonutChart
            segments={[
              { label: "Critical", value: impactCount(cyber, "extreme"), color: RISK_COLORS.extreme },
              {
                label: "Other",
                value: Math.max(0, cyber.length - impactCount(cyber, "extreme")),
                color: "var(--primary)",
              },
            ]}
          />
        );
      }
      case "policy_violations": {
        const comp = filterAlerts(data, (a) => a.category === "compliance");
        const open = comp.filter((a) => !a.isReviewed).length;
        return (
          <DonutChart
            segments={[
              { label: "Open", value: open, color: "var(--risk-high)" },
              { label: "Resolved", value: Math.max(0, comp.length - open), color: "var(--status-success)" },
            ]}
          />
        );
      }
      case "trade_war_impact":
        return (
          <GroupedBarChart
            groups={[
              {
                label: "Alerts",
                value: filterAlerts(data, (a) => a.category === "geopolitical").length,
                color: "var(--risk-medium)",
              },
              { label: "Regions", value: analytics.regionGeoCounts.length, color: "var(--primary)" },
              {
                label: "Intl entities",
                value: data.entities.filter((e) => e.country && e.country !== "US").length,
                color: "var(--tertiary)",
              },
            ]}
          />
        );
      case "currency_risk":
        return (
          <GroupedBarChart
            groups={[
              { label: "Regions", value: new Set(data.entities.map((e) => e.country).filter(Boolean)).size, color: "var(--primary)" },
              {
                label: "Non-US",
                value: data.entities.filter((e) => e.country && e.country !== "US").length,
                color: "var(--tertiary)",
              },
            ]}
          />
        );
      case "single_source_risk": {
        const tier1 = data.entities.filter((e) => e.tier === 1);
        const atRisk = tier1.filter((e) => e.riskLevel === "extreme" || e.riskLevel === "high");
        return (
          <GroupedBarChart
            groups={[
              { label: "Tier 1", value: tier1.length, color: "var(--on-surface)" },
              { label: "At risk", value: atRisk.length, color: "var(--risk-high)" },
            ]}
          />
        );
      }
      case "total_alerts_summary":
        return (
          <DonutChart
            centerLabel={String(stats.totalAlerts)}
            segments={[
              { label: "Extreme", value: stats.extremeAlerts, color: RISK_COLORS.extreme },
              { label: "High", value: stats.highAlerts, color: RISK_COLORS.high },
              { label: "Unread", value: stats.unreadAlerts, color: "var(--primary)" },
            ]}
          />
        );
      case "risk_heatmap": {
        const categories = analytics.categoryBreakdown.map(([c]) => c).slice(0, 4);
        const columns = RISK_LEVELS.map((l) => l.label);
        const values: Record<string, Record<string, number>> = {};
        categories.forEach((cat) => {
          const rowLabel = formatCategoryKey(cat);
          values[rowLabel] = {};
          RISK_LEVELS.forEach((l) => {
            values[rowLabel][l.label] = data.alerts.filter(
              (a) => a.category === cat && a.impact === l.key,
            ).length;
          });
        });
        return (
          <HeatmapChart
            rows={categories.map(formatCategoryKey)}
            columns={columns}
            values={values}
          />
        );
      }
      case "risk_trend_chart":
        return (
          <LineChart
            points={analytics.riskTrendPoints.map((p) => ({ label: p.month, value: p.value }))}
          />
        );
      default:
        break;
    }
  }

  switch (type) {
    case "risk_score_overview":
      return (
        <Kpi
          value={stats.avgRiskScore}
          subtitle={
            stats.riskScoreDelta != null
              ? `${stats.riskScoreDelta > 0 ? "+" : ""}${stats.riskScoreDelta} vs last month`
              : "No comparison data"
          }
        />
      );
    case "critical_issues":
      return (
        <Kpi
          value={stats.extremeAlerts}
          subtitle={stats.extremeAlerts > 0 ? "Requires immediate attention" : "No critical issues"}
          color="var(--risk-high)"
        />
      );
    case "quick_stats_grid":
      return (
        <QuickStatsGrid
          items={[
            { label: "Extreme alerts", value: stats.extremeAlerts, color: RISK_COLORS.extreme },
            { label: "High alerts", value: stats.highAlerts, color: RISK_COLORS.high },
            { label: "Entities at risk", value: stats.entitiesAtRisk, color: "var(--risk-medium)" },
            { label: "Command centers", value: stats.activeCommandCenters, color: DS.statusInformational },
          ]}
        />
      );
    case "recent_activity":
      return (
        <AlertList
          items={data.recentAlerts.map((a) => ({
            id: a.id,
            title: a.title,
            meta: a.impact.toUpperCase(),
          }))}
        />
      );
    case "breach_alerts":
      return (
        <AlertList
          items={filterAlerts(data, (a) => a.category === "cyber")
            .slice(0, 4)
            .map((a) => ({ id: a.id, title: a.title }))}
          empty="No breach alerts"
        />
      );
    case "regulatory_updates":
      return (
        <AlertList
          items={filterAlerts(data, (a) => a.category === "compliance")
            .slice(0, 4)
            .map((a) => ({ id: a.id, title: a.title }))}
          empty="No regulatory updates"
        />
      );
    case "disruption_tracker":
      return (
        <AlertList
          items={filterAlerts(
            data,
            (a) => a.category === "operational" || a.category === "supply_chain",
          )
            .slice(0, 4)
            .map((a) => ({ id: a.id, title: a.title }))}
          empty="No disruptions"
        />
      );
    case "geopolitical_alerts":
      return (
        <AlertList
          items={filterAlerts(data, (a) => a.category === "geopolitical")
            .slice(0, 4)
            .map((a) => ({ id: a.id, title: a.title, meta: a.region }))}
          empty="No geopolitical alerts"
        />
      );
    case "cases_list":
      return (
        <AlertList
          items={data.commandCenters.slice(0, 3).map((cc) => ({
            id: cc.id,
            title: cc.name,
            meta: `${cc.alertCount} alerts`,
          }))}
          empty="No command centers"
        />
      );
    case "cyber_threat_level":
      return <Kpi value={analytics.cyberThreatLevel} subtitle="Active cyber threat level" color="var(--risk-medium)" />;
    case "cyber_incidents":
      return (
        <Kpi
          value={filterAlerts(data, (a) => a.category === "cyber").length}
          subtitle="Active cyber incidents"
        />
      );
    case "supply_chain_health":
      return (
        <Kpi
          value={analytics.supplyChainStatus}
          subtitle={`${data.entities.length} companies monitored`}
          color="var(--status-success)"
        />
      );
    case "active_cases":
      return (
        <Kpi value={stats.activeCommandCenters} subtitle="Active command centers" color="var(--risk-high)" />
      );
    case "revenue_at_risk":
      return (
        <Kpi
          value={formatCurrency(analytics.revenueAtRisk)}
          subtitle="Total revenue exposure"
          color="var(--risk-high)"
        />
      );
    case "lead_time_alerts":
      return (
        <Kpi
          value={filterAlerts(data, (a) => a.category === "supply_chain").length}
          subtitle="Supply chain timing alerts"
        />
      );
    case "ofac_sanctions":
      return (
        <Kpi
          value={filterAlerts(data, (a) => a.category === "compliance").length}
          subtitle="Compliance screening alerts"
        />
      );
    default:
      return (
        <Typography variant="body2" sx={{ color: "var(--on-surface-variant)" }}>
          Widget not configured.
        </Typography>
      );
  }
}

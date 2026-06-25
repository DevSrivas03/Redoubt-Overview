import React from "react";
import { Box, Typography } from "ds/index";
import { GripVertical } from "lucide-react";
import { WIDGET_METADATA } from "@/config/dashboardConfig";
import { FE_MONITOR_UI_TITLES } from "@/config/feMonitorWidgets";
import { WidgetContent } from "@/components/widgets/WidgetContent";
import { DS } from "@/lib/dsTokens";
import type { OverviewData } from "@/types/overview";
import type { WidgetType } from "@/config/dashboardConfig";

interface DashboardWidgetCardProps {
  type: WidgetType;
  data: OverviewData;
}

function getWidgetTitle(type: WidgetType): string {
  return FE_MONITOR_UI_TITLES[type] ?? WIDGET_METADATA[type].label;
}

const KPI_WIDGET_TYPES = new Set<WidgetType>([
  "risk_score_overview",
  "critical_issues",
  "cyber_threat_level",
  "cyber_incidents",
  "supply_chain_health",
  "active_cases",
  "revenue_at_risk",
  "lead_time_alerts",
  "ofac_sanctions",
]);

export function DashboardWidgetCard({
  type,
  data,
}: DashboardWidgetCardProps): React.ReactElement {
  const meta = WIDGET_METADATA[type];
  const accent = meta.color;
  const isKpi = KPI_WIDGET_TYPES.has(type);

  return (
    <Box
      className="overview-widget-card"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: DS.surface,
        border: `1px solid ${DS.outlineVariant}`,
        borderRadius: "var(--corner-large)",
        boxShadow: "var(--elevation-1)",
        overflow: "hidden",
        transition: [
          "border-color 200ms ease",
          "box-shadow 200ms ease",
        ].join(", "),
      }}
    >
      <Box
        className="widget-drag-handle"
        title="Drag to move"
        aria-label={`${getWidgetTitle(type)}. Drag to move.`}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "var(--sm)",
          px: "var(--md)",
          py: "var(--xs)",
          minHeight: 44,
          flexShrink: 0,
          borderBottom: `1px solid color-mix(in srgb, ${DS.outlineVariant} 70%, transparent)`,
          backgroundColor: DS.surface,
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
          "&:active": { cursor: "grabbing" },
          "&:hover .widget-grip": {
            backgroundColor: DS.surfaceContainerLow,
            color: DS.onSurface,
          },
        }}
      >
        <Box
          className="widget-grip"
          aria-hidden
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: "var(--corner-small)",
            color: DS.onSurfaceVariant,
            flexShrink: 0,
            transition: "background-color 150ms ease, color 150ms ease",
          }}
        >
          <GripVertical size={14} strokeWidth={2.5} />
        </Box>

        <Box
          aria-hidden
          sx={{
            width: 3,
            height: 18,
            borderRadius: 2,
            backgroundColor: accent,
            flexShrink: 0,
          }}
        />

        <Typography
          variant="subtitle2"
          component="h3"
          sx={{
            fontWeight: 600,
            fontSize: "var(--body-2-size)",
            lineHeight: 1.3,
            letterSpacing: "-0.01em",
            color: DS.onSurface,
            fontFamily: DS.fontFamily,
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {getWidgetTitle(type)}
        </Typography>
      </Box>

      <Box
        className="widget-body-interactive"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          px: "var(--md)",
          py: "var(--md)",
          minHeight: 0,
          height: "100%",
          justifyContent: isKpi ? "center" : "stretch",
          "& > *": {
            flex: isKpi ? undefined : 1,
            minHeight: isKpi ? undefined : 0,
            width: "100%",
          },
        }}
      >
        <WidgetContent type={type} data={data} />
      </Box>
    </Box>
  );
}

import React from "react";
import { Box, Typography } from "ds/index";
import { WIDGET_METADATA } from "@/config/dashboardConfig";
import { isWidgetExcluded } from "@/config/excludedWidgets";
import { FE_MONITOR_UI_TITLES } from "@/config/feMonitorWidgets";
import { WidgetContent } from "@/components/widgets/WidgetContent";
import type { OverviewData } from "@/types/overview";
import { useDashboardStore, getEnabledWidgets } from "@/stores/dashboardStore";

interface DashboardWidgetGridProps {
  data: OverviewData;
  variant?: "default" | "overlay";
}

function getWidgetTitle(type: keyof typeof WIDGET_METADATA): string {
  return FE_MONITOR_UI_TITLES[type] ?? WIDGET_METADATA[type].label;
}

function getWidgetGridSpan(size: (typeof WIDGET_METADATA)[keyof typeof WIDGET_METADATA]["defaultSize"]) {
  switch (size) {
    case "large":
      return { gridColumn: { xs: "span 1", sm: "span 2" } };
    case "full":
      return { gridColumn: { xs: "span 1", sm: "span 2", lg: "span 4" } };
    default:
      return { gridColumn: "span 1" };
  }
}

export function DashboardWidgetGrid({
  data,
  variant = "default",
}: DashboardWidgetGridProps): React.ReactElement {
  const { widgets } = useDashboardStore();
  const enabled = getEnabledWidgets(widgets).filter((w) => !isWidgetExcluded(w.type));
  const isOverlay = variant === "overlay";

  if (enabled.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: "var(--on-surface-variant)" }}>
        No widgets on this dashboard. Add widgets via Customize.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: { xs: "var(--sm)", sm: "var(--md)" },
        "@keyframes overview-widget-enter": {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {enabled.map((widget, index) => {
        const meta = WIDGET_METADATA[widget.type];
        const accent = meta.color;

        return (
          <Box
            key={widget.id}
            sx={{
              ...getWidgetGridSpan(meta.defaultSize),
              position: "relative",
              display: "flex",
              flexDirection: "column",
              minHeight: meta.defaultSize === "small" ? 200 : 240,
              p: { xs: "var(--md)", sm: "var(--lg)" },
              backgroundColor: "var(--surface)",
              border: "1px solid var(--outline-variant)",
              borderRadius: "var(--corner-large)",
              boxShadow: isOverlay
                ? "0 1px 2px rgba(60, 64, 67, 0.08), 0 1px 3px rgba(60, 64, 67, 0.04)"
                : "none",
              overflow: "hidden",
              transition: [
                "border-color var(--motion-enter-quick-duration) var(--motion-enter-quick-easing)",
                "box-shadow var(--motion-enter-duration) var(--motion-enter-easing)",
                "transform var(--motion-enter-quick-duration) var(--motion-enter-quick-easing)",
              ].join(", "),
              "@media (prefers-reduced-motion: no-preference)": {
                animation: isOverlay
                  ? `overview-widget-enter 0.5s var(--motion-enter-easing, ease) ${index * 40}ms both`
                  : "none",
                "&:hover": {
                  borderColor: "color-mix(in srgb, var(--outline) 80%, transparent)",
                  boxShadow: isOverlay
                    ? "0 2px 6px rgba(60, 64, 67, 0.12), 0 4px 12px rgba(60, 64, 67, 0.06)"
                    : "var(--elevation-1)",
                  transform: "translateY(-2px)",
                },
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                width: 3,
                backgroundColor: accent,
                borderRadius: "var(--corner-large) 0 0 var(--corner-large)",
              },
            }}
          >
            <Typography
              variant="subtitle2"
              component="h3"
              sx={{
                fontWeight: 700,
                fontSize: "var(--body-1-size)",
                color: "var(--on-surface)",
                mb: "var(--md)",
                pl: "var(--2xs)",
                fontFamily: "var(--font-family-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {getWidgetTitle(widget.type)}
            </Typography>
            <Box sx={{ flex: 1, pl: "var(--2xs)" }}>
              <WidgetContent type={widget.type} data={data} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

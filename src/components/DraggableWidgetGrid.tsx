import React from "react";
import GridLayout, { WidthProvider, type Layout, type LayoutItem } from "react-grid-layout/legacy";
import { Box, Typography } from "ds/index";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { DashboardWidgetCard } from "@/components/widgets/DashboardWidgetCard";
import { WIDGET_METADATA } from "@/config/dashboardConfig";
import { isWidgetExcluded } from "@/config/excludedWidgets";
import {
  GRID_COLS,
  GRID_MARGIN,
  GRID_ROW_HEIGHT,
  getHeightConstraints,
  getWidthConstraints,
  gridContentHeight,
  normalizeLayout,
} from "@/lib/dashboardLayout";
import { DS } from "@/lib/dsTokens";
import type { OverviewData } from "@/types/overview";
import { getEnabledWidgets, useDashboardStore } from "@/stores/dashboardStore";

const AutoWidthGrid = WidthProvider(GridLayout);

const MOTION_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

interface DraggableWidgetGridProps {
  data: OverviewData;
}

function toGridItems(
  enabled: ReturnType<typeof getEnabledWidgets>,
): LayoutItem[] {
  return enabled.map((widget) => {
    const meta = WIDGET_METADATA[widget.type];
    const { minW, maxW } = getWidthConstraints(meta.defaultSize);
    const { minH, maxH } = getHeightConstraints(meta.defaultSize);

    return {
      i: widget.id,
      x: widget.layout.x,
      y: widget.layout.y,
      w: widget.layout.w,
      h: widget.layout.h,
      minW,
      maxW,
      minH: widget.layout.minH ?? minH,
      maxH: widget.layout.maxH ?? maxH,
    };
  });
}

/** Strip default react-resizable chevron graphics — we draw our own handles. */
const RESIZE_HANDLE_BASE = {
  backgroundImage: "none !important",
  transform: "none !important",
  margin: "0 !important",
  padding: "0 !important",
  background: "transparent",
  border: "none",
  opacity: 0,
  transition: "opacity 180ms ease",
} as const;

export function DraggableWidgetGrid({
  data,
}: DraggableWidgetGridProps): React.ReactElement {
  const { widgets, updateWidgetLayouts, setLiveMessage } = useDashboardStore();
  const enabled = getEnabledWidgets(widgets).filter((w) => !isWidgetExcluded(w.type));

  const storeLayout = React.useMemo(() => toGridItems(enabled), [enabled]);
  const [activeLayout, setActiveLayout] = React.useState<Layout>(storeLayout);
  const isInteracting = React.useRef(false);

  React.useEffect(() => {
    if (!isInteracting.current) {
      setActiveLayout(storeLayout);
    }
  }, [storeLayout]);

  const canvasHeight = gridContentHeight(enabled.map((w) => w.layout));

  const commitLayout = React.useCallback(
    (raw: Layout) => {
      const normalized = normalizeLayout(
        [...raw],
        enabled.map((w) => ({ id: w.id, type: w.type })),
      );
      setActiveLayout(normalized);
      updateWidgetLayouts(
        normalized.map((item) => ({
          i: item.i,
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        })),
        { announce: false },
      );
      setLiveMessage("Layout updated");
    },
    [enabled, setLiveMessage, updateWidgetLayouts],
  );

  const handleInteractionStart = React.useCallback(() => {
    isInteracting.current = true;
  }, []);

  const handleInteractionStop = React.useCallback(
    (raw: Layout) => {
      isInteracting.current = false;
      commitLayout(raw);
    },
    [commitLayout],
  );

  if (enabled.length === 0) {
    return (
      <Typography variant="body2" sx={{ color: DS.onSurfaceVariant, p: "var(--lg)" }}>
        No widgets on this dashboard. Add widgets via Customize.
      </Typography>
    );
  }

  return (
    <Box
      aria-label="Dashboard widgets. Drag headers to move. Resize from bottom, right, or corner."
      sx={{
        position: "relative",
        minHeight: canvasHeight,
        "& .react-grid-layout": {
          minHeight: canvasHeight,
        },
        "& .react-grid-item": {
          transition: `transform 260ms ${MOTION_EASE}, width 260ms ${MOTION_EASE}, height 260ms ${MOTION_EASE}`,
        },
        "& .react-grid-item:hover": {
          "& .overview-widget-card": {
            borderColor: `color-mix(in srgb, ${DS.outline} 55%, transparent)`,
            boxShadow: "var(--elevation-2)",
          },
          "& .react-resizable-handle": {
            opacity: 1,
          },
        },
        "& .react-grid-item.react-draggable-dragging": {
          zIndex: 20,
          "& .overview-widget-card": {
            boxShadow: "var(--elevation-3, var(--elevation-2))",
            borderColor: `color-mix(in srgb, ${DS.primary} 35%, ${DS.outlineVariant})`,
          },
          transition: "none",
        },
        "& .react-grid-item.resizing": {
          zIndex: 20,
          transition: "none",
          "& .react-resizable-handle": {
            opacity: 1,
          },
        },
        "& .react-grid-item.react-grid-placeholder": {
          background: `color-mix(in srgb, ${DS.primary} 8%, transparent)`,
          border: `1.5px solid color-mix(in srgb, ${DS.primary} 28%, transparent)`,
          borderRadius: "var(--corner-large)",
          opacity: 1,
          transition: `transform 200ms ${MOTION_EASE}, width 200ms ${MOTION_EASE}, height 200ms ${MOTION_EASE}`,
        },
        "& .react-resizable-handle": RESIZE_HANDLE_BASE,
        "& .react-resizable-handle-s": {
          ...RESIZE_HANDLE_BASE,
          height: 14,
          width: 48,
          left: "50%",
          bottom: 2,
          marginLeft: "-24px !important",
          cursor: "ns-resize",
          "&::after": {
            content: '""',
            position: "absolute",
            left: "50%",
            top: 5,
            transform: "translateX(-50%)",
            width: 32,
            height: 4,
            borderRadius: 99,
            backgroundColor: `color-mix(in srgb, ${DS.onSurfaceVariant} 55%, transparent)`,
          },
        },
        "& .react-resizable-handle-e": {
          ...RESIZE_HANDLE_BASE,
          width: 14,
          height: 48,
          top: "50%",
          right: 2,
          marginTop: "-24px !important",
          cursor: "ew-resize",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "50%",
            right: 5,
            transform: "translateY(-50%)",
            width: 4,
            height: 32,
            borderRadius: 99,
            backgroundColor: `color-mix(in srgb, ${DS.onSurfaceVariant} 55%, transparent)`,
          },
        },
        "& .react-resizable-handle-se": {
          ...RESIZE_HANDLE_BASE,
          width: 20,
          height: 20,
          right: 4,
          bottom: 4,
          cursor: "se-resize",
          opacity: 0,
          "&::after": {
            content: '""',
            position: "absolute",
            right: 5,
            bottom: 5,
            width: 8,
            height: 8,
            borderRight: `2px solid color-mix(in srgb, ${DS.onSurfaceVariant} 70%, transparent)`,
            borderBottom: `2px solid color-mix(in srgb, ${DS.onSurfaceVariant} 70%, transparent)`,
          },
        },
        "@media (prefers-reduced-motion: reduce)": {
          "& .react-grid-item, & .react-grid-item.react-grid-placeholder": {
            transition: "none !important",
          },
        },
      }}
    >
      <AutoWidthGrid
        className="overview-widget-grid"
        layout={activeLayout}
        cols={GRID_COLS}
        rowHeight={GRID_ROW_HEIGHT}
        margin={GRID_MARGIN}
        containerPadding={[0, 0]}
        draggableHandle=".widget-drag-handle"
        draggableCancel=".widget-body-interactive, .react-resizable-handle, button, a, input, textarea, select"
        resizeHandles={["s", "e", "se"]}
        compactType="vertical"
        preventCollision={false}
        useCSSTransforms
        onDragStart={handleInteractionStart}
        onResizeStart={handleInteractionStart}
        onLayoutChange={(next) => {
          if (isInteracting.current) {
            setActiveLayout([...next]);
          }
        }}
        onDragStop={handleInteractionStop}
        onResizeStop={handleInteractionStop}
      >
        {enabled.map((widget) => (
          <Box key={widget.id} sx={{ height: "100%" }}>
            <DashboardWidgetCard type={widget.type} data={data} />
          </Box>
        ))}
      </AutoWidthGrid>
    </Box>
  );
}

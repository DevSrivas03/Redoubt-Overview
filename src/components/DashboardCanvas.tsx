import React from "react";
import { Box } from "ds/index";
import { DraggableWidgetGrid } from "@/components/DraggableWidgetGrid";
import { DS } from "@/lib/dsTokens";
import type { OverviewData } from "@/types/overview";

interface DashboardCanvasProps {
  data: OverviewData;
}

export function DashboardCanvas({ data }: DashboardCanvasProps): React.ReactElement {
  return (
    <Box
      component="section"
      aria-label="Dashboard workspace"
      sx={{
        position: "relative",
        borderRadius: "var(--corner-large)",
        border: `1px solid ${DS.outlineVariant}`,
        backgroundColor: DS.surfaceContainerLow,
        p: { xs: "var(--sm)", sm: "var(--md)", lg: "var(--lg)" },
      }}
    >
      <DraggableWidgetGrid data={data} />
    </Box>
  );
}

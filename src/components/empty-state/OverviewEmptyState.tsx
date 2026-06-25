import React from "react";
import { Box, Button, Typography } from "ds/index";
import { LayoutGrid, Plus } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";

/** @deprecated Pre–UX-overhaul empty state. Kept for easy revert — swap back into OverviewPage. */
export function OverviewEmptyState(): React.ReactElement {
  const { setCustomizeOpen } = useDashboardStore();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: "var(--3xl)",
        px: "var(--xl)",
        borderRadius: "var(--corner-large)",
        border: "2px dashed var(--outline-variant)",
        backgroundColor: "var(--surface-container-lowest)",
        minHeight: 340,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 420,
        }}
      >
        <LayoutGrid
          size={56}
          strokeWidth={1.25}
          color="var(--on-surface-variant)"
          style={{ opacity: 0.35, marginBottom: 16 }}
        />

        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "var(--on-surface)",
            textAlign: "center",
            mb: "var(--xs)",
          }}
        >
          Add a widget to your report
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "var(--on-surface-variant)",
            textAlign: "center",
            mb: "var(--xl)",
          }}
        >
          Create charts, tables, or KPIs to visualize your supply chain risk data.
        </Typography>

        <Button
          variant="outline"
          size="md"
          startIcon={<Plus size={18} />}
          onClick={() => setCustomizeOpen(true)}
          sx={{ textTransform: "none" }}
        >
          Add widget
        </Button>
      </Box>
    </Box>
  );
}

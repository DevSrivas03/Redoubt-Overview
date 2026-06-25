import React from "react";
import { Box, Button, EmptyState, Typography } from "ds/index";
import { LayoutGrid, Plus } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboardStore";

export function RoleFirstPrompt(): React.ReactElement {
  const { setCustomizeOpen } = useDashboardStore();

  return (
    <Box
      sx={{
        borderRadius: "var(--corner-large)",
        backgroundColor: "var(--surface-container-lowest)",
        py: { xs: "var(--lg)", sm: "var(--xl)" },
        px: { xs: "var(--md)", sm: "var(--lg)" },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          color: "var(--on-surface)",
          fontWeight: 500,
          mb: "var(--md)",
        }}
      >
        Select a role above to load a recommended dashboard.
      </Typography>

      <EmptyState
        icon={LayoutGrid}
        title="Or build your own"
        description="Add individual widgets for a custom layout."
        size="sm"
        action={
          <Button
            variant="outline"
            size="md"
            startIcon={<Plus size={18} aria-hidden />}
            onClick={() => setCustomizeOpen(true)}
            sx={{ textTransform: "none", minHeight: 44 }}
          >
            Add widget
          </Button>
        }
      />
    </Box>
  );
}

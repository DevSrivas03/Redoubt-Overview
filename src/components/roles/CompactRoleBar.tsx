import React from "react";
import { Box, Button, Chip, Typography } from "ds/index";
import { Check, Settings2 } from "lucide-react";
import { ROLE_CONFIGS } from "@/config/dashboardConfig";
import {
  getEnabledWidgets,
  isDashboardCustomized,
  useDashboardStore,
} from "@/stores/dashboardStore";

export function CompactRoleBar(): React.ReactElement {
  const {
    widgets,
    selectedRole,
    setCustomizeOpen,
    returnToRoleSelection,
    resetDashboard,
  } = useDashboardStore();

  const enabled = getEnabledWidgets(widgets);
  const customized = isDashboardCustomized(widgets, selectedRole);
  const role = selectedRole
    ? ROLE_CONFIGS.find((r) => r.id === selectedRole)
    : null;
  const label = role?.label ?? "Custom dashboard";
  const accentColor = role?.color ?? "var(--primary)";

  return (
    <Box
      component="header"
      aria-label="Dashboard controls"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: "var(--md)",
        py: "var(--sm)",
        px: { xs: "var(--sm)", sm: "var(--md)" },
        borderRadius: "var(--corner-medium)",
        border: "1px solid var(--outline-variant)",
        backgroundColor: "var(--surface)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "var(--sm)",
          flexWrap: "wrap",
          minWidth: 0,
        }}
      >
        <Chip
          variant="assistive"
          leadingIcon={Check}
          label={label}
          selected
          sx={{
            fontWeight: 600,
            maxWidth: "100%",
            backgroundColor: `color-mix(in srgb, ${accentColor} 12%, var(--surface))`,
            border: `1px solid ${accentColor}`,
            color: "var(--on-surface)",
            "& .MuiChip-label": {
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: "var(--on-surface-variant)",
            fontFamily: "var(--font-family-primary)",
            fontSize: "var(--body-2-size)",
            flexShrink: 0,
          }}
        >
          {enabled.length} widgets
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "var(--xs)",
          flexWrap: "wrap",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {customized && (
          <Button
            variant="text"
            size="sm"
            onClick={resetDashboard}
            sx={{
              textTransform: "none",
              minHeight: 44,
              flex: { xs: 1, sm: "0 0 auto" },
              color: "var(--on-surface-variant)",
            }}
          >
            Reset layout
          </Button>
        )}
        <Button
          variant="text"
          size="sm"
          onClick={returnToRoleSelection}
          sx={{
            textTransform: "none",
            minHeight: 44,
            flex: { xs: 1, sm: "0 0 auto" },
          }}
        >
          Change role
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCustomizeOpen(true)}
          startIcon={<Settings2 size={16} aria-hidden />}
          sx={{
            textTransform: "none",
            minHeight: 44,
            flex: { xs: 1, sm: "0 0 auto" },
          }}
        >
          Customize
        </Button>
      </Box>
    </Box>
  );
}

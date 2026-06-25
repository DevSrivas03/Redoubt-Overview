import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Box, Button, Typography } from "ds/index";
import { RotateCcw } from "lucide-react";
import { WidgetPicker } from "@/components/empty-state/WidgetPicker";
import { ROLE_CONFIGS } from "@/config/dashboardConfig";
import {
  getEnabledWidgets,
  isDashboardCustomized,
  useDashboardStore,
} from "@/stores/dashboardStore";

export function CustomizeModal(): React.ReactElement {
  const {
    widgets,
    selectedRole,
    customizeOpen,
    setCustomizeOpen,
    resetDashboard,
    returnToRoleSelection,
  } = useDashboardStore();
  const enabledTypes = new Set(
    getEnabledWidgets(widgets).map((w) => w.type),
  );
  const customized = isDashboardCustomized(widgets, selectedRole);
  const role = selectedRole
    ? ROLE_CONFIGS.find((r) => r.id === selectedRole)
    : null;

  const resetLabel = role ? `Reset to ${role.label}` : "Return to role selection";

  return (
    <Dialog
      open={customizeOpen}
      onClose={() => setCustomizeOpen(false)}
      maxWidth="sm"
      fullWidth
      aria-labelledby="customize-dialog-title"
      aria-describedby="customize-dialog-description"
      PaperProps={{
        sx: { borderRadius: "var(--corner-large)", maxHeight: "90vh" },
      }}
    >
      <DialogTitle id="customize-dialog-title" sx={{ pt: 3, px: 3, pb: 1 }}>
        <Typography
          variant="h6"
          component="span"
          sx={{ fontWeight: 600, color: "var(--on-surface)" }}
        >
          Customize dashboard
        </Typography>
        <Typography
          id="customize-dialog-description"
          variant="body2"
          sx={{ color: "var(--on-surface-variant)", mt: 0.5, display: "block" }}
        >
          Add or remove widgets. Drag headers on the dashboard to move; resize from the corner.
          {role
            ? ` Reset restores the default ${role.label} preset.`
            : " Return to role selection clears your custom layout."}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 2, pt: 1 }}>
        <Box sx={{ mt: "var(--sm)" }}>
          <WidgetPicker enabledTypes={enabledTypes} embedded />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 0,
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--sm)",
        }}
      >
        <Button
          variant="text"
          size="sm"
          onClick={role ? resetDashboard : returnToRoleSelection}
          disabled={role ? !customized : false}
          startIcon={<RotateCcw size={16} aria-hidden />}
          aria-label={
            role
              ? `Reset dashboard to default ${role.label} layout`
              : "Clear dashboard and return to role selection"
          }
          sx={{ textTransform: "none", minHeight: 44 }}
        >
          {resetLabel}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCustomizeOpen(false)}
          sx={{ textTransform: "none", minHeight: 44 }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

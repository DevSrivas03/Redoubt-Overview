import React from "react";
import { Collapse } from "@mui/material";
import { Box, Button, IconButton, Typography } from "ds/index";
import { X } from "lucide-react";
import {
  FEATURED_ROLES,
  ROLE_CONFIGS,
  type RoleConfig,
} from "@/config/dashboardConfig";
import { useDashboardStore } from "@/stores/dashboardStore";
import { RoleCard, type RoleCardMode } from "./RoleCard";

const ROLES_HEADING_ID = "overview-roles-heading";
const ROLES_EXPANDED_ID = "overview-roles-expanded";

const featuredGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(4, minmax(0, 1fr))",
  },
  gap: "var(--sm)",
  overflow: "visible",
  "& > *": { overflow: "visible" },
} as const;

const expandedGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    sm: "repeat(2, minmax(0, 1fr))",
    lg: "repeat(3, minmax(0, 1fr))",
  },
  gap: "var(--sm)",
  mt: "var(--md)",
  pt: "var(--md)",
  borderTop: "1px solid var(--outline-variant)",
  overflow: "visible",
  "& > *": { overflow: "visible" },
} as const;

interface RolesSectionProps {
  mode?: RoleCardMode;
  onCancel?: () => void;
}

export function RolesSection({
  mode = "default",
  onCancel,
}: RolesSectionProps): React.ReactElement {
  const { selectedRole, showAllRoles, applyRole, setShowAllRoles } =
    useDashboardStore();

  const extraRoles = React.useMemo(
    () => ROLE_CONFIGS.filter((role) => !role.featured),
    [],
  );
  const radioRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const isChangeMode = mode === "change";

  const allVisibleRoles: RoleConfig[] = showAllRoles
    ? ROLE_CONFIGS
    : FEATURED_ROLES;

  const focusRoleAt = (index: number) => {
    const total = allVisibleRoles.length;
    const next = ((index % total) + total) % total;
    radioRefs.current[next]?.focus();
  };

  const handleRadioKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        focusRoleAt(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        focusRoleAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusRoleAt(0);
        break;
      case "End":
        event.preventDefault();
        focusRoleAt(allVisibleRoles.length - 1);
        break;
      default:
        break;
    }
  };

  const renderRoleCard = (role: RoleConfig, index: number) => (
    <RoleCard
      key={role.id}
      ref={(node) => {
        radioRefs.current[index] = node;
      }}
      role={role}
      mode={mode}
      layout={showAllRoles ? "expanded" : "compact"}
      selected={selectedRole === role.id}
      onSelect={() => applyRole(role.id)}
      onRadioKeyDown={(event) => handleRadioKeyDown(event, index)}
    />
  );

  return (
    <Box
      component="section"
      aria-labelledby={ROLES_HEADING_ID}
      sx={{
        p: isChangeMode ? "var(--md)" : 0,
        borderRadius: isChangeMode ? "var(--corner-large)" : 0,
        backgroundColor: isChangeMode ? "var(--surface-container-lowest)" : "transparent",
        border: isChangeMode ? "1px solid var(--outline-variant)" : "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "flex-start" },
          justifyContent: "space-between",
          mb: "var(--md)",
          gap: "var(--md)",
        }}
      >
        <Box>
          <Typography
            id={ROLES_HEADING_ID}
            component="h2"
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "var(--on-surface)", m: 0 }}
          >
            {isChangeMode ? "Change role" : "Roles"}
          </Typography>
          {isChangeMode && (
            <Typography
              variant="body2"
              sx={{ color: "var(--on-surface-variant)", mt: "var(--2xs)", m: 0 }}
            >
              Choose a new role. Your current widgets will be replaced.
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: { xs: "space-between", sm: "flex-end" },
            gap: "var(--2xs)",
            flexShrink: 0,
            minHeight: 44,
          }}
        >
          {extraRoles.length > 0 && (
            <Button
              variant="text"
              size="sm"
              onClick={() => setShowAllRoles(!showAllRoles)}
              aria-expanded={showAllRoles}
              aria-controls={ROLES_EXPANDED_ID}
              sx={{ textTransform: "none", color: "var(--primary)", minHeight: 44 }}
            >
              {showAllRoles ? "Show less" : "See All"}
            </Button>
          )}
          {onCancel && (
            <IconButton
              size="small"
              aria-label="Cancel role change"
              onClick={onCancel}
              sx={{
                minWidth: 44,
                minHeight: 44,
                color: "var(--on-surface-variant)",
                "&:focus-visible": {
                  outline: "2px solid var(--primary)",
                  outlineOffset: "2px",
                },
              }}
            >
              <X size={18} aria-hidden />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box
        role="radiogroup"
        aria-label={isChangeMode ? "Choose a new dashboard role" : "Choose a dashboard role"}
      >
        <Box sx={featuredGridSx}>
          {FEATURED_ROLES.map((role, index) => renderRoleCard(role, index))}
        </Box>

        <Collapse in={showAllRoles} id={ROLES_EXPANDED_ID}>
          <Box sx={expandedGridSx} aria-label="Additional roles">
            {extraRoles.map((role, index) =>
              renderRoleCard(role, FEATURED_ROLES.length + index),
            )}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
}

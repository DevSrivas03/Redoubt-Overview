import React from "react";
import { Box, CircularProgress, PageHeader } from "ds/index";
import { LiveAnnouncer } from "@/components/a11y/LiveAnnouncer";
import { CustomizeModal } from "@/components/customize/CustomizeModal";
import { PageWidthWrapper } from "@/components/PageWidthWrapper";
import { DashboardCanvas } from "@/components/DashboardCanvas";
import { CompactRoleBar } from "@/components/roles/CompactRoleBar";
import { RoleFirstPrompt } from "@/components/roles/RoleFirstPrompt";
import { RolesSection } from "@/components/roles/RolesSection";
import { mockOverviewData } from "@/mocks/overviewData";
import { getEnabledWidgets, useDashboardStore } from "@/stores/dashboardStore";

export function OverviewPage(): React.ReactElement {
  const { widgets, isApplyingRole } = useDashboardStore();

  const enabledWidgets = getEnabledWidgets(widgets);
  const hasWidgets = enabledWidgets.length > 0;
  const showRoleSelection = !hasWidgets;
  const showDashboard = hasWidgets && !isApplyingRole;

  return (
    <PageWidthWrapper>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: { xs: "var(--md)", sm: "var(--lg)" },
        }}
      >
        <LiveAnnouncer />

        <PageHeader
          title="Overview"
          description="Supply chain risk overview and monitoring"
          sx={{
            mb: 0,
            "& h1": {
              fontSize: "var(--headline-4-size)",
              lineHeight: 1.2,
              mb: "var(--2xs)",
            },
            "& .MuiTypography-body1": {
              fontSize: "var(--body-2-size)",
              lineHeight: 1.4,
            },
          }}
        />

        {showRoleSelection && <RolesSection mode="default" />}

        {showRoleSelection && <RoleFirstPrompt />}

        {hasWidgets && (
          <Box
            component="section"
            aria-label="Dashboard"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--md)",
            }}
          >
            <CompactRoleBar />

            {isApplyingRole && (
              <Box
                role="status"
                aria-label="Loading dashboard"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 280,
                  borderRadius: "var(--corner-large)",
                  backgroundColor: "var(--surface-container-lowest)",
                }}
              >
                <CircularProgress size={32} aria-hidden />
              </Box>
            )}

            {showDashboard && <DashboardCanvas data={mockOverviewData} />}
          </Box>
        )}

        <CustomizeModal />
      </Box>
    </PageWidthWrapper>
  );
}

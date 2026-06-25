import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "ds/index";
import { primaryNavItems, utilityNavItems } from "./navConfig";
import {
  DEFAULT_WORKSPACE_ID,
  SHELL_USER,
  SHELL_WORKSPACES,
} from "./shellConfig";

interface DashboardShellProps {
  children: React.ReactNode;
  activeRoute?: string;
}

export function DashboardShell({
  children,
  activeRoute = "overview",
}: DashboardShellProps): React.ReactElement {
  const navigate = useNavigate();
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState(
    DEFAULT_WORKSPACE_ID,
  );

  const navItems = primaryNavItems.map((item) => ({
    ...item,
    onClick: () => {
      if (item.id === "overview") navigate("/overview");
    },
  }));

  return (
    <AppShell
      activeRoute={activeRoute}
      navItems={navItems}
      utilityItems={utilityNavItems}
      searchEnabled={false}
      user={SHELL_USER}
      workspaces={[...SHELL_WORKSPACES]}
      activeWorkspaceId={activeWorkspaceId}
      onBrandClick={() => navigate("/overview")}
      onSettingsClick={() => undefined}
      onWorkspaceSettingsClick={() => undefined}
      onSwitchWorkspace={setActiveWorkspaceId}
      onViewAllWorkspaces={() => undefined}
      onSignOut={() => undefined}
    >
      {children}
    </AppShell>
  );
}

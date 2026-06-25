/**
 * Fallback typings until Module Federation generates @mf-types/ds/*.
 */
declare module "ds/tokens";

declare module "ds/index" {
  import type { ComponentType, MouseEvent, ReactNode } from "react";
  import type { LucideIcon } from "lucide-react";

  export interface NavItemConfig {
    id: string;
    icon: LucideIcon;
    activeIcon?: LucideIcon;
    label: string;
    badge?: {
      label?: string | number;
      size?: "small" | "large";
      variant?: "error" | "primary" | "secondary";
    };
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }

  export interface AppShellProps {
    children?: ReactNode;
    navItems: NavItemConfig[];
    utilityItems?: NavItemConfig[];
    activeRoute?: string;
    searchEnabled?: boolean;
    user?: { name: string; initials?: string; avatarSrc?: string };
    workspaces?: Array<{
      id: string;
      name: string;
      role?: "viewer" | "analyst" | "manager" | "admin";
      avatarSrc?: string;
      initials?: string;
    }>;
    activeWorkspaceId?: string;
    onBrandClick?: () => void;
    onSettingsClick?: () => void;
    onWorkspaceSettingsClick?: () => void;
    onSwitchWorkspace?: (id: string) => void;
    onViewAllWorkspaces?: () => void;
    onSignOut?: () => void;
    onUserMenuClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  }

  export const AppShell: ComponentType<AppShellProps>;
  export const AppThemeProvider: ComponentType<{ children?: ReactNode }>;
  export const Box: ComponentType<Record<string, unknown>>;
  export const Typography: ComponentType<Record<string, unknown>>;
  export const Button: ComponentType<Record<string, unknown>>;
  export const PageHeader: ComponentType<{
    title: string;
    description?: string;
    actions?: ReactNode;
    sx?: Record<string, unknown>;
  }>;
  export const PageSurface: ComponentType<{
    children?: ReactNode;
    contentWidth?: "full" | "cards" | "narrow";
  }>;
  export const CircularProgress: ComponentType<Record<string, unknown>>;
  export const StatCard: ComponentType<Record<string, unknown>>;
  export const EmptyState: ComponentType<{
    icon?: LucideIcon;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    size?: "sm" | "md";
  }>;
  export const Chip: ComponentType<{
    variant?: "input" | "assistive" | "filter" | "suggestion";
    label: string;
    leadingIcon?: LucideIcon;
    selected?: boolean;
    sx?: Record<string, unknown>;
  }>;
  export const Icon: ComponentType<Record<string, unknown>>;
  export const TextField: ComponentType<Record<string, unknown>>;
  export const IconButton: ComponentType<Record<string, unknown>>;
  export const Accordion: ComponentType<Record<string, unknown>>;
  export const AccordionSummary: ComponentType<Record<string, unknown>>;
  export const AccordionDetails: ComponentType<Record<string, unknown>>;
  export const Select: ComponentType<Record<string, unknown>>;
  export const MenuItem: ComponentType<Record<string, unknown>>;
  export const Menu: ComponentType<Record<string, unknown>>;
  export const Tooltip: ComponentType<{
    title: ReactNode;
    children: ReactNode;
    variant?: "plain" | "rich";
    placement?: string;
    arrow?: boolean;
    enterDelay?: number;
    describeChild?: boolean;
  }>;
}

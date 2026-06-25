import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  LayoutDashboard,
  Network,
  PackageOpen,
  PackagePlus,
  Radar,
  Radio,
} from "lucide-react";
import { NetworkChecked } from "./navIcons/NetworkChecked";
import { WorkChecked } from "./navIcons/WorkChecked";
import { WorkDefault } from "./navIcons/WorkDefault";

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

export const primaryNavItems: NavItemConfig[] = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  {
    id: "manage",
    icon: PackagePlus,
    activeIcon: PackageOpen,
    label: "Manage",
  },
  { id: "monitor", icon: Radar, label: "Monitor" },
  {
    id: "investigate",
    icon: Network,
    activeIcon: NetworkChecked as LucideIcon,
    label: "Investigate",
  },
  { id: "work", icon: WorkDefault as LucideIcon, activeIcon: WorkChecked as LucideIcon, label: "Work" },
];

export const utilityNavItems: NavItemConfig[] = [
  { id: "signals", icon: Radio, label: "Signals" },
  {
    id: "notifications",
    icon: BellRing,
    label: "Notifications",
    badge: { label: "99+", size: "large", variant: "error" },
  },
];

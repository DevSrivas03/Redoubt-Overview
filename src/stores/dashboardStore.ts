import { create } from "zustand";
import {
  ROLE_CONFIGS,
  WIDGET_METADATA,
  type RoleType,
  type WidgetType,
} from "@/config/dashboardConfig";
import { filterAvailableWidgets, isWidgetExcluded } from "@/config/excludedWidgets";
import {
  defaultLayoutsForTypes,
  layoutsAreEqual,
  nextWidgetPosition,
  packWidgetLayouts,
  type WidgetGridLayout,
} from "@/lib/dashboardLayout";

export interface DashboardWidgetInstance {
  id: string;
  type: WidgetType;
  enabled: boolean;
  order: number;
  layout: WidgetGridLayout;
}

interface LayoutUpdate {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DashboardState {
  widgets: DashboardWidgetInstance[];
  selectedRole: RoleType | null;
  customizeOpen: boolean;
  showAllRoles: boolean;
  showRolePicker: boolean;
  isApplyingRole: boolean;
  liveMessage: string | null;
  applyRole: (roleId: RoleType) => void;
  addWidget: (type: WidgetType) => void;
  resetDashboard: () => void;
  returnToRoleSelection: () => void;
  updateWidgetLayouts: (items: LayoutUpdate[], options?: { announce?: boolean }) => void;
  setCustomizeOpen: (open: boolean) => void;
  setShowAllRoles: (show: boolean) => void;
  setShowRolePicker: (show: boolean) => void;
  setLiveMessage: (message: string | null) => void;
  clearWidgets: () => void;
}

function createWidgetsFromRole(roleId: RoleType): DashboardWidgetInstance[] {
  const role = ROLE_CONFIGS.find((r) => r.id === roleId);
  if (!role) return [];

  const now = Date.now();
  const instances = filterAvailableWidgets(role.widgets).map((type, index) => ({
    id: `widget-${type}-${now}-${index}`,
    type,
  }));
  const layouts = packWidgetLayouts(instances);

  return instances.map((instance, index) => ({
    ...instance,
    enabled: true,
    order: index,
    layout: layouts[instance.id],
  }));
}


export const getEnabledWidgets = (
  widgets: DashboardWidgetInstance[],
): DashboardWidgetInstance[] =>
  widgets.filter((w) => w.enabled).sort((a, b) => a.order - b.order);

/** True when widget set or grid positions differ from the role default. */
export function isDashboardCustomized(
  widgets: DashboardWidgetInstance[],
  selectedRole: RoleType | null,
): boolean {
  const enabled = getEnabledWidgets(widgets);
  if (!selectedRole) {
    return enabled.length > 0;
  }

  const role = ROLE_CONFIGS.find((r) => r.id === selectedRole);
  if (!role) return enabled.length > 0;

  const defaultTypes = filterAvailableWidgets(role.widgets);
  const currentTypes = enabled.map((w) => w.type);
  if (currentTypes.length !== defaultTypes.length) return true;
  if (defaultTypes.some((type, index) => currentTypes[index] !== type)) return true;

  const defaultLayouts = defaultLayoutsForTypes(defaultTypes);

  return !layoutsAreEqual(
    enabled.map((w) => ({ type: w.type, layout: w.layout })),
    defaultLayouts.map((layout, index) => ({ type: defaultTypes[index], layout })),
  );
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  widgets: [],
  selectedRole: null,
  customizeOpen: false,
  showAllRoles: false,
  showRolePicker: true,
  isApplyingRole: false,
  liveMessage: null,

  applyRole: (roleId) => {
    const role = ROLE_CONFIGS.find((r) => r.id === roleId);
    set({
      isApplyingRole: true,
      selectedRole: roleId,
      customizeOpen: false,
      showRolePicker: false,
    });

    window.setTimeout(() => {
      const roleWidgets = filterAvailableWidgets(role?.widgets ?? []);
      set({
        widgets: createWidgetsFromRole(roleId),
        isApplyingRole: false,
        liveMessage: role
          ? `${role.label} dashboard loaded with ${roleWidgets.length} widgets. Drag headers to rearrange.`
          : null,
      });
    }, 280);
  },

  addWidget: (type) => {
    if (isWidgetExcluded(type)) return;
    const { widgets } = get();
    if (widgets.some((w) => w.enabled && w.type === type)) return;
    const meta = WIDGET_METADATA[type];
    const now = Date.now();
    const layout = nextWidgetPosition(widgets, meta.defaultSize);
    set({
      widgets: [
        ...widgets,
        {
          id: `widget-${type}-${now}`,
          type,
          enabled: true,
          order: widgets.length,
          layout,
        },
      ],
      customizeOpen: false,
      showRolePicker: false,
      liveMessage: `${meta.label} widget added`,
    });
  },

  updateWidgetLayouts: (items, options) => {
    const { widgets } = get();
    set({
      widgets: widgets.map((widget) => {
        const item = items.find((entry) => entry.i === widget.id);
        if (!item) return widget;
        return {
          ...widget,
          layout: {
            ...widget.layout,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
            minW: widget.layout.minW,
            maxW: widget.layout.maxW,
            minH: widget.layout.minH,
            maxH: widget.layout.maxH,
          },
        };
      }),
    });
    if (options?.announce) {
      set({ liveMessage: "Dashboard layout saved" });
    }
  },

  resetDashboard: () => {
    const { selectedRole, widgets } = get();

    if (!selectedRole) {
      get().returnToRoleSelection();
      return;
    }

    const role = ROLE_CONFIGS.find((r) => r.id === selectedRole);
    const roleWidgets = filterAvailableWidgets(role?.widgets ?? []);

    if (!isDashboardCustomized(widgets, selectedRole)) {
      set({
        customizeOpen: false,
        liveMessage: "Dashboard already matches the role default.",
      });
      return;
    }

    set({
      widgets: createWidgetsFromRole(selectedRole),
      customizeOpen: false,
      showRolePicker: false,
      liveMessage: role
        ? `${role.label} dashboard reset to default (${roleWidgets.length} widgets)`
        : "Dashboard reset to default",
    });
  },

  setCustomizeOpen: (open) => set({ customizeOpen: open }),
  setShowAllRoles: (show) => set({ showAllRoles: show }),
  setShowRolePicker: (show) => set({ showRolePicker: show }),
  setLiveMessage: (message) => set({ liveMessage: message }),

  returnToRoleSelection: () =>
    set({
      widgets: [],
      selectedRole: null,
      customizeOpen: false,
      showAllRoles: false,
      showRolePicker: true,
      isApplyingRole: false,
      liveMessage:
        "Returned to role selection. Choose a role above or add individual widgets.",
    }),

  clearWidgets: () => get().returnToRoleSelection(),
}));

export { ROLE_CONFIGS, WIDGET_METADATA };

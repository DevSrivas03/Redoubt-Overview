import type { WidgetType } from "./dashboardConfig";

/** Widget types hidden from roles, picker, and grid — used elsewhere later. */
export const EXCLUDED_WIDGET_TYPES: readonly WidgetType[] = [
  "global_risk_map",
] as const;

const EXCLUDED = new Set<WidgetType>(EXCLUDED_WIDGET_TYPES);

export function isWidgetExcluded(type: WidgetType): boolean {
  return EXCLUDED.has(type);
}

export function filterAvailableWidgets(types: WidgetType[]): WidgetType[] {
  return types.filter((type) => !isWidgetExcluded(type));
}

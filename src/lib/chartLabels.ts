import { CATEGORY_LABELS, type WidgetCategory } from "@/config/dashboardConfig";
import { chartColorAt } from "@/lib/dsTokens";

/** Human-readable label for alert/entity category keys (e.g. supply_chain → Supply Chain). */
export function formatCategoryKey(key: string): string {
  if (key in CATEGORY_LABELS) {
    return CATEGORY_LABELS[key as WidgetCategory];
  }
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export { chartColorAt };

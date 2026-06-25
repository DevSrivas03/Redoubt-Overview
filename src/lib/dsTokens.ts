/**
 * Design-system semantic tokens for charts, maps, and data visualization.
 * Prefer these CSS variable references over hardcoded hex so theme changes propagate.
 */

/** Core surface & text */
export const DS = {
  surface: "var(--surface)",
  surfaceContainerLow: "var(--surface-container-low)",
  surfaceContainerLowest: "var(--surface-container-lowest)",
  onSurface: "var(--on-surface)",
  onSurfaceVariant: "var(--on-surface-variant)",
  outline: "var(--outline)",
  outlineVariant: "var(--outline-variant)",
  primary: "var(--primary)",
  onPrimary: "var(--on-primary, #ffffff)",
  tertiary: "var(--tertiary)",
  statusSuccess: "var(--status-success)",
  statusWarning: "var(--status-warning)",
  statusInformational: "var(--status-informational)",
  riskExtreme: "var(--risk-extreme)",
  riskHigh: "var(--risk-high)",
  riskMedium: "var(--risk-medium)",
  fontFamily: "var(--font-family-primary)",
  /** Motion — use with chartMotion helpers for enter/hover transitions. */
  motionDuration: "var(--motion-enter-duration)",
  motionEasing: "var(--motion-enter-easing)",
  durationQuick: "var(--duration-quick)",
} as const;

/** Rotating palette for multi-series charts — all DS tokens. */
export const CHART_COLOR_TOKENS = [
  DS.primary,
  DS.tertiary,
  DS.riskHigh,
  DS.statusSuccess,
  DS.riskMedium,
  DS.onSurfaceVariant,
] as const;

export function chartColorAt(index: number): string {
  return CHART_COLOR_TOKENS[index % CHART_COLOR_TOKENS.length];
}

/**
 * Resolves a CSS color variable to a computed rgb/rgba string.
 * Use when a library (e.g. Leaflet canvas) cannot parse var() directly.
 */
export function readCssColor(token: string, fallback = "#000000"): string {
  if (typeof document === "undefined") return fallback;

  const probe = document.createElement("span");
  probe.style.setProperty("color", token);
  probe.style.display = "none";
  document.documentElement.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  return resolved && resolved !== "rgba(0, 0, 0, 0)" ? resolved : fallback;
}

/** Resolved chart palette for contexts that require concrete color strings. */
export function readChartColors(): string[] {
  return CHART_COLOR_TOKENS.map((token, i) =>
    readCssColor(token, ["#3B82F6", "#8B5CF6", "#EA580C", "#10B981", "#F59E0B", "#64748B"][i]),
  );
}

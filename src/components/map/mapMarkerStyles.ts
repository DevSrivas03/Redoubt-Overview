import type { MapNode } from "@/types/overview";

/** Label-free, ultra-light tiles — muted basemap background for DS tokens. */
export const MAP_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png";

export const MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const RISK_LABEL: Record<MapNode["riskLevel"], string> = {
  extreme: "Extreme",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function markerSize(node: MapNode): number {
  if (node.riskLevel === "extreme") return 56;
  if (node.riskLevel === "high") return 44;
  if (node.riskLevel === "medium") return 36;
  return 28;
}

export function createMarkerHtml(node: MapNode): string {
  const size = markerSize(node);
  const elevated = node.riskLevel === "extreme" || node.riskLevel === "high";

  return `
    <div
      class="overview-marker${elevated ? " overview-marker--elevated" : ""}"
      style="width:${size}px;height:${size}px"
      aria-hidden="true"
    >
      <span class="overview-marker__halo"></span>
      <span class="overview-marker__core"></span>
    </div>
  `;
}

export function createPopupHtml(node: MapNode): string {
  const label = RISK_LABEL[node.riskLevel];
  const elevated = node.riskLevel === "extreme" || node.riskLevel === "high";

  return `
    <div class="overview-map-popup">
      <div class="overview-map-popup__eyebrow">Partner</div>
      <div class="overview-map-popup__title">${node.name}</div>
      <div class="overview-map-popup__meta">
        <span class="overview-map-popup__badge overview-map-popup__badge--${elevated ? "elevated" : "normal"}">${label}</span>
        ${node.tier ? `<span class="overview-map-popup__tier">Tier ${node.tier}</span>` : ""}
      </div>
    </div>
  `;
}

/** Leaflet marker + popup styles — all colors via DS CSS variables. */
export const MAP_MARKER_CSS = `
  .overview-marker {
    position: relative;
    display: block;
    --marker-core: color-mix(in srgb, var(--primary) 55%, var(--surface));
    --marker-halo: color-mix(in srgb, var(--primary) 18%, transparent);
  }
  .overview-marker--elevated {
    --marker-core: var(--primary);
    --marker-halo: color-mix(in srgb, var(--primary) 28%, transparent);
  }
  .overview-marker__halo {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: var(--marker-halo);
    z-index: 1;
  }
  .overview-marker__core {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--marker-core);
    border: 2px solid var(--surface);
    box-shadow: 0 1px 6px color-mix(in srgb, var(--primary) 35%, transparent);
    z-index: 2;
  }
  .overview-map-popup {
    font-family: var(--font-family-primary, system-ui, sans-serif);
    min-width: 148px;
  }
  .overview-map-popup__eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--on-surface-variant);
    margin-bottom: 2px;
  }
  .overview-map-popup__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--on-surface);
    margin-bottom: 8px;
    line-height: 1.3;
  }
  .overview-map-popup__meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .overview-map-popup__badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }
  .overview-map-popup__badge--elevated {
    background: var(--primary);
    color: var(--on-primary, #ffffff);
  }
  .overview-map-popup__badge--normal {
    background: color-mix(in srgb, var(--primary) 12%, var(--surface));
    color: var(--primary);
  }
  .overview-map-popup__tier {
    font-size: 11px;
    color: var(--on-surface-variant);
    font-weight: 500;
  }
  .leaflet-popup-content-wrapper {
    border-radius: var(--corner-medium, 8px) !important;
    box-shadow: var(--elevation-2, 0 4px 12px rgba(0, 0, 0, 0.1)) !important;
    border: 1px solid var(--outline-variant) !important;
    background: var(--surface) !important;
    padding: 0 !important;
  }
  .leaflet-popup-content {
    margin: 12px 14px !important;
    line-height: 1.4 !important;
    color: var(--on-surface);
  }
  .leaflet-popup-tip {
    background: var(--surface) !important;
    box-shadow: none !important;
  }
  .leaflet-control-attribution {
    font-size: 9px !important;
    font-family: var(--font-family-primary, system-ui, sans-serif) !important;
    background: transparent !important;
    color: var(--on-surface-variant) !important;
    padding: 2px 4px !important;
  }
  .leaflet-control-attribution a {
    color: var(--on-surface-variant) !important;
  }
`;

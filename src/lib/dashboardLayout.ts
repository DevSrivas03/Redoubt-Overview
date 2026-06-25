import { verticalCompactor } from "react-grid-layout/core";
import type { LayoutItem } from "react-grid-layout/legacy";
import {
  WIDGET_METADATA,
  type WidgetSize,
  type WidgetType,
} from "@/config/dashboardConfig";

export const GRID_COLS = 12;
export const GRID_ROW_HEIGHT = 48;
export const GRID_MARGIN: [number, number] = [16, 16];

/** Allowed widths — keeps the 4-column B2B grid aligned. */
export const GRID_WIDTH_STEPS = [3, 6, 12] as const;

/** Standard dashboard tile — 3 cols × 4 rows (4 widgets per row). */
export const DEFAULT_TILE_WIDTH = 3;
export const DEFAULT_TILE_HEIGHT = 4;

/** Compact KPI tile — 3 cols × 3 rows (scalar metrics, gauges). */
export const COMPACT_TILE_HEIGHT = 3;

/** Expanded chart tile — 6 cols × 5 rows (dense legends, lists, heatmaps). */
export const EXPANDED_TILE_WIDTH = 6;
export const EXPANDED_TILE_HEIGHT = 5;

export interface WidgetGridLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxH?: number;
  maxW?: number;
}

export function getWidthConstraints(size: WidgetSize): { minW: number; maxW: number } {
  switch (size) {
    case "small":
      return { minW: 3, maxW: 6 };
    case "large":
      return { minW: 3, maxW: 12 };
    case "full":
      return { minW: 6, maxW: 12 };
    case "medium":
    default:
      return { minW: 3, maxW: 12 };
  }
}

export function getHeightConstraints(size: WidgetSize): { minH: number; maxH: number } {
  switch (size) {
    case "small":
      return { minH: COMPACT_TILE_HEIGHT, maxH: 5 };
    case "large":
      return { minH: DEFAULT_TILE_HEIGHT, maxH: 9 };
    case "full":
      return { minH: 5, maxH: 12 };
    case "medium":
    default:
      return { minH: DEFAULT_TILE_HEIGHT, maxH: 8 };
  }
}

export function defaultSizeToGrid(size: WidgetSize): WidgetGridLayout {
  const { minW, maxW } = getWidthConstraints(size);
  const { minH, maxH } = getHeightConstraints(size);

  switch (size) {
    case "small":
      return {
        x: 0,
        y: 0,
        w: DEFAULT_TILE_WIDTH,
        h: COMPACT_TILE_HEIGHT,
        minW,
        maxW,
        minH,
        maxH,
      };
    case "large":
      return {
        x: 0,
        y: 0,
        w: EXPANDED_TILE_WIDTH,
        h: EXPANDED_TILE_HEIGHT,
        minW,
        maxW,
        minH,
        maxH,
      };
    case "full":
      return { x: 0, y: 0, w: 12, h: 6, minW, maxW, minH, maxH };
    case "medium":
    default:
      return {
        x: 0,
        y: 0,
        w: DEFAULT_TILE_WIDTH,
        h: DEFAULT_TILE_HEIGHT,
        minW,
        maxW,
        minH,
        maxH,
      };
  }
}

export function snapWidth(w: number, minW: number, maxW: number): number {
  const allowed = GRID_WIDTH_STEPS.filter((step) => step >= minW && step <= maxW);
  const steps = allowed.length > 0 ? allowed : [minW];
  return steps.reduce((best, step) => (Math.abs(step - w) < Math.abs(best - w) ? step : best));
}

export function snapX(x: number, w: number): number {
  const step = w === 12 ? 12 : w === 6 ? 6 : 3;
  const snapped = Math.round(x / step) * step;
  return Math.max(0, Math.min(GRID_COLS - w, snapped));
}

export function snapLayoutItem(
  item: LayoutItem,
  minW: number,
  maxW: number,
  minH: number,
  maxH: number,
): LayoutItem {
  const w = snapWidth(item.w, minW, maxW);
  const x = snapX(item.x, w);
  const h = Math.min(maxH, Math.max(minH, Math.round(item.h)));
  const y = Math.max(0, Math.round(item.y));

  return { ...item, x, y, w, h, minH, maxH, minW, maxW };
}

/** Snap widths/positions and vertically compact — keeps rows even after drag/resize. */
export function normalizeLayout(
  items: LayoutItem[],
  widgets: { id: string; type: WidgetType }[],
): LayoutItem[] {
  const typeById = new Map(widgets.map((widget) => [widget.id, widget.type]));

  const snapped = items.map((item) => {
    const type = typeById.get(item.i);
    const size = type ? WIDGET_METADATA[type].defaultSize : "medium";
    const { minW, maxW } = getWidthConstraints(size);
    const { minH, maxH } = getHeightConstraints(size);
    return snapLayoutItem(item, minW, maxW, minH, maxH);
  });

  return [...verticalCompactor.compact(snapped, GRID_COLS)];
}

/** Flow widgets left-to-right, wrapping at 12 columns. */
export function packWidgetLayouts(
  instances: { id: string; type: WidgetType }[],
): Record<string, WidgetGridLayout> {
  let cursorX = 0;
  let cursorY = 0;
  let rowHeight = 0;
  const layouts: Record<string, WidgetGridLayout> = {};

  instances.forEach((instance) => {
    const meta = WIDGET_METADATA[instance.type];
    const { w, h, minW, minH, maxW, maxH } = defaultSizeToGrid(meta.defaultSize);

    if (cursorX + w > GRID_COLS) {
      cursorX = 0;
      cursorY += rowHeight;
      rowHeight = 0;
    }

    layouts[instance.id] = { x: cursorX, y: cursorY, w, h, minW, minH, maxW, maxH };
    cursorX += w;
    rowHeight = Math.max(rowHeight, h);
  });

  return layouts;
}

export function nextWidgetPosition(
  widgets: { layout: WidgetGridLayout }[],
  size: WidgetSize,
): WidgetGridLayout {
  const { w, h, minW, minH, maxW, maxH } = defaultSizeToGrid(size);
  const bottom = widgets.reduce(
    (max, widget) => Math.max(max, widget.layout.y + widget.layout.h),
    0,
  );
  return { x: 0, y: bottom, w, h, minW, minH, maxW, maxH };
}

export function layoutsAreEqual(
  a: { type: string; layout: WidgetGridLayout }[],
  b: { type: string; layout: WidgetGridLayout }[],
): boolean {
  if (a.length !== b.length) return false;
  return a.every((widget, index) => {
    const other = b[index];
    if (!other || widget.type !== other.type) return false;
    const l = widget.layout;
    const o = other.layout;
    return l.x === o.x && l.y === o.y && l.w === o.w && l.h === o.h;
  });
}

export function defaultLayoutsForTypes(types: WidgetType[]): WidgetGridLayout[] {
  const instances = types.map((type, index) => ({ id: String(index), type }));
  const packed = packWidgetLayouts(instances);
  return instances.map((instance) => packed[instance.id]);
}

export function gridContentHeight(layouts: WidgetGridLayout[]): number {
  if (layouts.length === 0) return 480;
  const maxRow = Math.max(...layouts.map((l) => l.y + l.h));
  return maxRow * GRID_ROW_HEIGHT + (maxRow + 1) * GRID_MARGIN[1] + 48;
}

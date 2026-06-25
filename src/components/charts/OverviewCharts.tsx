import React from "react";
import { Box, Typography } from "ds/index";
import { DS } from "@/lib/dsTokens";
import { RISK_COLORS } from "@/lib/riskColors";
import { formatChartValue } from "@/components/charts/chartUtils";
import {
  chartBarGrowSx,
  chartFadeInSx,
  chartHoverSx,
  chartSegmentRevealSx,
  chartWidthGrowSx,
  useChartEnter,
} from "@/lib/chartMotion";

export interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

/** Visually hidden table for screen readers — data is not hover-only. */
function ChartDataTable({
  rows,
  caption,
}: {
  rows: { label: string; value: string }[];
  caption: string;
}): React.ReactElement {
  return (
    <Box
      component="table"
      sx={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0, 0, 0, 0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      <caption>{caption}</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </Box>
  );
}

function LegendSwatch({ color }: { color: string }): React.ReactElement {
  return (
    <Box
      aria-hidden
      sx={{
        width: 10,
        height: 10,
        borderRadius: "2px",
        backgroundColor: color,
        border: `1.5px solid ${DS.outline}`,
        flexShrink: 0,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${DS.surface} 30%, transparent)`,
      }}
    />
  );
}

function ChartLegend({
  items,
  formatValue = (v: number) => String(v),
  total,
  columns = 2,
  entered = true,
}: {
  items: ChartSegment[];
  formatValue?: (v: number) => string;
  total?: number;
  columns?: 1 | 2;
  entered?: boolean;
}): React.ReactElement {
  const sum = total ?? items.reduce((s, i) => s + i.value, 0);

  return (
    <Box
      component="ul"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "grid",
        gridTemplateColumns: columns === 1 ? "1fr" : "repeat(2, minmax(0, 1fr))",
        gap: "var(--xs) var(--md)",
        mt: columns === 1 ? 0 : "var(--md)",
        flex: 1,
        minWidth: 0,
      }}
    >
      {items.map((item, index) => {
        const pct = sum > 0 ? Math.round((item.value / sum) * 100) : 0;
        return (
          <Box
            component="li"
            key={item.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "var(--xs)",
              minWidth: 0,
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(4px)",
              ...chartFadeInSx(index),
            }}
          >
            <LegendSwatch color={item.color} />
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: DS.onSurface,
                lineHeight: 1.3,
                flex: 1,
                minWidth: 0,
              }}
            >
              {item.label}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: DS.onSurface,
                lineHeight: 1.3,
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
              }}
            >
              {formatValue(item.value)}
              {sum > 0 && item.value > 0 && (
                <Box
                  component="span"
                  sx={{ fontWeight: 500, color: DS.onSurfaceVariant, ml: "4px" }}
                >
                  ({pct}%)
                </Box>
              )}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

interface BarColumnProps {
  label: string;
  value: number;
  max: number;
  color: string;
  formatValue?: (v: number) => string;
  index?: number;
  entered?: boolean;
}

function BarColumn({
  label,
  value,
  max,
  color,
  formatValue = formatChartValue,
  index = 0,
  entered = true,
}: BarColumnProps): React.ReactElement {
  const [hovered, setHovered] = React.useState(false);
  const formatted = formatValue(value);
  const isActive = hovered;
  const barHeightPct = max > 0 ? (value / max) * 100 : 0;
  const targetHeight = Math.max(barHeightPct, value > 0 ? 8 : 0);

  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        outline: isActive ? `2px solid ${DS.primary}` : "none",
        outlineOffset: 2,
        borderRadius: "var(--corner-extra-small)",
        ...chartHoverSx(),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="group"
      aria-label={`${label}: ${formatted}`}
    >
      <Typography
        component="span"
        aria-hidden
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: DS.onSurface,
          lineHeight: 1.2,
          mb: "var(--2xs)",
          fontVariantNumeric: "tabular-nums",
          flexShrink: 0,
        }}
      >
        {formatted}
      </Typography>

      <Box
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: 52,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          minHeight: 48,
        }}
      >
        <Box
          sx={{
            width: "68%",
            height: entered ? `${targetHeight}%` : "0%",
            minHeight: entered && value > 0 ? 8 : 0,
            backgroundColor: value > 0 ? color : DS.surfaceContainerLow,
            borderRadius: "var(--corner-extra-small) var(--corner-extra-small) 0 0",
            border: value > 0 ? "none" : `1px dashed ${DS.outlineVariant}`,
            opacity: isActive ? 1 : value > 0 ? 0.92 : 1,
            ...chartBarGrowSx(index),
          }}
        />
      </Box>

      <Typography
        component="span"
        sx={{
          mt: "var(--sm)",
          textAlign: "center",
          fontSize: 12,
          fontWeight: isActive ? 600 : 500,
          lineHeight: 1.25,
          color: isActive ? DS.onSurface : DS.onSurfaceVariant,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          width: "100%",
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}

interface StackedBarChartProps {
  segments: ChartSegment[];
  height?: number;
  formatValue?: (v: number) => string;
}

export function StackedBarChart({
  segments,
  height = 36,
  formatValue = (v) => String(v),
}: StackedBarChartProps): React.ReactElement {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const entered = useChartEnter();
  const active = segments.filter((s) => s.value > 0);

  if (total === 0) {
    return (
      <Typography variant="body2" sx={{ color: DS.onSurfaceVariant, py: "var(--md)", fontSize: 13 }}>
        No data available
      </Typography>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column" }} role="figure" aria-label={`Distribution, total ${total}`}>
      <ChartDataTable
        caption="Chart data"
        rows={segments.map((s) => ({ label: s.label, value: formatValue(s.value) }))}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: "var(--sm)" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: DS.onSurface }}>
          Total
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: DS.onSurface,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatValue(total)}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          width: "100%",
          height,
          borderRadius: "var(--corner-small)",
          overflow: "hidden",
          backgroundColor: DS.surfaceContainerLow,
          border: `1px solid ${DS.outlineVariant}`,
          gap: "2px",
        }}
      >
        {active.map((seg, index) => {
          const isActive = hovered === seg.label;
          return (
            <Box
              key={seg.label}
              role="img"
              aria-label={`${seg.label}: ${formatValue(seg.value)}`}
              onMouseEnter={() => setHovered(seg.label)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(seg.label)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              sx={{
                flex: seg.value,
                minWidth: 6,
                backgroundColor: seg.color,
                opacity: hovered && !isActive ? 0.5 : 1,
                outline: isActive ? `2px solid ${DS.onSurface}` : "none",
                outlineOffset: -2,
                cursor: "default",
                transform: entered ? "scaleX(1)" : "scaleX(0)",
                ...chartSegmentRevealSx(index),
                ...chartHoverSx(),
              }}
            />
          );
        })}
      </Box>

      <ChartLegend items={segments} formatValue={formatValue} total={total} entered={entered} />
    </Box>
  );
}

interface HorizontalBarChartProps {
  items: { label: string; value: number; color?: string }[];
  maxValue?: number;
  formatValue?: (v: number) => string;
}

export function HorizontalBarChart({
  items,
  maxValue,
  formatValue = formatChartValue,
}: HorizontalBarChartProps): React.ReactElement {
  const max = maxValue ?? Math.max(...items.map((i) => i.value), 1);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const entered = useChartEnter();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "var(--md)", position: "relative" }}>
      <ChartDataTable
        caption="Chart data"
        rows={items.map((i) => ({ label: i.label, value: formatValue(i.value) }))}
      />
      {items.map((item, index) => {
        const isActive = hovered === item.label;
        const formatted = formatValue(item.value);
        const widthPct = (item.value / max) * 100;
        return (
          <Box
            key={item.label}
            onMouseEnter={() => setHovered(item.label)}
            onMouseLeave={() => setHovered(null)}
            role="group"
            aria-label={`${item.label}: ${formatted}`}
            sx={{
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(6px)",
              ...chartFadeInSx(index),
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: "var(--2xs)", gap: "var(--sm)" }}>
              <Typography
                sx={{
                  color: DS.onSurface,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                  flex: 1,
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {item.label}
              </Typography>
              <Typography
                sx={{
                  color: DS.onSurface,
                  fontWeight: 700,
                  flexShrink: 0,
                  fontSize: 12,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatted}
              </Typography>
            </Box>
            <Box
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: DS.surfaceContainerLow,
                border: `1px solid ${DS.outlineVariant}`,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: entered ? `${widthPct}%` : "0%",
                  backgroundColor: item.color ?? DS.primary,
                  borderRadius: 5,
                  opacity: isActive ? 1 : 0.9,
                  minWidth: item.value > 0 ? 4 : 0,
                  ...chartWidthGrowSx(index),
                  ...chartHoverSx(),
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

interface ColumnBarChartProps {
  items: { label: string; value: number; color?: string }[];
  formatValue?: (v: number) => string;
}

export function ColumnBarChart({
  items,
  formatValue,
}: ColumnBarChartProps): React.ReactElement {
  const max = Math.max(...items.map((i) => i.value), 1);
  const fmt = formatValue ?? formatChartValue;
  const entered = useChartEnter();

  if (items.every((i) => i.value === 0)) {
    return (
      <Typography variant="body2" sx={{ color: DS.onSurfaceVariant, py: "var(--md)", fontSize: 13 }}>
        No data available
      </Typography>
    );
  }

  return (
    <Box
      sx={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
      role="figure"
    >
      <ChartDataTable
        caption="Chart data"
        rows={items.map((i) => ({ label: i.label, value: fmt(i.value) }))}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "stretch",
          gap: "var(--sm)",
          width: "100%",
          minHeight: 0,
          borderBottom: `2px solid ${DS.outlineVariant}`,
        }}
      >
        {items.map((item, index) => (
          <BarColumn
            key={item.label}
            label={item.label}
            value={item.value}
            max={max}
            color={item.color ?? DS.primary}
            formatValue={fmt}
            index={index}
            entered={entered}
          />
        ))}
      </Box>
    </Box>
  );
}

interface GroupedBarChartProps {
  groups: { label: string; value: number; color?: string }[];
  formatValue?: (v: number) => string;
}

export function GroupedBarChart({
  groups,
  formatValue,
}: GroupedBarChartProps): React.ReactElement {
  const max = Math.max(...groups.map((g) => g.value), 1);
  const fmt = formatValue ?? formatChartValue;
  const entered = useChartEnter();

  return (
    <Box
      sx={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
      role="figure"
    >
      <ChartDataTable
        caption="Chart data"
        rows={groups.map((g) => ({ label: g.label, value: fmt(g.value) }))}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: "var(--sm)",
          alignItems: "stretch",
          width: "100%",
          minHeight: 0,
          borderBottom: `2px solid ${DS.outlineVariant}`,
        }}
      >
        {groups.map((group, index) => (
          <BarColumn
            key={group.label}
            label={group.label}
            value={group.value}
            max={max}
            color={group.color ?? DS.primary}
            formatValue={fmt}
            index={index}
            entered={entered}
          />
        ))}
      </Box>
    </Box>
  );
}

interface DonutChartProps {
  segments: ChartSegment[];
  size?: number;
  centerLabel?: string;
  formatValue?: (v: number) => string;
}

export function DonutChart({
  segments,
  size = 108,
  centerLabel,
  formatValue = (v) => String(v),
}: DonutChartProps): React.ReactElement {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const [hovered, setHovered] = React.useState<string | null>(null);
  const entered = useChartEnter();
  const stroke = 16;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const activeSeg = segments.find((s) => s.label === hovered);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "var(--md)", width: "100%", height: "100%", position: "relative" }}>
      <ChartDataTable
        caption="Chart data"
        rows={segments.map((s) => ({ label: s.label, value: formatValue(s.value) }))}
      />
      <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Donut chart, total ${formatValue(total)}`}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={DS.surfaceContainerLow}
            strokeWidth={stroke}
          />
          {segments.map((seg, segIndex) => {
            if (seg.value <= 0) return null;
            const pct = seg.value / total;
            const dash = pct * circumference;
            const isActive = hovered === seg.label;
            const circle = (
              <circle
                key={seg.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={isActive ? stroke + 3 : stroke}
                strokeDasharray={`${entered ? dash : 0} ${circumference - (entered ? dash : 0)}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${cx} ${cy})`}
                opacity={hovered && !isActive ? 0.35 : 1}
                style={{
                  cursor: "pointer",
                  transition: entered
                    ? `stroke-dasharray ${DS.motionDuration} ${DS.motionEasing} ${segIndex * 45}ms, opacity ${DS.durationQuick} linear, stroke-width ${DS.durationQuick} linear`
                    : "none",
                }}
                onMouseEnter={() => setHovered(seg.label)}
                onMouseLeave={() => setHovered(null)}
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: activeSeg ? 20 : 18,
              color: activeSeg ? activeSeg.color : DS.onSurface,
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
              opacity: entered ? 1 : 0,
              ...chartFadeInSx(0),
            }}
          >
            {activeSeg ? formatValue(activeSeg.value) : centerLabel ?? formatValue(total)}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 500,
              color: DS.onSurfaceVariant,
              mt: "3px",
              textAlign: "center",
              maxWidth: size * 0.6,
              lineHeight: 1.2,
            }}
          >
            {activeSeg ? activeSeg.label : "Total"}
          </Typography>
        </Box>
      </Box>
      <ChartLegend items={segments} formatValue={formatValue} total={total} columns={1} entered={entered} />
    </Box>
  );
}

interface GaugeChartProps {
  value: number;
  label?: string;
  color?: string;
}

export function GaugeChart({
  value,
  label,
  color = DS.primary,
}: GaugeChartProps): React.ReactElement {
  const clamped = Math.min(100, Math.max(0, value));
  const entered = useChartEnter();

  return (
    <Box
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label}: ${clamped}%` : `${clamped}%`}
      sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}
    >
      <Typography
        component="p"
        sx={{
          fontWeight: 700,
          color,
          fontSize: { xs: 34, sm: 40 },
          lineHeight: 1,
          letterSpacing: "-0.02em",
          mb: "var(--sm)",
          fontVariantNumeric: "tabular-nums",
          opacity: entered ? 1 : 0,
          transform: entered ? "translateY(0)" : "translateY(8px)",
          ...chartFadeInSx(0),
        }}
      >
        {clamped}%
      </Typography>
      <Box
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: DS.surfaceContainerLow,
          border: `1px solid ${DS.outlineVariant}`,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: entered ? `${clamped}%` : "0%",
            backgroundColor: color,
            borderRadius: 5,
            ...chartWidthGrowSx(1),
          }}
        />
      </Box>
      {label && (
        <Typography
          sx={{
            color: DS.onSurfaceVariant,
            mt: "var(--sm)",
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
}

interface HeatmapChartProps {
  rows: string[];
  columns: string[];
  values: Record<string, Record<string, number>>;
}

export function HeatmapChart({
  rows,
  columns,
  values,
}: HeatmapChartProps): React.ReactElement {
  const max = Math.max(
    ...rows.flatMap((row) => columns.map((col) => values[row]?.[col] ?? 0)),
    1,
  );
  const [hovered, setHovered] = React.useState<string | null>(null);
  const entered = useChartEnter();
  let cellIndex = 0;

  const cellColor = (count: number) => {
    if (count === 0) return DS.surfaceContainerLow;
    const intensity = count / max;
    if (intensity > 0.7) return RISK_COLORS.extreme;
    if (intensity > 0.4) return RISK_COLORS.high;
    if (intensity > 0.2) return RISK_COLORS.medium;
    return RISK_COLORS.low;
  };

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: `minmax(80px, 1fr) repeat(${columns.length}, minmax(48px, 1fr))`,
          gap: "var(--2xs)",
          minWidth: 280,
        }}
      >
        <Box />
        {columns.map((col) => (
          <Typography
            key={col}
            sx={{ color: DS.onSurfaceVariant, textAlign: "center", fontSize: 11, fontWeight: 500 }}
          >
            {col}
          </Typography>
        ))}
        {rows.map((row) => (
          <React.Fragment key={row}>
            <Typography
              title={row}
              sx={{
                color: DS.onSurface,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 11,
                fontWeight: 500,
                alignSelf: "center",
              }}
            >
              {row}
            </Typography>
            {columns.map((col) => {
              const count = values[row]?.[col] ?? 0;
              const key = `${row}-${col}`;
              const isActive = hovered === key;
              const delayIndex = cellIndex;
              cellIndex += 1;
              return (
                <Box
                  key={key}
                  title={`${row}, ${col}: ${count}`}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  sx={{
                    height: 32,
                    borderRadius: "var(--corner-extra-small)",
                    backgroundColor: cellColor(count),
                    border: `1px solid ${DS.outlineVariant}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: isActive ? `2px solid ${DS.onSurface}` : "none",
                    outlineOffset: -1,
                    opacity: entered ? 1 : 0,
                    transform: entered ? "scale(1)" : "scale(0.92)",
                    ...chartFadeInSx(delayIndex),
                    ...chartHoverSx(),
                  }}
                >
                  <Typography
                    sx={{
                      color: count > 0 ? DS.onPrimary : DS.onSurfaceVariant,
                      fontSize: 12,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {count > 0 ? count : "—"}
                  </Typography>
                </Box>
              );
            })}
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
}

interface LineChartProps {
  points: { label: string; value: number }[];
  emptyMessage?: string;
}

export function LineChart({
  points,
  emptyMessage = "No trend data available",
}: LineChartProps): React.ReactElement {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const entered = useChartEnter();

  if (points.length === 0) {
    return (
      <Typography sx={{ color: DS.onSurfaceVariant, fontSize: 13 }}>
        {emptyMessage}
      </Typography>
    );
  }

  const width = 280;
  const height = 100;
  const padding = 16;
  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = padding + (i / Math.max(points.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((p.value - min) / range) * (height - padding * 2);
    return { x, y, label: p.label, value: p.value };
  });

  const path = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const pathLength = width * 2;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: "block", flex: 1 }} role="img" aria-label="Trend line chart">
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={padding}
            x2={width - padding}
            y1={height - padding - pct * (height - padding * 2)}
            y2={height - padding - pct * (height - padding * 2)}
            stroke={DS.outlineVariant}
            strokeWidth={0.5}
          />
        ))}
        <path
          d={path}
          fill="none"
          stroke={DS.primary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={pathLength}
          strokeDasharray={pathLength}
          strokeDashoffset={entered ? 0 : pathLength}
          style={{
            transition: entered
              ? `stroke-dashoffset ${DS.motionDuration} ${DS.motionEasing}`
              : "none",
          }}
        />
        {coords.map((c, i) => (
          <circle
            key={c.label}
            cx={c.x}
            cy={c.y}
            r={hovered === i ? 5 : 4}
            fill={DS.primary}
            stroke={DS.surface}
            strokeWidth={2}
            style={{ cursor: "pointer" }}
            opacity={entered ? 1 : 0}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
      </svg>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: "var(--xs)", gap: "var(--2xs)" }}>
        {points.map((p, i) => (
          <Typography
            key={p.label}
            sx={{
              color: hovered === i ? DS.onSurface : DS.onSurfaceVariant,
              fontSize: 11,
              fontWeight: hovered === i ? 700 : 500,
              fontVariantNumeric: "tabular-nums",
              textAlign: "center",
              flex: 1,
            }}
          >
            {hovered === i ? p.value : p.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

interface QuickStatsGridProps {
  items: { label: string; value: number; color: string }[];
}

export function QuickStatsGrid({ items }: QuickStatsGridProps): React.ReactElement {
  const entered = useChartEnter();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "var(--sm)",
        height: "100%",
        alignContent: "center",
      }}
    >
      {items.map((cell, index) => (
        <Box
          key={cell.label}
          sx={{
            px: "var(--md)",
            py: "var(--md)",
            borderRadius: "var(--corner-medium)",
            backgroundColor: DS.surfaceContainerLowest,
            border: `1px solid ${DS.outlineVariant}`,
            opacity: entered ? 1 : 0,
            transform: entered ? "translateY(0)" : "translateY(8px)",
            ...chartFadeInSx(index),
          }}
        >
          <Typography
            component="p"
            sx={{
              fontWeight: 700,
              color: cell.color,
              fontSize: { xs: 22, sm: 26 },
              lineHeight: 1.1,
              mb: "var(--3xs)",
              fontFamily: DS.fontFamily,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {cell.value.toLocaleString()}
          </Typography>
          <Typography
            sx={{
              color: DS.onSurfaceVariant,
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.3,
            }}
          >
            {cell.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export { formatCurrency } from "@/components/charts/chartUtils";

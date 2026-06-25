import React from "react";
import { Box } from "ds/index";

const BAR_HEIGHTS = [0.45, 0.7, 0.55, 0.85, 0.6, 0.75, 0.5];

interface RoleMiniChartProps {
  color: string;
  seed?: string;
}

/** Decorative bar chart shown at the bottom of role cards. */
export function RoleMiniChart({
  color,
  seed = "default",
}: RoleMiniChartProps): React.ReactElement {
  const offset = seed.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  const heights = BAR_HEIGHTS.map((h, i) => {
    const wobble = ((offset + i * 17) % 5) * 0.04;
    return Math.min(1, Math.max(0.35, h + wobble - 0.1));
  });

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        gap: "6px",
        height: 48,
        mt: "auto",
        pt: "var(--md)",
      }}
    >
      {heights.map((h, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            height: `${h * 100}%`,
            borderRadius: "var(--corner-extra-small)",
            backgroundColor: color,
            opacity: 0.85,
          }}
        />
      ))}
    </Box>
  );
}

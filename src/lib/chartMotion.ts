import React from "react";

/** DS motion tokens — matches RoleCardHoverPreview and grid transitions. */
export const CHART_MOTION = {
  duration: "var(--motion-enter-duration)",
  easing: "var(--motion-enter-easing)",
  quick: "var(--duration-quick)",
} as const;

/** Stagger step for multi-series chart enter animations. */
export function chartStaggerDelay(index: number, stepMs = 45): number {
  return index * stepMs;
}

/** Defer data animations until after mount; skip when reduced motion is preferred. */
export function useChartEnter(): boolean {
  const [entered, setEntered] = React.useState(false);

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setEntered(true);
      return undefined;
    }

    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setEntered(true));
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  return entered;
}

type ChartMotionSx = Record<string, unknown>;

const reducedMotionNone: ChartMotionSx = {
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
};

/** Vertical bar grow (column / grouped charts). */
export function chartBarGrowSx(index = 0): ChartMotionSx {
  return {
    "@media (prefers-reduced-motion: no-preference)": {
      transition: [
        `height ${CHART_MOTION.duration} ${CHART_MOTION.easing} ${chartStaggerDelay(index)}ms`,
        `opacity ${CHART_MOTION.quick} linear ${chartStaggerDelay(index)}ms`,
      ].join(", "),
    },
    ...reducedMotionNone,
  };
}

/** Horizontal bar / gauge fill. */
export function chartWidthGrowSx(index = 0): ChartMotionSx {
  return {
    "@media (prefers-reduced-motion: no-preference)": {
      transition: `width ${CHART_MOTION.duration} ${CHART_MOTION.easing} ${chartStaggerDelay(index)}ms`,
    },
    ...reducedMotionNone,
  };
}

/** Stacked bar segment reveal. */
export function chartSegmentRevealSx(index = 0): ChartMotionSx {
  return {
    transformOrigin: "left center",
    "@media (prefers-reduced-motion: no-preference)": {
      transition: `transform ${CHART_MOTION.duration} ${CHART_MOTION.easing} ${chartStaggerDelay(index)}ms`,
    },
    ...reducedMotionNone,
  };
}

/** Legend rows, stat tiles, heatmap cells. */
export function chartFadeInSx(index = 0): ChartMotionSx {
  return {
    "@media (prefers-reduced-motion: no-preference)": {
      transition: [
        `opacity ${CHART_MOTION.duration} ${CHART_MOTION.easing} ${chartStaggerDelay(index)}ms`,
        `transform ${CHART_MOTION.duration} ${CHART_MOTION.easing} ${chartStaggerDelay(index)}ms`,
      ].join(", "),
    },
    ...reducedMotionNone,
  };
}

/** Hover / focus feedback on chart marks. */
export function chartHoverSx(): ChartMotionSx {
  return {
    "@media (prefers-reduced-motion: no-preference)": {
      transition: [
        `opacity ${CHART_MOTION.quick} linear`,
        `outline-color ${CHART_MOTION.quick} linear`,
        `stroke-width ${CHART_MOTION.quick} linear`,
      ].join(", "),
    },
    ...reducedMotionNone,
  };
}

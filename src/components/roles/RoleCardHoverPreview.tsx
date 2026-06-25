import React from "react";
import { Box, Icon, Typography } from "ds/index";
import type { WidgetType } from "@/config/dashboardConfig";
import { WIDGET_METADATA } from "@/config/dashboardConfig";
import { getWidgetIcon } from "@/config/widgetIcons";

const PREVIEW_WIDGET_COUNT = 3;
const PREVIEW_LEAVE_DELAY_MS = 280;

const motionTransition = {
  "@media (prefers-reduced-motion: no-preference)": {
    transition: [
      "opacity var(--motion-enter-duration) var(--motion-enter-easing)",
      "transform var(--motion-enter-duration) var(--motion-enter-easing)",
      "max-height var(--motion-enter-duration) var(--motion-enter-easing)",
      "margin-top var(--motion-enter-duration) var(--motion-enter-easing)",
      "box-shadow var(--motion-enter-duration) var(--motion-enter-easing)",
    ].join(", "),
  },
};

interface RoleCardHoverPreviewProps {
  id: string;
  headingId: string;
  open: boolean;
  layout: "inline" | "popover";
  widgetTypes: WidgetType[];
  accentColor: string;
}

export function RoleCardHoverPreview({
  id,
  headingId,
  open,
  layout,
  widgetTypes,
  accentColor,
}: RoleCardHoverPreviewProps): React.ReactElement {
  const previewItems = widgetTypes.slice(0, PREVIEW_WIDGET_COUNT);
  const moreCount = widgetTypes.length - previewItems.length;
  const isPopover = layout === "popover";

  return (
    <Box
      id={id}
      role="region"
      aria-labelledby={headingId}
      aria-hidden={!open}
      sx={{
        ...(isPopover
          ? {
              position: "absolute",
              left: 0,
              right: 0,
              top: "100%",
              zIndex: 20,
              pt: "var(--2xs)",
              pointerEvents: open ? "auto" : "none",
              opacity: open ? 1 : 0,
              transform: open
                ? "translateY(0) scale(1)"
                : "translateY(-8px) scale(0.98)",
              ...motionTransition,
              "@media (prefers-reduced-motion: reduce)": {
                opacity: open ? 1 : 0,
                transform: "none",
                transition: "opacity var(--duration-quick) linear",
              },
            }
          : {
              position: "relative",
              width: "100%",
              overflow: "hidden",
              pointerEvents: open ? "auto" : "none",
              opacity: open ? 1 : 0,
              maxHeight: open ? 320 : 0,
              mt: open ? "var(--sm)" : 0,
              transform: open ? "translateY(0)" : "translateY(-4px)",
              ...motionTransition,
              "@media (prefers-reduced-motion: reduce)": {
                opacity: open ? 1 : 0,
                maxHeight: open ? 320 : 0,
                transform: "none",
                transition: "opacity var(--duration-quick) linear, max-height var(--duration-quick) linear",
              },
            }),
      }}
    >
      <Box
        sx={{
          borderRadius: "var(--corner-medium)",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--outline-variant)",
          boxShadow: open && isPopover ? "var(--elevation-2)" : "var(--elevation-0, none)",
          overflow: "hidden",
          "@media (prefers-reduced-motion: no-preference)": {
            transition: "box-shadow var(--motion-enter-duration) var(--motion-enter-easing)",
          },
        }}
      >
        <Box aria-hidden sx={{ height: 3, backgroundColor: accentColor }} />

        <Box sx={{ p: { xs: "var(--sm)", sm: "var(--md)" } }}>
          <Typography
            id={headingId}
            variant="overline"
            component="p"
            sx={{
              m: 0,
              mb: "var(--sm)",
              color: "var(--on-surface-variant)",
              fontFamily: "var(--font-family-primary)",
              fontSize: "var(--overline-size)",
              fontWeight: "var(--overline-weight)",
              lineHeight: "var(--overline-line-height)",
              letterSpacing: "var(--overline-tracking)",
              textTransform: "uppercase",
            }}
          >
            Widgets in this view
          </Typography>

          <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
            {previewItems.map((type, index) => {
              const meta = WIDGET_METADATA[type];
              const WidgetIcon = getWidgetIcon(meta.icon);
              return (
                <Box
                  component="li"
                  key={type}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--sm)",
                    py: "var(--2xs)",
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0)" : "translateY(4px)",
                    "@media (prefers-reduced-motion: no-preference)": {
                      transition: [
                        `opacity var(--motion-enter-duration) var(--motion-enter-easing) ${open ? index * 40 : 0}ms`,
                        `transform var(--motion-enter-duration) var(--motion-enter-easing) ${open ? index * 40 : 0}ms`,
                      ].join(", "),
                    },
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "var(--corner-small)",
                      backgroundColor: `color-mix(in srgb, ${accentColor} 12%, var(--surface))`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon={WidgetIcon} size="small" color={accentColor} />
                  </Box>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      color: "var(--on-surface)",
                      fontFamily: "var(--font-family-primary)",
                      fontSize: "var(--body-2-size)",
                      fontWeight: "var(--body-2-weight)",
                      lineHeight: "var(--body-2-line-height)",
                      letterSpacing: "var(--body-2-tracking)",
                      wordBreak: "break-word",
                    }}
                  >
                    {meta.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {moreCount > 0 && (
            <Box
              sx={{
                mt: "var(--sm)",
                pt: "var(--sm)",
                borderTop: "1px solid var(--outline-variant)",
                display: "flex",
                justifyContent: "center",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(4px)",
                "@media (prefers-reduced-motion: no-preference)": {
                  transition: [
                    `opacity var(--motion-enter-duration) var(--motion-enter-easing) ${open ? 120 : 0}ms`,
                    `transform var(--motion-enter-duration) var(--motion-enter-easing) ${open ? 120 : 0}ms`,
                  ].join(", "),
                },
              }}
            >
              <Typography
                variant="caption"
                component="span"
                sx={{
                  px: "var(--sm)",
                  py: "var(--3xs)",
                  borderRadius: "var(--corner-full)",
                  backgroundColor: "var(--surface-container-low)",
                  color: "var(--on-surface-variant)",
                  fontFamily: "var(--font-family-primary)",
                  fontSize: "var(--caption-size)",
                  fontWeight: 600,
                  lineHeight: "var(--caption-line-height)",
                  letterSpacing: "var(--caption-tracking)",
                }}
              >
                +{moreCount} more
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export { PREVIEW_LEAVE_DELAY_MS, PREVIEW_WIDGET_COUNT };

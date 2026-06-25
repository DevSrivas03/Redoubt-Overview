import React from "react";
import { Box, Typography } from "ds/index";
import { LayoutGrid } from "lucide-react";
import { getWidgetIcon } from "@/config/widgetIcons";
import type { RoleConfig } from "@/config/dashboardConfig";
import { WIDGET_METADATA } from "@/config/dashboardConfig";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePrefersFinePointer } from "@/hooks/usePrefersFinePointer";
import {
  PREVIEW_LEAVE_DELAY_MS,
  PREVIEW_WIDGET_COUNT,
  RoleCardHoverPreview,
} from "./RoleCardHoverPreview";

const focusRingSx = {
  "&:focus-visible": {
    outline: "2px solid var(--primary)",
    outlineOffset: "2px",
  },
};

const statusLabelSx = {
  fontFamily: "var(--font-family-primary)",
  fontSize: "var(--caption-size)",
  fontWeight: 600,
  lineHeight: "var(--caption-line-height)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
} as const;

export type RoleCardMode = "default" | "change";
export type RoleCardLayout = "compact" | "expanded";

interface RoleCardProps {
  role: RoleConfig;
  selected: boolean;
  mode?: RoleCardMode;
  layout?: RoleCardLayout;
  onSelect: () => void;
  onRadioKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

export const RoleCard = React.forwardRef<HTMLButtonElement, RoleCardProps>(
  function RoleCard(
    { role, selected, mode = "default", layout = "compact", onSelect, onRadioKeyDown },
    ref,
  ): React.ReactElement {
    const [previewOpen, setPreviewOpen] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const closeTimerRef = React.useRef<number | null>(null);
    const prefersFinePointer = usePrefersFinePointer();
    const isDesktopLayout = useMediaQuery("(min-width: 600px)");

    const IconComponent = getWidgetIcon(role.icon);
    const widgetLabels = role.widgets.map((w) => WIDGET_METADATA[w].label);
    const spokenPreview = widgetLabels.slice(0, PREVIEW_WIDGET_COUNT).join(", ");
    const moreCount = Math.max(0, widgetLabels.length - PREVIEW_WIDGET_COUNT);
    const previewId = `role-preview-${role.id}`;
    const previewHeadingId = `role-preview-heading-${role.id}`;
    const isChangeMode = mode === "change";
    const isExpandedLayout = layout === "expanded";
    const showActiveState = selected && !isChangeMode;
    const showCurrentLabel = selected && isChangeMode;
    const previewLayout = isDesktopLayout ? "popover" : "inline";
    const hoverPreviewEnabled = prefersFinePointer && isDesktopLayout;
    const showPreviewTrigger = !hoverPreviewEnabled;

    const clearCloseTimer = () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };

    const openPreview = () => {
      clearCloseTimer();
      setPreviewOpen(true);
    };

    const closePreview = () => {
      clearCloseTimer();
      setPreviewOpen(false);
    };

    const scheduleClosePreview = () => {
      if (!prefersFinePointer) return;
      clearCloseTimer();
      closeTimerRef.current = window.setTimeout(() => {
        setPreviewOpen(false);
        closeTimerRef.current = null;
      }, PREVIEW_LEAVE_DELAY_MS);
    };

    const togglePreview = (event: React.MouseEvent) => {
      event.stopPropagation();
      setPreviewOpen((open) => !open);
    };

    React.useEffect(() => () => clearCloseTimer(), []);

    React.useEffect(() => {
      if (!previewOpen || prefersFinePointer) return undefined;

      const handlePointerDown = (event: PointerEvent) => {
        if (!wrapperRef.current?.contains(event.target as Node)) {
          closePreview();
        }
      };

      document.addEventListener("pointerdown", handlePointerDown);
      return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [previewOpen, prefersFinePointer]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Escape") {
        closePreview();
        return;
      }
      onRadioKeyDown?.(event);
    };

    const handlePreviewKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closePreview();
      }
    };

    return (
      <Box
        ref={wrapperRef}
        onMouseEnter={prefersFinePointer ? openPreview : undefined}
        onMouseLeave={prefersFinePointer ? scheduleClosePreview : undefined}
        sx={{
          position: "relative",
          width: "100%",
          minWidth: 0,
          zIndex: previewOpen && previewLayout === "popover" ? 30 : 0,
          display: "flex",
          flexDirection: "column",
          "&:focus-within .role-preview-trigger": {
            opacity: 1,
            pointerEvents: "auto",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: isExpandedLayout ? "flex-start" : "center",
            gap: "var(--xs)",
            p: "var(--md)",
            borderRadius: "var(--corner-medium)",
            border: "2px solid",
            borderColor: showActiveState ? role.color : "var(--outline-variant)",
            borderStyle: showCurrentLabel ? "dashed" : "solid",
            backgroundColor: showActiveState
              ? `color-mix(in srgb, ${role.color} 6%, var(--surface))`
              : "var(--surface)",
            "@media (prefers-reduced-motion: no-preference)": {
              transition: [
                "border-color var(--motion-enter-quick-duration) var(--motion-enter-quick-easing)",
                "background-color var(--motion-enter-quick-duration) var(--motion-enter-quick-easing)",
                "box-shadow var(--motion-enter-duration) var(--motion-enter-easing)",
              ].join(", "),
            },
            ...(previewOpen && {
              backgroundColor: showActiveState
                ? `color-mix(in srgb, ${role.color} 8%, var(--surface))`
                : "var(--surface-container-low)",
              boxShadow: previewLayout === "popover" ? "var(--elevation-1)" : "none",
            }),
          }}
        >
          <Box
            ref={ref}
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${role.label}, ${role.widgets.length} widgets${spokenPreview ? `, includes ${spokenPreview}` : ""}${moreCount > 0 ? `, and ${moreCount} more` : ""}. ${isChangeMode ? "Switch to this dashboard view." : "Apply this dashboard view."}`}
            onClick={onSelect}
            onKeyDown={handleKeyDown}
            sx={{
              flex: 1,
              minWidth: 0,
              minHeight: 44,
              display: "flex",
              alignItems: isExpandedLayout ? "flex-start" : "center",
              gap: "var(--sm)",
              p: 0,
              m: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              textAlign: "left",
              font: "inherit",
              color: "inherit",
              borderRadius: "var(--corner-small)",
              ...focusRingSx,
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: "var(--xl)",
                height: "var(--xl)",
                borderRadius: "var(--corner-small)",
                backgroundColor: `color-mix(in srgb, ${role.color} 14%, var(--surface))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <IconComponent size={16} color={role.color} />
            </Box>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--xs)",
                  flexWrap: "wrap",
                }}
              >
                <Typography
                  variant="subtitle2"
                  component="span"
                  sx={{
                    fontWeight: 600,
                    color: "var(--on-surface)",
                    fontFamily: "var(--font-family-primary)",
                    fontSize: "var(--body-2-size)",
                    lineHeight: "var(--body-2-line-height)",
                    letterSpacing: "var(--body-2-tracking)",
                    whiteSpace: isExpandedLayout ? "normal" : undefined,
                    wordBreak: "break-word",
                  }}
                >
                  {role.label}
                </Typography>
                {showCurrentLabel && (
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{
                      ...statusLabelSx,
                      color: "var(--on-surface-variant)",
                    }}
                  >
                    Current
                  </Typography>
                )}
                {showActiveState && (
                  <Typography
                    variant="caption"
                    component="span"
                    sx={{
                      ...statusLabelSx,
                      color: role.color,
                      fontWeight: 700,
                    }}
                  >
                    Active
                  </Typography>
                )}
              </Box>
              <Typography
                variant="caption"
                component="span"
                sx={{
                  color: "var(--on-surface-variant)",
                  fontFamily: "var(--font-family-primary)",
                  fontSize: "var(--caption-size)",
                  lineHeight: "var(--caption-line-height)",
                  letterSpacing: "var(--caption-tracking)",
                }}
              >
                {role.widgets.length} widgets
              </Typography>
            </Box>
          </Box>

          {(showPreviewTrigger || previewOpen) && (
            <Box
              className="role-preview-trigger"
              component="button"
              type="button"
              aria-label={`${previewOpen ? "Hide" : "Preview"} widgets for ${role.label}`}
              aria-expanded={previewOpen}
              aria-controls={previewId}
              onClick={togglePreview}
              onKeyDown={handlePreviewKeyDown}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                alignSelf: isExpandedLayout ? "flex-start" : "center",
                width: 44,
                height: 44,
                p: 0,
                m: 0,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: previewOpen ? role.color : "var(--on-surface-variant)",
                opacity: showPreviewTrigger ? 1 : 0,
                pointerEvents: showPreviewTrigger ? "auto" : "none",
                borderRadius: "var(--corner-small)",
                ...focusRingSx,
                "@media (prefers-reduced-motion: no-preference)": {
                  transition:
                    "opacity var(--motion-enter-quick-duration) var(--motion-enter-quick-easing), color var(--motion-enter-quick-duration) var(--motion-enter-quick-easing)",
                },
                "&:hover .role-preview-trigger-icon, &:focus-visible .role-preview-trigger-icon": {
                  backgroundColor: `color-mix(in srgb, ${role.color} 10%, var(--surface))`,
                  borderColor: `color-mix(in srgb, ${role.color} 30%, var(--outline-variant))`,
                },
              }}
            >
              <Box
                className="role-preview-trigger-icon"
                aria-hidden
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "var(--corner-small)",
                  border: "1px solid",
                  borderColor: previewOpen
                    ? `color-mix(in srgb, ${role.color} 40%, transparent)`
                    : "var(--outline-variant)",
                  backgroundColor: previewOpen
                    ? `color-mix(in srgb, ${role.color} 12%, var(--surface))`
                    : "var(--surface-container-low)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "@media (prefers-reduced-motion: no-preference)": {
                    transition:
                      "background-color var(--motion-enter-quick-duration) var(--motion-enter-quick-easing), border-color var(--motion-enter-quick-duration) var(--motion-enter-quick-easing)",
                  },
                }}
              >
                <LayoutGrid size={18} strokeWidth={2} aria-hidden />
              </Box>
            </Box>
          )}
        </Box>

        <RoleCardHoverPreview
          id={previewId}
          headingId={previewHeadingId}
          open={previewOpen}
          layout={previewLayout}
          widgetTypes={role.widgets}
          accentColor={role.color}
        />
      </Box>
    );
  },
);

import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Icon,
  TextField,
  Typography,
} from "ds/index";
import { ChevronDown, Search } from "lucide-react";
import {
  CATEGORY_LABELS,
  WIDGET_METADATA,
  getWidgetsByCategory,
  type WidgetCategory,
  type WidgetType,
} from "@/config/dashboardConfig";
import { getWidgetIcon } from "@/config/widgetIcons";
import { useDashboardStore } from "@/stores/dashboardStore";

const CATEGORY_ORDER: WidgetCategory[] = [
  "overview",
  "risk",
  "cyber",
  "compliance",
  "supply_chain",
  "financial",
  "operational",
  "geopolitical",
];

interface WidgetPickerProps {
  enabledTypes: Set<WidgetType>;
  embedded?: boolean;
}

export function WidgetPicker({
  enabledTypes,
  embedded = false,
}: WidgetPickerProps): React.ReactElement {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState<WidgetCategory[]>(["overview", "risk"]);
  const { addWidget } = useDashboardStore();
  const byCategory = React.useMemo(() => getWidgetsByCategory(), []);

  const normalizedQuery = query.trim().toLowerCase();

  const filterWidgets = (types: WidgetType[]): WidgetType[] =>
    types.filter((type) => {
      const meta = WIDGET_METADATA[type];
      if (enabledTypes.has(type)) return false;
      if (!normalizedQuery) return true;
      return (
        meta.label.toLowerCase().includes(normalizedQuery) ||
        meta.description.toLowerCase().includes(normalizedQuery)
      );
    });

  const handleToggleCategory = (cat: WidgetCategory) => {
    setExpanded((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "none",
        mt: 0,
        borderRadius: "var(--corner-medium)",
        border: "1px solid var(--outline-variant)",
        backgroundColor: "var(--surface)",
        boxShadow: embedded ? "none" : "var(--elevation-2)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: "var(--md)", borderBottom: "1px solid var(--outline-variant)" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <Box sx={{ display: "flex", alignItems: "center", pr: "var(--xs)", color: "var(--on-surface-variant)" }}>
                  <Search size={18} />
                </Box>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
        {CATEGORY_ORDER.map((category) => {
          const widgets = filterWidgets(byCategory[category]);
          if (widgets.length === 0 && normalizedQuery) return null;

          const isOpen = expanded.includes(category);

          return (
            <Accordion
              key={category}
              expanded={isOpen}
              onChange={() => handleToggleCategory(category)}
              disableGutters
              elevation={0}
              sx={{
                "&:before": { display: "none" },
                borderBottom: "1px solid var(--outline-variant)",
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown size={18} />}
                sx={{
                  minHeight: 48,
                  px: "var(--md)",
                  "& .MuiAccordionSummary-content": { my: "var(--sm)" },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "var(--on-surface)" }}>
                  {CATEGORY_LABELS[category]}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                {widgets.length === 0 ? (
                  <Typography
                    variant="body2"
                    sx={{ px: "var(--md)", pb: "var(--md)", color: "var(--on-surface-variant)" }}
                  >
                    No widgets available in this category.
                  </Typography>
                ) : (
                  widgets.map((type) => {
                    const meta = WIDGET_METADATA[type];
                    const WidgetIcon = getWidgetIcon(meta.icon);
                    return (
                      <Box
                        key={type}
                        onClick={() => addWidget(type)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            addWidget(type);
                          }
                        }}
                        sx={{
                          display: "flex",
                          gap: "var(--md)",
                          px: "var(--md)",
                          py: "var(--md)",
                          cursor: "pointer",
                          borderTop: "1px solid var(--outline-variant)",
                          transition: "background-color 0.15s ease",
                          "&:hover": {
                            backgroundColor: "var(--surface-container-low)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "var(--corner-small)",
                            backgroundColor: "var(--surface-container-low)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon icon={WidgetIcon} size="medium" color="var(--on-surface-variant)" />
                        </Box>
                        <Box sx={{ minWidth: 0, textAlign: "left" }}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600, color: "var(--on-surface)" }}
                          >
                            {meta.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: "var(--on-surface-variant)",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {meta.description}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Box>
  );
}

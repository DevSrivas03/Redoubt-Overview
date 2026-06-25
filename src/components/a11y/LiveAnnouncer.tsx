import React from "react";
import { Box } from "ds/index";
import { useDashboardStore } from "@/stores/dashboardStore";

/** Visually hidden region for screen reader announcements. */
export function LiveAnnouncer(): React.ReactElement {
  const { liveMessage, setLiveMessage } = useDashboardStore();

  React.useEffect(() => {
    if (!liveMessage) return undefined;
    const timer = window.setTimeout(() => setLiveMessage(null), 4000);
    return () => window.clearTimeout(timer);
  }, [liveMessage, setLiveMessage]);

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-atomic="true"
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
      {liveMessage}
    </Box>
  );
}

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const STARTUP_TIMEOUT_MS = 30_000;

export async function runBootstrap(): Promise<void> {
  // Tokens must load before ds/index — App imports the DS barrel.
  await Promise.race([
    import("ds/tokens"),
    new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `Design System tokens did not load within ${STARTUP_TIMEOUT_MS / 1000}s. ` +
                "Start the DS remote: cd redoubt-design-system-v2 && npm run watch:federation",
            ),
          ),
        STARTUP_TIMEOUT_MS,
      ),
    ),
  ]);

  const { default: App } = await import("./App");

  const container = document.getElementById("root");
  if (!container) throw new Error("Root element not found");

  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

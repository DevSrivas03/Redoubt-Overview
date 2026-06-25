import "./shims/process";
import { runBootstrap } from "./bootstrap";

void runBootstrap().catch((err) => {
  console.error("[bootstrap] Startup failed:", err);
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `<p style="padding:24px;font-family:system-ui;color:#b00020">Failed to load Overview. Is the Design System remote running?<br/><small>${String(err)}</small></p>`;
  }
});

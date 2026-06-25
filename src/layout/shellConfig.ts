/** Demo workspace list for the DS AccountMenu workspace switcher. */
export const SHELL_WORKSPACES = [
  {
    id: "ws-exiger",
    name: "Exiger",
    role: "admin" as const,
    initials: "EX",
  },
  {
    id: "ws-acme",
    name: "Acme Corp",
    role: "analyst" as const,
    initials: "AC",
  },
  {
    id: "ws-demo",
    name: "Demo Workspace",
    role: "viewer" as const,
    initials: "DW",
  },
] as const;

export const DEFAULT_WORKSPACE_ID = SHELL_WORKSPACES[0].id;

export const SHELL_USER = {
  name: "Casey Rivera",
} as const;

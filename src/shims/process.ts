/**
 * Browser shim for libraries that reference Node's `process` (e.g. react-draggable).
 * Must load before any draggable/grid code executes.
 */
const globalScope = globalThis as typeof globalThis & {
  process?: { env: Record<string, string | undefined> };
};

if (typeof globalScope.process === "undefined") {
  globalScope.process = { env: {} };
}

globalScope.process.env ??= {};

if (globalScope.process.env.DRAGGABLE_DEBUG === undefined) {
  globalScope.process.env.DRAGGABLE_DEBUG = "";
}

if (globalScope.process.env.NODE_ENV === undefined) {
  globalScope.process.env.NODE_ENV = "development";
}

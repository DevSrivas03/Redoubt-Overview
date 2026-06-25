import React from "react";

/** True when the primary input supports hover (typically mouse/trackpad). */
export function usePrefersFinePointer(): boolean {
  const [prefersFinePointer, setPrefersFinePointer] = React.useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  });

  React.useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setPrefersFinePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return prefersFinePointer;
}

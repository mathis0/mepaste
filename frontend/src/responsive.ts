import { useSyncExternalStore } from "react";

// >= 1024px → desktop layout (sidebar + main + right rail).
// The design targets 1280×800 specifically, but anything wide enough for
// the sidebar + composer + 320px rail benefits from this layout.
const DESKTOP_MIN = 1024;

function read(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= DESKTOP_MIN;
}

export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("resize", cb);
      return () => window.removeEventListener("resize", cb);
    },
    read,
    () => false,
  );
}

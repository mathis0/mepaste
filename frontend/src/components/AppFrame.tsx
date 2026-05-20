import { ReactNode } from "react";
import { SURFACE } from "../theme";

type Props = {
  children: ReactNode;
};

// Centered max-width 430px column. Fills the viewport on mobile.
// All screens render absolutely inside this column, matching the design's
// 390-wide artboards. No bottom tab bar — mepaste is one-shot.
export function AppFrame({ children }: Props) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100%",
        background: "#f3ece5",
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 430,
          minHeight: "100dvh",
          background: SURFACE,
          overflow: "hidden",
          boxShadow:
            "0 0 0 1px rgba(0,0,0,0.04), 0 30px 60px -30px rgba(80,40,20,0.18)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

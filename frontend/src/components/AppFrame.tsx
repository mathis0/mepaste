import { ReactNode } from "react";
import { TabBar, Tab } from "./TabBar";
import { SURFACE } from "../theme";

type Props = {
  children: ReactNode;
  activeTab?: Tab | null;
};

// Centered max-width 430 column. Fills the viewport on mobile.
// All screens render absolutely inside this column, matching the design's 390-wide artboards.
export function AppFrame({ children, activeTab }: Props) {
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
        {activeTab && <TabBar active={activeTab} />}
      </div>
    </div>
  );
}

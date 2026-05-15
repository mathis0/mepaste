import { CSSProperties, ReactNode } from "react";
import { MONO, TEAL } from "../theme";

type Props = {
  children: ReactNode;
  color?: string;
  rotate?: number;
  style?: CSSProperties;
};

export function Stamp({ children, color = TEAL, rotate = -6, style }: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px 4px",
        border: `1.6px solid ${color}`,
        borderRadius: 4,
        color,
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: "uppercase",
        transform: `rotate(${rotate}deg)`,
        background: "rgba(255,255,255,0.7)",
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,0.4)",
        opacity: 0.92,
        whiteSpace: "pre-line",
        textAlign: "center",
        lineHeight: 1.1,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

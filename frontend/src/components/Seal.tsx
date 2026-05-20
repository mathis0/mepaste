import { CSSProperties, ReactNode } from "react";
import { MONO, TEAL } from "../theme";

type Props = {
  top: ReactNode;
  bottom?: ReactNode;
  size?: number;
  color?: string;
  rotate?: number;
  style?: CSSProperties;
};

export function Seal({
  top,
  bottom = "★",
  size = 64,
  color = TEAL,
  rotate = -8,
  style,
}: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `rotate(${rotate}deg)`,
        boxShadow: `0 6px 18px -6px ${color}, inset 0 0 0 2px rgba(255,255,255,0.35), inset 0 0 0 4px ${color}`,
        fontFamily: MONO,
        fontWeight: 700,
        letterSpacing: 0.5,
        ...style,
      }}
    >
      <div
        style={{
          fontSize: size * 0.13,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.15,
          padding: "0 6px",
        }}
      >
        {top}
      </div>
      <div style={{ fontSize: size * 0.22, marginTop: 2, opacity: 0.85 }}>{bottom}</div>
    </div>
  );
}

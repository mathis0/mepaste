import { ReactNode } from "react";
import { HAIR, INK_3, MONO } from "../../theme";

type Props = {
  children: ReactNode;
  dark?: boolean;
};

export function Kbd({ children, dark = false }: Props) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 11,
        fontWeight: 600,
        color: dark ? "rgba(255,255,255,0.85)" : INK_3,
        background: dark ? "rgba(255,255,255,0.08)" : "#fff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.18)" : HAIR}`,
        borderBottomWidth: 2,
        padding: "1px 6px",
        borderRadius: 5,
        display: "inline-block",
        minWidth: 16,
        textAlign: "center",
      }}
    >
      {children}
    </span>
  );
}

import { ReactNode } from "react";
import { Kbd } from "./Kbd";
import { HAIR, INK, INK_3, INK_4, MONO, SANS, SURFACE } from "../../theme";

type Hint = [label: string, keys: string[]];

type Props = {
  crumbs: string[];
  hints?: Hint[];
  right?: ReactNode;
};

export function TopBar({ crumbs, hints = [], right }: Props) {
  return (
    <div
      style={{
        height: 52,
        padding: "0 22px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: `1px solid ${HAIR}`,
        background: SURFACE,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: MONO,
          fontSize: 12.5,
          color: INK_3,
          letterSpacing: -0.1,
        }}
      >
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {i > 0 && <span style={{ color: INK_4 }}>/</span>}
            <span
              style={{
                color: i === crumbs.length - 1 ? INK : INK_3,
                fontWeight: i === crumbs.length - 1 ? 600 : 500,
              }}
            >
              {c}
            </span>
          </span>
        ))}
      </div>
      <span style={{ flex: 1 }} />
      {hints.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: SANS,
            fontSize: 11.5,
            color: INK_3,
          }}
        >
          {hints.map(([label, keys], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{label}</span>
              <span style={{ display: "flex", gap: 3 }}>
                {keys.map((k, j) => <Kbd key={j}>{k}</Kbd>)}
              </span>
            </div>
          ))}
        </div>
      )}
      {right}
    </div>
  );
}

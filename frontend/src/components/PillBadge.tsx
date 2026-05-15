import { Icon } from "./Icon";
import { SANS, TEAL, TEAL_BORDER, TEAL_TINT, WARN } from "../theme";

type Props = {
  icon: string;
  label: string;
  warn?: boolean;
};

export function PillBadge({ icon, label, warn = false }: Props) {
  const c = warn ? WARN : TEAL;
  const bg = warn ? "rgba(224,122,60,0.10)" : TEAL_TINT;
  const bd = warn ? "rgba(224,122,60,0.30)" : TEAL_BORDER;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 22,
        padding: "0 8px",
        borderRadius: 999,
        background: bg,
        border: `1px solid ${bd}`,
        fontSize: 11.5,
        fontWeight: 500,
        color: c,
        letterSpacing: -0.05,
        fontFamily: SANS,
      }}
    >
      <Icon d={icon} s={11} c={c} sw={2} />
      <span>{label}</span>
    </span>
  );
}

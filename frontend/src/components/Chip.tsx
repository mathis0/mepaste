import { Icon } from "./Icon";
import { HAIR, INK_2, INK_3, TEAL, TEAL_BORDER, TEAL_TINT } from "../theme";

type Props = {
  icon?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
  accent?: string;
};

export function Chip({ icon, label, active = false, onClick, accent = TEAL }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 11px",
        borderRadius: 999,
        background: active ? TEAL_TINT : "#fff",
        border: `1px solid ${active ? TEAL_BORDER : HAIR}`,
        fontSize: 13,
        fontWeight: 500,
        color: active ? accent : INK_2,
        letterSpacing: -0.1,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {icon && <Icon d={icon} s={14} c={active ? accent : INK_3} />}
      <span>{label}</span>
    </button>
  );
}

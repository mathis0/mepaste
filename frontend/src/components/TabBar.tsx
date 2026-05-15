import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { I } from "../icons";
import { INK_3, TEAL } from "../theme";
import { useLang, t } from "../i18n";

export type Tab = "create" | "list" | "settings";

export function TabBar({ active }: { active: Tab }) {
  const nav = useNavigate();
  const lang = useLang();
  const tabs: { id: Tab; label: string; icon: string; path: string }[] = [
    { id: "create", label: t(lang, "new_paste"), icon: I.plus, path: "/" },
    { id: "list", label: t(lang, "pastes"), icon: I.raw, path: "/list" },
    { id: "settings", label: t(lang, "settings"), icon: I.user, path: "/settings" },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 16,
        height: 56,
        borderRadius: 18,
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow:
          "0 6px 18px -8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
        display: "flex",
        alignItems: "center",
        padding: "0 6px",
        zIndex: 200,
      }}
    >
      {tabs.map((tb) => {
        const on = tb.id === active;
        return (
          <button
            key={tb.id}
            type="button"
            onClick={() => nav(tb.path)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              height: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <Icon d={tb.icon} s={20} c={on ? TEAL : INK_3} sw={on ? 2 : 1.6} />
            <span
              style={{
                fontSize: 10.5,
                fontWeight: on ? 600 : 500,
                color: on ? TEAL : INK_3,
                letterSpacing: 0,
              }}
            >
              {tb.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { BrandMark } from "../BrandMark";
import { Icon } from "../Icon";
import { Kbd } from "./Kbd";
import { I } from "../../icons";
import {
  FARSI,
  HAIR,
  INK,
  INK_2,
  INK_3,
  INK_4,
  MONO,
  PEACH,
  SANS,
  TEAL,
  TEAL_BORDER,
  TEAL_DARK,
  TEAL_TINT,
} from "../../theme";
import { Lang, t } from "../../i18n";
import { useAuth } from "../../auth";

export type SidebarActive = "new" | "list" | "settings" | null;

type Props = {
  active: SidebarActive;
  lang: Lang;
  pasteCount?: number;
};

export function Sidebar({ active, lang, pasteCount }: Props) {
  const nav = useNavigate();
  const { user, mode } = useAuth();
  const isFa = lang === "fa";
  const dir: "rtl" | "ltr" = isFa ? "rtl" : "ltr";

  return (
    <div
      dir={dir}
      style={{
        width: 240,
        flexShrink: 0,
        height: "100%",
        background: "#f6efe7",
        [isFa ? "borderLeft" : "borderRight"]: `1px solid ${HAIR}`,
        padding: "18px 14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: isFa ? FARSI : SANS,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px" }}>
        <BrandMark size={26} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 14,
              fontWeight: 700,
              color: INK,
              letterSpacing: -0.2,
              direction: "ltr",
            }}
          >
            mepaste
          </span>
          <span
            style={{
              fontFamily: isFa ? FARSI : MONO,
              fontSize: isFa ? 12 : 9.5,
              color: PEACH,
              letterSpacing: isFa ? 0 : 1.4,
              textTransform: isFa ? "none" : "uppercase",
              fontWeight: 600,
            }}
          >
            {isFa ? "می‌پیست · یک پیست‌بین کوچک" : "a tiny pastebin"}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => nav("/")}
        style={{
          height: 38,
          borderRadius: 11,
          border: "none",
          cursor: "pointer",
          background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
          color: "#fff",
          fontFamily: isFa ? FARSI : SANS,
          fontSize: 13.5,
          fontWeight: 600,
          letterSpacing: -0.1,
          boxShadow:
            "0 6px 14px -6px rgba(220,76,62,0.55), inset 0 1px 0 rgba(255,255,255,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Icon d={I.plus} s={15} c="#fff" sw={2.2} />
        <span>{t(lang, "new_paste_long")}</span>
        <span style={{ flex: 1 }} />
        <Kbd dark>N</Kbd>
      </button>

      <div
        style={{
          height: 32,
          borderRadius: 9,
          background: "#fff",
          border: `1px solid ${HAIR}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 10px",
        }}
      >
        <Icon d={I.search} s={14} c={INK_4} />
        <span style={{ flex: 1, fontSize: 12.5, color: INK_4 }}>{t(lang, "search_pastes")}</span>
        <Kbd>⌘K</Kbd>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <SectionLabel isFa={isFa}>{t(lang, "sb_workshop")}</SectionLabel>
        <NavRow
          icon={I.plus}
          label={t(lang, "new_paste_long")}
          active={active === "new"}
          onClick={() => nav("/")}
        />
        <NavRow
          icon={I.raw}
          label={t(lang, "my_pastes")}
          count={pasteCount}
          active={active === "list"}
          onClick={() => nav("/list")}
        />
        <NavRow icon={I.flame} label={t(lang, "sb_burning")} count={0} />
        <NavRow icon={I.globe} label={t(lang, "sb_public")} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <SectionLabel isFa={isFa}>{t(lang, "sb_archive")}</SectionLabel>
        <NavRow icon={I.clock} label={t(lang, "sb_this_week")} />
        <NavRow icon={I.clock} label={t(lang, "sb_older")} />
      </div>

      <div style={{ flex: 1 }} />

      <div
        style={{
          padding: "10px 12px",
          borderRadius: 10,
          background: "#fff",
          border: `1px dashed ${TEAL_BORDER}`,
          fontFamily: MONO,
          fontSize: 10.5,
          color: INK_3,
          lineHeight: "16px",
        }}
      >
        <div style={{ color: TEAL, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
          batch #042
        </div>
        <div style={{ marginTop: 2 }}>v0.4.2 · 14kb · 0 cookies</div>
        <div style={{ color: PEACH, marginTop: 2 }}>♥ hand-built in tehran</div>
      </div>

      {mode === "user" ? (
        <NavRow
          icon={I.user}
          label={user?.name || user?.email?.split("@")[0] || "you"}
          onClick={() => nav("/settings")}
          active={active === "settings"}
        />
      ) : (
        <button
          type="button"
          onClick={() => nav("/signup")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 36,
            padding: "0 12px",
            borderRadius: 10,
            background: TEAL_TINT,
            border: `1px dashed ${TEAL_BORDER}`,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
            width: "100%",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: 99, background: PEACH }} />
          <span style={{ flex: 1, fontSize: 13, color: INK, fontWeight: 600 }}>
            {t(lang, "mode_open_a_tab")}
          </span>
          <span style={{ fontSize: 14, color: TEAL }}>→</span>
        </button>
      )}
    </div>
  );

  function SectionLabel({ children, isFa }: { children: React.ReactNode; isFa: boolean }) {
    return (
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: INK_4,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          padding: "6px 10px 2px",
          direction: "ltr",
          textAlign: isFa ? "right" : "left",
        }}
      >
        {children}
      </div>
    );
  }
}

type NavRowProps = {
  icon: string;
  label: string;
  count?: number;
  active?: boolean;
  kbd?: string;
  onClick?: () => void;
};

function NavRow({ icon, label, count, active = false, kbd, onClick }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        height: 34,
        padding: "0 12px",
        borderRadius: 9,
        background: active ? "#fff" : "transparent",
        border: `1px solid ${active ? HAIR : "transparent"}`,
        boxShadow: active ? "0 1px 0 rgba(0,0,0,0.02)" : "none",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        width: "100%",
      }}
    >
      <Icon d={icon} s={16} c={active ? TEAL : INK_3} sw={active ? 2 : 1.6} />
      <span
        style={{
          flex: 1,
          fontSize: 13.5,
          fontWeight: active ? 600 : 500,
          color: active ? INK : INK_2,
          letterSpacing: -0.1,
        }}
      >
        {label}
      </span>
      {count != null && (
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10.5,
            color: active ? TEAL : INK_4,
            background: active ? TEAL_TINT : "transparent",
            padding: active ? "1px 6px" : 0,
            borderRadius: 6,
          }}
        >
          {count}
        </span>
      )}
      {kbd && <Kbd>{kbd}</Kbd>}
    </button>
  );
}

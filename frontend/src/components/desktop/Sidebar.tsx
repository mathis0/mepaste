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

type Props = {
  lang: Lang;
};

export function Sidebar({ lang }: Props) {
  const nav = useNavigate();
  const isFa = lang === "fa";

  return (
    <div
      dir={isFa ? "rtl" : "ltr"}
      style={{
        width: 240,
        flexShrink: 0,
        minHeight: "100dvh",
        background: "#f6efe7",
        [isFa ? "borderLeft" : "borderRight"]: `1px solid ${HAIR}`,
        padding: "18px 14px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: isFa ? FARSI : SANS,
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
      }}
    >
      {/* brand */}
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

      {/* big new-paste CTA */}
      <button
        type="button"
        onClick={() => nav("/")}
        style={{
          height: 42,
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
          color: "#fff",
          fontFamily: isFa ? FARSI : SANS,
          fontSize: 14,
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
        <Kbd dark>⌘N</Kbd>
      </button>

      {/* "the deal" — manifesto card replaces nav rows */}
      <div
        style={{
          marginTop: 8,
          padding: "14px 14px 14px",
          borderRadius: 13,
          background: "#fff",
          border: `1px solid ${HAIR}`,
          backgroundImage:
            "radial-gradient(circle at 10px 10px, rgba(220,76,62,0.05) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10,
            fontWeight: 700,
            color: TEAL,
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          {t(lang, "the_deal_title")}
        </div>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 12.5,
            lineHeight: "18px",
            color: INK_2,
            letterSpacing: -0.1,
            whiteSpace: "pre-line",
          }}
        >
          {t(lang, "the_deal_body")}
        </p>
      </div>

      <div style={{ flex: 1 }} />

      {/* about link */}
      <button
        type="button"
        onClick={() => nav("/about")}
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
        <Icon d={I.info} s={14} c={TEAL} sw={2} />
        <span style={{ flex: 1, fontSize: 13, color: INK, fontWeight: 600 }}>
          {t(lang, "about")}
        </span>
        <span style={{ fontSize: 14, color: TEAL }}>→</span>
      </button>

      {/* indie footer */}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            color: INK_4,
          }}
        >
          <span style={{ color: TEAL, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>
            batch #042
          </span>
          <span style={{ color: INK_4 }}>v0.5.0</span>
        </div>
        <div style={{ marginTop: 4 }}>14kb · 0 cookies · 0 trackers</div>
        <div style={{ color: PEACH, marginTop: 2 }}>♥ no signup · no accounts</div>
      </div>
    </div>
  );
}

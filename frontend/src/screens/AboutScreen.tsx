import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AppFrame } from "../components/AppFrame";
import { BrandMark } from "../components/BrandMark";
import { Icon } from "../components/Icon";
import { Stamp } from "../components/Stamp";
import { I } from "../icons";
import {
  CARD,
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
  TEAL_TINT,
  WARN,
} from "../theme";
import { setLang, t, useLang } from "../i18n";

const iconBtn: React.CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  width: 36,
  height: 36,
  borderRadius: 999,
  background: "rgba(255,255,255,0.7)",
  border: `1px solid ${HAIR}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: 0,
  cursor: "pointer",
  zIndex: 7,
};

export function AboutScreen() {
  const lang = useLang();
  const nav = useNavigate();

  const toggleLang = () => setLang(lang === "fa" ? "en" : "fa");

  return (
    <AppFrame>
      <button type="button" style={iconBtn} aria-label={t(lang, "back")} onClick={() => nav("/")}>
        <Icon d={I.back} s={20} c={INK_2} />
      </button>
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 0,
          right: 0,
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 60px",
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 600, color: INK, letterSpacing: -0.2 }}>
          {t(lang, "about_title")}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "auto",
          padding: "12px 0 40px",
        }}
      >
        {/* manifesto card */}
        <div
          style={{
            margin: "4px 16px 6px",
            padding: "14px 16px 16px",
            borderRadius: 14,
            background: "#fff",
            border: `1px solid ${HAIR}`,
            backgroundImage:
              "radial-gradient(circle at 10px 10px, rgba(220,76,62,0.05) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BrandMark size={22} />
            <span
              style={{
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 700,
                color: TEAL,
                textTransform: "uppercase",
                letterSpacing: 1.4,
              }}
            >
              {t(lang, "settings_what_is")}
            </span>
          </div>
          <p
            style={{
              margin: "10px 0 0",
              fontSize: 13.5,
              lineHeight: "20px",
              color: INK_2,
              letterSpacing: -0.1,
              whiteSpace: "pre-line",
            }}
          >
            {t(lang, "settings_manifesto")}
          </p>
          <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 11, color: INK_3 }}>
            {t(lang, "settings_signature").replace("tehran", "").trim()}{" "}
            <span style={{ color: PEACH }}>{lang === "fa" ? "تهران" : "tehran"}</span>
          </div>
          <div style={{ position: "absolute", top: -10, right: 14 }}>
            <Stamp
              color={WARN}
              rotate={6}
              style={{ fontSize: 9, padding: "3px 7px 2px", letterSpacing: 1.2 }}
            >
              v0.5 · batch #042
            </Stamp>
          </div>
        </div>

        <SectionLabel>{t(lang, "look_feel")}</SectionLabel>
        <Group>
          <Row icon={I.sun} title={t(lang, "theme")} detail="system" />
          <Row
            icon={I.globe}
            title={t(lang, "language")}
            detail={lang === "fa" ? "فارسی · english" : "english · فارسی"}
            onClick={toggleLang}
            last
          />
        </Group>

        {/* three promises */}
        <div
          style={{
            margin: "18px 16px 6px",
            padding: "14px 16px",
            borderRadius: 14,
            background: TEAL_TINT,
            border: `1px dashed ${TEAL_BORDER}`,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 700,
              color: TEAL,
              textTransform: "uppercase",
              letterSpacing: 1.4,
              marginBottom: 8,
            }}
          >
            {t(lang, "three_promises")}
          </div>
          {[t(lang, "promise_1"), t(lang, "promise_2"), t(lang, "promise_3")].map((p, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: i ? 6 : 0 }}
            >
              <span
                style={{
                  marginTop: 4,
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: TEAL,
                  transform: "rotate(45deg)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, color: INK_2, lineHeight: "18px" }}>{p}</span>
            </div>
          ))}
        </div>

        {/* page weight + maker line */}
        <div style={{ padding: "28px 24px 8px", textAlign: "center" }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10.5,
              color: "rgba(80,55,45,0.55)",
            }}
          >
            {t(lang, "page_weight")}
          </div>
          <div
            style={{
              marginTop: 8,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: MONO,
              fontSize: 10.5,
              color: "rgba(80,55,45,0.6)",
            }}
          >
            <span style={{ fontSize: 11 }}>🍅</span>
            <span>{t(lang, "made_with")}</span>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: "18px 32px 6px",
        fontSize: 12.5,
        color: INK_3,
        textTransform: "uppercase",
        letterSpacing: 0.4,
        fontWeight: 500,
        fontFamily: SANS,
      }}
    >
      {children}
    </div>
  );
}

function Group({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        margin: "0 16px",
        background: CARD,
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${HAIR}`,
      }}
    >
      {children}
    </div>
  );
}

type RowProps = {
  icon: string;
  title: string;
  detail?: string;
  onClick?: () => void;
  last?: boolean;
};

function Row({ icon, title, detail, onClick, last }: RowProps) {
  const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    minHeight: 48,
    padding: "0 14px",
    borderBottom: last ? "none" : `1px solid ${HAIR}`,
    gap: 12,
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: onClick ? "pointer" : "default",
    fontFamily: SANS,
    color: INK,
  };
  const content = (
    <>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: TEAL_TINT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon d={icon} s={16} c={TEAL} sw={2} />
      </div>
      <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: INK, letterSpacing: -0.2 }}>
        {title}
      </span>
      {detail && <span style={{ fontSize: 14, color: INK_3 }}>{detail}</span>}
      <Icon d={I.chev} s={14} c={INK_4} sw={2.2} />
    </>
  );
  return onClick ? (
    <button type="button" onClick={onClick} style={baseStyle}>{content}</button>
  ) : (
    <div style={baseStyle}>{content}</div>
  );
}

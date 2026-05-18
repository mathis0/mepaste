import { ReactNode, useState } from "react";
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
  MONO,
  PEACH,
  SANS,
  TEAL,
  TEAL_BORDER,
  TEAL_TINT,
  WARN,
} from "../theme";
import { Lang, setLang, t, useLang } from "../i18n";
import { ExpiresIn, Visibility } from "../api";

function readDefault<T extends string>(key: string, fallback: T): T {
  const v = localStorage.getItem(key) as T | null;
  return v ?? fallback;
}

export function SettingsScreen() {
  const lang = useLang();
  const [vis, setVis] = useState<Visibility>(readDefault("mp_default_visibility", "public"));
  const [exp, setExp] = useState<ExpiresIn>(readDefault("mp_default_expires", "1d"));
  const [burn, setBurn] = useState<boolean>(localStorage.getItem("mp_default_burn") === "1");
  const [colour, setColour] = useState<boolean>(localStorage.getItem("mp_colour_code") !== "0");

  const toggleLang = () => {
    setLang(lang === "fa" ? "en" : "fa");
  };

  const cycleVisibility = () => {
    const next: Visibility = vis === "public" ? "unlisted" : vis === "unlisted" ? "private" : "public";
    setVis(next);
    localStorage.setItem("mp_default_visibility", next);
  };
  const cycleExp = () => {
    const next: ExpiresIn = exp === "1h" ? "1d" : exp === "1d" ? "never" : "1h";
    setExp(next);
    localStorage.setItem("mp_default_expires", next);
  };
  const toggleBurn = () => {
    const next = !burn;
    setBurn(next);
    localStorage.setItem("mp_default_burn", next ? "1" : "0");
  };
  const toggleColour = () => {
    const next = !colour;
    setColour(next);
    localStorage.setItem("mp_colour_code", next ? "1" : "0");
  };

  const visLabel = t(lang, vis);
  const expLabel = exp === "1h"
    ? (lang === "fa" ? t(lang, "wilts_in_an_hour") : "an hour")
    : exp === "1d"
      ? (lang === "fa" ? t(lang, "wilts_in_a_day") : "a day")
      : (lang === "fa" ? t(lang, "wilts_never") : "never");

  return (
    <AppFrame activeTab="settings">
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
          padding: "0 16px",
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 600, color: INK, letterSpacing: -0.2 }}>
          {t(lang, "settings")}
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          bottom: 90,
          overflow: "auto",
          padding: "8px 0 24px",
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
            <span style={{ color: PEACH }}>
              {lang === "fa" ? "تهران" : "tehran"}
            </span>
          </div>
          <div style={{ position: "absolute", top: -10, right: 14 }}>
            <Stamp
              color={WARN}
              rotate={6}
              style={{ fontSize: 9, padding: "3px 7px 2px", letterSpacing: 1.2 }}
            >
              v0.4 · batch #042
            </Stamp>
          </div>
        </div>

        <SectionLabel>{t(lang, "profile")}</SectionLabel>
        <Group>
          <Row left={<Avatar />} title="nima" detail="nima@mepaste.to · since paste #1" big last />
        </Group>

        <SectionLabel>{t(lang, "defaults_section")}</SectionLabel>
        <Group>
          <Row icon={I.globe} title={t(lang, "who_can_see")} detail={visLabel} onClick={cycleVisibility} />
          <Row icon={I.clock} title={t(lang, "how_long_ripens")} detail={expLabel} onClick={cycleExp} />
          <Row icon={I.flame} title={t(lang, "burn_after_read")} toggle on={burn} onClick={toggleBurn} />
          <Row icon={I.raw} title={t(lang, "colour_the_code")} toggle on={colour} onClick={toggleColour} last />
        </Group>

        <SectionLabel>{t(lang, "look_feel")}</SectionLabel>
        <Group>
          <Row icon={I.sun} title={t(lang, "theme")} detail="system" />
          <Row icon={I.globe} title={t(lang, "language")} detail={lang === "fa" ? "فارسی · english" : "english · فارسی"} onClick={toggleLang} last />
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

        <SectionLabel>{t(lang, "workshop")}</SectionLabel>
        <Group>
          <Row icon={I.info} title={t(lang, "current_vintage")} detail={t(lang, "vintage_value")} />
          <Row icon={I.flask} title={t(lang, "changelog")} detail={t(lang, "changelog_value")} />
          <Row icon={I.link} title={t(lang, "peek_source")} detail={t(lang, "github")} />
          <Row icon={I.bell} title={t(lang, "guestbook")} detail={t(lang, "guestbook_value")} last />
        </Group>

        {/* visitor counter */}
        <div style={{ padding: "24px 24px 8px", textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px",
              borderRadius: 6,
              background: "#0f1216",
              fontFamily: MONO,
              fontSize: 11,
              color: "#fbbf77",
            }}
          >
            <span style={{ color: "#5eead4" }}>{t(lang, "visitors")}</span>
            <span style={{ letterSpacing: 1.5, fontWeight: 700, color: "#fff" }}>04,217</span>
          </div>
          <div
            style={{
              marginTop: 10,
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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

function Avatar() {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 999,
        background: "linear-gradient(135deg, #fce5e0 0%, #f5b8ad 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontSize: 17,
        fontWeight: 700,
        color: "#b53a2e",
        border: `1px solid ${HAIR}`,
      }}
    >
      n
    </div>
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
  icon?: string;
  left?: ReactNode;
  title: string;
  detail?: string;
  toggle?: boolean;
  on?: boolean;
  onClick?: () => void;
  last?: boolean;
  big?: boolean;
};

function Row({ icon, left, title, detail, toggle, on, onClick, last, big }: RowProps) {
  const content = (
    <>
      {left ? left : icon && (
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
      )}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <span style={{ fontSize: 15, fontWeight: big ? 600 : 500, color: INK, letterSpacing: -0.2 }}>
          {title}
        </span>
        {big && detail && (
          <span style={{ fontSize: 12.5, color: INK_3, fontFamily: MONO }}>{detail}</span>
        )}
      </div>
      {!big && detail && <span style={{ fontSize: 14, color: INK_3 }}>{detail}</span>}
      {toggle ? (
        <Toggle on={!!on} />
      ) : (
        !big && <Icon d={I.chev} s={14} c="#b4a59c" sw={2.2} />
      )}
    </>
  );

  const baseStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    minHeight: big ? 64 : 48,
    padding: "0 14px",
    borderBottom: last ? "none" : `1px solid ${HAIR}`,
    gap: 12,
    background: "transparent",
    border: "none",
    width: "100%",
    textAlign: "left" as const,
    cursor: onClick ? "pointer" : "default",
    fontFamily: SANS,
    color: INK,
  };

  if (onClick) {
    return <button type="button" onClick={onClick} style={baseStyle}>{content}</button>;
  }
  return <div style={baseStyle}>{content}</div>;
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 51,
        height: 31,
        borderRadius: 99,
        background: on ? TEAL : "rgba(120,120,128,0.16)",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background 200ms",
      }}
    >
      <div
        style={{
          width: 27,
          height: 27,
          borderRadius: 99,
          background: "#fff",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}

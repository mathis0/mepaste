import { Icon } from "./Icon";
import { I } from "../icons";
import {
  HAIR,
  INK,
  MONO,
  PEACH,
  SANS,
  TEAL,
  TEAL_BORDER,
  TEAL_TINT,
} from "../theme";
import { useLang, t } from "../i18n";
import { Mode } from "../auth";

type Props = {
  url: string;
  onReset: () => void;
  onOpen: () => void;
  mode?: Mode;
  onOpenTab?: () => void;
};

export function PublishToast({ url, onReset, onOpen, mode = "anon", onOpenTab }: Props) {
  const lang = useLang();
  const handleCopy = () => {
    const fullUrl = `${window.location.origin}${url.startsWith("/") ? url : "/" + url.split("/").slice(-2).join("/")}`;
    navigator.clipboard?.writeText(fullUrl).catch(() => {});
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 196,
        left: 24,
        right: 24,
        background: "#fff",
        borderRadius: 22,
        border: `1px solid ${HAIR}`,
        padding: "22px 18px 16px",
        boxShadow:
          "0 30px 60px -28px rgba(80,40,20,0.4), 0 1px 0 rgba(255,255,255,0.8) inset",
        animation: "mp-toast-in 520ms cubic-bezier(.2,.7,.3,1) both",
        zIndex: 110,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10.5,
          color: PEACH,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {t(lang, "fresh_off_vine")}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 20,
          fontWeight: 700,
          color: INK,
          letterSpacing: -0.4,
        }}
      >
        {t(lang, "your_paste_live")}
      </div>
      <div
        style={{
          marginTop: 12,
          padding: "10px 12px",
          borderRadius: 12,
          background: TEAL_TINT,
          border: `1px dashed ${TEAL_BORDER}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon d={I.link} s={16} c={TEAL} />
        <span
          style={{
            flex: 1,
            fontFamily: MONO,
            fontSize: 13,
            color: INK,
            fontWeight: 600,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {url}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            height: 28,
            padding: "0 10px",
            borderRadius: 8,
            border: "none",
            background: TEAL,
            color: "#fff",
            fontFamily: SANS,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {t(lang, "copy")}
        </button>
      </div>
      {mode === "anon" && (
        <button
          type="button"
          onClick={onOpenTab}
          style={{
            marginTop: 10,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 12,
            background: "rgba(110,155,86,0.10)",
            border: "1px dashed rgba(110,155,86,0.35)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: SANS,
          }}
        >
          <span style={{ fontSize: 20 }}>🌱</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: MONO, fontSize: 10, color: PEACH, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700 }}>
              {t(lang, "toast_anon_upsell_title")}
            </div>
            <div style={{ marginTop: 1, fontSize: 12, color: "#3a2e28", lineHeight: "16px" }}>
              {t(lang, "toast_anon_upsell_body")}
            </div>
          </div>
          <span style={{ fontSize: 12, color: PEACH, fontWeight: 700 }}>{t(lang, "mode_open_a_tab")} →</span>
        </button>
      )}
      {mode === "user" && (
        <div
          style={{
            marginTop: 10,
            padding: "6px 10px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 11,
            color: PEACH,
          }}
        >
          <Icon d={I.check} s={12} c={PEACH} sw={2.5} />
          <span>{t(lang, "toast_user_saved")}</span>
        </div>
      )}
      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={onReset}
          style={{
            flex: 1,
            height: 38,
            borderRadius: 11,
            border: `1px solid ${HAIR}`,
            background: "#fff",
            cursor: "pointer",
            fontFamily: SANS,
            fontSize: 13,
            fontWeight: 500,
            color: "#3a2e28",
          }}
        >
          {t(lang, "smash_another")}
        </button>
        <button
          type="button"
          onClick={onOpen}
          style={{
            flex: 1,
            height: 38,
            borderRadius: 11,
            border: "none",
            background: "#0f1216",
            color: "#fff",
            fontFamily: SANS,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          {t(lang, "open_it")}
        </button>
      </div>
    </div>
  );
}

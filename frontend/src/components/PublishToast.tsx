import { useState } from "react";
import { Icon } from "./Icon";
import { I } from "../icons";
import {
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
} from "../theme";
import { useLang, t } from "../i18n";
import { ExpiresIn } from "../api";
import { expiryLabel } from "./PasteOptionsSheet";

type Props = {
  url: string;
  onReset: () => void;
  onOpen: () => void;
  expiresIn: ExpiresIn;
};

function expiryFooterTitle(lang: ReturnType<typeof useLang>, e: ExpiresIn): string {
  if (e === "never") return "this paste sticks around · no expiry.";
  return `ripens for ${expiryLabel(lang, e)}, then it's gone.`;
}

export function PublishToast({ url, onReset, onOpen, expiresIn }: Props) {
  const lang = useLang();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullUrl = `${window.location.origin}${url.startsWith("/") ? url : "/p/" + url.split("/").slice(-1)[0]}`;
    navigator.clipboard?.writeText(fullUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 156,
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
          {copied ? "✓" : t(lang, "copy")}
        </button>
      </div>

      {/* expiry footer — honest about what happens next */}
      <div
        style={{
          marginTop: 12,
          padding: "10px 12px",
          borderRadius: 11,
          background: "rgba(110,155,86,0.08)",
          border: "1px dashed rgba(110,155,86,0.35)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 16 }}>⏳</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, letterSpacing: -0.1 }}>
            {expiryFooterTitle(lang, expiresIn)}
          </div>
          <div style={{ fontSize: 11, color: INK_3, marginTop: 1, fontFamily: MONO }}>
            {t(lang, "toast_expiry_sub")}
          </div>
        </div>
      </div>

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
            color: INK_2,
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

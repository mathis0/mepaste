import { useNavigate, useParams } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { DamavandScene } from "../components/DamavandScene";
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
  SURFACE,
  WARN,
} from "../theme";
import { useLang, t } from "../i18n";
import { PasteMeta } from "../api";

const iconBtn: React.CSSProperties = {
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
};

function relAge(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const m = Math.floor(ms / 60_000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function BurnWarningScreen({
  meta,
  onConfirm,
}: {
  meta: PasteMeta;
  onConfirm: () => void;
}) {
  const lang = useLang();
  const nav = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        background: SURFACE,
        color: INK,
        fontFamily: SANS,
        overflow: "hidden",
      }}
    >
      <DamavandScene />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 38%, rgba(220,76,62,0.18) 0%, rgba(251,245,241,0.0) 60%)",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 18,
          left: 0,
          right: 0,
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <button type="button" style={iconBtn} onClick={() => nav("/")} aria-label="back">
          <Icon d={I.back} s={20} c={INK_2} />
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.7)",
            border: `1px solid ${HAIR}`,
            backdropFilter: "blur(10px)",
            fontFamily: MONO,
            fontSize: 12,
            color: INK_2,
            fontWeight: 600,
          }}
        >
          <Icon d={I.flame} s={13} c={WARN} sw={2} />
          <span>mepaste.to/{slug}</span>
        </div>
        <span style={{ width: 36 }} />
      </div>

      {/* burning tomato hero */}
      <div
        style={{
          position: "absolute",
          top: 90,
          left: 0,
          right: 0,
          zIndex: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: 100, height: 100 }}>
          <div
            style={{
              position: "absolute",
              inset: -16,
              background:
                "radial-gradient(circle, rgba(224,122,60,0.45) 0%, transparent 65%)",
              filter: "blur(8px)",
              animation: "mp-pulse 1.8s ease-in-out infinite",
            }}
          />
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
            <path
              d="M50 22c8 6 14 18 14 30a14 14 0 11-28 0c0-8 4-14 6-18 1 6 3 9 5 9-1-7 1-15 3-21Z"
              fill="#e07a3c"
              opacity="0.85"
            />
            <path
              d="M50 32c5 4 9 13 9 21a9 9 0 11-18 0c0-6 3-10 4-12 1 4 2 6 3 6-0-4 1-10 2-15Z"
              fill="#f3a85a"
            />
          </svg>
          <div style={{ position: "absolute", left: "50%", top: 38, transform: "translateX(-50%)" }}>
            <BrandMark size={42} />
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 220,
          left: 20,
          right: 20,
          zIndex: 6,
          background: CARD,
          borderRadius: 22,
          border: `1px solid ${HAIR}`,
          boxShadow: "0 30px 70px -30px rgba(80,40,20,0.4)",
          padding: "22px 22px 18px",
          textAlign: "center",
        }}
      >
        <Stamp color={WARN} rotate={-4} style={{ marginBottom: 4 }}>
          {t(lang, "burn_stamp")}
        </Stamp>
        <div
          style={{
            marginTop: 12,
            fontSize: 22,
            fontWeight: 700,
            color: INK,
            letterSpacing: -0.5,
            lineHeight: "28px",
          }}
        >
          {t(lang, "burn_title")}
        </div>
        <div style={{ marginTop: 8, fontSize: 13.5, color: INK_2, lineHeight: "20px" }}>
          {t(lang, "burn_body_1")}{" "}
          <span style={{ color: WARN, fontWeight: 600 }}>{t(lang, "burn_body_2")}</span>
          {t(lang, "burn_body_3")}
        </div>

        <div
          style={{
            marginTop: 14,
            padding: "10px 12px",
            borderRadius: 11,
            background: SURFACE,
            border: `1px solid ${HAIR}`,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: MONO,
            fontSize: 11,
            color: INK_3,
            textAlign: "left",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Icon d={I.clock} s={11} c={INK_3} sw={2} /> {relAge(meta.created_at)}
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ color: PEACH }}>{meta.line_count} lines</span>
        </div>

        <button
          type="button"
          onClick={onConfirm}
          style={{
            marginTop: 14,
            width: "100%",
            height: 52,
            borderRadius: 14,
            border: "none",
            cursor: "pointer",
            background: `linear-gradient(180deg, ${WARN} 0%, #b95523 100%)`,
            color: "#fff",
            fontFamily: SANS,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: -0.2,
            boxShadow:
              "0 10px 24px -10px rgba(224,122,60,0.65), inset 0 1px 0 rgba(255,255,255,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Icon d={I.flame} s={16} c="#fff" sw={2.2} />
          <span>{t(lang, "burn_open")}</span>
        </button>

        <button
          type="button"
          onClick={() => nav(-1)}
          style={{
            marginTop: 8,
            width: "100%",
            height: 44,
            borderRadius: 12,
            border: `1px solid ${HAIR}`,
            cursor: "pointer",
            background: "#fff",
            color: INK_2,
            fontFamily: SANS,
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: -0.1,
          }}
        >
          {t(lang, "burn_leave")}
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 28,
          zIndex: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 10.5,
            color: "rgba(80,55,45,0.7)",
          }}
        >
          <span>🍅</span>
          <span>{t(lang, "burn_footer")}</span>
        </div>
      </div>
    </div>
  );
}

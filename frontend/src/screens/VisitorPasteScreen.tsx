import { useState } from "react";
import { useParams } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { Icon } from "../components/Icon";
import { I } from "../icons";
import {
  HAIR,
  INK,
  INK_2,
  INK_3,
  INK_4,
  MONO,
  PEACH,
  SANS,
  SURFACE,
  TEAL,
  TEAL_BORDER,
  TEAL_DARK,
  WARN,
} from "../theme";
import { Paste } from "../api";
import { useLang, t } from "../i18n";

const iconBtn: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 999,
  background: "rgba(255,255,255,0.85)",
  border: `1px solid ${HAIR}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  padding: 0,
  cursor: "pointer",
};

function humanWilt(expiresAt: string | null, lang: ReturnType<typeof useLang>): string {
  if (!expiresAt) return t(lang, "wilts_never");
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "gone";
  const h = Math.round(ms / 3_600_000);
  if (h >= 36) return `wilts in ${Math.round(h / 24)}d`;
  if (h >= 1) return `wilts in ${h}h`;
  return `wilts in ${Math.max(1, Math.round(ms / 60_000))}m`;
}

type Variant = "open" | "unlocked" | "burn";

export function VisitorPasteScreen({
  paste,
  variant,
}: {
  paste: Paste;
  variant: Variant;
}) {
  const lang = useLang();
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const isBurn = variant === "burn";
  const isUnlocked = variant === "unlocked";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/p/${slug}`;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ url, title: paste.title || "mepaste" });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch { /* ignore */ }
  };

  const wilt = isBurn
    ? t(lang, "visitor_burns_when_leave")
    : humanWilt(paste.expires_at, lang);

  const lines = paste.content.split("\n");
  const charCount = paste.content.length;

  const bannerBg = isBurn
    ? "rgba(224,122,60,0.10)"
    : isUnlocked
      ? "rgba(110,155,86,0.10)"
      : "rgba(220,76,62,0.07)";
  const bannerBd = isBurn
    ? "rgba(224,122,60,0.32)"
    : isUnlocked
      ? "rgba(110,155,86,0.32)"
      : TEAL_BORDER;
  const bannerIcon = isBurn ? I.flame : isUnlocked ? I.check : I.link;
  const bannerC = isBurn ? WARN : isUnlocked ? PEACH : TEAL;
  const bannerLabel = isBurn
    ? t(lang, "visitor_burns_when_leave")
    : isUnlocked
      ? t(lang, "visitor_unlocked")
      : t(lang, "visitor_shared_with_you");

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#f3ece5",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 430,
          minHeight: "100dvh",
          background: SURFACE,
          color: INK,
          fontFamily: SANS,
          paddingTop: 18,
          paddingBottom: 28,
          overflow: "hidden",
        }}
      >
        {/* top chrome */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 12px 0",
          }}
        >
          <button
            type="button"
            style={iconBtn}
            aria-label={t(lang, "hint_close")}
            onClick={() => window.history.length > 1 ? window.history.back() : (window.location.href = "/")}
          >
            <Icon d="M6 6l12 12 M18 6L6 18" s={16} c={INK_2} sw={2.2} />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "7px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.85)",
              border: `1px solid ${HAIR}`,
              backdropFilter: "blur(10px)",
              fontFamily: MONO,
              fontSize: 12,
              color: INK_2,
              fontWeight: 600,
            }}
          >
            <Icon
              d={isUnlocked || paste.visibility === "private" ? I.lock : I.link}
              s={12}
              c={isUnlocked ? PEACH : TEAL}
              sw={2.2}
            />
            <span>mepaste.to/{slug}</span>
          </div>
          <button type="button" style={iconBtn} aria-label={t(lang, "share")} onClick={handleShare}>
            <Icon d={I.share} s={16} c={INK_2} sw={2} />
          </button>
        </div>

        {/* shared-with-you banner */}
        <div
          style={{
            margin: "14px 16px 0",
            padding: "8px 12px",
            borderRadius: 11,
            background: bannerBg,
            border: `1px dashed ${bannerBd}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon d={bannerIcon} s={14} c={bannerC} sw={2} />
          <span
            style={{
              flex: 1,
              fontFamily: MONO,
              fontSize: 11.5,
              fontWeight: 600,
              color: bannerC,
              letterSpacing: 0.2,
              textTransform: "lowercase",
            }}
          >
            {bannerLabel}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: INK_4 }}>{wilt}</span>
        </div>

        {/* title + meta */}
        <div style={{ padding: "14px 20px 6px" }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: INK,
              letterSpacing: -0.5,
              lineHeight: "30px",
            }}
          >
            {paste.title || (paste.language === "fa" ? "بی‌نام" : "untitled")}
          </div>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: MONO,
              fontSize: 11,
              color: INK_3,
              flexWrap: "wrap",
            }}
          >
            <span>{paste.language}</span>
            <span style={{ color: INK_4 }}>·</span>
            <span>{lines.length} lines · {charCount} chars</span>
            {isBurn && (
              <>
                <span style={{ color: INK_4 }}>·</span>
                <span style={{ color: WARN, fontWeight: 700 }}>
                  {t(lang, "visitor_single_read")}
                </span>
              </>
            )}
          </div>
        </div>

        {/* read-only code card */}
        <div
          style={{
            margin: "8px 16px 0",
            background: "#0f1216",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 18px 40px -22px rgba(0,0,0,0.45)",
            position: "relative",
            maxHeight: 360,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              fontFamily: MONO,
              fontSize: 9.5,
              color: "rgba(255,255,255,0.62)",
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            <Icon d={I.lock} s={9} c="rgba(255,255,255,0.6)" sw={2.4} />
            <span>{t(lang, "visitor_read_only")}</span>
          </div>

          <div
            style={{
              display: "flex",
              padding: "14px 0",
              fontFamily: MONO,
              fontSize: 12.5,
              lineHeight: "22px",
              overflow: "auto",
              maxHeight: 360,
            }}
          >
            <div
              style={{
                width: 38,
                minWidth: 38,
                textAlign: "right",
                color: "rgba(255,255,255,0.22)",
                userSelect: "none",
              }}
            >
              {lines.map((_, i) => (
                <div key={i} style={{ paddingRight: 10 }}>{i + 1}</div>
              ))}
            </div>
            <pre
              style={{
                flex: 1,
                margin: 0,
                paddingRight: 16,
                color: "#cfd2d6",
                fontFamily: MONO,
                fontSize: 12.5,
                lineHeight: "22px",
                whiteSpace: "pre",
              }}
            >
              {paste.content || " "}
            </pre>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 28,
              background: "linear-gradient(180deg, transparent, rgba(15,18,22,0.95))",
              pointerEvents: "none",
            }}
          />
        </div>

        {isBurn && (
          <div
            style={{
              margin: "12px 16px 0",
              padding: "10px 12px",
              borderRadius: 11,
              background: "rgba(224,122,60,0.10)",
              border: "1px solid rgba(224,122,60,0.32)",
              display: "flex",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14, lineHeight: "14px", marginTop: 1 }}>🔥</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: WARN,
                  letterSpacing: -0.1,
                }}
              >
                {t(lang, "visitor_only_copy_left")}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10.5,
                  color: INK_3,
                  marginTop: 1,
                  lineHeight: "14px",
                }}
              >
                {t(lang, "visitor_copy_before_leave")}
              </div>
            </div>
          </div>
        )}

        {/* bottom action dock */}
        <div style={{ padding: "20px 16px 0" }}>
          {copied && (
            <div
              style={{
                marginBottom: 8,
                padding: "8px 12px",
                borderRadius: 11,
                background: "rgba(110,155,86,0.14)",
                border: "1px solid rgba(110,155,86,0.32)",
                display: "flex",
                alignItems: "center",
                gap: 7,
                fontFamily: MONO,
                fontSize: 11.5,
                color: PEACH,
                fontWeight: 700,
                animation: "mp-toast-in 320ms cubic-bezier(.2,.7,.3,1) both",
              }}
            >
              <Icon d={I.check} s={13} c={PEACH} sw={2.5} />
              <span>{t(lang, "visitor_copied")} · {charCount} {t(lang, "visitor_chars")}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleCopy}
            style={{
              width: "100%",
              height: 56,
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
              color: "#fff",
              fontFamily: SANS,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: -0.2,
              boxShadow:
                "0 14px 28px -14px rgba(220,76,62,0.6), inset 0 1px 0 rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Icon d={I.copy} s={18} c="#fff" sw={2.2} />
            <span>{t(lang, "visitor_copy_all")}</span>
            <span style={{ opacity: 0.75, fontFamily: MONO, fontSize: 11.5, fontWeight: 600 }}>
              {charCount} {t(lang, "visitor_chars")}
            </span>
          </button>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "center",
              gap: 6,
              fontFamily: MONO,
              fontSize: 10.5,
              color: "rgba(80,55,45,0.55)",
            }}
          >
            <BrandMark size={13} />
            <span>
              {t(lang, "visitor_made_with")}{" "}
              <span style={{ color: TEAL, fontWeight: 600 }}>mepaste</span> ·{" "}
              {t(lang, "visitor_made_with_sub")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

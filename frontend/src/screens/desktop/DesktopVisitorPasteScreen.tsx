import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import { DamavandScene } from "../../components/DamavandScene";
import { Icon } from "../../components/Icon";
import { Kbd } from "../../components/desktop/Kbd";
import { I } from "../../icons";
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
} from "../../theme";
import { Paste } from "../../api";
import { useLang, t } from "../../i18n";

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

export function DesktopVisitorPasteScreen({
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

  const lines = paste.content.split("\n");
  const charCount = paste.content.length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
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

  // ⌘C / ctrl+C copies the paste content (only when no text selection exists).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "c" || e.key === "C")) {
        const sel = window.getSelection?.()?.toString() ?? "";
        if (!sel) {
          e.preventDefault();
          void handleCopy();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paste.content]);

  const wiltText = isBurn
    ? t(lang, "visitor_burns_when_leave_tab")
    : humanWilt(paste.expires_at, lang);

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
    ? t(lang, "visitor_burns_when_leave_tab")
    : isUnlocked
      ? t(lang, "visitor_unlocked")
      : t(lang, "visitor_shared_with_you");

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        position: "relative",
        background: SURFACE,
        fontFamily: SANS,
        color: INK,
        overflow: "hidden",
      }}
    >
      {/* Damavand thin band */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 160, overflow: "hidden" }}>
        <DamavandScene />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 0%, transparent 55%, rgba(251,245,241,1) 100%)",
          }}
        />
      </div>

      {/* top bar */}
      <div
        style={{
          position: "absolute",
          top: 22,
          left: 28,
          right: 28,
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <BrandMark size={26} />
        <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: INK, letterSpacing: -0.2 }}>
          mepaste
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            color: PEACH,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          a tiny pastebin
        </span>
        <span style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "7px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.85)",
            border: `1px solid ${HAIR}`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            fontFamily: MONO,
            fontSize: 13,
            color: INK_2,
            fontWeight: 600,
          }}
        >
          <Icon
            d={isUnlocked || paste.visibility === "private" ? I.lock : I.link}
            s={13}
            c={isUnlocked ? PEACH : TEAL}
            sw={2.2}
          />
          <span>mepaste.to/{slug}</span>
        </div>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          onClick={handleShare}
          style={{
            height: 36,
            padding: "0 12px",
            borderRadius: 9,
            cursor: "pointer",
            background: "rgba(255,255,255,0.85)",
            border: `1px solid ${HAIR}`,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: SANS,
            fontSize: 12.5,
            fontWeight: 600,
            color: INK_2,
          }}
        >
          <Icon d={I.share} s={13} c={INK_2} sw={2} />
          <span>{t(lang, "share")}</span>
        </button>
      </div>

      {/* centered column */}
      <div
        style={{
          position: "relative",
          margin: "0 auto",
          width: "min(880px, calc(100% - 56px))",
          paddingTop: 96,
          paddingBottom: 40,
        }}
      >
        {/* banner */}
        <div
          style={{
            padding: "10px 16px",
            borderRadius: 12,
            background: bannerBg,
            border: `1px dashed ${bannerBd}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Icon d={bannerIcon} s={15} c={bannerC} sw={2} />
          <span
            style={{
              flex: 1,
              fontFamily: MONO,
              fontSize: 12,
              fontWeight: 700,
              color: bannerC,
              letterSpacing: 0.4,
              textTransform: "lowercase",
            }}
          >
            {bannerLabel}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: INK_4 }}>{wiltText}</span>
        </div>

        {/* title + meta + big copy button */}
        <div
          style={{
            marginTop: 22,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 700,
                color: INK,
                letterSpacing: -1,
                lineHeight: "44px",
              }}
            >
              {paste.title || (paste.language === "fa" ? "بی‌نام" : "untitled")}
            </div>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: MONO,
                fontSize: 12,
                color: INK_3,
                flexWrap: "wrap",
              }}
            >
              <span>{paste.language}</span>
              <span style={{ color: INK_4 }}>·</span>
              <span>{lines.length} lines · {charCount} chars</span>
              <span style={{ color: INK_4 }}>·</span>
              <span>{wiltText}</span>
              {isBurn && (
                <>
                  <span style={{ color: INK_4 }}>·</span>
                  <span
                    style={{
                      color: WARN,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 1.2,
                    }}
                  >
                    {t(lang, "visitor_single_read")}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            style={{
              height: 56,
              padding: "0 22px",
              borderRadius: 14,
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
              gap: 10,
              flexShrink: 0,
              position: "relative",
            }}
          >
            <Icon d={I.copy} s={18} c="#fff" sw={2.2} />
            <span>{t(lang, "visitor_copy_all")}</span>
            <span style={{ opacity: 0.78, fontFamily: MONO, fontSize: 12, fontWeight: 600 }}>
              {charCount} {t(lang, "visitor_chars")}
            </span>
            <span style={{ display: "flex", gap: 3, marginLeft: 4 }}>
              <Kbd dark>⌘</Kbd>
              <Kbd dark>C</Kbd>
            </span>
            {copied && (
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  top: -38,
                  padding: "6px 12px",
                  borderRadius: 10,
                  background: "#1a3320",
                  color: "#86efac",
                  fontFamily: MONO,
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 24px -10px rgba(0,0,0,0.4)",
                  animation: "mp-toast-in 320ms cubic-bezier(.2,.7,.3,1) both",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon d={I.check} s={11} c="#86efac" sw={2.6} />
                <span>{t(lang, "visitor_copied")} {charCount} {t(lang, "visitor_chars")}</span>
              </span>
            )}
          </button>
        </div>

        {isBurn && (
          <div
            style={{
              marginTop: 14,
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(224,122,60,0.10)",
              border: "1px solid rgba(224,122,60,0.32)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 18 }}>🔥</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 14,
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
                  fontSize: 11.5,
                  color: INK_3,
                  marginTop: 1,
                }}
              >
                {t(lang, "visitor_copy_before_leave")}
              </div>
            </div>
          </div>
        )}

        {/* read-only code card */}
        <div
          style={{
            marginTop: isBurn ? 16 : 22,
            background: "#0f1216",
            borderRadius: 18,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 30px 70px -32px rgba(0,0,0,0.5)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 16,
              zIndex: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              fontFamily: MONO,
              fontSize: 10,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: 1.4,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            <Icon d={I.lock} s={10} c="rgba(255,255,255,0.65)" sw={2.4} />
            <span>{t(lang, "visitor_read_only")}</span>
          </div>

          <div
            style={{
              position: "absolute",
              top: 16,
              left: 18,
              zIndex: 2,
              display: "flex",
              gap: 6,
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <span
                key={c}
                style={{ width: 10, height: 10, borderRadius: 999, background: c, opacity: 0.62 }}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              padding: "46px 0 22px",
              fontFamily: MONO,
              fontSize: 13.5,
              lineHeight: "24px",
              maxHeight: 520,
              overflow: "auto",
            }}
          >
            <div
              style={{
                width: 56,
                minWidth: 56,
                textAlign: "right",
                color: "rgba(255,255,255,0.22)",
                userSelect: "none",
                borderRight: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {lines.map((_, i) => (
                <div key={i} style={{ paddingRight: 14 }}>{i + 1}</div>
              ))}
            </div>
            <pre
              style={{
                flex: 1,
                margin: 0,
                paddingLeft: 18,
                paddingRight: 24,
                color: "#cfd2d6",
                fontFamily: MONO,
                fontSize: 13.5,
                lineHeight: "24px",
                whiteSpace: "pre",
              }}
            >
              {paste.content || " "}
            </pre>
          </div>
        </div>

        {/* footer */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "center",
            gap: 7,
            fontFamily: MONO,
            fontSize: 11,
            color: "rgba(80,55,45,0.55)",
          }}
        >
          <BrandMark size={14} />
          <span>
            {t(lang, "visitor_made_with")}{" "}
            <span style={{ color: TEAL, fontWeight: 600 }}>mepaste</span> ·{" "}
            {t(lang, "made_with")}
          </span>
        </div>
      </div>
    </div>
  );
}

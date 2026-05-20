import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppFrame } from "../components/AppFrame";
import { Icon } from "../components/Icon";
import { PillBadge } from "../components/PillBadge";
import { Stamp } from "../components/Stamp";
import { I } from "../icons";
import {
  CARD,
  HAIR,
  INK,
  INK_3,
  INK_4,
  MONO,
  PEACH,
  SANS,
  TEAL,
  WARN,
} from "../theme";
import { ApiError, Paste, getPaste, rawUrl } from "../api";
import { useLang, t } from "../i18n";

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

function humanizeWilt(expiresAt: string | null, lang: "en" | "fa"): string {
  if (!expiresAt) return t(lang, "wilts_never");
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return t(lang, "wilts_never");
  const hours = Math.round(ms / 3_600_000);
  if (hours >= 36) return `wilts in ${Math.round(hours / 24)}d`;
  if (hours >= 1) return `wilts in ${hours}h`;
  const mins = Math.max(1, Math.round(ms / 60_000));
  return `wilts in ${mins}m`;
}

export function ViewScreen({ passwordOverride }: { passwordOverride?: string | null } = {}) {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const lang = useLang();

  const [paste, setPaste] = useState<Paste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"wilted" | "burned" | "not_found" | "other" | null>(null);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const p = await getPaste(slug, passwordOverride ?? undefined);
      setPaste(p);
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 410) {
        const reason = err.body?.detail?.reason;
        setError(reason === "burned" ? "burned" : "wilted");
      } else if (err.status === 404) {
        setError("not_found");
      } else {
        setError("other");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [slug, passwordOverride]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const handleCopyContent = async () => {
    if (!paste) return;
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const renderHeader = () => (
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
      <button type="button" onClick={() => nav(-1)} style={iconBtn} aria-label={t(lang, "back")}>
        <Icon d={I.back} s={20} />
      </button>
      {paste && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            style={iconBtn}
            onClick={() => slug && window.open(rawUrl(slug), "_blank", "noopener")}
            aria-label={t(lang, "raw")}
          >
            <Icon d={I.raw} s={18} />
          </button>
          <button type="button" style={iconBtn} onClick={handleCopyContent} aria-label="copy">
            <Icon d={I.copy} s={18} />
          </button>
          <button type="button" style={iconBtn} onClick={handleCopyLink} aria-label="share">
            <Icon d={I.share} s={18} />
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <AppFrame>
        {renderHeader()}
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: MONO, fontSize: 12, color: INK_3,
          }}
        >
          loading…
        </div>
      </AppFrame>
    );
  }

  if (error) {
    const msg =
      error === "burned" ? t(lang, "paste_burned")
      : error === "wilted" ? t(lang, "paste_wilted")
      : error === "not_found" ? t(lang, "paste_not_found")
      : "something went wrong.";
    return (
      <AppFrame>
        {renderHeader()}
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 14, padding: "0 32px", textAlign: "center",
          }}
        >
          <div style={{ fontSize: 44 }}>
            {error === "burned" ? "🔥" : error === "wilted" ? "🥀" : "🍅"}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: INK, letterSpacing: -0.2 }}>{msg}</div>
          <button
            type="button"
            onClick={() => nav("/")}
            style={{
              marginTop: 10, height: 40, padding: "0 18px", borderRadius: 11,
              border: "none", background: TEAL, color: "#fff",
              fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            {t(lang, "go_home")}
          </button>
        </div>
      </AppFrame>
    );
  }

  if (!paste) return null;

  const lines = paste.content.split("\n");
  const wiltText = humanizeWilt(paste.expires_at, lang);
  const shortUrl = `mepaste.to/${paste.slug}`;
  const visibilityIcon = paste.visibility === "private" ? I.lock : paste.visibility === "unlisted" ? I.eyeOff : I.globe;
  const titleText = paste.title || t(lang, "default_title_placeholder");

  return (
    <AppFrame>
      {renderHeader()}

      {/* meta header */}
      <div style={{ position: "absolute", top: 70, left: 20, right: 20 }}>
        <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.6, color: INK }}>
          {titleText}
        </div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: MONO,
            fontSize: 11.5,
            color: INK_3,
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: TEAL }}>{shortUrl}</span>
          <span style={{ color: INK_4 }}>·</span>
          <span>{paste.language}</span>
          <span style={{ color: INK_4 }}>·</span>
          <span>{lines.length} lines</span>
          <span style={{ color: INK_4 }}>·</span>
          <span>{wiltText}</span>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <PillBadge icon={visibilityIcon} label={t(lang, paste.visibility)} />
          {paste.burn_after_read && (
            <PillBadge icon={I.flame} label={t(lang, "burns_on_first_read")} warn />
          )}
        </div>
      </div>

      {paste.burn_after_read && (
        <div style={{ position: "absolute", top: 60, right: 6, zIndex: 6 }}>
          <Stamp color={WARN} rotate={9}>{t(lang, "burns_on_open")}</Stamp>
        </div>
      )}

      {/* code card */}
      <div
        style={{
          position: "absolute",
          top: 212,
          left: 16,
          right: 16,
          bottom: 150,
          background: "#0f1216",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 24px 60px -28px rgba(0,0,0,0.45)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "14px 0 14px 0",
            fontFamily: MONO,
            fontSize: 12.5,
            lineHeight: "22px",
            height: "100%",
            overflow: "auto",
          }}
        >
          <div
            style={{
              width: 38,
              minWidth: 38,
              textAlign: "right",
              color: "rgba(255,255,255,0.28)",
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
              padding: "0 16px 0 0",
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
      </div>

      {/* share row */}
      <div
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 78,
          background: CARD,
          borderRadius: 16,
          border: `1px solid ${HAIR}`,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Icon d={I.link} s={18} c={TEAL} />
        <div style={{ flex: 1, fontFamily: MONO, fontSize: 13, color: "#3a2e28" }}>
          {shortUrl}
        </div>
        <button
          type="button"
          onClick={handleCopyLink}
          style={{
            height: 32,
            padding: "0 12px",
            borderRadius: 10,
            border: "none",
            background: TEAL,
            color: "#fff",
            fontFamily: SANS,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {copied ? "✓" : t(lang, "copy")}
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 42,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: "rgba(80,55,45,0.55)" }}>
          <span style={{ color: PEACH }}>♥</span>{" "}
          {paste.view_count} {t(lang, "visitors_so_far")} · 1 {t(lang, "reading_now")}
        </div>
      </div>
    </AppFrame>
  );
}

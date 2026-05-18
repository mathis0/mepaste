import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DesktopFrame } from "../../components/desktop/DesktopFrame";
import { Icon } from "../../components/Icon";
import { Stamp } from "../../components/Stamp";
import { I } from "../../icons";
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
  TEAL_DARK,
  TEAL_TINT,
  WARN,
} from "../../theme";
import { ApiError, getPaste, Paste, rawUrl } from "../../api";
import { t, useLang } from "../../i18n";

function humanizeRipeness(expiresAt: string | null): { fresh: string; wilts: string; pct: number } {
  if (!expiresAt) return { fresh: "fresh", wilts: "never wilts 🍅", pct: 0 };
  const total = new Date(expiresAt).getTime() - Date.now();
  if (total <= 0) return { fresh: "ripe", wilts: "gone", pct: 100 };
  const hours = Math.round(total / 3_600_000);
  const wiltsStr = hours >= 36 ? `${Math.round(hours / 24)}d`
    : hours >= 1 ? `${hours}h`
    : `${Math.max(1, Math.round(total / 60_000))}m`;
  // pct = how-ripe-it-is = elapsed / planned-lifetime. We don't have created_at handy
  // for pct calc here without an extra round, so estimate a flat 5% to match the design's mood.
  return { fresh: "fresh · 2m", wilts: `wilts in ${wiltsStr} 🍅`, pct: 5 };
}

export function DesktopViewScreen() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const lang = useLang();

  const [paste, setPaste] = useState<Paste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"wilted" | "burned" | "not_found" | "other" | null>(null);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async (password?: string) => {
    if (!slug) return;
    setLoading(true); setError(null);
    try {
      const p = await getPaste(slug, password);
      setPaste(p);
      setNeedsPassword(false);
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 401 && err.body?.detail?.password_required) {
        setNeedsPassword(true);
        if (password) setPwError(true);
      } else if (err.status === 410) {
        setError(err.body?.detail?.reason === "burned" ? "burned" : "wilted");
      } else if (err.status === 404) {
        setError("not_found");
      } else {
        setError("other");
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); /* eslint-disable-next-line */ }, [slug]);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); }
    catch { /* ignore */ }
  };

  if (loading) {
    return (
      <DesktopFrame active="list" lang={lang} crumbs={[t(lang, "cb_my_pastes"), "…"]}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, color: INK_3 }}>
          loading…
        </div>
      </DesktopFrame>
    );
  }

  if (needsPassword) {
    return (
      <DesktopFrame active="list" lang={lang} crumbs={[t(lang, "cb_my_pastes"), slug ?? ""]}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <div style={{ width: 380, background: CARD, borderRadius: 14, border: `1px solid ${HAIR}`, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon d={I.lock} s={20} c={TEAL} sw={2} />
              <div style={{ fontSize: 17, fontWeight: 700, color: INK }}>
                {t(lang, "this_one_needs_password")}
              </div>
            </div>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => { setPwInput(e.target.value); setPwError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") void load(pwInput); }}
              autoFocus
              placeholder={t(lang, "password")}
              style={{
                marginTop: 14, width: "100%", height: 40, padding: "0 12px", borderRadius: 10,
                border: `1px solid ${pwError ? "#c0392b" : HAIR}`, background: "#fff", outline: "none",
                fontFamily: MONO, fontSize: 14,
              }}
            />
            <button
              type="button"
              onClick={() => void load(pwInput)}
              style={{
                marginTop: 12, width: "100%", height: 42, borderRadius: 11, border: "none", cursor: "pointer",
                background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                color: "#fff", fontFamily: SANS, fontSize: 14, fontWeight: 600,
              }}
            >
              {t(lang, "unlock")}
            </button>
          </div>
        </div>
      </DesktopFrame>
    );
  }

  if (error) {
    const msg = error === "burned" ? t(lang, "paste_burned")
      : error === "wilted" ? t(lang, "paste_wilted")
      : error === "not_found" ? t(lang, "paste_not_found")
      : "something went wrong.";
    return (
      <DesktopFrame active="list" lang={lang} crumbs={[t(lang, "cb_my_pastes"), slug ?? ""]}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ fontSize: 56 }}>{error === "burned" ? "🔥" : error === "wilted" ? "🥀" : "🍅"}</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: INK }}>{msg}</div>
          <button
            type="button"
            onClick={() => nav("/")}
            style={{
              height: 40, padding: "0 18px", borderRadius: 11, border: "none",
              background: TEAL, color: "#fff", fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            {t(lang, "go_home")}
          </button>
        </div>
      </DesktopFrame>
    );
  }

  if (!paste) return null;

  const lines = paste.content.split("\n");
  const charCount = paste.content.length;
  const ripe = humanizeRipeness(paste.expires_at);
  const visIcon = paste.visibility === "private" ? I.lock : paste.visibility === "unlisted" ? I.eye : I.globe;

  return (
    <DesktopFrame
      active="list"
      lang={lang}
      crumbs={[t(lang, "cb_my_pastes"), paste.title || paste.slug]}
      hints={[
        [t(lang, "hint_copy"), ["⌘", "C"]],
        [t(lang, "hint_raw"), ["R"]],
        [t(lang, "hint_back"), ["esc"]],
      ]}
    >
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* main code column */}
        <div style={{ flex: 1, padding: "22px", display: "flex", flexDirection: "column", gap: 14, minWidth: 0 }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: INK, letterSpacing: -0.6 }}>
                {paste.title || t(lang, "default_title_placeholder")}
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
                <span style={{ color: TEAL, fontWeight: 600 }}>mepaste.to/{paste.slug}</span>
                <span style={{ color: INK_4 }}>·</span>
                <span>{paste.language}</span>
                <span style={{ color: INK_4 }}>·</span>
                <span>{lines.length} lines · {charCount} chars</span>
                <span style={{ color: INK_4 }}>·</span>
                <span>{paste.is_owner ? "yours" : "by nima"}</span>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <DPillBadge icon={visIcon} label={t(lang, paste.visibility)} />
                {paste.burn_after_read && <DPillBadge icon={I.flame} label={t(lang, "burns_on_first_read")} warn />}
                <DPillBadge icon={I.clock} label={ripe.wilts} />
              </div>
            </div>
            {paste.burn_after_read && (
              <div style={{ paddingTop: 8 }}>
                <Stamp color={WARN} rotate={6} style={{ fontSize: 12, padding: "6px 12px" }}>burns on open</Stamp>
              </div>
            )}
          </div>

          {/* code card */}
          <div
            style={{
              flex: 1,
              background: "#0f1216",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 24px 60px -28px rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div
              style={{
                height: 38,
                padding: "0 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ flex: 1 }} />
              <span style={{ fontFamily: MONO, fontSize: 11.5, color: "rgba(255,255,255,0.55)" }}>
                {paste.title ? paste.title : `${paste.slug}.txt`}
              </span>
              <span style={{ flex: 1 }} />
              <button
                type="button"
                onClick={() => slug && window.open(rawUrl(slug), "_blank", "noopener")}
                style={{
                  height: 24,
                  padding: "0 8px",
                  borderRadius: 6,
                  border: "none",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: MONO,
                  fontSize: 10.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
              >
                <Icon d={I.raw} s={11} c="rgba(255,255,255,0.85)" /> raw
              </button>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(paste.content)}
                style={{
                  height: 24,
                  padding: "0 8px",
                  borderRadius: 6,
                  border: "none",
                  background: "rgba(94,234,212,0.16)",
                  color: "#5eead4",
                  fontFamily: MONO,
                  fontSize: 10.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  cursor: "pointer",
                }}
              >
                <Icon d={I.copy} s={11} c="#5eead4" /> copy
              </button>
            </div>
            <div
              style={{
                flex: 1,
                padding: "14px 0",
                overflow: "auto",
                fontFamily: MONO,
                fontSize: 13.5,
                lineHeight: "24px",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    width: 48,
                    minWidth: 48,
                    textAlign: "right",
                    color: "rgba(255,255,255,0.28)",
                    userSelect: "none",
                  }}
                >
                  {lines.map((_, i) => <div key={i} style={{ paddingRight: 12 }}>{i + 1}</div>)}
                </div>
                <pre
                  style={{
                    flex: 1,
                    margin: 0,
                    paddingRight: 16,
                    color: "#cfd2d6",
                    fontFamily: MONO,
                    fontSize: 13.5,
                    lineHeight: "24px",
                    whiteSpace: "pre",
                  }}
                >{paste.content || " "}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div style={{ width: 300, flexShrink: 0, padding: "22px 22px 22px 0", display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}>
          <RailCard label={t(lang, "share_section")}>
            <div
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                background: TEAL_TINT,
                border: `1px dashed ${TEAL_BORDER}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Icon d={I.link} s={14} c={TEAL} />
              <span style={{ flex: 1, fontFamily: MONO, fontSize: 12.5, color: INK, fontWeight: 600 }}>
                mepaste.to/{paste.slug}
              </span>
              <button
                type="button"
                onClick={copyLink}
                style={{
                  height: 24, padding: "0 8px", borderRadius: 6, border: "none",
                  background: TEAL, color: "#fff", fontFamily: SANS, fontSize: 11, fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {copied ? "✓" : t(lang, "copy")}
              </button>
            </div>

            {/* QR placeholder */}
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 8,
                  background: "#fff",
                  border: `1px solid ${HAIR}`,
                  padding: 4,
                  flexShrink: 0,
                  backgroundImage:
                    `radial-gradient(${INK} 1px, transparent 1.2px), radial-gradient(${INK} 1px, transparent 1.2px)`,
                  backgroundSize: "6px 6px, 6px 6px",
                  backgroundPosition: "0 0, 3px 3px",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: INK_3, lineHeight: "16px", whiteSpace: "pre-line" }}>
                  {t(lang, "scan_to_share")}
                </div>
              </div>
            </div>
          </RailCard>

          <RailCard label={t(lang, "lifecycle_section")}>
            <div style={{ position: "relative", height: 6, borderRadius: 99, background: "rgba(120,80,60,0.1)" }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${ripe.pct}%`,
                  background: `linear-gradient(90deg, ${PEACH}, ${TEAL})`,
                  borderRadius: 99,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: MONO,
                fontSize: 10.5,
                color: INK_4,
              }}
            >
              <span style={{ color: PEACH }}>{ripe.fresh}</span>
              <span style={{ color: WARN }}>{ripe.wilts}</span>
            </div>
          </RailCard>

          <RailCard label={t(lang, "who_reading_section")}>
            <div style={{ fontSize: 13.5, color: INK_2, fontWeight: 600 }}>
              {paste.view_count} {t(lang, "visitors_so_far_2")}
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: INK_3 }}>
              <span style={{ color: PEACH }}>●</span> 1 {t(lang, "reading_now_2")}
            </div>
            <div style={{ marginTop: 10, display: "flex", alignItems: "flex-end", gap: 3, height: 32 }}>
              {[6, 8, 4, 12, 9, 14, 18, 11, 7, 9, 13, 22, 15, 8, 6, 10, 5, 4, 7, 11, 16, 21, 13, 9].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: i === 21 ? TEAL : "rgba(220,76,62,0.25)",
                    height: `${h * 1.3}px`,
                    borderRadius: 2,
                  }}
                />
              ))}
            </div>
            <div
              style={{
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
                fontFamily: MONO,
                fontSize: 10,
                color: INK_4,
              }}
            >
              <span>−24h</span><span>now</span>
            </div>
          </RailCard>

          <div style={{ marginTop: "auto" }} />
        </div>
      </div>
    </DesktopFrame>
  );
}

function RailCard({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 12, padding: "14px 16px" }}>
      {label && (
        <div
          style={{
            fontFamily: MONO,
            fontSize: 10.5,
            color: INK_4,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

function DPillBadge({ icon, label, warn = false }: { icon: string; label: string; warn?: boolean }) {
  const c = warn ? WARN : TEAL;
  const bg = warn ? "rgba(224,122,60,0.10)" : TEAL_TINT;
  const bd = warn ? "rgba(224,122,60,0.30)" : TEAL_BORDER;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        height: 24,
        padding: "0 10px",
        borderRadius: 999,
        background: bg,
        border: `1px solid ${bd}`,
        fontSize: 12,
        fontWeight: 500,
        color: c,
        letterSpacing: -0.05,
      }}
    >
      <Icon d={icon} s={12} c={c} sw={2} />
      <span>{label}</span>
    </span>
  );
}

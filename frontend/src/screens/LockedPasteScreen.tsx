import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DamavandScene } from "../components/DamavandScene";
import { Icon } from "../components/Icon";
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
  SURFACE,
  TEAL,
  TEAL_BORDER,
  TEAL_DARK,
  TEAL_TINT,
  WARN,
} from "../theme";
import { ApiError, getPaste, getPasteMeta } from "../api";
import { useLang, t } from "../i18n";

const MAX_TRIES = 3;

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

export function LockedPasteScreen({ onUnlocked }: { onUnlocked: (password: string) => void }) {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const lang = useLang();

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [tries, setTries] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const triesLeft = Math.max(0, MAX_TRIES - tries);

  const tryUnlock = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!slug || submitting || !password) return;
    setSubmitting(true);
    setWrong(false);
    try {
      // Validate the password by hitting the meta-less full read; if it
      // returns 200, we have content — bubble the password up so the
      // ViewScreen can re-use it without re-prompting.
      await getPaste(slug, password);
      onUnlocked(password);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setTries((n) => n + 1);
        setWrong(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

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
          <Icon d={I.lock} s={13} c={WARN} sw={2} />
          <span>mepaste.to/{slug}</span>
        </div>
        <span style={{ width: 36 }} />
      </div>

      <form
        onSubmit={tryUnlock}
        key={tries}
        style={{
          position: "absolute",
          top: 180,
          left: 20,
          right: 20,
          zIndex: 6,
          background: CARD,
          borderRadius: 22,
          border: `1px solid ${HAIR}`,
          boxShadow:
            "0 30px 70px -30px rgba(80,40,20,0.4), 0 1px 0 rgba(255,255,255,0.8) inset",
          padding: "26px 22px 22px",
          textAlign: "center",
          animation: wrong ? "mp-shake 420ms cubic-bezier(.36,.07,.19,.97)" : "none",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: `linear-gradient(180deg, ${TEAL_TINT} 0%, rgba(220,76,62,0.05) 100%)`,
              border: `1px solid ${TEAL_BORDER}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 22px -12px rgba(220,76,62,0.5)",
            }}
          >
            <Icon d={I.lock} s={28} c={TEAL} sw={2.2} />
          </div>
        </div>

        <div
          style={{
            fontFamily: MONO,
            fontSize: 10.5,
            color: TEAL,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {t(lang, "lock_locked_paste")}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            fontWeight: 700,
            color: INK,
            letterSpacing: -0.5,
            lineHeight: "28px",
          }}
        >
          {t(lang, "lock_title_1")}{" "}
          <span style={{ color: TEAL }}>{t(lang, "lock_title_private")}</span>.
          <br />
          {t(lang, "lock_title_2")}
        </div>

        <div style={{ marginTop: 8, fontSize: 13, color: INK_3, lineHeight: "18px" }}>
          {t(lang, "lock_explainer")}
        </div>

        <div style={{ marginTop: 18, position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              height: 50,
              padding: "0 14px",
              borderRadius: 13,
              background: "#fff",
              border: `1.5px solid ${wrong ? WARN : TEAL_BORDER}`,
              boxShadow: wrong
                ? "0 0 0 4px rgba(224,122,60,0.12)"
                : "0 0 0 4px rgba(220,76,62,0.08)",
            }}
          >
            <Icon d={I.lock} s={16} c={wrong ? WARN : TEAL_DARK} sw={2} />
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setWrong(false); }}
              autoFocus
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: MONO,
                fontSize: 16,
                color: INK,
                fontWeight: 600,
                letterSpacing: show ? 0 : 4,
              }}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
              aria-label="show password"
            >
              <Icon d={show ? I.eyeOff : I.eye} s={16} c={INK_4} sw={1.6} />
            </button>
          </div>
          {wrong && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                fontFamily: MONO,
                fontSize: 11,
                color: WARN,
                fontWeight: 600,
              }}
            >
              <Icon d={I.info} s={13} c={WARN} sw={2} />
              <span>{t(lang, "lock_wrong_1")}{triesLeft} {t(lang, "lock_wrong_2")}</span>
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: wrong ? 10 : 14,
            padding: "10px 12px",
            borderRadius: 11,
            background: "rgba(110,155,86,0.08)",
            border: "1px dashed rgba(110,155,86,0.35)",
            textAlign: "left",
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 14, marginTop: 1 }}>🌱</span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: PEACH,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {t(lang, "lock_senders_hint")}
            </div>
            <div style={{ marginTop: 2, fontSize: 13, color: INK_2, lineHeight: "18px" }}>
              it's three tomatoes
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={!password || submitting}
          style={{
            marginTop: 14,
            width: "100%",
            height: 52,
            borderRadius: 14,
            border: "none",
            cursor: !password || submitting ? "default" : "pointer",
            background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
            color: "#fff",
            fontFamily: SANS,
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: -0.2,
            boxShadow:
              "0 10px 24px -10px rgba(220,76,62,0.6), inset 0 1px 0 rgba(255,255,255,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: !password || submitting ? 0.55 : 1,
          }}
        >
          <Icon d={I.lock} s={16} c="#fff" sw={2.2} />
          <span>{t(lang, "lock_unlock")}</span>
        </button>
      </form>

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
            textShadow: "0 1px 4px rgba(20,40,20,0.35)",
          }}
        >
          <Icon d={I.lock} s={11} c="rgba(80,55,45,0.7)" sw={2} />
          <span>{t(lang, "lock_footer")}</span>
        </div>
      </div>
    </div>
  );
}

// Convenience: do the meta peek up front so the visitor flow knows
// whether to render the lock or the actual paste.
export async function probePaste(slug: string) {
  try {
    return { ok: true as const, meta: await getPasteMeta(slug) };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false as const, error: err };
    }
    throw err;
  }
}

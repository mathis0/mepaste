import { useState } from "react";
import { useParams } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import { DamavandScene } from "../../components/DamavandScene";
import { Icon } from "../../components/Icon";
import { Kbd } from "../../components/desktop/Kbd";
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
  SURFACE,
  TEAL,
  TEAL_BORDER,
  TEAL_DARK,
  TEAL_TINT,
  WARN,
} from "../../theme";
import { ApiError, getPaste } from "../../api";
import { useLang, t } from "../../i18n";

const MAX_TRIES = 3;

export function DesktopLockedPasteScreen({
  onUnlocked,
}: {
  onUnlocked: (password: string) => void;
}) {
  const { slug } = useParams<{ slug: string }>();
  const lang = useLang();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [tries, setTries] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const triesLeft = Math.max(0, MAX_TRIES - tries);

  const tryUnlock = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!slug || !password || submitting) return;
    setSubmitting(true);
    setWrong(false);
    try {
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
        width: "100%",
        minHeight: "100dvh",
        position: "relative",
        background: SURFACE,
        fontFamily: SANS,
        color: INK,
        overflow: "hidden",
      }}
    >
      {/* Damavand band */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 280, overflow: "hidden" }}>
        <DamavandScene />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 0%, transparent 50%, rgba(251,245,241,1) 100%)",
          }}
        />
      </div>

      {/* top bar over hero */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 24,
          right: 24,
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
            fontSize: 10.5,
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
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,0.75)",
            border: `1px solid ${HAIR}`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            fontFamily: MONO,
            fontSize: 12,
            color: INK_2,
            fontWeight: 600,
          }}
        >
          <Icon d={I.lock} s={12} c={WARN} sw={2} />
          <span>mepaste.to/{slug}</span>
        </div>
      </div>

      {/* centered card */}
      <form
        onSubmit={tryUnlock}
        key={tries}
        style={{
          position: "absolute",
          top: 200,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(520px, calc(100% - 48px))",
          zIndex: 5,
          background: CARD,
          borderRadius: 18,
          border: `1px solid ${HAIR}`,
          boxShadow:
            "0 40px 100px -36px rgba(80,40,20,0.45), 0 1px 0 rgba(255,255,255,0.9) inset",
          padding: "32px 36px 28px",
          animation: wrong ? "mp-shake 420ms cubic-bezier(.36,.07,.19,.97)" : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
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
              flexShrink: 0,
            }}
          >
            <Icon d={I.lock} s={28} c={TEAL} sw={2.2} />
          </div>
          <div style={{ flex: 1 }}>
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
                marginTop: 4,
                fontSize: 26,
                fontWeight: 700,
                color: INK,
                letterSpacing: -0.5,
                lineHeight: "32px",
              }}
            >
              {t(lang, "lock_title_1")}{" "}
              <span style={{ color: TEAL }}>{t(lang, "lock_title_private")}</span>.<br />
              {t(lang, "lock_title_2")}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: INK_3, lineHeight: "18px" }}>
              {t(lang, "lock_explainer")}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label
            style={{
              fontFamily: MONO,
              fontSize: 10.5,
              color: INK_4,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t(lang, "auth_password")}
          </label>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              alignItems: "center",
              gap: 10,
              height: 52,
              padding: "0 14px 0 16px",
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
                fontSize: 17,
                color: INK,
                fontWeight: 600,
                letterSpacing: show ? 0 : 4,
              }}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              style={{
                height: 32,
                padding: "0 10px",
                borderRadius: 8,
                border: `1px solid ${HAIR}`,
                background: "#fff",
                cursor: "pointer",
                fontFamily: SANS,
                fontSize: 11.5,
                fontWeight: 500,
                color: INK_3,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Icon d={show ? I.eyeOff : I.eye} s={13} c={INK_3} sw={1.6} />
              show
            </button>
            <button
              type="submit"
              disabled={!password || submitting}
              style={{
                height: 36,
                padding: "0 16px",
                borderRadius: 10,
                border: "none",
                background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
                color: "#fff",
                fontFamily: SANS,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: !password || submitting ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: !password || submitting ? 0.6 : 1,
                boxShadow:
                  "0 6px 14px -6px rgba(220,76,62,0.55), inset 0 1px 0 rgba(255,255,255,0.22)",
              }}
            >
              <span>{t(lang, "lock_unlock").replace(/paste/, "")}</span>
              <Kbd dark>↩</Kbd>
            </button>
          </div>
          {wrong && (
            <div
              style={{
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: MONO,
                fontSize: 11.5,
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
            marginTop: 16,
            padding: "12px 14px",
            borderRadius: 11,
            background: "rgba(110,155,86,0.08)",
            border: "1px dashed rgba(110,155,86,0.35)",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 16, marginTop: 1 }}>🌱</span>
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
            <div style={{ marginTop: 2, fontSize: 13.5, color: INK_2, lineHeight: "18px" }}>
              it's three tomatoes
            </div>
          </div>
        </div>
      </form>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 22,
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          fontFamily: MONO,
          fontSize: 11,
          color: INK_4,
        }}
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Icon d={I.lock} s={11} c={INK_4} sw={2} />
          <span>{t(lang, "lock_footer")}</span>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: PEACH }}>
          <BrandMark size={14} />
          <span>{t(lang, "made_with")}</span>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import { DamavandScene } from "../../components/DamavandScene";
import { Icon } from "../../components/Icon";
import { Seal } from "../../components/Seal";
import { Stamp } from "../../components/Stamp";
import { Kbd } from "../../components/desktop/Kbd";
import { AuthField, PromisesBlock } from "../../components/auth/AuthField";
import { AuthDivider, OAuthButton } from "../../components/auth/OAuthButton";
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
  TEAL_DARK,
  WARN,
} from "../../theme";
import { useAuth } from "../../auth";
import { ApiError } from "../../api";
import { useLang, t } from "../../i18n";

export function DesktopSignUpScreen() {
  const lang = useLang();
  const nav = useNavigate();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;
    setError(null); setInfo(null);
    if (password.length < 8) { setError(t(lang, "auth_password_hint")); return; }
    setSubmitting(true);
    try {
      await signUp(email, password);
      nav("/");
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 409) setError(t(lang, "auth_email_taken"));
      else setError(err.body?.detail ?? err.message ?? "signup_failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        background: SURFACE,
        fontFamily: SANS,
        color: INK,
      }}
    >
      {/* LEFT: poster */}
      <div
        style={{
          width: 520,
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
          borderRight: `1px solid ${HAIR}`,
        }}
      >
        <div style={{ position: "absolute", inset: 0 }}>
          <DamavandScene />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(251,245,241,0.35) 0%, rgba(251,245,241,0.85) 65%, rgba(251,245,241,1) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 36,
            top: 32,
            right: 36,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <BrandMark size={28} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 15,
              fontWeight: 700,
              color: INK,
              letterSpacing: -0.2,
            }}
          >
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
        </div>

        <div style={{ position: "absolute", left: 36, top: 320, right: 36, zIndex: 2 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: TEAL,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {t(lang, "auth_optional")}
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 44,
              fontWeight: 700,
              color: INK,
              letterSpacing: -1.2,
              lineHeight: "52px",
              maxWidth: 380,
            }}
          >
            {t(lang, "auth_signup_title_1")}{" "}
            <span style={{ color: TEAL }}>{t(lang, "auth_signup_title_2")}</span>.
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 15,
              color: INK_2,
              lineHeight: "22px",
              maxWidth: 400,
            }}
          >
            {t(lang, "auth_signup_sub")}
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxWidth: 380,
            }}
          >
            {[
              { icon: I.raw, label: "your pastes follow you across devices" },
              { icon: I.link, label: "custom slugs · mepaste.to/your-name" },
              { icon: I.bell, label: "a tiny inbox for who read your pastes" },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontSize: 14,
                  color: INK_2,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#fff",
                    border: `1px solid ${HAIR}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon d={b.icon} s={14} c={TEAL} sw={2} />
                </div>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", right: 30, top: 220, zIndex: 2 }}>
          <Stamp color={WARN} rotate={-8}>no marketing emails</Stamp>
        </div>
        <div style={{ position: "absolute", right: 60, top: 270, zIndex: 2 }}>
          <Seal top="100% organic plain text" bottom="🍅" size={88} color={TEAL} rotate={6} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 36,
            bottom: 26,
            right: 36,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 11,
            color: "rgba(80,55,45,0.55)",
          }}
        >
          <BrandMark size={14} />
          <span>{t(lang, "made_with")} · batch #042</span>
        </div>
      </div>

      {/* RIGHT: form */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 48px",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 28, right: 36, fontSize: 13, color: INK_3, zIndex: 2 }}>
          {t(lang, "auth_already_have")}{" "}
          <a
            onClick={() => nav("/signin")}
            style={{ color: TEAL, fontWeight: 600, cursor: "pointer" }}
          >
            {t(lang, "auth_sign_in")}
          </a>
        </div>

        <form onSubmit={submit} style={{ width: "100%", maxWidth: 420 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10.5,
              color: INK_4,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {t(lang, "mode_open_a_tab")}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 28,
              fontWeight: 700,
              color: INK,
              letterSpacing: -0.6,
              lineHeight: "34px",
            }}
          >
            we'll save you a seat.
          </div>
          <div style={{ marginTop: 4, fontSize: 13.5, color: INK_3 }}>
            takes about ten seconds. you can close your tab any time.
          </div>

          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 8 }}>
            <OAuthButton
              provider="google"
              label={t(lang, "auth_continue_google")}
              big
              onClick={() => setInfo(t(lang, "auth_oauth_soon"))}
            />
            <OAuthButton
              provider="apple"
              label={t(lang, "auth_continue_apple")}
              big
              onClick={() => setInfo(t(lang, "auth_oauth_soon"))}
            />
          </div>

          <AuthDivider label={t(lang, "auth_or_email")} />

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <AuthField
              label={t(lang, "auth_email")}
              icon={I.user}
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
              autoFocus
            />
            <AuthField
              label={t(lang, "auth_password")}
              icon={I.lock}
              value={password}
              onChange={setPassword}
              type={show ? "text" : "password"}
              suffix={
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  style={{
                    height: 28,
                    padding: "0 8px",
                    borderRadius: 7,
                    border: `1px solid ${HAIR}`,
                    background: "#fff",
                    cursor: "pointer",
                    fontFamily: SANS,
                    fontSize: 11.5,
                    fontWeight: 500,
                    color: INK_3,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Icon d={show ? I.eyeOff : I.eye} s={12} c={INK_3} /> {show ? "hide" : "show"}
                </button>
              }
              hint={t(lang, "auth_password_hint")}
            />
          </div>

          {error && (
            <div
              style={{
                marginTop: 10,
                fontFamily: MONO,
                fontSize: 11,
                color: "#c0392b",
              }}
            >
              {error}
            </div>
          )}
          {info && !error && (
            <div
              style={{
                marginTop: 10,
                fontFamily: MONO,
                fontSize: 11,
                color: PEACH,
              }}
            >
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 18,
              width: "100%",
              height: 54,
              borderRadius: 14,
              border: "none",
              cursor: submitting ? "default" : "pointer",
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
              gap: 10,
              opacity: submitting ? 0.65 : 1,
            }}
          >
            <span>{t(lang, "auth_open_tab")}</span>
            <span style={{ opacity: 0.7, fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>🍅</span>
            <span style={{ display: "flex", gap: 3 }}>
              <Kbd dark>⌘</Kbd>
              <Kbd dark>↩</Kbd>
            </span>
          </button>

          <div style={{ marginTop: 14 }}>
            <PromisesBlock
              label={t(lang, "auth_three_promises")}
              promises={[
                t(lang, "auth_promise_1"),
                t(lang, "auth_promise_2"),
                t(lang, "auth_promise_3"),
              ]}
            />
          </div>

          <div
            style={{
              marginTop: 14,
              fontFamily: MONO,
              fontSize: 10.5,
              color: INK_4,
              lineHeight: "16px",
            }}
          >
            {t(lang, "auth_house_rules_1")}
            <br />
            {t(lang, "auth_house_rules_2")}
          </div>
        </form>
      </div>
    </div>
  );
}

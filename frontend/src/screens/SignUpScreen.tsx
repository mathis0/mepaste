import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { DamavandScene } from "../components/DamavandScene";
import { Icon } from "../components/Icon";
import { AuthField, PromisesBlock } from "../components/auth/AuthField";
import { AuthDivider, OAuthButton } from "../components/auth/OAuthButton";
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
  TEAL_DARK,
} from "../theme";
import { useAuth } from "../auth";
import { ApiError } from "../api";
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

export function SignUpScreen() {
  const lang = useLang();
  const isFa = lang === "fa";
  const nav = useNavigate();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;
    setError(null); setInfo(null);
    if (password.length < 8) {
      setError(t(lang, "auth_password_hint"));
      return;
    }
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
      dir={isFa ? "rtl" : "ltr"}
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

      {/* top bar */}
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
        <button type="button" style={iconBtn} onClick={() => nav(-1)} aria-label="back">
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
          <BrandMark size={14} />
          <span>mepaste</span>
        </div>
        <button type="button" style={iconBtn} aria-label="info">
          <Icon d={I.info} s={20} c={INK_2} />
        </button>
      </div>

      <form
        onSubmit={submit}
        style={{
          position: "absolute",
          top: 80,
          left: 16,
          right: 16,
          bottom: 24,
          zIndex: 6,
          background: CARD,
          borderRadius: 22,
          border: `1px solid ${HAIR}`,
          boxShadow: "0 30px 70px -30px rgba(80,40,20,0.4)",
          padding: "24px 22px 22px",
          overflow: "auto",
        }}
      >
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
          {t(lang, "auth_optional")}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 26,
            fontWeight: 700,
            color: INK,
            letterSpacing: -0.6,
            lineHeight: "32px",
          }}
        >
          {t(lang, "auth_signup_title_1")}{" "}
          <span style={{ color: TEAL }}>{t(lang, "auth_signup_title_2")}</span>.
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: INK_3, lineHeight: "19px" }}>
          {t(lang, "auth_signup_sub")}
        </div>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
          <OAuthButton
            provider="google"
            label={t(lang, "auth_continue_google")}
            onClick={() => setInfo(t(lang, "auth_oauth_soon"))}
          />
          <OAuthButton
            provider="apple"
            label={t(lang, "auth_continue_apple")}
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
            placeholder="you@example.com"
            type="email"
            autoFocus
          />
          <AuthField
            label={t(lang, "auth_password")}
            icon={I.lock}
            value={password}
            onChange={setPassword}
            type="password"
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
              textAlign: "center",
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
              textAlign: "center",
            }}
          >
            {info}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            marginTop: 16,
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
            gap: 8,
            opacity: submitting ? 0.65 : 1,
          }}
        >
          <span>{t(lang, "auth_open_tab")}</span>
          <span style={{ opacity: 0.7, fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>🍅</span>
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

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 13, color: INK_3 }}>
          {t(lang, "auth_already_have")}{" "}
          <a
            onClick={() => nav("/signin")}
            style={{ color: TEAL, fontWeight: 600, cursor: "pointer" }}
          >
            {t(lang, "auth_sign_in")}
          </a>
        </div>

        <div
          style={{
            marginTop: 8,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 10.5,
            color: INK_4,
            lineHeight: "15px",
          }}
        >
          {t(lang, "auth_house_rules_1")}
          <br />
          {t(lang, "auth_house_rules_2")}
        </div>
      </form>
    </div>
  );
}

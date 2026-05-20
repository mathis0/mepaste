import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { DamavandScene } from "../components/DamavandScene";
import { Icon } from "../components/Icon";
import { Stamp } from "../components/Stamp";
import { AuthField } from "../components/auth/AuthField";
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

export function SignInScreen() {
  const lang = useLang();
  const isFa = lang === "fa";
  const nav = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;
    setError(null); setInfo(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      nav("/");
    } catch (e) {
      const err = e as ApiError;
      if (err.status === 401) setError(t(lang, "auth_bad_creds"));
      else setError(err.body?.detail ?? err.message ?? "signin_failed");
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
          padding: "26px 22px 22px",
          overflow: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ flex: 1 }}>
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
              {t(lang, "auth_welcome_back")}
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
              {t(lang, "auth_signin_title_1")}
              <br />
              <span style={{ color: TEAL }}>{t(lang, "auth_signin_title_2")}</span>
            </div>
          </div>
          <Stamp
            color={PEACH}
            rotate={9}
            style={{ fontSize: 9, padding: "4px 8px 3px", letterSpacing: 1 }}
          >
            member
            {"\n"}since '04
          </Stamp>
        </div>

        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 8 }}>
          <OAuthButton
            provider="google"
            label={t(lang, "auth_signin_google")}
            onClick={() => setInfo(t(lang, "auth_oauth_soon"))}
          />
          <OAuthButton
            provider="apple"
            label={t(lang, "auth_signin_apple")}
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
          />
          <AuthField
            label={t(lang, "auth_password")}
            icon={I.lock}
            value={password}
            onChange={setPassword}
            type={showPassword ? "text" : "password"}
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label="show password"
              >
                <Icon d={showPassword ? I.eyeOff : I.eye} s={16} c={INK_4} />
              </button>
            }
            autoFocus
          />
        </div>

        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
            <span
              onClick={() => setKeepSignedIn((v) => !v)}
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                background: keepSignedIn ? TEAL : "transparent",
                border: `1.5px solid ${keepSignedIn ? TEAL_DARK : HAIR}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {keepSignedIn && <Icon d={I.check} s={11} c="#fff" sw={3} />}
            </span>
            <span style={{ fontSize: 13, color: INK_2, fontWeight: 500 }}>
              {t(lang, "auth_keep_signed_in")}
            </span>
          </label>
          <span style={{ fontSize: 13, color: TEAL, fontWeight: 600, cursor: "pointer" }}>
            {t(lang, "auth_forgot")}
          </span>
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
            marginTop: 14,
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
          <span>{t(lang, "auth_sign_in")}</span>
          <span style={{ opacity: 0.7, fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>
            ⌘↩
          </span>
        </button>

        <div style={{ marginTop: 14, textAlign: "center", fontSize: 13, color: INK_3 }}>
          {t(lang, "auth_no_tab")}{" "}
          <a
            onClick={() => nav("/signup")}
            style={{ color: TEAL, fontWeight: 600, cursor: "pointer" }}
          >
            {t(lang, "auth_open_one")}
          </a>{" "}
          ·{" "}
          <a
            onClick={() => nav("/")}
            style={{ color: INK_2, fontWeight: 600, cursor: "pointer" }}
          >
            {t(lang, "auth_or_anon")}
          </a>
        </div>

        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: `1px dashed ${HAIR}`,
            display: "flex",
            justifyContent: "center",
            gap: 6,
            fontFamily: MONO,
            fontSize: 10.5,
            color: "rgba(80,55,45,0.55)",
          }}
        >
          <BrandMark size={14} />
          <span>{t(lang, "made_with")}</span>
        </div>
      </form>
    </div>
  );
}

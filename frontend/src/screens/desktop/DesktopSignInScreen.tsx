import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import { DamavandScene } from "../../components/DamavandScene";
import { Icon } from "../../components/Icon";
import { Stamp } from "../../components/Stamp";
import { Kbd } from "../../components/desktop/Kbd";
import { AuthField } from "../../components/auth/AuthField";
import { AuthDivider, OAuthButton } from "../../components/auth/OAuthButton";
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
  TEAL_DARK,
} from "../../theme";
import { useAuth } from "../../auth";
import { ApiError } from "../../api";
import { useLang, t } from "../../i18n";

export function DesktopSignInScreen() {
  const lang = useLang();
  const nav = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [keepSigned, setKeepSigned] = useState(true);
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
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, overflow: "hidden" }}>
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

      <div
        style={{
          position: "absolute",
          top: 22,
          left: 28,
          right: 28,
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          gap: 12,
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
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 13.5, color: INK_3 }}>
          {t(lang, "auth_no_tab")}{" "}
          <a
            onClick={() => nav("/signup")}
            style={{ color: TEAL, fontWeight: 600, cursor: "pointer" }}
          >
            {t(lang, "auth_open_one")}
          </a>
        </span>
      </div>

      <form
        onSubmit={submit}
        style={{
          position: "absolute",
          top: 160,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(480px, calc(100% - 48px))",
          zIndex: 5,
          background: CARD,
          borderRadius: 18,
          border: `1px solid ${HAIR}`,
          boxShadow:
            "0 40px 100px -36px rgba(80,40,20,0.45), 0 1px 0 rgba(255,255,255,0.9) inset",
          padding: "32px 36px 28px",
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
            style={{ fontSize: 10, padding: "5px 9px 4px", letterSpacing: 1 }}
          >
            member
            {"\n"}since '04
          </Stamp>
        </div>

        <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 8 }}>
          <OAuthButton
            provider="google"
            label={t(lang, "auth_signin_google")}
            big
            onClick={() => setInfo(t(lang, "auth_oauth_soon"))}
          />
          <OAuthButton
            provider="apple"
            label={t(lang, "auth_signin_apple")}
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
            autoFocus
          />
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <span
              onClick={() => setKeepSigned((v) => !v)}
              style={{
                width: 18,
                height: 18,
                borderRadius: 5,
                background: keepSigned ? TEAL : "transparent",
                border: `1.5px solid ${keepSigned ? TEAL_DARK : HAIR}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {keepSigned && <Icon d={I.check} s={11} c="#fff" sw={3} />}
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
          <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 11, color: "#c0392b" }}>{error}</div>
        )}
        {info && !error && (
          <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 11, color: PEACH }}>{info}</div>
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
            gap: 10,
            opacity: submitting ? 0.65 : 1,
          }}
        >
          <span>{t(lang, "auth_sign_in")}</span>
          <span style={{ display: "flex", gap: 3 }}>
            <Kbd dark>⌘</Kbd>
            <Kbd dark>↩</Kbd>
          </span>
        </button>

        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: `1px dashed ${HAIR}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12.5,
            color: INK_3,
          }}
        >
          <span>
            {t(lang, "auth_no_tab")}{" "}
            <a
              onClick={() => nav("/signup")}
              style={{ color: TEAL, fontWeight: 600, cursor: "pointer" }}
            >
              {t(lang, "auth_open_one")}
            </a>
          </span>
          <span>
            or just{" "}
            <a
              onClick={() => nav("/")}
              style={{ color: INK_2, fontWeight: 600, textDecoration: "underline", cursor: "pointer" }}
            >
              {t(lang, "auth_or_anon")} →
            </a>
          </span>
        </div>
      </form>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 24,
          zIndex: 5,
          display: "flex",
          justifyContent: "center",
          gap: 6,
          fontFamily: MONO,
          fontSize: 11,
          color: INK_4,
        }}
      >
        <BrandMark size={14} />
        <span>{t(lang, "made_with")} · batch #042</span>
      </div>
    </div>
  );
}

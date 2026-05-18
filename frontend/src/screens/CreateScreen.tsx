import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppFrame } from "../components/AppFrame";
import { BrandMark } from "../components/BrandMark";
import { DamavandScene } from "../components/DamavandScene";
import { Icon } from "../components/Icon";
import { PasteOptionsSheet, SheetOpts, expiryLabel } from "../components/PasteOptionsSheet";
import { PublishToast } from "../components/PublishToast";
import { SmashOverlay } from "../components/SmashOverlay";
import { I } from "../icons";
import {
  CARD,
  FARSI,
  HAIR,
  INK,
  INK_2,
  INK_3,
  INK_4,
  MONO,
  PEACH,
  SANS,
  TEAL,
  TEAL_DARK,
  WARN,
} from "../theme";
import { createPaste, ApiError, ExpiresIn, Visibility } from "../api";
import { useLang, t } from "../i18n";
import { useAuth } from "../auth";

type State = "idle" | "smashing" | "done";

function loadDefaults(): SheetOpts {
  const v = (localStorage.getItem("mp_default_visibility") as Visibility) || "public";
  const e = (localStorage.getItem("mp_default_expires") as ExpiresIn) || "1d";
  const burn = localStorage.getItem("mp_default_burn") === "1";
  return { visibility: v, expires: e, burn, password: false };
}

export function CreateScreen() {
  const lang = useLang();
  const isFa = lang === "fa";
  const nav = useNavigate();
  const { mode, user } = useAuth();

  const [state, setState] = useState<State>("idle");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [opts, setOpts] = useState<SheetOpts>(useMemo(loadDefaults, []));
  const [password, setPassword] = useState("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [resultSlug, setResultSlug] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { taRef.current?.focus(); }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const publish = async () => {
    if (state !== "idle") return;
    setSheetOpen(false);
    if (!content.trim()) {
      taRef.current?.focus();
      return;
    }
    setError(null);
    setState("smashing");
    try {
      const res = await createPaste({
        title: title.trim() || null,
        content,
        visibility: opts.visibility,
        expires_in: opts.expires,
        password: opts.password && password ? password : null,
        burn_after_read: opts.burn,
      });
      setResultUrl(res.url);
      setResultSlug(res.slug);
      setTimeout(() => setState("done"), 2000);
    } catch (e) {
      const err = e as ApiError;
      if (err?.status === 403 && err?.body?.detail === "private_requires_account") {
        setState("idle");
        nav("/signup");
        return;
      }
      setError(err?.body?.detail?.message ?? err?.body?.detail ?? err?.message ?? "something went wrong");
      setState("idle");
    }
  };

  const reset = () => {
    setState("idle");
    setContent("");
    setTitle("");
    setPassword("");
    setResultUrl("");
    setResultSlug("");
    setTimeout(() => taRef.current?.focus(), 0);
  };

  const openIt = () => nav(`/p/${resultSlug}`);

  const dir: "rtl" | "ltr" = isFa ? "rtl" : "ltr";
  const screenFont = isFa ? FARSI : SANS;

  const visIcon = opts.visibility === "private" ? I.lock
    : opts.visibility === "unlisted" ? I.eye
    : I.globe;

  return (
    <AppFrame activeTab="create">
      <DamavandScene />

      <div
        dir={dir}
        style={{
          position: "absolute",
          top: 18,
          left: 0,
          right: 0,
          zIndex: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          fontFamily: screenFont,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <BrandMark />
          <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, color: INK, letterSpacing: -0.2 }}>
            mepaste
          </span>
          {isFa ? (
            <span style={{ fontFamily: FARSI, fontSize: 13, color: INK_3 }}>· می‌پیست</span>
          ) : (
            <span
              style={{
                fontFamily: MONO,
                fontSize: 10,
                color: INK_4,
                letterSpacing: 0.4,
                padding: "2px 5px",
                border: `1px dashed ${HAIR}`,
                borderRadius: 4,
              }}
            >
              v0.4 · batch #042
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {mode === "anon" ? (
            <button
              type="button"
              onClick={() => nav("/signup")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontFamily: MONO,
                fontSize: 10,
                color: INK_3,
                letterSpacing: 0.6,
                padding: "4px 9px",
                borderRadius: 99,
                border: `1px dashed ${HAIR}`,
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: 99, background: "#6e9b56" }} />
              {t(lang, "mode_anon_create_pill")}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => nav("/settings")}
              aria-label={user?.email ?? "you"}
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "linear-gradient(135deg, #fce5e0 0%, #f8c8c0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#b53a2e",
                fontFamily: SANS,
                border: `1px solid ${HAIR}`,
                cursor: "pointer",
              }}
            >
              {(user?.name?.[0] || user?.email?.[0] || "?").toLowerCase()}
            </button>
          )}
          <button
            type="button"
            onClick={() => nav("/list")}
            style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0 }}
            aria-label="my pastes"
          >
            <Icon d={I.search} s={20} c={INK_3} />
          </button>
        </div>
      </div>

      <div
        dir={dir}
        style={{
          position: "absolute",
          top: 68,
          left: 16,
          right: 16,
          bottom: 168,
          background: CARD,
          borderRadius: 22,
          border: `1px solid ${HAIR}`,
          boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 24px 60px -32px rgba(220,76,62,0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: screenFont,
          zIndex: 5,
        }}
      >
        <div style={{ padding: "14px 18px 4px", display: "flex", alignItems: "center", gap: 10 }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t(lang, "give_name")}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: isFa ? FARSI : MONO,
              fontSize: isFa ? 14 : 12,
              color: INK,
              padding: 0,
            }}
          />
          <span style={{ fontFamily: MONO, fontSize: 11, color: INK_4 }}>
            {isFa ? "fa.txt" : "plain.txt"}
          </span>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <textarea
            ref={taRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                void publish();
              }
            }}
            placeholder={`${t(lang, "placeholder_hint")}\n${t(lang, "placeholder_line_2")}\n${t(lang, "placeholder_line_3")}`}
            style={{
              width: "100%",
              height: "100%",
              padding: "8px 18px",
              border: "none",
              outline: "none",
              resize: "none",
              background: "transparent",
              fontFamily: isFa ? FARSI : MONO,
              fontSize: isFa ? 15 : 13.5,
              lineHeight: isFa ? "28px" : "20px",
              color: INK,
              direction: dir,
            }}
          />
        </div>
        <div
          style={{
            padding: "10px 16px",
            borderTop: `1px solid ${HAIR}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 11,
            color: INK_4,
            direction: "ltr",
          }}
        >
          <span>
            {wordCount} {t(lang, "words")} · {t(lang, "fresh_off_vine")}
          </span>
          <span>{t(lang, "cmd_ripe")}</span>
        </div>
      </div>

      <div
        dir={dir}
        style={{
          position: "absolute",
          left: 16,
          right: 16,
          bottom: 92,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 5,
          fontFamily: screenFont,
        }}
      >
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          style={{
            height: 46,
            padding: "0 14px",
            borderRadius: 14,
            background: "#fff",
            border: `1px solid ${HAIR}`,
            boxShadow: "0 8px 20px -16px rgba(80,40,20,0.25)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: screenFont,
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 10,
              color: INK_4,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t(lang, "options_label")}
          </span>
          <span
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              fontSize: 13,
              color: INK_2,
              fontWeight: 500,
              letterSpacing: -0.1,
            }}
          >
            <OptBit icon={visIcon} label={t(lang, opts.visibility)} accent={TEAL} />
            <span style={{ color: INK_4 }}>·</span>
            <OptBit icon={I.clock} label={expiryLabel(lang, opts.expires)} accent={PEACH} />
            {opts.burn && (
              <>
                <span style={{ color: INK_4 }}>·</span>
                <OptBit icon={I.flame} label={t(lang, "burns_label")} accent={WARN} />
              </>
            )}
            {opts.password && (
              <>
                <span style={{ color: INK_4 }}>·</span>
                <OptBit icon={I.lock} label={t(lang, "password")} accent={INK_2} />
              </>
            )}
          </span>
          <Icon d={I.chev} s={14} c={INK_4} sw={2.2} />
        </button>

        <button
          type="button"
          onClick={publish}
          disabled={state !== "idle"}
          style={{
            height: 54,
            borderRadius: 16,
            border: "none",
            cursor: state === "idle" ? "pointer" : "default",
            background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
            color: "#fff",
            fontFamily: screenFont,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: -0.2,
            boxShadow:
              "0 10px 24px -10px rgba(220,76,62,0.6), inset 0 1px 0 rgba(255,255,255,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: state === "idle" ? 1 : 0.55,
            transform: state === "smashing" ? "scale(0.97)" : "scale(1)",
            transition: "transform 200ms, opacity 200ms",
          }}
        >
          <span>
            {state === "idle"
              ? t(lang, "publish")
              : state === "smashing"
                ? t(lang, "publishing")
                : t(lang, "published")}
          </span>
          {state === "idle" && (
            <span style={{ opacity: 0.7, fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>
              {t(lang, "publish_sub")}
            </span>
          )}
        </button>

        {error && (
          <div
            style={{
              fontFamily: MONO,
              fontSize: 11,
              color: "#c0392b",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* If password is enabled and the sheet isn't open, show an inline password input. */}
      {opts.password && !sheetOpen && (
        <div
          dir={dir}
          style={{
            position: "absolute",
            left: 16,
            right: 16,
            bottom: 152,
            zIndex: 5,
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t(lang, "password")}
            style={{
              width: "100%",
              height: 36,
              padding: "0 12px",
              borderRadius: 10,
              border: `1px solid ${HAIR}`,
              background: "#fff",
              outline: "none",
              fontFamily: MONO,
              fontSize: 13,
              direction: dir,
            }}
          />
        </div>
      )}

      {state === "smashing" && <SmashOverlay />}
      {state === "done" && (
        <PublishToast
          url={resultUrl}
          onReset={reset}
          onOpen={openIt}
          mode={mode}
          onOpenTab={() => nav("/signup")}
        />
      )}

      {sheetOpen && (
        <PasteOptionsSheet
          opts={opts}
          lang={lang}
          mode={mode}
          onChange={(patch) => setOpts((o) => ({ ...o, ...patch }))}
          onClose={() => setSheetOpen(false)}
          onPublish={publish}
          onPrivateRequiresAccount={() => nav("/signup")}
        />
      )}
    </AppFrame>
  );
}

function OptBit({ icon, label, accent }: { icon: string; label: string; accent: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <Icon d={icon} s={13} c={accent} sw={2} />
      <span style={{ color: accent === INK_2 ? INK_2 : accent }}>{label}</span>
    </span>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppFrame } from "../components/AppFrame";
import { BrandMark } from "../components/BrandMark";
import { Chip } from "../components/Chip";
import { DamavandScene } from "../components/DamavandScene";
import { Icon } from "../components/Icon";
import { PublishToast } from "../components/PublishToast";
import { SmashOverlay } from "../components/SmashOverlay";
import { I } from "../icons";
import {
  CARD,
  FARSI,
  HAIR,
  INK,
  INK_3,
  INK_4,
  MONO,
  SANS,
  TEAL,
  TEAL_DARK,
} from "../theme";
import { createPaste, ApiError, ExpiresIn, Visibility } from "../api";
import { useLang, t } from "../i18n";

type State = "idle" | "smashing" | "done";

const VISIBILITY_CYCLE: Visibility[] = ["public", "unlisted", "private"];
const EXPIRES_CYCLE: ExpiresIn[] = ["1h", "1d", "never"];

function loadDefaults() {
  const v = (localStorage.getItem("mp_default_visibility") as Visibility) || "public";
  const e = (localStorage.getItem("mp_default_expires") as ExpiresIn) || "1d";
  const burn = localStorage.getItem("mp_default_burn") === "1";
  return { v, e, burn };
}

export function CreateScreen() {
  const lang = useLang();
  const isFa = lang === "fa";
  const nav = useNavigate();
  const defaults = useMemo(loadDefaults, []);

  const [state, setState] = useState<State>("idle");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(defaults.v);
  const [expiresIn, setExpiresIn] = useState<ExpiresIn>(defaults.e);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [burn, setBurn] = useState<boolean>(defaults.burn);
  const [resultUrl, setResultUrl] = useState<string>("");
  const [resultSlug, setResultSlug] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { taRef.current?.focus(); }, []);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const expiresLabel = (e: ExpiresIn): string =>
    e === "1h" ? t(lang, "wilts_in_an_hour")
    : e === "1d" ? t(lang, "wilts_in_a_day")
    : t(lang, "wilts_never");

  const cycleVisibility = () => {
    const i = VISIBILITY_CYCLE.indexOf(visibility);
    setVisibility(VISIBILITY_CYCLE[(i + 1) % VISIBILITY_CYCLE.length]);
  };
  const cycleExpires = () => {
    const i = EXPIRES_CYCLE.indexOf(expiresIn);
    setExpiresIn(EXPIRES_CYCLE[(i + 1) % EXPIRES_CYCLE.length]);
  };

  const publish = async () => {
    if (state !== "idle") return;
    if (!content.trim()) {
      // small nudge — focus textarea
      taRef.current?.focus();
      return;
    }
    setError(null);
    setState("smashing");
    try {
      const res = await createPaste({
        title: title.trim() || null,
        content,
        visibility,
        expires_in: expiresIn,
        password: showPassword && password ? password : null,
        burn_after_read: burn,
      });
      setResultUrl(res.url);
      setResultSlug(res.slug);
      // smash animation lasts ~2s before toast appears
      setTimeout(() => setState("done"), 2000);
    } catch (e) {
      const err = e as ApiError;
      setError(err?.body?.detail?.message ?? err?.message ?? "something went wrong");
      setState("idle");
    }
  };

  const reset = () => {
    setState("idle");
    setContent("");
    setTitle("");
    setPassword("");
    setShowPassword(false);
    setResultUrl("");
    setResultSlug("");
    setTimeout(() => taRef.current?.focus(), 0);
  };

  const openIt = () => nav(`/p/${resultSlug}`);

  const dir: "rtl" | "ltr" = isFa ? "rtl" : "ltr";
  const screenFont = isFa ? FARSI : SANS;

  return (
    <AppFrame activeTab="create">
      <DamavandScene />

      {/* top bar */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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

      {/* composer */}
      <div
        dir={dir}
        style={{
          position: "absolute",
          top: 68,
          left: 16,
          right: 16,
          bottom: 218,
          background: CARD,
          borderRadius: 22,
          border: `1px solid ${HAIR}`,
          boxShadow:
            "0 1px 0 rgba(0,0,0,0.02), 0 24px 60px -32px rgba(220,76,62,0.2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          fontFamily: screenFont,
          zIndex: 5,
        }}
      >
        <div
          style={{
            padding: "14px 18px 4px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
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

      {/* controls panel */}
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
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Chip
            icon={I.globe}
            label={t(lang, visibility)}
            active
            onClick={cycleVisibility}
          />
          <Chip icon={I.clock} label={expiresLabel(expiresIn)} active onClick={cycleExpires} />
          <Chip
            icon={I.lock}
            label={t(lang, "password")}
            active={showPassword}
            onClick={() => setShowPassword((v) => !v)}
          />
          <Chip
            icon={I.flame}
            label={t(lang, "burn_after_read")}
            active={burn}
            onClick={() => setBurn((v) => !v)}
          />
        </div>

        {showPassword && (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t(lang, "password")}
            style={{
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
        )}

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

      {state === "smashing" && <SmashOverlay />}
      {state === "done" && (
        <PublishToast url={resultUrl} onReset={reset} onOpen={openIt} />
      )}
    </AppFrame>
  );
}

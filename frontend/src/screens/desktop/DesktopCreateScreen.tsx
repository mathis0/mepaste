import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DamavandScene } from "../../components/DamavandScene";
import { DesktopFrame } from "../../components/desktop/DesktopFrame";
import { DesktopSmashOverlay } from "../../components/desktop/DesktopSmashOverlay";
import { Icon } from "../../components/Icon";
import { Kbd } from "../../components/desktop/Kbd";
import { PublishToast } from "../../components/PublishToast";
import { I } from "../../icons";
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
  TEAL_BORDER,
  TEAL_DARK,
  TEAL_TINT,
  WARN,
} from "../../theme";
import { ApiError, createPaste, ExpiresIn, Visibility } from "../../api";
import { t, useLang } from "../../i18n";
import { expiryLabel } from "../../components/PasteOptionsSheet";

type State = "idle" | "smashing" | "done";

const EXPIRY_OPTIONS: ExpiresIn[] = ["10m", "1h", "1d", "1w", "never"];
const VIS_OPTIONS: { id: Visibility; icon: string }[] = [
  { id: "public", icon: I.globe },
  { id: "private", icon: I.lock },
];

export function DesktopCreateScreen() {
  const lang = useLang();
  const isFa = lang === "fa";
  const dir: "rtl" | "ltr" = isFa ? "rtl" : "ltr";
  const nav = useNavigate();

  const [state, setState] = useState<State>("idle");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [expires, setExpires] = useState<ExpiresIn>("1d");
  const [burn, setBurn] = useState(false);
  const [usePw, setUsePw] = useState(false);
  const [password, setPassword] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultSlug, setResultSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  const taRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { taRef.current?.focus(); }, []);

  const publish = async () => {
    if (state !== "idle") return;
    if (!content.trim()) { taRef.current?.focus(); return; }
    setError(null);
    setState("smashing");
    try {
      const res = await createPaste({
        title: title.trim() || null,
        content,
        visibility,
        expires_in: expires,
        password: usePw && password ? password : null,
        burn_after_read: burn,
      });
      setResultUrl(res.url);
      setResultSlug(res.slug);
      setTimeout(() => setState("done"), 2000);
    } catch (e) {
      const err = e as ApiError;
      setError(err?.body?.detail?.message ?? err?.body?.detail ?? err?.message ?? "something went wrong");
      setState("idle");
    }
  };

  const reset = () => {
    setState("idle");
    setContent("");
    setTitle("");
    setUsePw(false);
    setPassword("");
    setResultUrl("");
    setResultSlug("");
    setTimeout(() => taRef.current?.focus(), 0);
  };

  const lineCount = content ? content.split("\n").length : 1;
  const charCount = content.length;

  return (
    <DesktopFrame
      lang={lang}
      crumbs={[t(lang, "new_paste_long")]}
      hints={[
        [t(lang, "hint_publish"), ["⌘", "↩"]],
        [t(lang, "hint_cancel"), ["esc"]],
      ]}
    >
      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
        {/* composer column */}
        <div
          style={{
            flex: 1,
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minWidth: 0,
          }}
        >
          {/* Damavand hero */}
          <div
            style={{
              position: "relative",
              height: 168,
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${HAIR}`,
              boxShadow: "0 16px 40px -28px rgba(80,40,20,0.3)",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "absolute", inset: 0 }}>
              <DamavandScene />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: isFa
                  ? "linear-gradient(270deg, rgba(251,245,241,0.95) 0%, rgba(251,245,241,0.3) 45%, transparent 80%)"
                  : "linear-gradient(90deg, rgba(251,245,241,0.95) 0%, rgba(251,245,241,0.3) 45%, transparent 80%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 24,
                zIndex: 2,
                [isFa ? "right" : "left"]: 26,
                [isFa ? "left" : "right"]: 60,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: TEAL,
                  letterSpacing: 1.6,
                  textTransform: "uppercase",
                  fontWeight: 700,
                  direction: "ltr",
                  textAlign: isFa ? "right" : "left",
                }}
              >
                {t(lang, "hero_fresh_batch")}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontSize: 28,
                  fontWeight: 700,
                  color: INK,
                  letterSpacing: -0.6,
                  lineHeight: "34px",
                  fontFamily: isFa ? FARSI : SANS,
                }}
              >
                {t(lang, "hero_headline_1")}<br />
                <span style={{ color: TEAL }}>{t(lang, "hero_headline_2")}</span>
              </div>
            </div>
          </div>

          {/* composer card */}
          <div
            style={{
              flex: 1,
              background: CARD,
              borderRadius: 14,
              border: `1px solid ${HAIR}`,
              boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 24px 60px -38px rgba(220,76,62,0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minHeight: 360,
            }}
          >
            <div
              style={{
                padding: "14px 22px 10px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                borderBottom: `1px solid ${HAIR}`,
              }}
            >
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t(lang, "give_name")}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontFamily: isFa ? FARSI : SANS,
                  fontSize: 17,
                  fontWeight: 600,
                  color: INK,
                  letterSpacing: -0.3,
                  textAlign: isFa ? "right" : "left",
                  direction: dir,
                }}
              />
              <span style={{ fontFamily: MONO, fontSize: 11, color: INK_4 }}>
                {isFa ? "fa.txt" : "plain.txt"}
              </span>
            </div>

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
                flex: 1,
                border: "none",
                outline: "none",
                resize: "none",
                background: "transparent",
                padding: "16px 22px",
                fontFamily: isFa ? FARSI : MONO,
                fontSize: isFa ? 16 : 13.5,
                lineHeight: isFa ? "32px" : "22px",
                color: INK,
                direction: dir,
                textAlign: isFa ? "right" : "left",
                minHeight: 200,
              }}
            />

            <div
              style={{
                height: 32,
                padding: "0 18px",
                borderTop: `1px solid ${HAIR}`,
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontFamily: MONO,
                fontSize: 11,
                color: INK_4,
                direction: "ltr",
              }}
            >
              <span>{lineCount} lines · {charCount} chars</span>
              <span style={{ flex: 1 }} />
              <span>
                <span style={{ color: PEACH }}>●</span> {t(lang, "fresh_off_vine")}
              </span>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div
          style={{
            width: 320,
            flexShrink: 0,
            padding: isFa ? "22px 0 22px 22px" : "22px 22px 22px 0",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            minHeight: 0,
          }}
        >
          <RailCard label={t(lang, "sheet_who")}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {VIS_OPTIONS.map((o) => {
                const active = visibility === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setVisibility(o.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 10px",
                      borderRadius: 9,
                      background: active ? TEAL_TINT : "transparent",
                      border: `1px solid ${active ? TEAL_BORDER : "transparent"}`,
                      cursor: "pointer",
                      width: "100%",
                      textAlign: isFa ? "right" : "left",
                      fontFamily: "inherit",
                    }}
                  >
                    <Icon d={o.icon} s={16} c={active ? TEAL : INK_3} sw={active ? 2 : 1.6} />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: active ? TEAL : INK_2,
                        }}
                      >
                        {t(lang, o.id)}
                      </div>
                      <div style={{ fontSize: 11.5, color: INK_3 }}>
                        {t(lang, ("desc_" + o.id) as any)}
                      </div>
                    </div>
                    {active && <Icon d={I.check} s={14} c={TEAL} sw={2.5} />}
                  </button>
                );
              })}
            </div>
          </RailCard>

          <RailCard
            label={t(lang, "sheet_how_long")}
            right={
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: PEACH }}>
                {expiryLabel(lang, expires)}
              </span>
            }
          >
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {EXPIRY_OPTIONS.map((e) => {
                const active = expires === e;
                return (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setExpires(e)}
                    style={{
                      height: 30,
                      padding: "0 12px",
                      borderRadius: 999,
                      background: active ? TEAL_TINT : "#fff",
                      border: `1px solid ${active ? TEAL_BORDER : HAIR}`,
                      fontSize: 13,
                      fontWeight: 500,
                      color: active ? TEAL : INK_2,
                      letterSpacing: -0.1,
                      fontFamily: "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {expiryLabel(lang, e)}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setBurn((v) => !v)}
              style={{
                marginTop: 12,
                padding: "10px 12px",
                borderRadius: 9,
                background: "rgba(224,122,60,0.07)",
                border: "1px dashed rgba(224,122,60,0.3)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                width: "100%",
                textAlign: isFa ? "right" : "left",
                fontFamily: "inherit",
              }}
            >
              <Icon d={I.flame} s={16} c={WARN} sw={2} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: WARN }}>
                  {t(lang, "burn_after_read")}
                </div>
                <div style={{ fontSize: 11, color: INK_3 }}>{t(lang, "desc_burn")}</div>
              </div>
              <DesktopToggle on={burn} />
            </button>
          </RailCard>

          <RailCard>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                type="button"
                onClick={() => setUsePw((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: isFa ? "right" : "left",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                <Icon d={I.lock} s={16} c={INK_3} sw={2} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: INK_2 }}>
                    {t(lang, "password")}
                  </div>
                  <div style={{ fontSize: 11.5, color: INK_4 }}>{t(lang, "desc_password")}</div>
                </div>
                <DesktopToggle on={usePw} />
              </button>
              {usePw && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t(lang, "password")}
                  style={{
                    height: 34,
                    padding: "0 10px",
                    borderRadius: 8,
                    border: `1px solid ${HAIR}`,
                    background: "#fff",
                    outline: "none",
                    fontFamily: MONO,
                    fontSize: 13,
                    direction: dir,
                  }}
                />
              )}
            </div>
          </RailCard>

          <button
            type="button"
            onClick={publish}
            disabled={state !== "idle"}
            style={{
              height: 52,
              borderRadius: 14,
              border: "none",
              cursor: state === "idle" ? "pointer" : "default",
              background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
              color: "#fff",
              fontFamily: isFa ? FARSI : SANS,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: -0.2,
              boxShadow:
                "0 10px 24px -10px rgba(220,76,62,0.6), inset 0 1px 0 rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              opacity: state === "idle" ? 1 : 0.55,
              transform: state === "smashing" ? "scale(0.98)" : "scale(1)",
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
              <span style={{ display: "flex", gap: 3, direction: "ltr" }}>
                <Kbd dark>⌘</Kbd>
                <Kbd dark>↩</Kbd>
              </span>
            )}
          </button>

          {error && (
            <div style={{ fontFamily: MONO, fontSize: 11, color: "#c0392b", textAlign: "center" }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: "auto" }} />
        </div>

        {state === "smashing" && <DesktopSmashOverlay />}
        {state === "done" && (
          <PublishToast
            url={resultUrl}
            onReset={reset}
            onOpen={() => nav(`/p/${resultSlug}`)}
            expiresIn={expires}
          />
        )}
      </div>
    </DesktopFrame>
  );
}

function RailCard({
  label,
  right,
  children,
}: {
  label?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 12, padding: "14px 16px" }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10.5,
              color: INK_4,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {label}
          </div>
          <span style={{ flex: 1 }} />
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function DesktopToggle({ on }: { on: boolean }) {
  return (
    <span
      style={{
        width: 38,
        height: 22,
        borderRadius: 99,
        background: on ? TEAL : "rgba(120,120,128,0.18)",
        padding: 2,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        flexShrink: 0,
        transition: "background 200ms",
      }}
    >
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 99,
          background: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
        }}
      />
    </span>
  );
}

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError, getPaste, getPasteMeta, Paste, PasteMeta } from "../api";
import { useIsDesktop } from "../responsive";
import { useLang, t } from "../i18n";
import { LockedPasteScreen } from "./LockedPasteScreen";
import { BurnWarningScreen } from "./BurnWarningScreen";
import { VisitorPasteScreen } from "./VisitorPasteScreen";
import { DesktopVisitorPasteScreen } from "./desktop/DesktopVisitorPasteScreen";
import { DesktopLockedPasteScreen } from "./desktop/DesktopLockedPasteScreen";
import { INK, INK_3, MONO, SANS, SURFACE, TEAL, TEAL_DARK } from "../theme";

type Stage = "probe" | "locked" | "burn" | "load" | "view" | "gone" | "missing";

export function PasteRoute() {
  const { slug } = useParams<{ slug: string }>();
  const isDesktop = useIsDesktop();
  const lang = useLang();
  const nav = useNavigate();

  const [meta, setMeta] = useState<PasteMeta | null>(null);
  const [stage, setStage] = useState<Stage>("probe");
  const [password, setPassword] = useState<string | null>(null);
  const [paste, setPaste] = useState<Paste | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. peek at meta to decide which gate to show.
  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    setStage("probe");
    setMeta(null);
    setPaste(null);
    setPassword(null);
    setErrorMsg(null);
    getPasteMeta(slug)
      .then((m) => {
        if (cancelled) return;
        setMeta(m);
        if (m.has_password && !m.is_owner) setStage("locked");
        else if (m.burn_after_read && !m.is_owner) setStage("burn");
        else setStage("load");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setStage("missing");
            setErrorMsg(t(lang, "paste_not_found"));
          } else if (err.status === 410) {
            setStage("gone");
            setErrorMsg(
              err.body?.detail?.reason === "burned"
                ? t(lang, "paste_burned")
                : t(lang, "paste_wilted"),
            );
          } else {
            setErrorMsg(err.message ?? "error");
            setStage("missing");
          }
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // 2. once the gates are cleared, fetch the actual content.
  useEffect(() => {
    if (stage !== "load" || !slug) return;
    let cancelled = false;
    getPaste(slug, password ?? undefined)
      .then((p) => {
        if (cancelled) return;
        setPaste(p);
        setStage("view");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 410) {
            setStage("gone");
            setErrorMsg(
              err.body?.detail?.reason === "burned"
                ? t(lang, "paste_burned")
                : t(lang, "paste_wilted"),
            );
          } else if (err.status === 404) {
            setStage("missing");
            setErrorMsg(t(lang, "paste_not_found"));
          } else {
            setStage("missing");
            setErrorMsg("something went wrong");
          }
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, slug, password]);

  if (stage === "probe" || stage === "load") return <CenterMessage label="loading…" />;

  if (stage === "missing" || stage === "gone") {
    return <ErrorScreen label={errorMsg ?? ""} kind={stage === "gone" ? "gone" : "missing"} onHome={() => nav("/")} />;
  }

  if (stage === "locked") {
    const onUnlocked = (pw: string) => {
      setPassword(pw);
      if (meta?.burn_after_read && !meta.is_owner) setStage("burn");
      else setStage("load");
    };
    return isDesktop ? (
      <DesktopLockedPasteScreen onUnlocked={onUnlocked} />
    ) : (
      <LockedPasteScreen onUnlocked={onUnlocked} />
    );
  }

  if (stage === "burn" && meta) {
    return <BurnWarningScreen meta={meta} onConfirm={() => setStage("load")} />;
  }

  if (stage === "view" && paste && meta) {
    const variant = meta.burn_after_read && !meta.is_owner
      ? "burn"
      : password
        ? "unlocked"
        : "open";
    return isDesktop ? (
      <DesktopVisitorPasteScreen paste={paste} variant={variant} />
    ) : (
      <VisitorPasteScreen paste={paste} variant={variant} />
    );
  }

  return null;
}

function CenterMessage({ label }: { label: string }) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: SURFACE,
        fontFamily: MONO,
        fontSize: 12,
        color: INK_3,
      }}
    >
      {label}
    </div>
  );
}

function ErrorScreen({
  label,
  kind,
  onHome,
}: {
  label: string;
  kind: "gone" | "missing";
  onHome: () => void;
}) {
  const lang = useLang();
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 14,
        padding: "0 32px",
        textAlign: "center",
        background: SURFACE,
        fontFamily: SANS,
        color: INK,
      }}
    >
      <div style={{ fontSize: 56 }}>{kind === "gone" ? "🥀" : "🍅"}</div>
      <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.2 }}>{label}</div>
      <button
        type="button"
        onClick={onHome}
        style={{
          marginTop: 10,
          height: 40,
          padding: "0 18px",
          borderRadius: 11,
          border: "none",
          background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
          color: "#fff",
          fontFamily: SANS,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {t(lang, "go_home")}
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppFrame } from "../components/AppFrame";
import { ApiError, getPasteMeta, PasteMeta } from "../api";
import { useIsDesktop } from "../responsive";
import { useLang, t } from "../i18n";
import { LockedPasteScreen } from "./LockedPasteScreen";
import { BurnWarningScreen } from "./BurnWarningScreen";
import { ViewScreen } from "./ViewScreen";
import { DesktopViewScreen } from "./desktop/DesktopViewScreen";
import { DesktopLockedPasteScreen } from "./desktop/DesktopLockedPasteScreen";
import { INK_3, MONO } from "../theme";

type Stage = "probe" | "locked" | "burn" | "view" | "gone" | "missing";

export function PasteRoute() {
  const { slug } = useParams<{ slug: string }>();
  const isDesktop = useIsDesktop();
  const lang = useLang();
  const [meta, setMeta] = useState<PasteMeta | null>(null);
  const [stage, setStage] = useState<Stage>("probe");
  const [password, setPassword] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!slug) return;
    setStage("probe");
    setMeta(null);
    setPassword(null);
    setErrorMsg(null);
    getPasteMeta(slug)
      .then((m) => {
        if (cancelled) return;
        setMeta(m);
        if (m.has_password && !m.is_owner) setStage("locked");
        else if (m.burn_after_read && !m.is_owner) setStage("burn");
        else setStage("view");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError) {
          if (err.status === 404) { setStage("missing"); setErrorMsg(t(lang, "paste_not_found")); }
          else if (err.status === 410) {
            setStage("gone");
            setErrorMsg(err.body?.detail?.reason === "burned"
              ? t(lang, "paste_burned")
              : t(lang, "paste_wilted"));
          } else {
            setErrorMsg(err.message ?? "error");
            setStage("missing");
          }
        }
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (stage === "probe") {
    const inner = (
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: MONO,
          fontSize: 12,
          color: INK_3,
        }}
      >
        loading…
      </div>
    );
    return isDesktop ? inner : <AppFrame>{inner}</AppFrame>;
  }

  if (stage === "missing" || stage === "gone") {
    // Defer to the existing ViewScreen / DesktopViewScreen for the friendly
    // error page (same icon set + back-home flow). Those screens probe again
    // and re-render their own error state.
    return isDesktop ? <DesktopViewScreen passwordOverride={password} /> : <ViewScreen passwordOverride={password} />;
  }

  if (stage === "locked") {
    const onUnlocked = (pw: string) => {
      setPassword(pw);
      if (meta?.burn_after_read && !meta.is_owner) setStage("burn");
      else setStage("view");
    };
    return isDesktop ? (
      <DesktopLockedPasteScreen onUnlocked={onUnlocked} />
    ) : (
      <LockedPasteScreen onUnlocked={onUnlocked} />
    );
  }

  if (stage === "burn" && meta) {
    return <BurnWarningScreen meta={meta} onConfirm={() => setStage("view")} />;
  }

  // view
  return isDesktop
    ? <DesktopViewScreen passwordOverride={password} />
    : <ViewScreen passwordOverride={password} />;
}

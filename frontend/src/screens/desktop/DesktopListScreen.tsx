import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DesktopFrame } from "../../components/desktop/DesktopFrame";
import { Icon } from "../../components/Icon";
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
  TEAL_TINT,
  WARN,
} from "../../theme";
import { ApiError, listPastes, PasteListItem, Visibility } from "../../api";
import { t, useLang } from "../../i18n";

type Filter = "all" | Visibility | "burning";

const FILTERS: Filter[] = ["all", "public", "unlisted", "private", "burning"];

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return days === 1 ? "yesterday" : `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function wiltText(expiresAt: string | null): string {
  if (!expiresAt) return "never";
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "gone";
  const hours = Math.round(ms / 3_600_000);
  if (hours >= 36) return `${Math.round(hours / 24)}d`;
  if (hours >= 1) return `${hours}h`;
  return `${Math.max(1, Math.round(ms / 60_000))}m`;
}

export function DesktopListScreen() {
  const nav = useNavigate();
  const lang = useLang();
  const isFa = lang === "fa";

  const [rows, setRows] = useState<PasteListItem[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true); setError(null);
    try {
      const visibility = filter === "all" || filter === "burning" ? undefined : filter;
      let r = await listPastes(undefined, visibility);
      if (filter === "burning") r = r.filter((x) => x.burn_after_read);
      setRows(r);
    } catch (e) {
      setError((e as ApiError)?.message ?? "failed to load");
    } finally { setLoading(false); }
  };

  useEffect(() => { void reload(); /* eslint-disable-next-line */ }, [filter]);

  const total = rows.length;
  const burning = rows.filter((r) => r.burn_after_read).length;

  return (
    <DesktopFrame
      active="list"
      lang={lang}
      crumbs={[t(lang, "cb_workshop"), t(lang, "cb_my_pastes")]}
      hints={[
        [t(lang, "hint_new"), ["N"]],
        [t(lang, "hint_search"), ["⌘", "K"]],
        [t(lang, "hint_focus"), ["↑", "↓"]],
      ]}
      pasteCount={total}
    >
      <div style={{ flex: 1, padding: "22px", overflow: "auto", minHeight: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: INK, letterSpacing: -0.6 }}>
              {t(lang, "my_pastes")}
            </div>
            <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 12, color: INK_3 }}>
              <span style={{ color: TEAL, fontWeight: 600 }}>
                {total} {total === 1 ? "paste" : "pastes"}
              </span>
              {" · "}
              <span style={{ color: WARN }}>{burning} ripening now</span>
            </div>
          </div>
          <span style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 6 }}>
            {FILTERS.map((f) => (
              <FilterChip
                key={f}
                label={f === "all" ? t(lang, "all") : f === "burning" ? t(lang, "sb_burning") : t(lang, f)}
                icon={
                  f === "public" ? I.globe :
                  f === "unlisted" ? I.eye :
                  f === "private" ? I.lock :
                  f === "burning" ? I.flame : undefined
                }
                active={filter === f}
                accent={f === "burning" ? WARN : TEAL}
                onClick={() => setFilter(f)}
              />
            ))}
          </div>
        </div>

        <div style={{ background: CARD, border: `1px solid ${HAIR}`, borderRadius: 14, overflow: "hidden" }}>
          {/* table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "82px 1fr 70px 100px 90px 110px 70px",
              gap: 12,
              padding: "12px 18px",
              borderBottom: `1px solid ${HAIR}`,
              background: "#faf4ed",
              fontFamily: MONO,
              fontSize: 10.5,
              color: INK_3,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            <span>{t(lang, "table_slug")}</span>
            <span>{t(lang, "table_title")}</span>
            <span>{t(lang, "table_lang")}</span>
            <span>{t(lang, "table_visibility")}</span>
            <span>{t(lang, "table_wilts")}</span>
            <span>{t(lang, "table_created")}</span>
            <span style={{ textAlign: "right" }}>{t(lang, "table_reads")}</span>
          </div>

          {loading && (
            <div style={{ padding: 22, fontFamily: MONO, color: INK_3 }}>loading…</div>
          )}
          {error && !loading && (
            <div style={{ padding: 22, fontFamily: MONO, color: "#c0392b" }}>{error}</div>
          )}
          {!loading && !error && rows.length === 0 && (
            <div
              style={{
                padding: 36,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                color: INK_3,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 36 }}>🍅</div>
              <div style={{ fontSize: 14 }}>no pastes yet — go grow one</div>
              <button
                type="button"
                onClick={() => nav("/")}
                style={{
                  marginTop: 6,
                  height: 36,
                  padding: "0 14px",
                  borderRadius: 10,
                  background: TEAL,
                  color: "#fff",
                  border: "none",
                  fontFamily: SANS,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t(lang, "publish")}
              </button>
            </div>
          )}

          {!loading && !error && rows.map((r, i) => {
            const rtl = r.language === "fa";
            return (
              <button
                key={r.slug}
                type="button"
                onClick={() => nav(`/p/${r.slug}`)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "82px 1fr 70px 100px 90px 110px 70px",
                  gap: 12,
                  padding: "14px 18px",
                  borderBottom: i === rows.length - 1 ? "none" : `1px solid ${HAIR}`,
                  alignItems: "center",
                  cursor: "pointer",
                  background: i === 0 ? "rgba(220,76,62,0.025)" : "transparent",
                  border: "none",
                  borderRadius: 0,
                  textAlign: isFa ? "right" : "left",
                  fontFamily: "inherit",
                  width: "100%",
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: TEAL,
                    fontWeight: 600,
                    background: TEAL_TINT,
                    padding: "3px 8px",
                    borderRadius: 6,
                    width: "fit-content",
                  }}
                >
                  /{r.slug}
                </span>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: INK,
                        letterSpacing: -0.2,
                        fontFamily: rtl ? FARSI : SANS,
                        direction: rtl ? "rtl" : "ltr",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {r.title || t(lang, "default_title_placeholder")}
                    </span>
                    {r.burn_after_read && <Icon d={I.flame} s={13} c={WARN} sw={2} />}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontFamily: rtl ? FARSI : MONO,
                      fontSize: 11.5,
                      color: INK_3,
                      direction: rtl ? "rtl" : "ltr",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {r.snippet}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: INK_3,
                    background: "#faf4ed",
                    padding: "2px 7px",
                    borderRadius: 5,
                    width: "fit-content",
                  }}
                >
                  {r.language}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    fontSize: 12,
                    color:
                      r.visibility === "public" ? PEACH :
                      r.visibility === "private" ? WARN : INK_3,
                  }}
                >
                  <Icon
                    d={r.visibility === "public" ? I.globe : r.visibility === "private" ? I.lock : I.eye}
                    s={12}
                    c={r.visibility === "public" ? PEACH : r.visibility === "private" ? WARN : INK_3}
                  />
                  <span>{t(lang, r.visibility)}</span>
                </span>
                <span style={{ fontFamily: MONO, fontSize: 11.5, color: r.expires_at ? INK_2 : INK_4 }}>
                  {wiltText(r.expires_at)}
                </span>
                <span style={{ fontSize: 12, color: INK_3 }}>{relTime(r.created_at)}</span>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    color: INK_3,
                    textAlign: "right",
                    fontWeight: 500,
                  }}
                >
                  —
                </span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 11,
            color: INK_4,
          }}
        >
          <span>showing {rows.length} · sorted by newest</span>
          <span style={{ color: PEACH }}>♥ hand-built in tehran</span>
        </div>
      </div>
    </DesktopFrame>
  );
}

function FilterChip({
  label,
  icon,
  active,
  accent = TEAL,
  onClick,
}: {
  label: string;
  icon?: string;
  active: boolean;
  accent?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 12px",
        borderRadius: 999,
        background: active ? TEAL_TINT : "#fff",
        border: `1px solid ${active ? TEAL_BORDER : HAIR}`,
        fontSize: 13,
        fontWeight: 500,
        color: active ? accent : INK_2,
        letterSpacing: -0.1,
        cursor: "pointer",
        fontFamily: SANS,
      }}
    >
      {icon && <Icon d={icon} s={14} c={active ? accent : INK_3} />}
      <span>{label}</span>
    </button>
  );
}

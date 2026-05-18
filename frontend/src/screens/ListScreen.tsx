import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppFrame } from "../components/AppFrame";
import { Icon } from "../components/Icon";
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
  TEAL_TINT,
  WARN,
} from "../theme";
import { ApiError, PasteListItem, Visibility, listPastes } from "../api";
import { useLang, t } from "../i18n";

type Filter = "all" | Visibility;

const FILTERS: Filter[] = ["all", "public", "unlisted", "private"];

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 60_000) return "just now";
  const mins = Math.floor(ms / 60_000);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return days === 1 ? "yesterday" : `${days}d`;
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

export function ListScreen() {
  const nav = useNavigate();
  const lang = useLang();

  const [rows, setRows] = useState<PasteListItem[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await listPastes(
        q.trim() || undefined,
        filter === "all" ? undefined : filter,
      );
      setRows(r);
    } catch (e) {
      setError((e as ApiError)?.message ?? "failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(reload, 200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, filter]);

  return (
    <AppFrame activeTab="list">
      {/* nav */}
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
          padding: "0 20px",
        }}
      >
        <span style={{ fontSize: 17, fontWeight: 600, color: INK, letterSpacing: -0.2 }}>
          {t(lang, "my_pastes")}
        </span>
        <button
          type="button"
          onClick={() => nav("/")}
          style={{
            width: 36, height: 36, borderRadius: 999,
            background: "rgba(255,255,255,0.7)", border: `1px solid ${HAIR}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
          }}
          aria-label="new"
        >
          <Icon d={I.plus} s={20} c={TEAL} />
        </button>
      </div>

      {/* search */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 16,
          right: 16,
          height: 38,
          borderRadius: 12,
          background: "rgba(118,118,128,0.12)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
        }}
      >
        <Icon d={I.search} s={17} c={INK_3} />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t(lang, "search_pastes")}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: 15,
            color: INK,
          }}
        />
      </div>

      {/* segmented */}
      <div
        style={{
          position: "absolute",
          top: 116,
          left: 16,
          right: 16,
          height: 32,
          background: "rgba(118,118,128,0.12)",
          borderRadius: 9,
          padding: 2,
          display: "flex",
          gap: 0,
        }}
      >
        {FILTERS.map((f) => {
          const on = filter === f;
          return (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 500,
                color: on ? INK : INK_3,
                background: on ? "#fff" : "transparent",
                borderRadius: 7,
                boxShadow: on ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                border: "none",
                cursor: "pointer",
                fontFamily: SANS,
              }}
            >
              {t(lang, f as any)}
            </button>
          );
        })}
      </div>

      {/* list */}
      <div
        style={{
          position: "absolute",
          top: 162,
          left: 16,
          right: 16,
          bottom: 90,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {loading && (
          <div style={{ fontFamily: MONO, fontSize: 12, color: INK_3, padding: 20 }}>
            loading…
          </div>
        )}
        {!loading && error && (
          <div style={{ fontFamily: MONO, fontSize: 12, color: "#c0392b", padding: 20 }}>
            {error}
          </div>
        )}
        {!loading && !error && rows.length === 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 16px",
              gap: 10,
              color: INK_3,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32 }}>🍅</div>
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
        {rows.map((r) => {
          const rtl = r.language === "fa";
          return (
            <button
              key={r.slug}
              type="button"
              onClick={() => nav(`/p/${r.slug}`)}
              style={{
                background: CARD,
                borderRadius: 16,
                border: `1px solid ${HAIR}`,
                padding: "12px 14px",
                display: "flex",
                flexDirection: "column",
                gap: 6,
                textAlign: rtl ? "right" : "left",
                cursor: "pointer",
                fontFamily: rtl ? FARSI : SANS,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    color: TEAL,
                    fontWeight: 600,
                    background: TEAL_TINT,
                    padding: "2px 6px",
                    borderRadius: 5,
                  }}
                >
                  /{r.slug}
                </span>
                <span
                  style={{
                    fontSize: 14.5,
                    fontWeight: 600,
                    color: INK,
                    letterSpacing: -0.2,
                    flex: 1,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    direction: rtl ? "rtl" : "ltr",
                  }}
                >
                  {r.title || t(lang, "default_title_placeholder")}
                </span>
                {r.burn_after_read && <Icon d={I.flame} s={13} c={WARN} sw={2} />}
              </div>
              <div
                style={{
                  fontFamily: rtl ? FARSI : MONO,
                  fontSize: 11.5,
                  color: INK_3,
                  direction: rtl ? "rtl" : "ltr",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.snippet}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: INK_4,
                  fontFamily: SANS,
                  direction: "ltr",
                }}
              >
                <span>{r.language}</span>
                <span>·</span>
                <span>{r.visibility}</span>
                <span>·</span>
                <span>wilts {wiltText(r.expires_at)}</span>
                <span style={{ flex: 1 }} />
                <span>{relTime(r.created_at)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </AppFrame>
  );
}

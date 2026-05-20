import { ReactNode } from "react";
import { Icon } from "./Icon";
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
  TEAL_BORDER,
  TEAL_DARK,
  TEAL_TINT,
  WARN,
} from "../theme";
import { ExpiresIn, Visibility } from "../api";
import { Lang, t } from "../i18n";

export type SheetOpts = {
  visibility: Visibility;
  expires: ExpiresIn;
  burn: boolean;
  password: boolean;
};

type Props = {
  opts: SheetOpts;
  onChange: (patch: Partial<SheetOpts>) => void;
  onClose: () => void;
  onPublish: () => void;
  lang: Lang;
};

const EXPIRY_OPTIONS: ExpiresIn[] = ["10m", "1h", "1d", "1w", "never"];
const VIS_OPTIONS: { id: Visibility; icon: string }[] = [
  { id: "public", icon: I.globe },
  { id: "private", icon: I.lock },
];

export function expiryLabel(lang: Lang, e: ExpiresIn): string {
  switch (e) {
    case "10m": return t(lang, "exp_10m");
    case "1h":  return t(lang, "exp_1h");
    case "1d":  return t(lang, "exp_1d");
    case "1w":  return t(lang, "exp_1w");
    case "never": return t(lang, "exp_never");
  }
}

function visDesc(lang: Lang, v: Visibility): string {
  return v === "public" ? t(lang, "desc_public") : t(lang, "desc_private");
}

export function PasteOptionsSheet({ opts, onChange, onClose, onPublish, lang }: Props) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(20,15,12,0.42)",
          zIndex: 100,
          animation: "mp-scrim-in 220ms ease-out both",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: SURFACE,
          borderRadius: "24px 24px 0 0",
          zIndex: 101,
          paddingBottom: 38,
          boxShadow: "0 -20px 60px -20px rgba(80,40,20,0.4)",
          animation: "mp-sheet-in 320ms cubic-bezier(.2,.7,.3,1) both",
          fontFamily: SANS,
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 40, height: 5, borderRadius: 99, background: "rgba(70,40,30,0.18)" }} />
        </div>

        <div style={{ padding: "6px 20px 14px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: INK, letterSpacing: -0.3 }}>
              {t(lang, "options_sheet_title")}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: INK_3, marginTop: 2 }}>
              {t(lang, "options_sheet_sub")}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="close"
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: "none",
              background: "rgba(70,40,30,0.08)",
              color: INK_3,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
          <SheetSection label={t(lang, "sheet_who")}>
            {VIS_OPTIONS.map((o, i) => (
              <SheetRow
                key={o.id}
                icon={o.icon}
                title={t(lang, o.id)}
                detail={visDesc(lang, o.id)}
                selected={opts.visibility === o.id}
                onClick={() => onChange({ visibility: o.id })}
                last={i === VIS_OPTIONS.length - 1}
              />
            ))}
          </SheetSection>

          <SheetSection label={t(lang, "sheet_how_long")}>
            <div style={{ padding: "12px 14px", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {EXPIRY_OPTIONS.map((e) => {
                const active = opts.expires === e;
                const isDefault = e === "1d";
                return (
                  <button
                    type="button"
                    key={e}
                    onClick={() => onChange({ expires: e })}
                    style={{
                      height: 34,
                      padding: "0 14px",
                      borderRadius: 999,
                      background: active ? TEAL_TINT : "#fff",
                      border: `1px solid ${active ? TEAL_BORDER : HAIR}`,
                      fontFamily: SANS,
                      fontSize: 13,
                      fontWeight: 500,
                      color: active ? TEAL : INK_2,
                      letterSpacing: -0.1,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {expiryLabel(lang, e)}
                    {isDefault && !active && (
                      <span
                        style={{
                          fontFamily: MONO,
                          fontSize: 9,
                          color: PEACH,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        {t(lang, "exp_default")}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </SheetSection>

          <SheetSection label={t(lang, "sheet_extras")}>
            <SheetRow
              icon={I.flame}
              title={t(lang, "burn_after_read")}
              detail={t(lang, "desc_burn")}
              accent={WARN}
              toggle
              on={opts.burn}
              onClick={() => onChange({ burn: !opts.burn })}
            />
            <SheetRow
              icon={I.lock}
              title={t(lang, "password")}
              detail={t(lang, "desc_password")}
              toggle
              on={opts.password}
              onClick={() => onChange({ password: !opts.password })}
              last
            />
          </SheetSection>
        </div>

        <div style={{ padding: "16px 16px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={onPublish}
            style={{
              height: 54,
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              background: `linear-gradient(180deg, ${TEAL} 0%, ${TEAL_DARK} 100%)`,
              color: "#fff",
              fontFamily: SANS,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: -0.2,
              boxShadow:
                "0 10px 24px -10px rgba(220,76,62,0.6), inset 0 1px 0 rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <span>{t(lang, "publish")}</span>
            <span style={{ opacity: 0.7, fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>
              {t(lang, opts.visibility)} · {expiryLabel(lang, opts.expires)}
              {opts.burn ? ` · ${t(lang, "burns_label")}` : ""}
            </span>
          </button>
          <div
            style={{
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 10.5,
              color: "rgba(80,55,45,0.55)",
            }}
          >
            🍅 {t(lang, "fresh_tap")}
          </div>
        </div>
      </div>
    </>
  );
}

function SheetSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div
        style={{
          padding: "0 6px 6px",
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
      <div
        style={{
          background: CARD,
          borderRadius: 14,
          border: `1px solid ${HAIR}`,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

type RowProps = {
  icon: string;
  title: string;
  detail?: string;
  selected?: boolean;
  toggle?: boolean;
  on?: boolean;
  accent?: string;
  onClick?: () => void;
  last?: boolean;
};

function SheetRow({
  icon,
  title,
  detail,
  selected = false,
  toggle = false,
  on = false,
  accent = TEAL,
  onClick,
  last = false,
}: RowProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderBottom: last ? "none" : `1px solid ${HAIR}`,
        background: selected ? TEAL_TINT : "transparent",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: selected
            ? accent
            : accent === WARN
              ? "rgba(224,122,60,0.10)"
              : TEAL_TINT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon d={icon} s={16} c={selected ? "#fff" : accent} sw={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: INK, letterSpacing: -0.2 }}>
          {title}
        </div>
        {detail && (
          <div style={{ fontSize: 12, color: INK_3, marginTop: 1 }}>{detail}</div>
        )}
      </div>
      {toggle ? (
        <Toggle on={on} />
      ) : (
        selected && <Icon d={I.check} s={16} c={accent} sw={2.5} />
      )}
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 51,
        height: 31,
        borderRadius: 99,
        background: on ? TEAL : "rgba(120,120,128,0.16)",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background 200ms",
      }}
    >
      <div
        style={{
          width: 27,
          height: 27,
          borderRadius: 99,
          background: "#fff",
          boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
}

import { ReactNode, useRef } from "react";
import { Icon } from "../Icon";
import {
  HAIR,
  INK,
  INK_3,
  INK_4,
  MONO,
  SANS,
  TEAL_BORDER,
  TEAL_DARK,
  WARN,
} from "../../theme";

type Props = {
  label: string;
  icon?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "password";
  suffix?: ReactNode;
  hint?: string;
  error?: boolean;
  autoFocus?: boolean;
  dir?: "ltr" | "rtl";
};

export function AuthField({
  label,
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  suffix,
  hint,
  error = false,
  autoFocus = false,
  dir = "ltr",
}: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const focused = autoFocus;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: MONO,
          fontSize: 10.5,
          color: INK_4,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 48,
          padding: "0 14px",
          borderRadius: 12,
          background: "#fff",
          border: `1.5px solid ${error ? WARN : focused ? TEAL_BORDER : HAIR}`,
          boxShadow: error
            ? "0 0 0 4px rgba(224,122,60,0.10)"
            : focused
              ? "0 0 0 4px rgba(220,76,62,0.08)"
              : "none",
          transition: "border 150ms, box-shadow 150ms",
        }}
      >
        {icon && <Icon d={icon} s={16} c={focused ? TEAL_DARK : INK_3} sw={2} />}
        <input
          ref={ref}
          type={type}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            background: "transparent",
            fontFamily: type === "password" ? MONO : SANS,
            fontSize: type === "password" ? 16 : 15,
            color: INK,
            fontWeight: type === "password" ? 600 : 500,
            letterSpacing: type === "password" && value ? 4 : 0,
          }}
        />
        {suffix}
      </div>
      {hint && (
        <div style={{ fontFamily: MONO, fontSize: 11, color: error ? WARN : INK_4 }}>
          {hint}
        </div>
      )}
    </div>
  );
}

export function PromisesBlock({ promises, label }: { promises: string[]; label: string }) {
  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 11,
        background: "rgba(110,155,86,0.08)",
        border: "1px dashed rgba(110,155,86,0.35)",
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 10,
          color: "#6e9b56",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      {promises.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 7,
            marginTop: i ? 3 : 0,
            fontSize: 12,
            color: "#3a2e28",
            lineHeight: "16px",
          }}
        >
          <span
            style={{
              marginTop: 5,
              width: 5,
              height: 5,
              borderRadius: 1.5,
              background: "#6e9b56",
              transform: "rotate(45deg)",
              flexShrink: 0,
            }}
          />
          <span>{p}</span>
        </div>
      ))}
    </div>
  );
}

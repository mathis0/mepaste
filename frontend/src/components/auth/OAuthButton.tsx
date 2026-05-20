import { HAIR, INK, MONO, SANS } from "../../theme";

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      <path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" fill="#4285F4" />
      <path d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1a5.9 5.9 0 01-5.6-4.1H3.1v2.6A10 10 0 0012 22Z" fill="#34A853" />
      <path d="M6.4 13.9a6 6 0 010-3.8V7.5H3.1a10 10 0 000 9l3.3-2.6Z" fill="#FBBC05" />
      <path d="M12 6c1.5 0 2.9.5 4 1.5l3-3A10 10 0 003.1 7.5l3.3 2.6A5.9 5.9 0 0112 6Z" fill="#EA4335" />
    </svg>
  );
}

function AppleMark({ size = 18, color = "#000" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      <path
        fill={color}
        d="M16.4 12.4c0-2.7 2.2-4 2.3-4.1-1.3-1.8-3.2-2.1-3.9-2.1-1.7-.2-3.2 1-4 1-.8 0-2.1-1-3.5-.9-1.8 0-3.5 1-4.4 2.6-1.9 3.3-.5 8.1 1.3 10.8.9 1.3 2 2.7 3.4 2.7 1.4-.1 1.9-.9 3.5-.9s2.1.9 3.5.8c1.5 0 2.4-1.3 3.3-2.6 1-1.5 1.5-3 1.5-3-.1 0-2.9-1.1-2.9-4.3ZM13.7 4.7C14.4 3.8 14.9 2.6 14.7 1.4c-1 0-2.3.7-3 1.6-.6.8-1.2 2-1 3.2 1.1 0 2.3-.6 3-1.5Z"
      />
    </svg>
  );
}

type Props = {
  provider: "google" | "apple";
  label: string;
  big?: boolean;
  onClick?: () => void;
};

export function OAuthButton({ provider, label, big = false, onClick }: Props) {
  const isApple = provider === "apple";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        height: big ? 54 : 50,
        borderRadius: big ? 14 : 12,
        background: "#fff",
        border: `1px solid ${HAIR}`,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: SANS,
        fontSize: big ? 15 : 14.5,
        fontWeight: 600,
        color: INK,
        letterSpacing: -0.2,
        boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 6px 16px -10px rgba(80,40,20,0.2)",
      }}
    >
      {isApple ? <AppleMark size={18} /> : <GoogleG size={18} />}
      <span>{label}</span>
    </button>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "6px 0" }}>
      <div style={{ flex: 1, height: 1, background: HAIR }} />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 10.5,
          color: "#b4a59c",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: HAIR }} />
    </div>
  );
}

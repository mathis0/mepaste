export function BrandMark({ size = 28 }: { size?: number }) {
  // tomato — round red body, sage-green calyx, tiny stem 🍅
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ display: "block", filter: "drop-shadow(0 3px 6px rgba(220,76,62,0.32))" }}
    >
      <circle cx="16" cy="19.5" r="10.5" fill="#dc4c3e" />
      <path
        d="M22 22a6 6 0 01-9 5"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="12"
        cy="15.5"
        rx="2.6"
        ry="1.6"
        fill="rgba(255,255,255,0.42)"
        transform="rotate(-25 12 15.5)"
      />
      <path
        d="M16 7 L18.6 10.2 L22.6 9.4 L21 13 L24 15 L20.4 16.4 L20.2 19.4 L17 17.6 L16 17 L15 17.6 L11.8 19.4 L11.6 16.4 L8 15 L11 13 L9.4 9.4 L13.4 10.2 Z"
        fill="#6e9b56"
      />
      <path
        d="M16 7 L18.6 10.2 L22.6 9.4 L21 13 L24 15 L20.4 16.4 L20.2 19.4 L17 17.6 L16 17 L15 17.6 L11.8 19.4 L11.6 16.4 L8 15 L11 13 L9.4 9.4 L13.4 10.2 Z"
        fill="rgba(0,0,0,0.08)"
        style={{ mixBlendMode: "multiply" }}
      />
      <rect x="15.2" y="3.5" width="1.8" height="4.5" rx="0.9" fill="#5a8443" />
    </svg>
  );
}

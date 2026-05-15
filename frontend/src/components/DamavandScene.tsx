// Damavand mountain + green prairie, sits behind the composer card.
// Pure SVG, no assets. Copied verbatim from the design bundle.

export function DamavandScene() {
  return (
    <svg
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <defs>
        <linearGradient id="mp-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f9e6d6" />
          <stop offset="40%" stopColor="#fbd6c4" />
          <stop offset="80%" stopColor="#cfd9e4" />
          <stop offset="100%" stopColor="#a8c2d8" />
        </linearGradient>
        <linearGradient id="mp-mtn-far" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5e7da0" />
          <stop offset="100%" stopColor="#42627f" />
        </linearGradient>
        <linearGradient id="mp-mtn" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#6a89ad" />
          <stop offset="60%" stopColor="#4a6480" />
          <stop offset="100%" stopColor="#3a4a64" />
        </linearGradient>
        <linearGradient id="mp-snow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dde6ef" />
        </linearGradient>
        <linearGradient id="mp-prairie" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8eb469" />
          <stop offset="60%" stopColor="#6e9b56" />
          <stop offset="100%" stopColor="#557e42" />
        </linearGradient>
        <linearGradient id="mp-fg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#5e8c47" />
          <stop offset="100%" stopColor="#3f6630" />
        </linearGradient>
      </defs>

      <rect width="390" height="844" fill="url(#mp-sky)" />

      <circle cx="245" cy="295" r="60" fill="#ffd8b4" opacity="0.55" />
      <circle cx="245" cy="295" r="32" fill="#ffe4c8" opacity="0.85" />

      <path
        fill="url(#mp-mtn-far)"
        opacity="0.85"
        d="M0 470 L40 430 L90 450 L140 410 L200 440 L260 405 L320 445 L390 420 L390 540 L0 540 Z"
      />
      <path
        fill="url(#mp-mtn-far)"
        opacity="0.55"
        d="M0 520 L60 480 L130 510 L200 470 L280 505 L350 475 L390 495 L390 580 L0 580 Z"
      />

      <path
        fill="url(#mp-mtn)"
        d="M195 215 L168 280 L150 330 L130 390 L100 470 L60  545 L20  600 L370 600 L335 545 L300 470 L275 390 L255 330 L240 285 L218 240 Z"
      />
      <path
        fill="#2f3f56"
        opacity="0.32"
        d="M218 240 L240 285 L255 330 L275 390 L300 470 L335 545 L370 600 L210 600 L210 250 Z"
      />

      <path
        fill="url(#mp-snow)"
        d="M195 215 L180 248 L168 280 L156 312 L142 332 L150 340 L168 332 L184 340 L200 336 L214 348 L228 340 L242 348 L255 330 L246 312 L234 280 L218 240 Z"
      />
      <path
        fill="#bcc8d5"
        opacity="0.55"
        d="M218 240 L234 280 L246 312 L255 330 L242 348 L228 340 L214 348 L210 340 L210 245 Z"
      />

      <ellipse cx="206" cy="218" rx="11" ry="3.5" fill="#23344c" opacity="0.65" />
      <ellipse cx="206" cy="217" rx="9" ry="2" fill="#1a2438" />

      <g opacity="0.7">
        <ellipse cx="220" cy="200" rx="14" ry="6" fill="#ffffff" opacity="0.6" />
        <ellipse cx="240" cy="184" rx="20" ry="8" fill="#ffffff" opacity="0.45" />
        <ellipse cx="266" cy="170" rx="26" ry="9" fill="#ffffff" opacity="0.3" />
        <ellipse cx="295" cy="160" rx="30" ry="10" fill="#ffffff" opacity="0.18" />
      </g>

      <path
        fill="url(#mp-prairie)"
        d="M0 600 Q 60 575, 130 600 T 270 600 T 390 590 L 390 720 L 0 720 Z"
      />
      <path
        fill="#557e42"
        opacity="0.55"
        d="M0 640 Q 80 615, 160 640 T 320 640 T 390 632 L 390 720 L 0 720 Z"
      />

      <path fill="url(#mp-fg)" d="M0 680 Q 100 660, 200 685 T 390 678 L 390 844 L 0 844 Z" />

      <g stroke="#3a5a28" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
        {Array.from({ length: 26 }).map((_, i) => {
          const x = ((i * 17 + (i % 3) * 7) % 380) + 8;
          const baseY = 700 + ((i * 13) % 120);
          const h = 6 + ((i * 5) % 10);
          const tilt = ((i % 5) - 2) * 1.5;
          return <line key={i} x1={x} y1={baseY} x2={x + tilt} y2={baseY - h} />;
        })}
      </g>

      <g>
        {[[40, 720], [98, 745], [175, 730], [245, 750], [310, 728], [355, 745]].map(
          ([x, y], i) => (
            <g key={i}>
              <line x1={x} y1={y} x2={x} y2={y - 8} stroke="#3f6630" strokeWidth="1.2" />
              <circle cx={x} cy={y - 8} r="2.2" fill="#dc4c3e" />
            </g>
          ),
        )}
      </g>
    </svg>
  );
}

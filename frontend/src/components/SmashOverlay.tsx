// Tomato rain — small spinning tomatoes fall from above and splat on the prairie.
// Copied behaviour from screens.jsx (SmashOverlay + RainingTomato + MiniSplat + FlyingTomatoSVG).

function FlyingTomatoSVG({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{ display: "block" }}>
      <circle cx="16" cy="19.5" r="10.5" fill="#dc4c3e" />
      <path
        d="M22 22a6 6 0 01-9 5"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse
        cx="12"
        cy="15.5"
        rx="2.6"
        ry="1.6"
        fill="rgba(255,255,255,0.5)"
        transform="rotate(-25 12 15.5)"
      />
      <path
        d="M16 7 L18.6 10.2 L22.6 9.4 L21 13 L24 15 L20.4 16.4 L20.2 19.4 L17 17.6 L16 17 L15 17.6 L11.8 19.4 L11.6 16.4 L8 15 L11 13 L9.4 9.4 L13.4 10.2 Z"
        fill="#6e9b56"
      />
      <rect x="15.2" y="3.5" width="1.8" height="4.5" rx="0.9" fill="#5a8443" />
    </svg>
  );
}

type Drop = {
  x: number;
  landY: number;
  delay: number;
  size: number;
  spin: number;
  sway: number;
};

function RainingTomato({ x, landY, delay, size, spin, sway }: Drop) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: -size - 20,
    width: size,
    height: size,
    animation: `mp-rain 900ms cubic-bezier(.5,.05,.9,.6) ${delay}ms forwards`,
    opacity: 0,
    filter: "drop-shadow(0 3px 4px rgba(220,76,62,0.3))",
    pointerEvents: "none",
  };
  // CSS custom properties for keyframe variables
  (style as any)["--landY"] = `${landY + size + 20}px`;
  (style as any)["--spin"] = `${spin}deg`;
  (style as any)["--sway"] = `${sway}px`;
  return (
    <div style={style}>
      <FlyingTomatoSVG size={size} />
    </div>
  );
}

function MiniSplat({ x, y, delay, size }: { x: number; y: number; delay: number; size: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size * 0.55,
        animation: `mp-mini-splat 1100ms cubic-bezier(.2,.7,.3,1) ${delay}ms forwards`,
        transformOrigin: "center bottom",
        opacity: 0,
        pointerEvents: "none",
      }}
    >
      <svg
        viewBox="0 0 60 34"
        width={size}
        height={size * 0.55}
        style={{ overflow: "visible", display: "block" }}
      >
        <circle cx="4" cy="18" r="2.2" fill="#dc4c3e" />
        <circle cx="56" cy="20" r="1.8" fill="#b53a2e" />
        <circle cx="30" cy="2" r="1.6" fill="#dc4c3e" />
        <ellipse cx="30" cy="20" rx="22" ry="10" fill="#dc4c3e" />
        <ellipse cx="30" cy="19" rx="15" ry="6" fill="#a52e25" opacity="0.55" />
        <ellipse cx="24" cy="19" rx="1.6" ry="1" fill="#fef9c3" />
        <ellipse cx="34" cy="22" rx="1.6" ry="1" fill="#fef9c3" />
      </svg>
    </div>
  );
}

export function SmashOverlay() {
  // Drops chosen to look natural; landY values target the prairie band.
  // Container width is 100% — using x in px works because the parent is the screen column.
  const drops: Drop[] = [
    { x: 28,  landY: 612, delay: 0,   size: 26, spin: 320,  sway: 6 },
    { x: 108, landY: 622, delay: 140, size: 22, spin: -280, sway: -4 },
    { x: 196, landY: 608, delay: 80,  size: 28, spin: 400,  sway: 3 },
    { x: 270, landY: 618, delay: 240, size: 24, spin: -340, sway: -5 },
    { x: 68,  landY: 628, delay: 360, size: 20, spin: 300,  sway: 4 },
    { x: 236, landY: 630, delay: 460, size: 22, spin: -360, sway: -3 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 95,
        overflow: "hidden",
      }}
    >
      {drops.map((d, i) => (
        <div key={i}>
          <RainingTomato {...d} />
          <MiniSplat
            x={d.x - 6 + (d.size - 26) / 2}
            y={d.landY + d.size - 6}
            delay={d.delay + 880}
            size={36 + (d.size - 22)}
          />
        </div>
      ))}
    </div>
  );
}

/* Traditional South Indian ornaments, hand-drawn in SVG:
   marigold garlands, kolam corners, kuthu vilakku lamp, lotus divider. */

/* ---------------------------------------------------------------- Garland */

type Strand = { x0: number; x1: number; depth: number; step: number };

function strandPoints({ x0, x1, depth, step }: Strand) {
  const pts: { x: number; y: number; i: number }[] = [];
  const w = x1 - x0;
  const n = Math.max(7, Math.floor(Math.abs(w) / step));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + w * t;
    const y = 2 * (1 - t) * t * depth * 2; // quadratic control = depth*2 → apex = depth
    pts.push({ x, y, i });
  }
  return pts;
}

function Marigold({ x, y, r, tone }: { x: number; y: number; r: number; tone: 0 | 1 }) {
  const petal = tone === 0 ? "#e8890c" : "#f2b705";
  const core = tone === 0 ? "#b45309" : "#e8890c";
  const petals = [];
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2;
    petals.push(
      <circle key={k} cx={x + Math.cos(a) * r * 0.62} cy={y + Math.sin(a) * r * 0.62} r={r * 0.58} fill={petal} />
    );
  }
  return (
    <g>
      {petals}
      <circle cx={x} cy={y} r={r * 0.42} fill={core} />
    </g>
  );
}

export function Garland({ className = "" }: { className?: string }) {
  const strands: Strand[] = [
    { x0: -30, x1: 640, depth: 74, step: 34 },
    { x0: 560, x1: 1230, depth: 96, step: 34 },
    { x0: 210, x1: 990, depth: 52, step: 32 },
  ];
  return (
    <svg
      viewBox="0 0 1200 150"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      {strands.map((s, si) => {
        const midX = (s.x0 + s.x1) / 2;
        return (
          <g key={si} opacity={si === 2 ? 0.9 : 1}>
            <path
              d={`M ${s.x0} -6 Q ${midX} ${s.depth * 2} ${s.x1} -6`}
              fill="none"
              stroke="#5c6b3a"
              strokeWidth={2.4}
              opacity={0.85}
            />
            {strandPoints(s).map((p) =>
              p.i % 5 === 3 ? (
                <ellipse
                  key={p.i}
                  cx={p.x}
                  cy={p.y + 3}
                  rx={3.2}
                  ry={6}
                  fill="#47603b"
                  transform={`rotate(${(p.i % 2 ? -18 : 18) + 0} ${p.x} ${p.y + 3})`}
                />
              ) : (
                <Marigold key={p.i} x={p.x} y={p.y + 4} r={p.i % 2 ? 6.4 : 5.4} tone={p.i % 3 === 0 ? 1 : 0} />
              )
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------- Kolam corner */

export function KolamCorner({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  const dots = [20, 40, 60];
  return (
    <svg
      viewBox="0 0 80 80"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <g stroke="currentColor" fill="none" strokeWidth="1.1">
        <path d="M40 4 L76 40 L40 76 L4 40 Z" />
        <path d="M40 16 L64 40 L40 64 L16 40 Z" opacity={0.7} />
        <circle cx="40" cy="40" r="7" opacity={0.55} />
      </g>
      <g fill="currentColor">
        {dots.flatMap((y) =>
          dots.map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.7} />)
        )}
        <circle cx="40" cy="40" r="2.4" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ Lotus */

export function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 44" className={className} aria-hidden>
      <g fill="currentColor">
        <path d="M36 4 C41.5 13 41.5 22 36 32 C30.5 22 30.5 13 36 4 Z" />
        <path d="M18 10 C26.5 15 31 22 33 32 C24 29 18.5 21 18 10 Z" opacity={0.82} />
        <path d="M54 10 C45.5 15 41 22 39 32 C48 29 53.5 21 54 10 Z" opacity={0.82} />
        <path d="M6 22 C14 24.5 21 29 25 35 C16.5 34.5 9 30 6 22 Z" opacity={0.6} />
        <path d="M66 22 C58 24.5 51 29 47 35 C55.5 34.5 63 30 66 22 Z" opacity={0.6} />
      </g>
      <path d="M14 40 Q36 34 58 40" stroke="currentColor" fill="none" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------------------------------- Kuthu Vilakku */

export function LampVilakku({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 148" className={className} aria-hidden>
      <defs>
        <radialGradient id="flameGlow" cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor="#f2b705" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f2b705" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8a6a24" />
          <stop offset="45%" stopColor="#e9cf87" />
          <stop offset="100%" stopColor="#8a6a24" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="30" r="30" fill="url(#flameGlow)" />
      {/* flame */}
      <path d="M50 12 C56 22 57 30 50 37 C43 30 44 22 50 12 Z" fill="#f2b705" />
      <path d="M50 21 C53 26 53 30 50 33.4 C47 30 47 26 50 21 Z" fill="#fff6d8" />

      {/* top oil cup */}
      <ellipse cx="50" cy="43" rx="24" ry="5.5" fill="url(#brass)" />
      <ellipse cx="50" cy="41.4" rx="18" ry="3.4" fill="#8a6a24" opacity={0.55} />
      {/* stem + tiers */}
      <rect x="46.5" y="48" width="7" height="26" fill="url(#brass)" />
      <ellipse cx="50" cy="76" rx="31" ry="4.6" fill="url(#brass)" />
      <rect x="47.5" y="80" width="5" height="20" fill="url(#brass)" />
      <ellipse cx="50" cy="102" rx="37" ry="5" fill="url(#brass)" />
      <rect x="48" y="106" width="4" height="10" fill="url(#brass)" />
      {/* base */}
      <path d="M34 116 H66 L72 132 H28 Z" fill="url(#brass)" />
      <ellipse cx="50" cy="133" rx="24" ry="4.4" fill="url(#brass)" />
      {/* decorative dots */}
      <g fill="#8a6a24">
        <circle cx="28" cy="42" r="1.6" />
        <circle cx="72" cy="42" r="1.6" />
        <circle cx="19" cy="76" r="1.5" />
        <circle cx="81" cy="76" r="1.5" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------- Divider */

export function OrnateDivider({
  className = "",
  tone = "gold",
}: {
  className?: string;
  tone?: "gold" | "maroon";
}) {
  const line = tone === "gold" ? "bg-gold/60" : "bg-maroon/30";
  const dot = tone === "gold" ? "text-gold" : "text-maroon/60";
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden>
      <span className={`h-px w-16 sm:w-24 ${line}`} />
      <svg viewBox="0 0 20 20" className={`h-3 w-3 ${dot}`}>
        <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="currentColor" opacity={0.85} />
        <circle cx="10" cy="10" r="2.4" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 20 20" className={`h-4 w-4 -rotate-45 ${dot}`}>
        <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="currentColor" opacity={0.55} />
      </svg>
      <svg viewBox="0 0 20 20" className={`h-3 w-3 ${dot}`}>
        <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="currentColor" opacity={0.85} />
        <circle cx="10" cy="10" r="2.4" fill="currentColor" />
      </svg>
      <span className={`h-px w-16 sm:w-24 ${line}`} />
    </div>
  );
}

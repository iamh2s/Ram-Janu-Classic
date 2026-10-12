import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type TargetName = "menu" | "contact" | "music" | "scroll";

type GuideStep = {
  target: TargetName;
  title: string;
  tamilTitle: string;
  message: string;
  tamil: string;
};

type Rect = { x: number; y: number; width: number; height: number };

type Placement = "top" | "bottom" | "left" | "right" | "center";

type Frame = {
  vw: number;
  vh: number;
  target: Rect | null;
  card: Rect | null;
};

type CardLayout = {
  placement: Placement;
  offset: number;
  width: number;
  maxHeight: number;
};

type Arrow = { d: string; ex: number; ey: number; angle: number };

type GuideProps = {
  /** The guide starts counting once this is true. */
  ready?: boolean;
  /** Milliseconds to wait before opening (default 5000). */
  delay?: number;
};

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

const COUPLE = "RAM & JANU";
const OPEN_DELAY = 2000; // ms to wait before the guide opens

const GOLD = "#f8d77e";
const PAD = 8; // breathing room around the highlight
const EDGE = 4; // highlight never gets closer than this to the screen edge
const MARGIN = 14; // minimum distance between the card and the screen edge
const MIN_CARD_HEIGHT = 230;

const DIM = "rgba(15,3,5,.66)";
const SHADOW_ON = `0 0 0 9999px ${DIM}, 0 0 26px rgba(248,215,126,.85)`;
const SHADOW_OFF = `0 0 0 9999px ${DIM}, 0 0 0 rgba(248,215,126,0)`;

/* ------------------------------------------------------------------ */
/* Steps (English + Tamil)                                             */
/* ------------------------------------------------------------------ */

const steps: GuideStep[] = [
  {
    target: "menu",
    title: "Menu",
    tamilTitle: "மெனு",
    message:
      "Tap the menu button at the top left to jump to the invitation, families, events and venue.",
    tamil:
      "மேல் இடதுபுறத்தில் உள்ள மெனு பொத்தானைத் தட்டி அழைப்பு, குடும்பங்கள், நிகழ்வுகள் மற்றும் விழா இடத்திற்குச் செல்லலாம்.",
  },
  {
    target: "contact",
    title: "Contact",
    tamilTitle: "தொடர்பு",
    message:
      "Tap the phone button at the top right for family phone numbers, WhatsApp and venue directions.",
    tamil:
      "மேல் வலதுபுறத்தில் உள்ள தொலைபேசி பொத்தானைத் தட்டி குடும்பத்தினரின் எண்கள், வாட்ஸ்அப் மற்றும் விழா இட வழியைக் காணலாம்.",
  },
  {
    target: "music",
    title: "Wedding Music",
    tamilTitle: "திருமண இசை",
    message:
      "Tap the music button at the bottom right to play or pause the wedding music.",
    tamil:
      "கீழ் வலதுபுறத்தில் உள்ள இசை பொத்தானைத் தட்டி திருமண இசையை இயக்கலாம் அல்லது நிறுத்தலாம்.",
  },
  {
    target: "scroll",
    title: "Scroll Down",
    tamilTitle: "கீழே ஸ்க்ரோல் செய்யுங்கள்",
    message:
      "Scroll down to see our invitation, families, events and the wedding venue.",
    tamil:
      "எங்கள் அழைப்பிதழ், குடும்பங்கள், நிகழ்வுகள் மற்றும் திருமண இடத்தைக் காண கீழே ஸ்க்ரோல் செய்யுங்கள்.",
  },
];

/**
 * Where to find each control. The first selector is an optional marker
 * (data-guide-target="menu" etc.); the others match your real buttons.
 */
const TARGET_SELECTORS: Record<Exclude<TargetName, "scroll">, string[]> = {
  menu: [
    '[data-guide-target="menu"]',
    "button.fab-menu",
    'button[aria-label*="மெனு"]',
  ],
  contact: [
    '[data-guide-target="contact"]',
    "button.fab-contact",
    'button[aria-label*="தொடர்பு"]',
  ],
  music: [
    '[data-guide-target="music"]',
    "button.fab-music",
    'button[aria-label*="இசை"]',
  ],
};

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                    */
/* ------------------------------------------------------------------ */

const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

const round1 = (n: number): number => Math.round(n * 10) / 10;

const near = (a: number, b: number): boolean => Math.abs(a - b) < 0.5;

const sameRect = (a: Rect | null, b: Rect | null): boolean =>
  a === b ||
  (!!a &&
    !!b &&
    near(a.x, b.x) &&
    near(a.y, b.y) &&
    near(a.width, b.width) &&
    near(a.height, b.height));

const toRect = (r: DOMRect): Rect => ({
  x: r.left,
  y: r.top,
  width: r.width,
  height: r.height,
});

function unionRects(rects: Rect[]): Rect {
  const left = Math.min(...rects.map((r) => r.x));
  const top = Math.min(...rects.map((r) => r.y));
  const right = Math.max(...rects.map((r) => r.x + r.width));
  const bottom = Math.max(...rects.map((r) => r.y + r.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

/** Padded highlight box, kept fully inside the screen. */
function spotRect(t: Rect, vw: number, vh: number): Rect {
  const left = Math.max(EDGE, t.x - PAD);
  const top = Math.max(EDGE, t.y - PAD);
  const right = Math.min(vw - EDGE, t.x + t.width + PAD);
  const bottom = Math.min(vh - EDGE, t.y + t.height + PAD);

  return {
    x: left,
    y: top,
    width: Math.max(right - left, 36),
    height: Math.max(bottom - top, 36),
  };
}

/** Measure an element (falls back to its children for `display: contents`). */
function measureElement(
  el: Element,
  vw: number,
  vh: number,
  depth = 0
): Rect | null {
  if (getComputedStyle(el).display === "none") return null;

  const r = el.getBoundingClientRect();
  const hasBox = r.width >= 1 && r.height >= 1;
  const isHuge = r.width > vw * 0.8 && r.height > vh * 0.8;

  if (hasBox && !isHuge) {
    const onScreen = r.right > 0 && r.bottom > 0 && r.left < vw && r.top < vh;
    return onScreen ? toRect(r) : null;
  }

  if (depth >= 4) return null;

  const rects = Array.from(el.children)
    .map((child) => measureElement(child, vw, vh, depth + 1))
    .filter((rect): rect is Rect => rect !== null);

  return rects.length ? unionRects(rects) : null;
}

/** Your round buttons have a small text label underneath: include it. */
function measureWithLabel(node: Element, vw: number, vh: number): Rect | null {
  const rect = measureElement(node, vw, vh);
  if (!rect) return null;

  const label = node.querySelector(".fab-label");
  if (!label) return rect;

  const lr = label.getBoundingClientRect();
  if (lr.width < 1 || lr.height < 1) return rect;

  return unionRects([rect, toRect(lr)]);
}

function locateTarget(
  name: TargetName,
  vw: number,
  vh: number,
  cache: { current: Element | null }
): Rect | null {
  // "scroll" has no element: point at a spot near the bottom of the screen.
  if (name === "scroll") {
    return { x: vw / 2 - 20, y: vh - 150, width: 40, height: 64 };
  }

  if (cache.current && cache.current.isConnected) {
    const cached = measureWithLabel(cache.current, vw, vh);
    if (cached) return cached;
  }
  cache.current = null;

  const selectors = TARGET_SELECTORS[name];

  for (const selector of selectors) {
    let nodes: Element[] = [];
    try {
      nodes = Array.from(document.querySelectorAll(selector));
    } catch {
      continue;
    }

    for (const node of nodes) {
      if (node.closest("[data-wedding-guide]")) continue;
      const rect = measureWithLabel(node, vw, vh);
      if (rect) {
        cache.current = node;
        return rect;
      }
    }
  }

  return null;
}

/**
 * Put the card where it never covers the highlight:
 * above or below it (whichever side has more room), or beside it on
 * short landscape screens. With no highlight the card is centred.
 */
function computeLayout(vw: number, vh: number, target: Rect | null): CardLayout {
  const baseWidth = vw >= 1600 ? 520 : vw >= 1280 ? 490 : 440;
  const width = Math.min(baseWidth, vw - MARGIN * 2);
  const fullHeight = Math.max(vh - MARGIN * 2, 160);

  if (!target) {
    return { placement: "center", offset: 0, width, maxHeight: fullHeight };
  }

  const gap = vw < 640 ? 34 : 48;
  const landscapeShort = vh < 520 && vw > vh * 1.15;

  if (landscapeShort) {
    const w = Math.min(400, vw * 0.46, vw - MARGIN * 2);
    const spaceLeft = target.x - PAD - gap;
    const spaceRight = vw - (target.x + target.width + PAD) - gap;

    if (spaceRight >= spaceLeft) {
      const raw = target.x + target.width + PAD + gap - MARGIN;
      return {
        placement: "right",
        offset: clamp(raw, 0, Math.max(vw - w - MARGIN * 2, 0)),
        width: w,
        maxHeight: fullHeight,
      };
    }

    const raw = vw - (target.x - PAD - gap) - MARGIN;
    return {
      placement: "left",
      offset: clamp(raw, 0, Math.max(vw - w - MARGIN * 2, 0)),
      width: w,
      maxHeight: fullHeight,
    };
  }

  const spaceAbove = target.y - PAD - gap;
  const spaceBelow = vh - (target.y + target.height + PAD) - gap;
  const maxOffset = Math.max(vh - MARGIN * 2 - MIN_CARD_HEIGHT, 0);

  if (spaceBelow >= spaceAbove) {
    const offset = clamp(
      target.y + target.height + PAD + gap - MARGIN,
      0,
      maxOffset
    );
    return {
      placement: "bottom",
      offset,
      width,
      maxHeight: Math.max(vh - offset - MARGIN * 2, MIN_CARD_HEIGHT),
    };
  }

  const offset = clamp(vh - (target.y - PAD - gap) - MARGIN, 0, maxOffset);
  return {
    placement: "top",
    offset,
    width,
    maxHeight: Math.max(vh - offset - MARGIN * 2, MIN_CARD_HEIGHT),
  };
}

/** Curved arrow from the nearest card edge to the highlight box. */
function buildArrow(card: Rect, spot: Rect): Arrow | null {
  const L = spot.x;
  const T = spot.y;
  const R = spot.x + spot.width;
  const B = spot.y + spot.height;

  const cL = card.x;
  const cT = card.y;
  const cR = card.x + card.width;
  const cB = card.y + card.height;

  const INSET = 30;
  const TIP = 5;

  let ux = 0;
  let uy = 0;
  let sx = 0;
  let sy = 0;
  let ex = 0;
  let ey = 0;

  if (T >= cB - 2) {
    uy = 1;
    sx = clamp((L + R) / 2, cL + INSET, cR - INSET);
    sy = cB;
    ex = clamp(sx, L + 10, R - 10);
    ey = T;
  } else if (B <= cT + 2) {
    uy = -1;
    sx = clamp((L + R) / 2, cL + INSET, cR - INSET);
    sy = cT;
    ex = clamp(sx, L + 10, R - 10);
    ey = B;
  } else if (L >= cR - 2) {
    ux = 1;
    sx = cR;
    sy = clamp((T + B) / 2, cT + INSET, cB - INSET);
    ex = L;
    ey = clamp(sy, T + 10, B - 10);
  } else if (R <= cL + 2) {
    ux = -1;
    sx = cL;
    sy = clamp((T + B) / 2, cT + INSET, cB - INSET);
    ex = R;
    ey = clamp(sy, T + 10, B - 10);
  } else {
    return null; // card and highlight overlap: no room for an arrow
  }

  ex -= ux * TIP;
  ey -= uy * TIP;

  const dist = Math.abs((ex - sx) * ux + (ey - sy) * uy);
  if (dist < 14) return null;

  const bend = clamp(dist * 0.45, 22, 120);

  const d = [
    `M ${round1(sx)} ${round1(sy)}`,
    `C ${round1(sx + ux * bend)} ${round1(sy + uy * bend)},`,
    `${round1(ex - ux * bend)} ${round1(ey - uy * bend)},`,
    `${round1(ex)} ${round1(ey)}`,
  ].join(" ");

  return {
    d,
    ex: round1(ex),
    ey: round1(ey),
    angle: (Math.atan2(uy, ux) * 180) / Math.PI,
  };
}

const initialFrame = (): Frame => ({
  vw: typeof window !== "undefined" ? window.innerWidth : 1024,
  vh: typeof window !== "undefined" ? window.innerHeight : 768,
  target: null,
  card: null,
});

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

/**
 * <Guide ready={siteIsVisible} />
 *
 * No storage is used: it shows every time the page loads.
 */
export default function Guide({ ready = true, delay = OPEN_DELAY }: GuideProps) {
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [frame, setFrame] = useState<Frame>(initialFrame);

  const cardRef = useRef<HTMLElement | null>(null);
  const targetCache = useRef<Element | null>(null);

  const finished = step >= steps.length;
  const current = steps[Math.min(step, steps.length - 1)];

  // Open once, after the delay. The guide is mounted only once by App,
  // so this timer runs one time and never starts again.
  useEffect(() => {
    if (!ready) return undefined;

    const timer = window.setTimeout(() => setOpen(true), delay);
    return () => window.clearTimeout(timer);
  }, [ready, delay]);

  const finishGuide = useCallback(() => {
    setLeaving(true);
    window.setTimeout(() => {
      setOpen(false);
      setLeaving(false);
    }, 260);
  }, []);

  const goNext = useCallback(() => {
    setDir(1);
    setStep((s) => Math.min(s + 1, steps.length));
  }, []);

  const goBack = useCallback(() => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  // Keyboard: Esc closes, arrow keys change step
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finishGuide();
      else if (event.key === "ArrowRight") goNext();
      else if (event.key === "ArrowLeft") goBack();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, finishGuide, goNext, goBack]);

  // Track the highlighted button and the card every frame, so everything
  // stays correct on resize, rotation, address-bar changes and page animations.
  useEffect(() => {
    if (!open) return undefined;

    targetCache.current = null;
    let raf = 0;

    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const target = finished
        ? null
        : locateTarget(current.target, vw, vh, targetCache);

      let card: Rect | null = null;
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        if (r.height > 10) card = toRect(r);
      }

      setFrame((prev) => {
        const nextCard = card ?? prev.card;
        if (
          prev.vw === vw &&
          prev.vh === vh &&
          sameRect(prev.target, target) &&
          sameRect(prev.card, nextCard)
        ) {
          return prev;
        }
        return { vw, vh, target, card: nextCard };
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, finished, current.target]);

  // Focus the main button so keyboard users can press Enter
  const focusOnMount = useCallback((el: HTMLButtonElement | null) => {
    if (el) el.focus({ preventScroll: true });
  }, []);

  const layout = useMemo(
    () => computeLayout(frame.vw, frame.vh, finished ? null : frame.target),
    [frame.vw, frame.vh, frame.target, finished]
  );

  const spot = useMemo(
    () =>
      !finished && frame.target
        ? spotRect(frame.target, frame.vw, frame.vh)
        : null,
    [finished, frame.target, frame.vw, frame.vh]
  );

  const arrow = useMemo(
    () => (spot && frame.card ? buildArrow(frame.card, spot) : null),
    [spot, frame.card]
  );

  if (!open || typeof document === "undefined") return null;

  /* Where the card sits on the screen */
  const hostStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    boxSizing: "border-box",
    pointerEvents: "none",
    padding: `max(${MARGIN}px, env(safe-area-inset-top)) max(${MARGIN}px, env(safe-area-inset-right)) max(${MARGIN}px, env(safe-area-inset-bottom)) max(${MARGIN}px, env(safe-area-inset-left))`,
    alignItems:
      layout.placement === "top"
        ? "flex-end"
        : layout.placement === "bottom"
          ? "flex-start"
          : "center",
    justifyContent:
      layout.placement === "right"
        ? "flex-start"
        : layout.placement === "left"
          ? "flex-end"
          : "center",
  };

  const cardStyle: CSSProperties = {
    width: layout.width,
    maxHeight: layout.maxHeight,
    marginTop: layout.placement === "bottom" ? layout.offset : 0,
    marginBottom: layout.placement === "top" ? layout.offset : 0,
    marginLeft: layout.placement === "right" ? layout.offset : 0,
    marginRight: layout.placement === "left" ? layout.offset : 0,
  };

  /* Highlight box. With no target it shrinks to a point and just dims. */
  const spotStyle: CSSProperties = spot
    ? {
        left: spot.x,
        top: spot.y,
        width: spot.width,
        height: spot.height,
        borderColor: GOLD,
        boxShadow: SHADOW_ON,
      }
    : {
        left: frame.vw / 2,
        top: frame.vh / 2,
        width: 0,
        height: 0,
        borderColor: "transparent",
        boxShadow: SHADOW_OFF,
      };

  const progress = finished ? 1 : (step + 1) / steps.length;
  const stepLabel = finished
    ? "Guide complete"
    : `Step ${step + 1} of ${steps.length}`;
  const showScrollLabel = !finished && current.target === "scroll";

  /* Rendered into document.body so `position: fixed` always means the screen */
  return createPortal(
    <div
      className={`wg-root${leaving ? " wg-leave" : ""}`}
      data-wedding-guide=""
    >
      <style>{GUIDE_CSS}</style>

      {/* Highlight */}
      <div className="wg-spot" aria-hidden="true" style={spotStyle}>
        {spot && <span key={step} className="wg-pulse" />}
        {spot && current.target === "scroll" && (
          <div className="wg-mouse">
            <span className="wg-wheel" />
          </div>
        )}
      </div>

      {/* Scroll Down words */}
      {showScrollLabel && (
        <div className="wg-scroll-wrap" aria-hidden="true">
          <div className="wg-scroll-pill">
            <span className="wg-scroll-en">Scroll Down</span>
            <span className="wg-tamil wg-scroll-ta">
              கீழே ஸ்க்ரோல் செய்யுங்கள்
            </span>
          </div>
        </div>
      )}

      {/* Arrow from the card to the highlight */}
      {arrow && (
        <svg className="wg-arrow" aria-hidden="true">
          <g key={`${step}-${layout.placement}`}>
            <path
              d={arrow.d}
              pathLength="1"
              className="wg-arrow-line"
              fill="none"
              stroke={GOLD}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <g
              transform={`translate(${arrow.ex} ${arrow.ey}) rotate(${arrow.angle})`}
            >
              <path
                className="wg-arrow-head"
                d="M 0 0 L -13 -7.5 L -9 0 L -13 7.5 Z"
                fill={GOLD}
              />
            </g>
            <circle className="wg-arrow-dot" r="3.4" fill="#fff6d2">
              <animateMotion
                dur="1.9s"
                repeatCount="indefinite"
                path={arrow.d}
              />
            </circle>
          </g>
        </svg>
      )}

      {/* Guide card */}
      <div style={hostStyle}>
        <section
          ref={cardRef}
          className="wg-card"
          style={cardStyle}
          role="dialog"
          aria-modal="false"
          aria-labelledby="wg-title"
          aria-describedby="wg-desc"
        >
          <div className="wg-inner">
            {/* Header */}
            <div className="wg-hdr">
              <div className="wg-hdr-left">
                <div className="wg-badge">
                  <svg viewBox="0 0 40 40" className="wg-ring" aria-hidden="true">
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke="rgba(217,184,110,.28)"
                      strokeWidth="1.5"
                    />
                    <circle
                      className="wg-ring-fill"
                      cx="20"
                      cy="20"
                      r="18"
                      fill="none"
                      stroke="#f1cf7f"
                      strokeWidth="2"
                      strokeLinecap="round"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset={1 - progress}
                    />
                  </svg>
                  <span key={finished ? "done" : step} className="wg-badge-num">
                    {finished ? <Check size={19} /> : step + 1}
                  </span>
                </div>

                <div className="wg-hdr-text">
                  <div className="wg-eyebrow">{COUPLE} · வழிகாட்டி</div>
                  <div className="wg-step-label">{stepLabel}</div>
                </div>
              </div>

              <button
                type="button"
                className="wg-btn wg-ghost wg-close"
                onClick={finishGuide}
                aria-label="Close guide"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="wg-body" aria-live="polite">
              <div
                key={finished ? "done" : step}
                className="wg-step"
                style={{ "--wg-dir": dir } as CSSProperties}
              >
                {finished ? (
                  <div className="wg-done">
                    <h2 id="wg-title" className="wg-title wg-done-title">
                      You're all set!
                    </h2>
                    <p id="wg-desc" className="wg-text">
                      Enjoy the invitation for Ram &amp; Janu's wedding.
                    </p>
                    <p lang="ta" className="wg-tamil wg-text-ta">
                      தயாராகிவிட்டீர்கள்! ராம் &amp; ஜானு திருமண அழைப்பிதழை
                      ரசித்துப் பாருங்கள்.
                    </p>
                    <div className="wg-done-cta">
                      <button
                        ref={focusOnMount}
                        type="button"
                        className="wg-btn wg-primary wg-full"
                        onClick={finishGuide}
                      >
                        Start Exploring <ChevronRight size={17} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 id="wg-title" className="wg-title">
                      {current.title}
                    </h2>
                    <div lang="ta" className="wg-tamil wg-title-ta">
                      {current.tamilTitle}
                    </div>
                    <div className="wg-rule" />
                    <p id="wg-desc" className="wg-text">
                      {current.message}
                    </p>
                    <p lang="ta" className="wg-tamil wg-text-ta">
                      {current.tamil}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            {!finished && (
              <div className="wg-footer">
                <div className="wg-dots" aria-hidden="true">
                  {steps.map((s, index) => (
                    <span
                      key={s.target}
                      className={`wg-dot${index === step ? " is-on" : ""}${
                        index < step ? " is-done" : ""
                      }`}
                    />
                  ))}
                </div>

                <div className="wg-actions">
                  {step > 0 && (
                    <button
                      type="button"
                      className="wg-btn wg-ghost wg-back"
                      onClick={goBack}
                      aria-label="Previous step"
                    >
                      <ChevronLeft size={17} />
                    </button>
                  )}

                  <button
                    type="button"
                    className="wg-btn wg-ghost"
                    onClick={finishGuide}
                  >
                    Skip
                  </button>

                  <button
                    ref={focusOnMount}
                    type="button"
                    className="wg-btn wg-primary"
                    onClick={goNext}
                  >
                    {step === steps.length - 1 ? "Finish" : "Next"}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/* Styles (self-contained: no Tailwind classes needed)                 */
/* ------------------------------------------------------------------ */

const GUIDE_CSS = `
  .wg-root {
    position: fixed;
    inset: 0;
    z-index: 2147483000;
    pointer-events: none;
    animation: wg-fade .4s ease both;
  }
  .wg-root.wg-leave { animation: wg-fade-out .26s ease forwards; }

  .wg-root, .wg-root * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  .wg-spot {
    position: absolute;
    border: 2px solid transparent;
    border-radius: 18px;
    display: grid;
    place-items: center;
    pointer-events: none;
    transition:
      left .45s cubic-bezier(.22,1,.36,1),
      top .45s cubic-bezier(.22,1,.36,1),
      width .45s cubic-bezier(.22,1,.36,1),
      height .45s cubic-bezier(.22,1,.36,1),
      border-color .3s ease,
      box-shadow .45s ease;
  }

  .wg-pulse {
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    animation: wg-pulse 1.9s ease-out infinite;
  }

  .wg-mouse {
    position: relative;
    width: 26px;
    height: 42px;
    border: 2px solid ${GOLD};
    border-radius: 14px;
  }

  .wg-wheel {
    position: absolute;
    left: 50%;
    top: 7px;
    width: 4px;
    height: 8px;
    margin-left: -2px;
    border-radius: 2px;
    background: ${GOLD};
    animation: wg-wheel 1.5s ease-in-out infinite;
  }

  .wg-scroll-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: max(18px, env(safe-area-inset-bottom));
    display: flex;
    justify-content: center;
    padding: 0 12px;
    pointer-events: none;
    animation: wg-rise .45s .2s ease both;
  }

  .wg-scroll-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 8px 20px;
    text-align: center;
    background: rgba(45, 9, 19, .9);
    border: 1px solid rgba(217, 187, 121, .6);
    border-radius: 999px;
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, .8);
  }

  .wg-scroll-en {
    color: #f6dfa0;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2.4px;
    text-transform: uppercase;
  }

  .wg-scroll-ta {
    color: #fff4dd;
    font-size: 12.5px;
    line-height: 1.5;
  }

  .wg-arrow {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }

  .wg-arrow-line {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    filter: drop-shadow(0 0 5px rgba(248,215,126,.7));
    animation: wg-draw .75s .3s ease-in-out forwards;
  }

  .wg-arrow-head { opacity: 0; animation: wg-fade .2s .95s ease forwards; }
  .wg-arrow-dot {
    opacity: 0;
    filter: drop-shadow(0 0 4px ${GOLD});
    animation: wg-fade .4s 1.15s ease forwards;
  }

  .wg-card {
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    color: #f8ecd1;
    background: linear-gradient(145deg, #48151d, #25090e);
    border: 1px solid #c6a45e;
    border-radius: 18px;
    box-shadow:
      0 18px 55px rgba(0,0,0,.5),
      inset 0 0 0 3px rgba(207,171,97,.08);
    pointer-events: auto;
    animation: wg-card-in .45s cubic-bezier(.22,1,.36,1) both;
  }

  .wg-card::before {
    content: "";
    position: absolute;
    inset: 6px;
    border: 1px solid rgba(223,190,119,.28);
    border-radius: 13px;
    pointer-events: none;
  }

  .wg-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    min-height: 0;
    padding: 22px 22px 18px;
  }

  .wg-hdr {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 16px;
  }

  .wg-hdr-left { display: flex; align-items: center; gap: 11px; min-width: 0; }
  .wg-hdr-text { min-width: 0; }

  .wg-badge {
    position: relative;
    flex: none;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    color: #f6dfa0;
    font-family: Georgia, serif;
    font-size: 16px;
  }

  .wg-ring {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }

  .wg-ring-fill { transition: stroke-dashoffset .5s cubic-bezier(.22,1,.36,1); }

  .wg-badge-num { display: grid; place-items: center; animation: wg-pop .35s ease both; }

  .wg-eyebrow {
    color: #d9b76b;
    font-size: 10px;
    letter-spacing: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .wg-step-label {
    margin-top: 3px;
    color: #f7e7b8;
    font-family: Georgia, serif;
    font-size: 17px;
  }

  .wg-body {
    flex: 0 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: none;
  }
  .wg-body::-webkit-scrollbar { display: none; }

  .wg-step { animation: wg-step-in .35s cubic-bezier(.22,1,.36,1) both; }

  .wg-title {
    margin: 0 0 6px;
    color: #f6dfa0;
    font-family: Georgia, serif;
    font-size: clamp(22px, 5.4vw, 29px);
    font-weight: 500;
    line-height: 1.25;
    overflow-wrap: break-word;
  }

  .wg-done-title { text-align: center; margin: 4px 0 12px; }

  .wg-tamil {
    font-family: "Noto Serif Tamil", "Latha", "Nirmala UI", serif;
    line-height: 1.9;
    overflow-wrap: break-word;
  }

  .wg-title-ta { margin-bottom: 12px; color: #dfbb78; font-size: 15px; }

  .wg-rule {
    height: 1px;
    margin: 0 0 14px;
    background: linear-gradient(90deg, #aa8647, transparent);
    transform-origin: left center;
    animation: wg-rule .55s .1s ease both;
  }

  .wg-text { margin: 0; font-size: 14px; line-height: 1.75; overflow-wrap: break-word; }
  .wg-text-ta { margin: 8px 0 0; color: #e8d3ad; font-size: 14px; }

  .wg-done { text-align: center; }
  .wg-done .wg-text-ta { color: #e8c989; }
  .wg-done-cta { margin-top: 16px; }

  .wg-footer {
    flex: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px 4px 4px;
    margin-top: auto;
  }

  .wg-dots { display: flex; align-items: center; gap: 5px; }
  .wg-dot {
    display: block;
    width: 8px;
    height: 4px;
    border-radius: 10px;
    background: rgba(232,201,137,.3);
    transition: width .3s ease, background-color .3s ease;
  }
  .wg-dot.is-done { background: rgba(232,201,137,.65); }
  .wg-dot.is-on { width: 24px; background: #e9c775; }

  .wg-actions { display: flex; align-items: center; gap: 9px; }

  .wg-btn {
    min-height: 44px;
    padding: 0 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border-radius: 999px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    cursor: pointer;
    touch-action: manipulation;
    transition: transform .2s, box-shadow .25s, background .25s;
  }
  .wg-btn:active { transform: scale(.96); }
  .wg-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(248,215,126,.55); }

  .wg-primary {
    color: #351016;
    background: linear-gradient(135deg, #f8e6a5, #d6ad54);
    border: 1px solid #ffe9ac;
  }

  .wg-ghost {
    color: #f5dda2;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(210,177,106,.55);
  }

  .wg-close { flex: none; width: 40px; min-height: 40px; padding: 0; }
  .wg-back { width: 44px; padding: 0; }
  .wg-full { width: 100%; }

  @media (hover: hover) {
    .wg-primary:hover { box-shadow: 0 6px 22px rgba(248,215,126,.35); transform: translateY(-1px); }
    .wg-ghost:hover { background: rgba(255,255,255,.1); }
  }

  @keyframes wg-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes wg-fade-out { from { opacity: 1; } to { opacity: 0; } }
  @keyframes wg-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
  @keyframes wg-card-in { from { opacity: 0; transform: translateY(14px) scale(.96); } to { opacity: 1; transform: none; } }
  @keyframes wg-step-in { from { opacity: 0; transform: translateX(calc(var(--wg-dir, 1) * 22px)); } to { opacity: 1; transform: none; } }
  @keyframes wg-rule { from { transform: scaleX(0); } to { transform: scaleX(1); } }
  @keyframes wg-pop { from { opacity: 0; transform: scale(.4) rotate(-25deg); } to { opacity: 1; transform: none; } }
  @keyframes wg-draw { to { stroke-dashoffset: 0; } }
  @keyframes wg-wheel { 0%,100% { transform: translateY(0); opacity: 1; } 50% { transform: translateY(14px); opacity: .2; } }
  @keyframes wg-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(248,215,126,.55); }
    100% { box-shadow: 0 0 0 16px rgba(248,215,126,0); }
  }

  /* Phones */
  @media (max-width: 639px) {
    .wg-inner { padding: 18px 16px 14px; }
    .wg-hdr { margin-bottom: 12px; gap: 8px; }
    .wg-hdr-left { gap: 9px; }
    .wg-badge { width: 36px; height: 36px; font-size: 14px; }
    .wg-eyebrow { font-size: 9.5px; letter-spacing: 1.4px; }
    .wg-step-label { font-size: 15px; }
    .wg-title { font-size: 21px; }
    .wg-title-ta { font-size: 14px; }
    .wg-text, .wg-text-ta { font-size: 13.5px; line-height: 1.7; }
  }

  @media (max-width: 400px) {
    .wg-footer { flex-direction: column; align-items: stretch; gap: 12px; padding-top: 14px; }
    .wg-dots { justify-content: center; }
    .wg-actions { width: 100%; gap: 6px; }
    .wg-actions .wg-btn { flex: 1; padding: 0 8px; font-size: 13px; }
    .wg-actions .wg-primary { flex: 1.5; }
    .wg-actions .wg-back { flex: 0 0 40px; padding: 0; }
  }

  @media (max-width: 340px) {
    .wg-eyebrow { font-size: 8.5px; letter-spacing: .8px; }
  }

  /* Phones in landscape and short windows */
  @media (max-height: 560px) {
    .wg-inner { padding: 12px 18px 10px; }
    .wg-hdr { margin-bottom: 8px; }
    .wg-badge { width: 34px; height: 34px; font-size: 14px; }
    .wg-step-label { font-size: 15px; }
    .wg-title { font-size: 20px; }
    .wg-title-ta { margin-bottom: 8px; font-size: 13px; }
    .wg-rule { margin-bottom: 8px; }
    .wg-text, .wg-text-ta { font-size: 13px; line-height: 1.55; }
    .wg-tamil { line-height: 1.6; }
    .wg-footer { flex-direction: row; align-items: center; padding-top: 10px; }
    .wg-btn { min-height: 40px; }
    .wg-done-cta { margin-top: 10px; }
  }

  /* Large desktops and TVs */
  @media (min-width: 1600px) {
    .wg-title { font-size: 33px; }
    .wg-title-ta { font-size: 17px; }
    .wg-text, .wg-text-ta { font-size: 15.5px; }
    .wg-btn { font-size: 15px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .wg-root *, .wg-root *::before, .wg-root *::after {
      animation-duration: .01ms !important;
      animation-delay: 0s !important;
      animation-iteration-count: 1 !important;
      transition: none !important;
    }
  }
`;
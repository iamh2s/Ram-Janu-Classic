import { useRef, useState } from "react";
import gsap from "gsap";
import { Heart } from "lucide-react";
import { Lotus } from "./Ornaments";

export default function Envelope({
  onOpen,
  onGone,
}: {
  onOpen: () => void;
  onGone: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    onOpen(); // gesture → start music + unlock page

    const tl = gsap.timeline({ onComplete: onGone });
    tl.to(hintRef.current, { opacity: 0, y: 10, duration: 0.35, ease: "power2.in" }, 0)
      .to(
        sealRef.current,
        { scale: 1.55, rotate: 18, opacity: 0, duration: 0.55, ease: "power2.in" },
        0.05
      )
      .to(
        coverRef.current,
        { rotationY: -162, duration: 1.25, ease: "power3.inOut" },
        0.55
      )
      .to(
        rootRef.current,
        { opacity: 0, scale: 1.04, duration: 0.85, ease: "power2.out" },
        1.35
      );
  };

  return (
    <div
      ref={rootRef}
      className="persp fixed inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-maroondeep bg-kolam px-6"
    >
      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.5)_100%)]" />

      {/* மூடப்பட்ட அழைப்பிதழ் */}
      <div ref={coverRef} className="card-3d relative w-[min(88vw,380px)]" style={{ transformOrigin: "left center" }}>
        <div className="envelope-card relative border border-gold/70 bg-cream p-2 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.65)]">
          <div className="relative border border-golddeep/40 px-6 pb-20 pt-10 text-center text-inkwine">
            <Lotus className="mx-auto mb-5 h-7 w-12 text-golddeep" />
            <p className="caps text-[0.64rem] text-golddeep">ஓம் ஸ்ரீ கணேசாய நம:</p>

            <h1 className="mt-6 flex flex-wrap items-baseline justify-center gap-x-3 font-script font-semibold leading-tight text-maroon">
              <span className="text-5xl">ராம்</span>
              <span className="font-serif text-lg font-medium italic text-golddeep">மற்றும்</span>
              <span className="text-5xl">ஜானு</span>
            </h1>

            <p className="caps mt-6 text-[0.66rem] text-inkwine/70">
              திருமண அழைப்பிதழ்
            </p>
            <p className="mt-3 font-caps text-sm font-semibold tracking-[0.3em] text-maroonsoft">
              30 · 09 · 2026
            </p>
          </div>

          {/* முத்திரை */}
          <button
            ref={sealRef}
            onClick={handleOpen}
            aria-label="அழைப்பிதழைத் திறக்கவும்"
            className="group absolute -bottom-10 left-1/2 flex h-[5.5rem] w-[5.5rem] -translate-x-1/2 items-center justify-center rounded-full border-2 border-goldlight bg-[radial-gradient(circle_at_35%_30%,#7a1e2d,#440d18)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <span className="absolute inset-0 animate-glow rounded-full border border-gold/50" />
            <span className="absolute inset-[7px] rounded-full border border-goldlight/50" />
            <span className="flex flex-col items-center font-script font-bold text-goldlight">
              <span className="text-sm leading-none tracking-wide">ரா·ஜா</span>
              <Heart className="mt-1.5 h-3 w-3 fill-goldlight/80 text-goldlight/80" />
            </span>
          </button>
        </div>
      </div>

      <p ref={hintRef} className="envelope-hint caps mt-20 text-[0.62rem] text-gold/80">
        — திறக்க முத்திரையைத் தட்டவும் —
      </p>
    </div>
  );
}

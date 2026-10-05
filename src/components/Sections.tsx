import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarHeart,
  ChevronDown,
  Clock3,
  Flower2,
  Heart,
  HeartHandshake,
  MapPin,
  Phone,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Garland, LampVilakku, Lotus, OrnateDivider } from "./Ornaments";

export const WEDDING_DATE = new Date(2026, 8, 30, 9, 0, 0); // 30 செப்டம்பர் 2026 · காலை 9:00

/* ------------------------------------------------------------ petals */

export function Petals({ count = 9, className = "" }: { count?: number; className?: string }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 97) % 100}%`,
        delay: `${(i * 1.7) % 11}s`,
        dur: `${10 + ((i * 2.3) % 7)}s`,
        scale: 0.6 + ((i * 37) % 50) / 100,
      })),
    [count]
  );
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {petals.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 18 12"
          className="animate-petal absolute top-0 h-3 w-5"
          style={{ left: p.left, animationDelay: p.delay, animationDuration: p.dur, transform: `scale(${p.scale})` }}
        >
          <path d="M1 6 C4 -1 14 -1 17 6 C14 13 4 13 1 6 Z" fill="#f6ecd2" opacity="0.85" />
        </svg>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------- countdown */

function diffTo(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
    done: ms === 0,
  };
}

export function Countdown() {
  const [t, setT] = useState(() => diffTo(WEDDING_DATE));
  useEffect(() => {
    const id = window.setInterval(() => setT(diffTo(WEDDING_DATE)), 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { v: t.d, l: "நாள்" },
    { v: t.h, l: "மணி" },
    { v: t.m, l: "நிமிடம்" },
    { v: t.s, l: "வினாடி" },
  ];

  return (
    <div data-hero className="mt-8 flex items-start justify-center gap-3 sm:gap-5">
      {t.done ? (
        <p className="caps text-sm text-goldlight">மங்கல வாழ்வு தொடங்கிவிட்டது · உங்கள் ஆசீர்வாதத்துடன்</p>
      ) : (
        units.map((u) => (
          <div key={u.l} className="flex flex-col items-center">
            <div className="cd-box flex h-14 w-14 items-center justify-center border border-gold/45 bg-maroondeep/50 backdrop-blur-sm sm:h-16 sm:w-16">
              <span className="cd-num font-caps text-xl font-semibold text-goldlight sm:text-2xl">
                {String(u.v).padStart(2, "0")}
              </span>
            </div>
            <span className="cd-label mt-2 font-tamil text-[0.62rem] tracking-wider text-gold/85">{u.l}</span>
          </div>
        ))
      )}
    </div>
  );
}

/* --------------------------------------------------------------- hero */

function Hero() {
  return (
    <section id="home" className="hero-root relative flex min-h-svh flex-col items-center overflow-hidden bg-maroon bg-kolam px-6 pb-16 pt-0">
      <Garland className="hero-garland mask-fade-x pointer-events-none absolute -top-1 left-0 h-24 w-full sm:h-28" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(68,13,24,0.75)_100%)]" />
      <Petals />

      <div className="hero-inner relative z-10 mt-16 flex w-full max-w-3xl flex-col items-center text-center">
        <p data-hero className="mt-4 font-tamil text-[0.72rem] tracking-[0.18em] text-gold/95 sm:text-sm">
          ஓம் ஸ்ரீ கணேசாய நம:
        </p>
        <p data-hero className="caps mt-6 text-[0.72rem] text-cream/80 sm:text-xs">
          திருமண விழா
        </p>

        <h1
          data-hero
          className="mt-4 flex flex-wrap items-baseline justify-center gap-x-5 font-script font-bold leading-tight text-goldlight"
        >
          <span className="text-[clamp(3.2rem,13vw,6.8rem)] [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">ராம்</span>
          <span className="font-serif text-[clamp(1.1rem,4vw,2rem)] font-medium italic text-gold">மற்றும்</span>
          <span className="text-[clamp(3.2rem,13vw,6.8rem)] [text-shadow:0_2px_30px_rgba(0,0,0,0.35)]">ஜானு</span>
        </h1>

        <div data-hero className="relative mt-8">
          <div className="absolute -inset-3 rounded-t-[999px] border border-gold/40" />
          <div className="relative overflow-hidden rounded-t-[999px] border border-goldlight/70 p-2">
            <img
              src="/images/couple.png"
              alt="பாரம்பரிய தென்னிந்திய உடையில் மணமக்கள் — ஓவியம்"
              className="couple-img rounded-t-[999px] object-cover"
            />
          </div>
          <Lotus className="absolute -bottom-4 left-1/2 h-6 w-10 -translate-x-1/2 text-gold" />
        </div>

        <div data-hero className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-tamil text-[0.78rem] tracking-[0.12em] text-cream/90 sm:text-sm">
          <span className="flex items-center gap-2">
            <CalendarHeart className="h-3.5 w-3.5 text-gold" /> புதன்கிழமை
          </span>
          <span className="h-1 w-1 rotate-45 bg-gold" />
          <span>செப்டம்பர் 30 · 2026</span>
          <span className="h-1 w-1 rotate-45 bg-gold" />
          <span className="flex items-center gap-2">
            <Clock3 className="h-3.5 w-3.5 text-gold" /> காலை 9:00 மணி
          </span>
        </div>

        <Countdown />

        <div data-hero className="mt-10 flex flex-col items-center gap-2 font-tamil text-[0.68rem] tracking-[0.2em] text-gold/70">
          <span>ஆசீர்வதிக்க கீழே செல்லவும்</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- invitation */

function Invitation() {
  return (
    <section id="invitation" className="section-pad relative bg-cream bg-kolam-light px-6 py-24 text-inkwine">
      <div className="mx-auto max-w-xl text-center">
        <div data-reveal className="flex items-end justify-center gap-8">
          <div className="animate-sway" style={{ transformOrigin: "50% 0%" }}>
            <LampVilakku className="h-28 w-20 opacity-90" />
          </div>
        </div>
        <p data-reveal className="caps mt-8 text-[0.68rem] text-golddeep">
          திருமண அழைப்பு
        </p>
        <p data-reveal className="mt-6 font-serif text-xl leading-loose text-maroonsoft sm:text-[1.35rem]">
          “பெற்றோர், பெரியோர் மற்றும் குடும்பத் தெய்வங்களின் அருளாசியுடன், எங்கள்
          புனிதத் தாலி கட்டும் திருநாளில் கலந்துகொண்டு, எங்களை ஆசீர்வதித்து
          மகிழ்விக்குமாறு உங்களையும் உங்கள் குடும்பத்தினரையும் அன்புடன்
          வரவேற்கிறோம்.”
        </p>
        <OrnateDivider data-reveal tone="maroon" className="mt-10" />
        <p data-reveal className="mt-6 font-tamil text-[0.78rem] tracking-[0.14em] text-inkwine/60">
          இரு உள்ளங்கள் · ஒரு தாலி · வாழ்நாள் பயணம்
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- families */

function FamilyCard({
  role,
  name,
  parents,
  delay,
}: {
  role: string;
  name: string;
  parents: string;
  delay: number;
}) {
  return (
    <div
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
      className="relative flex-1 border border-golddeep/30 bg-cream/60 px-8 py-12 text-center"
    >
      <Lotus className="mx-auto h-6 w-9 text-golddeep" />
      <p className="caps mt-4 text-[0.62rem] text-golddeep">{role}</p>
      <h3 className="mt-3 font-script text-4xl font-semibold text-maroon">{name}</h3>
      <p className="mt-4 font-serif text-base leading-relaxed text-inkwine/75">{parents}</p>
    </div>
  );
}

function Families() {
  return (
    <section id="families" className="section-pad-b bg-cream bg-kolam-light px-6 pb-24 text-inkwine">
      <div className="mx-auto max-w-3xl">
        <p data-reveal className="caps text-center text-[0.68rem] text-golddeep">
          இரு குடும்பங்களின் ஆசீர்வாதத்துடன்
        </p>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row">
          <FamilyCard
            role="மணமகன்"
            name="ராம்"
            parents="திரு. வெங்கட்ராமன் & திருமதி. பத்மா தம்பதியினரின் அருள் மகன்"
            delay={0}
          />
          <div data-reveal className="flex items-center justify-center" style={{ transitionDelay: "150ms" }}>
            <Heart className="h-6 w-6 fill-maroon text-maroon" />
          </div>
          <FamilyCard
            role="மணமகள்"
            name="ஜானு"
            parents="திரு. சீனிவாசன் & திருமதி. மீனாட்சி தம்பதியினரின் அருள் மகள்"
            delay={200}
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- events */

const EVENTS = [
  {
    icon: Flower2,
    day: "செவ்வாய் · செப் 29",
    time: "மாலை 5:00 மணி முதல்",
    title: "நலங்கு & மருதாணி",
    desc: "மஞ்சள் பூசும் சடங்கு, மருதாணி அலங்காரம், இசை மற்றும் சிரிப்புடன் இரு குடும்பங்களும் இணையும் மகிழ்ச்சியான மாலை நேரம்.",
  },
  {
    icon: HeartHandshake,
    day: "புதன் · செப் 30",
    time: "காலை 9:00 – 10:30 மணி",
    title: "முகூர்த்தம்",
    desc: "அக்னி சாட்சியாகவும் பெரியோர் முன்னிலையிலும், ராம் ஜானுவின் கழுத்தில் புனிதத் தாலி ஏந்தும் தூய்மையான தருணம்.",
  },
  {
    icon: UtensilsCrossed,
    day: "புதன் · செப் 30",
    time: "மாலை 6:30 மணி முதல்",
    title: "வரவேற்பு & விருந்து",
    desc: "மணமக்களை ஆசீர்வதித்து மகிழுங்கள்; வாழையிலையில் பரிமாறப்படும் சிறப்புத் தென்னிந்திய விருந்தில் பங்கேறுங்கள்.",
  },
];

function Events() {
  return (
    <section id="events" className="section-pad relative bg-maroondeep bg-kolam px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p data-reveal className="caps text-[0.68rem] text-gold">
          கொண்டாட்டங்களின் நிகழ்ச்சி நிரல்
        </p>
        <h2 data-reveal className="mt-4 font-script text-4xl font-semibold text-goldlight sm:text-5xl">
          விழா நிகழ்வுகள்
        </h2>
        <OrnateDivider data-reveal className="mt-8" />
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
        {EVENTS.map((e, i) => (
          <div
            key={e.title}
            data-reveal
            style={{ transitionDelay: `${i * 140}ms` }}
            className="group relative border border-gold/30 bg-maroon/40 px-7 py-10 text-center transition-colors duration-500 hover:border-goldlight/70"
          >
            <span className="absolute left-1/2 top-0 h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-gold/70" />
            <e.icon className="mx-auto h-7 w-7 text-goldlight transition-transform duration-500 group-hover:scale-110" />
            <h3 className="mt-5 font-tamil text-base font-semibold tracking-[0.12em] text-cream">{e.title}</h3>
            <p className="caps mt-4 text-[0.6rem] text-gold/90">{e.day}</p>
            <p className="mt-1 font-tamil text-[0.78rem] font-medium tracking-[0.08em] text-cream/85">{e.time}</p>
            <p className="mt-5 font-serif text-[0.98rem] leading-relaxed text-cream/70">{e.desc}</p>
          </div>
        ))}
      </div>

      <p data-reveal className="mx-auto mt-12 max-w-md text-center font-serif text-base leading-relaxed text-cream/70">
        முகூர்த்தத்திற்குச் சற்று முன்னதாகவே வந்தமர அன்புடன் கேட்டுக்கொள்கிறோம் —
        புனிதத் தருணங்கள் மிக விரைவில் கழிந்துவிடும்.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------- venue */

function Venue() {
  return (
    <section id="venue" className="section-pad bg-cream bg-kolam-light px-6 py-24 text-inkwine">
      <div className="mx-auto max-w-xl text-center">
        <MapPin data-reveal className="mx-auto h-8 w-8 text-maroon" />
        <p data-reveal className="caps mt-6 text-[0.68rem] text-golddeep">
          விழா நிகழ்விடம்
        </p>
        <h2 data-reveal className="mt-4 font-tamil text-xl font-bold tracking-[0.06em] text-maroon sm:text-2xl">
          ஸ்ரீ காமாட்சி கல்யாண மண்டபம்
        </h2>
        <p data-reveal className="mt-4 font-serif text-lg leading-relaxed text-inkwine/70">
          எண். 12, வட மாட வீதி, மயிலாப்பூர்,
          <br />
          சென்னை — 600 004
        </p>
        <a
          data-reveal
          href="https://www.google.com/maps/search/?api=1&query=Mylapore+Chennai"
          target="_blank"
          rel="noreferrer"
          className="caps mt-8 inline-block border border-maroon/60 px-8 py-3 text-[0.64rem] text-maroon transition-all duration-500 hover:bg-maroon hover:text-goldlight"
        >
          வரைபடத்தில் காண்க
        </a>
        <p data-reveal className="mt-10 font-tamil text-[0.78rem] leading-loose text-inkwine/55">
          தொடர்பு மற்றும் விவரங்களுக்கு — மேலே வலதுபுறம் உள்ள
          <br />
          “தொடர்பு” பட்டனை அழுத்தவும்
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- footer */

function Footer() {
  return (
    <footer id="credits" className="relative overflow-hidden bg-maroondeep bg-kolam px-6 pb-14 pt-20 text-center">
      <Petals count={5} className="opacity-60" />
      <Lotus className="mx-auto h-7 w-11 text-gold" />
      <p className="mt-6 font-script text-4xl font-semibold leading-tight tracking-wide text-goldlight">
        Ram <span className="font-serif text-xl italic text-gold">&</span> Janu
      </p>
      <p className="caps mt-5 text-[0.64rem] uppercase tracking-[0.22em] text-cream/70">
        30 · 09 · 2026 · We Await Your Presence
      </p>
      <OrnateDivider className="mt-8 opacity-70" />
      <p className="mt-8 font-caps text-[0.7rem] uppercase tracking-[0.24em] text-gold/60">
        With Love — Both Families
      </p>

      {/* developer credit */}
      <div
        data-reveal
        className="relative mx-auto mt-14 max-w-md border border-gold/25 bg-maroon/40 px-6 py-9"
      >
        <span className="absolute left-1/2 top-0 h-px w-20 -translate-x-1/2 -translate-y-1/2 bg-gold/70" />
        <Sparkles className="mx-auto h-5 w-5 text-gold" />
        <p className="caps mt-4 text-[0.58rem] uppercase leading-relaxed tracking-[0.28em] text-gold/85">
          Website Crafted &amp; Developed By
        </p>
        <p className="mt-3 font-script text-3xl font-semibold tracking-wide text-goldlight">
          Hariharasudhan
        </p>
        <p className="mx-auto mt-4 max-w-[36ch] font-serif text-[0.95rem] italic leading-relaxed text-cream/65">
          Designed with creativity, elegance, and love to celebrate this
          beautiful beginning.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://hariharasudhan-portfolio-iota.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="caps flex items-center gap-2 border border-gold/45 px-6 py-2.5 text-[0.58rem] uppercase tracking-[0.18em] text-goldlight transition-all duration-500 hover:bg-gold hover:text-maroondeep"
          >
            View Portfolio <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="tel:+917010458527"
            className="caps flex items-center gap-2 border border-gold/45 px-6 py-2.5 text-[0.58rem] uppercase tracking-[0.18em] text-goldlight transition-all duration-500 hover:bg-gold hover:text-maroondeep"
          >
            <Phone className="h-3.5 w-3.5" /> Call Developer
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------- main */

export default function MainPage() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }),
      { threshold: 0.18 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main>
      <Hero />
      <Invitation />
      <Families />
      <Events />
      <Venue />
      <Footer />
    </main>
  );
}

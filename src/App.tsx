import { useCallback, useEffect, useState } from "react";
import gsap from "gsap";

import Envelope from "./components/Envelope";
import MainPage from "./components/Sections";
import MusicToggle from "./components/MusicToggle";
import SideNav from "./components/SideNav";
import ContactPanel from "./components/ContactPanel";
import Guide from "./components/Guide";
import { KolamCorner } from "./components/Ornaments";

import { weddingMusic } from "./audio/music";

export default function App() {
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  const [playing, setPlaying] = useState(false);

  const [navOpen, setNavOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const anyPanel = navOpen || contactOpen;

  /* =========================================================
     PAGE SCROLL CONTROL
  ========================================================= */

  useEffect(() => {
    document.body.style.overflow =
      opened && !anyPanel ? "auto" : "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [opened, anyPanel]);

  /* =========================================================
     OPEN INVITATION + START MUSIC
  ========================================================= */

  const handleOpen = useCallback(() => {
    setOpened(true);

    weddingMusic
      .start()
      .then(() => {
        setPlaying(true);
      })
      .catch((error) => {
        console.error("Music playback failed:", error);
        setPlaying(false);
      });
  }, []);

  /* =========================================================
     HERO ANIMATION
  ========================================================= */

  useEffect(() => {
    if (!opened) return;

    const tl = gsap.timeline({
      delay: 0.85,
    });

    tl.fromTo(
      "[data-hero]",
      {
        y: 42,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.13,
        ease: "power3.out",
      }
    );

    return () => {
      tl.kill();
    };
  }, [opened]);

  /* =========================================================
     MUSIC TOGGLE
  ========================================================= */

  const toggleMusic = useCallback(() => {
    if (weddingMusic.isPlaying()) {
      weddingMusic.stop();
      setPlaying(false);
      return;
    }

    weddingMusic
      .start()
      .then(() => {
        setPlaying(true);
      })
      .catch((error) => {
        console.error("Music playback failed:", error);
        setPlaying(false);
      });
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-svh bg-maroondeep">

      {/* =====================================================
          MAIN WEBSITE
      ===================================================== */}

      <MainPage />

      {/* =====================================================
          FIXED DECORATIVE FRAME
      ===================================================== */}

      <div
        className="
          site-frame
          pointer-events-none
          fixed
          inset-3
          z-30
          border
          border-gold/35
        "
      >
        <KolamCorner
          className="absolute -left-2 -top-2 h-10 w-10 text-gold/60"
          rotate={0}
        />

        <KolamCorner
          className="absolute -right-2 -top-2 h-10 w-10 text-gold/60"
          rotate={90}
        />

        <KolamCorner
          className="absolute -bottom-2 -right-2 h-10 w-10 text-gold/60"
          rotate={180}
        />

        <KolamCorner
          className="absolute -bottom-2 -left-2 h-10 w-10 text-gold/60"
          rotate={270}
        />
      </div>

      {/* =====================================================
          MUSIC BUTTON
      ===================================================== */}

      <MusicToggle
        playing={playing}
        visible={gone}
        onToggle={toggleMusic}
      />

      {/* =====================================================
          SIDE NAVIGATION
      ===================================================== */}

      <SideNav
        open={navOpen}
        visible={gone && !contactOpen}
        onOpen={() => setNavOpen(true)}
        onClose={() => setNavOpen(false)}
      />

      {/* =====================================================
          CONTACT PANEL
      ===================================================== */}

      <ContactPanel
        open={contactOpen}
        visible={gone && !navOpen}
        onOpen={() => setContactOpen(true)}
        onClose={() => setContactOpen(false)}
      />

      {/* =====================================================
          ENVELOPE / INVITATION OPENING
      ===================================================== */}

      {!gone && (
        <Envelope
          onOpen={handleOpen}
          onGone={() => setGone(true)}
        />
      )}

      {/* =====================================================
          WEBSITE GUIDE
          Mounted once, right after the envelope has gone.
          It opens 5 seconds later and never opens again.
      ===================================================== */}

      {gone && <Guide />}

    </div>
  );
}
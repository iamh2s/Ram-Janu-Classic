import {
  ArrowUpRight,
  Code,
  Home,
  MailOpen,
  MapPin,
  Menu,
  PartyPopper,
  Users,
} from "lucide-react";
import DrawerShell from "./DrawerShell";
import { OrnateDivider } from "./Ornaments";

/* மெனு பட்டன் + இடது பக்கப் பட்டை — பக்கப் பயண இணைப்புகள் மட்டும் */

const NAV_LINKS = [
  { id: "home", label: "முகப்பு", sub: "Home", icon: Home },
  { id: "invitation", label: "அழைப்பு", sub: "Invitation", icon: MailOpen },
  { id: "families", label: "குடும்பங்கள்", sub: "Families", icon: Users },
  { id: "events", label: "நிகழ்வுகள்", sub: "Events", icon: PartyPopper },
  { id: "venue", label: "விழா இடம்", sub: "Venue", icon: MapPin },
  { id: "credits", label: "டெவலப்பர்", sub: "Developer", icon: Code },
];

export default function SideNav({
  open,
  visible,
  onOpen,
  onClose,
}: {
  open: boolean;
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const jump = (id: string) => {
    onClose();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // பட்டை மூடிய பிறகு மென்மையாகச் செல்
    window.setTimeout(() => {
      document
        .getElementById(id)
        ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 400);
  };

  return (
    <>
      {/* மெனு பட்டன் */}
      <button
        onClick={onOpen}
        aria-label="மெனுவைத் திற"
        className={`fab fab-menu fixed left-5 top-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-maroondeep/90 text-goldlight shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-700 ${
          visible && !open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none -translate-x-6 opacity-0"
        }`}
      >
        <Menu className="h-5 w-5" />
        <span className="fab-label absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-tamil text-[0.58rem] tracking-[0.16em] text-gold/70">
          மெனு
        </span>
      </button>

      <DrawerShell
        open={open}
        side="left"
        title="மெனு"
        ariaLabel="பக்க மெனு"
        onClose={onClose}
        footer={
          <>
            <p className="text-center font-tamil text-[0.72rem] tracking-[0.12em] text-gold/70">
              முகூர்த்தம் · புதன் · காலை 9:00
            </p>
            <p className="mt-1.5 text-center font-tamil text-[0.68rem] text-cream/50">
              அனைவரையும் அன்புடன் வரவேற்கிறோம்
            </p>
          </>
        }
      >
        <nav aria-label="பக்கப் பயணம்">
          {NAV_LINKS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => jump(l.id)}
              className="group flex w-full items-center gap-4 border-b border-gold/15 py-4 text-left transition-colors duration-300 hover:border-gold/50"
            >
              <span className="font-caps text-[0.6rem] tracking-[0.2em] text-gold/70 transition-colors group-hover:text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <l.icon className="h-4 w-4 text-gold/80 transition-colors group-hover:text-goldlight" />
              <span className="flex flex-col">
                <span className="font-tamil text-[0.95rem] font-semibold text-cream transition-transform duration-300 group-hover:translate-x-1">
                  {l.label}
                </span>
                <span className="font-caps text-[0.55rem] uppercase tracking-[0.2em] text-cream/40">
                  {l.sub}
                </span>
              </span>
              <ArrowUpRight className="ml-auto h-4 w-4 text-gold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
            </button>
          ))}
        </nav>

        <p className="mt-6 font-serif text-[0.9rem] leading-relaxed text-cream/60">
          தொடர்பு மற்றும் விவரங்களுக்கு — வலது மேல் மூலையிலுள்ள
          “தொடர்பு” பட்டனை அழுத்தவும்.
        </p>

        <OrnateDivider className="mt-8 opacity-50" />
      </DrawerShell>
    </>
  );
}

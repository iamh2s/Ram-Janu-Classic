import { MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import DrawerShell from "./DrawerShell";
import { OrnateDivider } from "./Ornaments";

/* தொடர்பு பட்டன் + வலது பக்கப் பட்டை — தொடர்பு விவரங்கள் மட்டும் */

const FAMILIES = [
  {
    label: "மணமகன் குடும்பம்",
    name: "திரு. வெங்கட்ராமன்",
    phone: "+91 98410 00011",
    tel: "+919841000011",
  },
  {
    label: "மணமகள் குடும்பம்",
    name: "திரு. சீனிவாசன்",
    phone: "+91 98410 00022",
    tel: "+919841000022",
  },
];

export default function ContactPanel({
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
  return (
    <>
      {/* தொடர்பு பட்டன் — மெனு பட்டனுக்குக் கீழே தனியாக */}
      <button
        onClick={onOpen}
        aria-label="தொடர்பு விவரங்களைத் திற"
        className={`fab fab-contact fixed right-5 top-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-maroondeep/90 text-goldlight shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-700 ${
          visible && !open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-6 opacity-0"
        }`}
      >
        <Phone className="h-5 w-5" />
        <span className="fab-label absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-tamil text-[0.58rem] tracking-[0.16em] text-gold/70">
          தொடர்பு
        </span>
      </button>

      <DrawerShell
        open={open}
        side="right"
        title="தொடர்பு விவரம்"
        ariaLabel="தொடர்பு விவரம்"
        onClose={onClose}
        footer={
          <p className="text-center font-tamil text-[0.72rem] tracking-[0.12em] text-gold/70">
            அனைவரையும் அன்புடன் வரவேற்கிறோம்
          </p>
        }
      >
        <p className="font-serif text-[0.95rem] leading-relaxed text-cream/70">
          ஆசீர்வாதங்கள், வருகை உறுதி மற்றும் ஏற்பாடு விவரங்களுக்கு —
          அன்புடன் அழையுங்கள்.
        </p>

        <div className="mt-5 flex flex-col gap-4">
          {FAMILIES.map((f) => (
            <div key={f.label} className="border border-gold/25 bg-maroon/40 p-4">
              <p className="caps text-[0.58rem] text-gold">{f.label}</p>
              <p className="mt-2 font-tamil text-base font-semibold text-cream">{f.name}</p>
              <p className="mt-1 font-caps text-sm tracking-[0.14em] text-cream/85">{f.phone}</p>
              <div className="mt-3 flex gap-2">
                <a
                  href={`tel:${f.tel}`}
                  className="flex flex-1 items-center justify-center gap-2 border border-gold/45 py-2 font-tamil text-[0.72rem] tracking-[0.08em] text-goldlight transition-colors duration-300 hover:bg-gold hover:text-maroondeep"
                >
                  <Phone className="h-3.5 w-3.5" /> அழை
                </a>
                <a
                  href={`https://wa.me/${f.tel.replace("+", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 border border-gold/45 py-2 font-tamil text-[0.72rem] tracking-[0.08em] text-goldlight transition-colors duration-300 hover:bg-gold hover:text-maroondeep"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> செய்தி
                </a>
              </div>
            </div>
          ))}

          <div className="border border-gold/25 bg-maroon/40 p-4">
            <p className="caps flex items-center gap-2 text-[0.58rem] text-gold">
              <MapPin className="h-3 w-3" /> விழா இடம்
            </p>
            <p className="mt-2 font-tamil text-[0.92rem] font-semibold leading-snug text-cream">
              ஸ்ரீ காமாட்சி கல்யாண மண்டபம்
            </p>
            <p className="mt-1 font-serif text-[0.9rem] leading-relaxed text-cream/70">
              எண். 12, வட மாட வீதி, மயிலாப்பூர், சென்னை — 600 004
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Mylapore+Chennai"
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-2 border border-gold/45 py-2 font-tamil text-[0.72rem] tracking-[0.08em] text-goldlight transition-colors duration-300 hover:bg-gold hover:text-maroondeep"
            >
              <Navigation className="h-3.5 w-3.5" /> வழி காண்க
            </a>
          </div>
        </div>

        <OrnateDivider className="mt-8 opacity-50" />
      </DrawerShell>
    </>
  );
}

import { Music, VolumeX } from "lucide-react";

export default function MusicToggle({
  playing,
  visible,
  onToggle,
}: {
  playing: boolean;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={playing ? "இசையை நிறுத்து" : "இசையை இயக்கு"}
      className={`fab fab-music fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-maroondeep/90 shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {playing ? (
        <span className="relative flex h-5 items-end gap-[3px]" aria-hidden>
          <span className="h-5 w-[3px] origin-bottom animate-eq-1 bg-goldlight" />
          <span className="h-5 w-[3px] origin-bottom animate-eq-2 bg-gold" />
          <span className="h-5 w-[3px] origin-bottom animate-eq-3 bg-marigold" />
          <Music className="absolute -right-5 h-4 w-4 text-goldlight/80" />
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-goldlight/90">
          <VolumeX className="h-5 w-5" />
          <Music className="-ml-1 h-4 w-4 opacity-70" />
        </span>
      )}
      <span
        className={`fab-label absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-tamil text-[0.58rem] tracking-[0.16em] ${
          playing ? "text-gold" : "text-gold/60"
        }`}
      >
        {playing ? "இசை ஒலிக்கிறது" : "இசை"}
      </span>
    </button>
  );
}

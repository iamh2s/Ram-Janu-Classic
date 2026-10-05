import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Lotus } from "./Ornaments";

/* பக்கப் பட்டை உறை — இடது / வலது பக்கம் சறுக்கும் அலங்கார drawer */

export default function DrawerShell({
  open,
  side,
  title,
  ariaLabel,
  footer,
  onClose,
  children,
}: {
  open: boolean;
  side: "left" | "right";
  title: string;
  ariaLabel: string;
  footer?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const isLeft = side === "left";

  return (
    <>
      {/* மங்கலான பின்னணி */}
      <div
        onClick={onClose}
        aria-hidden
        className={`fixed inset-0 z-[75] bg-maroondeep/70 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label={ariaLabel}
        className={`drawer-panel fixed top-0 z-[80] flex h-full w-[min(88vw,340px)] flex-col border-gold/40 bg-maroondeep bg-kolam transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
          isLeft ? "left-0 border-r" : "right-0 border-l"
        } ${
          open
            ? isLeft
              ? "translate-x-0 shadow-[30px_0_60px_rgba(0,0,0,0.5)]"
              : "translate-x-0 shadow-[-30px_0_60px_rgba(0,0,0,0.5)]"
            : isLeft
              ? "-translate-x-full"
              : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gold/20 px-6 pb-5 pt-6">
          <div className="flex items-center gap-3">
            <Lotus className="h-5 w-8 text-gold" />
            <h2 className="font-tamil text-base font-semibold tracking-[0.08em] text-cream">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="மூடு"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 text-goldlight transition-colors duration-300 hover:bg-gold hover:text-maroondeep"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && <div className="border-t border-gold/20 px-6 py-5">{footer}</div>}
      </aside>
    </>
  );
}

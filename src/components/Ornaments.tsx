import type { HTMLAttributes } from "react";

type OrnamentProps = HTMLAttributes<HTMLDivElement>;

/* =========================================================
   GARLAND
========================================================= */

export function Garland({
  className = "",
  ...props
}: OrnamentProps) {
  return (
    <div
      className={`pointer-events-none ${className}`}
      {...props}
    >
      <div className="relative h-full w-full">

        {/* Main Garland Curve */}
        <div
          className="
            absolute
            left-[5%]
            right-[5%]
            top-4
            h-20
            rounded-b-[50%]
            border-b-2
            border-gold/60
          "
        />

        {/* Left Flower Group */}
        <div className="absolute left-[8%] top-3 flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-gold" />
          <span className="h-5 w-5 rounded-full bg-goldlight" />
          <span className="h-3 w-3 rounded-full bg-gold" />
        </div>

        {/* Left Hanging Flower */}
        <div className="absolute left-[13%] top-8 h-10 w-px bg-gold/60" />

        {/* Center Flower Group */}
        <div className="absolute left-1/2 top-1 flex -translate-x-1/2 items-center gap-1">
          <span className="h-4 w-4 rounded-full bg-gold" />
          <span className="h-7 w-7 rounded-full border-2 border-gold bg-goldlight/30" />
          <span className="h-4 w-4 rounded-full bg-gold" />
        </div>

        {/* Center Hanging */}
        <div className="absolute left-1/2 top-7 h-12 w-px -translate-x-1/2 bg-gold/60" />

        {/* Right Flower Group */}
        <div className="absolute right-[8%] top-3 flex items-center gap-1">
          <span className="h-3 w-3 rounded-full bg-gold" />
          <span className="h-5 w-5 rounded-full bg-goldlight" />
          <span className="h-3 w-3 rounded-full bg-gold" />
        </div>

        {/* Right Hanging Flower */}
        <div className="absolute right-[13%] top-8 h-10 w-px bg-gold/60" />

        {/* Small Decorative Flowers */}
        <div className="absolute left-[25%] top-12 flex gap-1">
          <span className="h-2 w-2 rounded-full bg-goldlight" />
          <span className="h-3 w-3 rounded-full bg-gold" />
          <span className="h-2 w-2 rounded-full bg-goldlight" />
        </div>

        <div className="absolute right-[25%] top-12 flex gap-1">
          <span className="h-2 w-2 rounded-full bg-goldlight" />
          <span className="h-3 w-3 rounded-full bg-gold" />
          <span className="h-2 w-2 rounded-full bg-goldlight" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   LAMP VILAKKU
========================================================= */

export function LampVilakku({
  className = "",
  ...props
}: OrnamentProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      {...props}
    >
      <div className="relative flex flex-col items-center">

        {/* Flame Glow */}
        <div className="absolute -top-3 h-10 w-10 rounded-full bg-gold/20 blur-xl" />

        {/* Flame */}
        <div
          className="
            relative
            mb-1
            h-7
            w-4
            rounded-full
            bg-goldlight
            shadow-[0_0_18px_rgba(212,175,55,0.8)]
          "
        />

        {/* Wick */}
        <div className="h-2 w-px bg-gold" />

        {/* Lamp Bowl */}
        <div
          className="
            h-5
            w-16
            rounded-b-full
            border-2
            border-gold
            bg-gold/10
          "
        />

        {/* Lamp Stem */}
        <div className="h-4 w-1 bg-gold" />

        {/* Lamp Base */}
        <div className="h-2 w-12 rounded-full bg-gold" />

        {/* Bottom Base */}
        <div className="mt-1 h-1.5 w-16 rounded-full bg-gold/70" />
      </div>
    </div>
  );
}

/* =========================================================
   LOTUS
========================================================= */

export function Lotus({
  className = "",
  ...props
}: OrnamentProps) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      {...props}
    >
      <div className="relative h-16 w-24">

        {/* Center Petal */}
        <span
          className="
            absolute
            left-1/2
            top-0
            h-12
            w-7
            -translate-x-1/2
            rounded-full
            border
            border-gold/50
            bg-maroon/20
          "
        />

        {/* Left Center Petal */}
        <span
          className="
            absolute
            left-[25%]
            top-4
            h-10
            w-7
            -rotate-30
            rounded-full
            border
            border-gold/50
            bg-maroon/20
          "
        />

        {/* Right Center Petal */}
        <span
          className="
            absolute
            right-[25%]
            top-4
            h-10
            w-7
            rotate-30
            rounded-full
            border
            border-gold/50
            bg-maroon/20
          "
        />

        {/* Far Left Petal */}
        <span
          className="
            absolute
            left-1
            top-7
            h-7
            w-7
            -rotate-45
            rounded-full
            border
            border-gold/40
            bg-maroon/10
          "
        />

        {/* Far Right Petal */}
        <span
          className="
            absolute
            right-1
            top-7
            h-7
            w-7
            rotate-45
            rounded-full
            border
            border-gold/40
            bg-maroon/10
          "
        />

        {/* Lotus Base */}
        <div
          className="
            absolute
            bottom-1
            left-1/2
            h-2
            w-16
            -translate-x-1/2
            rounded-full
            bg-gold/50
          "
        />
      </div>
    </div>
  );
}

/* =========================================================
   ORNATE DIVIDER
========================================================= */

export function OrnateDivider({
  className = "",
  ...props
}: OrnamentProps) {
  return (
    <div
      className={`flex w-full items-center justify-center gap-4 ${className}`}
      {...props}
    >

      {/* Left Line */}
      <div
        className="
          h-px
          flex-1
          bg-gradient-to-r
          from-transparent
          via-gold/40
          to-gold
        "
      />

      {/* Center Ornament */}
      <div className="relative flex h-10 w-10 items-center justify-center">

        {/* Outer Circle */}
        <span
          className="
            absolute
            h-9
            w-9
            rounded-full
            border
            border-gold/40
          "
        />

        {/* Inner Diamond */}
        <span
          className="
            absolute
            h-4
            w-4
            rotate-45
            border
            border-gold
            bg-gold/10
          "
        />

        {/* Center Dot */}
        <span className="relative h-1.5 w-1.5 rounded-full bg-gold" />
      </div>

      {/* Right Line */}
      <div
        className="
          h-px
          flex-1
          bg-gradient-to-l
          from-transparent
          via-gold/40
          to-gold
        "
      />
    </div>
  );
}

/* =========================================================
   KOLAM CORNER
========================================================= */

export function KolamCorner({
  className = "",
  ...props
}: OrnamentProps) {
  return (
    <div
      className={`pointer-events-none ${className}`}
      {...props}
    >
      <div className="relative h-28 w-28 opacity-60">

        {/* Horizontal Corner Line */}
        <div className="absolute left-0 top-0 h-px w-24 bg-gold/70" />

        {/* Vertical Corner Line */}
        <div className="absolute left-0 top-0 h-24 w-px bg-gold/70" />

        {/* Decorative Dot 1 */}
        <span
          className="
            absolute
            left-5
            top-5
            h-2
            w-2
            rounded-full
            bg-gold
          "
        />

        {/* Decorative Dot 2 */}
        <span
          className="
            absolute
            left-12
            top-5
            h-2
            w-2
            rounded-full
            bg-gold
          "
        />

        {/* Decorative Dot 3 */}
        <span
          className="
            absolute
            left-5
            top-12
            h-2
            w-2
            rounded-full
            bg-gold
          "
        />

        {/* Decorative Dot 4 */}
        <span
          className="
            absolute
            left-12
            top-12
            h-2
            w-2
            rounded-full
            bg-gold
          "
        />

        {/* Center Diamond */}
        <div
          className="
            absolute
            left-6
            top-6
            h-9
            w-9
            rotate-45
            border
            border-gold/70
          "
        />

        {/* Outer Circle */}
        <div
          className="
            absolute
            left-2
            top-2
            h-6
            w-6
            rounded-full
            border
            border-gold/50
          "
        />

        {/* Upper Decorative Circle */}
        <div
          className="
            absolute
            left-14
            top-2
            h-6
            w-6
            rounded-full
            border
            border-gold/50
          "
        />

        {/* Lower Decorative Circle */}
        <div
          className="
            absolute
            left-2
            top-14
            h-6
            w-6
            rounded-full
            border
            border-gold/50
          "
        />
      </div>
    </div>
  );
}
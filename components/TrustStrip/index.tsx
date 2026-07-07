const ITEMS = [
    "Built for India",
    "DLT & TRAI-ready",
    "Hindi · Hinglish · English",
    "10+ Indic languages",
    "Real phone calls, at scale",
    "Your keys, your data",
];

// Seamless auto-scrolling trust marquee (pauses under reduced-motion via global CSS).
const TrustStrip = () => {
    return (
        <div className="relative overflow-hidden border-y border-n-1/8 bg-n-8/40 py-5">
            <div className="flex w-max animate-marquee gap-12 pr-12">
                {[...ITEMS, ...ITEMS].map((t, i) => (
                    <span
                        key={i}
                        className="flex items-center gap-3 whitespace-nowrap font-code text-sm uppercase tracking-[0.15em] text-n-4"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-color-1/60" />
                        {t}
                    </span>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-n-8 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-n-8 to-transparent" />
        </div>
    );
};

export default TrustStrip;

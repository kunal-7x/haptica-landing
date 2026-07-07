import { DEMO_VIDEO_URL, DEMO_VIDEO_POSTER } from "@/constants/site";

// Product demo video inside a premium glass "app window". The poster paints
// instantly; the video (served from the CDN) autoplays muted + loops inline.
// While DEMO_VIDEO_URL is empty, the poster shows on its own.
export default function HeroVideo() {
    return (
        <div className="relative mx-auto w-full max-w-xl">
            {/* spark glow */}
            <div
                className="pointer-events-none absolute -inset-6 rounded-[2rem] bg-[radial-gradient(circle_at_50%_0%,rgba(255,106,61,0.22),transparent_60%)] blur-2xl"
                aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-n-1/10 bg-n-7/40 shadow-2xl backdrop-blur">
                {/* window chrome */}
                <div className="flex items-center gap-2 border-b border-n-1/10 bg-n-8/60 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-color-1/80" />
                    <span className="h-3 w-3 rounded-full bg-color-2/80" />
                    <span className="h-3 w-3 rounded-full bg-color-4/80" />
                    <span className="ml-3 font-code text-[11px] uppercase tracking-wider text-n-4">
                        Riya · live call
                    </span>
                </div>
                <div className="relative aspect-[16/10] bg-n-8">
                    {DEMO_VIDEO_URL ? (
                        <video
                            className="h-full w-full object-cover"
                            src={DEMO_VIDEO_URL}
                            poster={DEMO_VIDEO_POSTER}
                            autoPlay
                            muted
                            loop
                            playsInline
                            preload="metadata"
                        />
                    ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={DEMO_VIDEO_POSTER}
                            alt="Haptica product demo"
                            className="h-full w-full object-cover"
                        />
                    )}
                </div>
            </div>
            {/* floating proof chip */}
            <div className="absolute -bottom-4 -right-3 hidden items-center gap-2 rounded-xl border border-n-1/10 bg-n-8/80 px-3 py-2 shadow-lg backdrop-blur sm:flex">
                <span className="h-2 w-2 animate-pulse rounded-full bg-color-4" />
                <span className="font-code text-[11px] text-n-2">
                    Site visit booked
                </span>
            </div>
        </div>
    );
}

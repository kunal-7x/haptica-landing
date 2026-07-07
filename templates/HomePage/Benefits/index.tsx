"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import Section from "@/components/Section";
import Heading from "@/components/Heading";
import Image from "@/components/Image";
import SpotlightCard from "@/components/SpotlightCard";
import { benefits } from "@/mocks/benefits";

// per-card spotlight tint (spark palette)
const ACCENTS = [
    "rgba(255,106,61,0.20)",
    "rgba(123,108,255,0.20)",
    "rgba(55,224,168,0.20)",
    "rgba(255,180,67,0.20)",
    "rgba(255,106,61,0.20)",
    "rgba(123,108,255,0.20)",
];

const Arrow = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" className="fill-current">
        <path d="M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414z" />
    </svg>
);

const Benefits = () => {
    const pinRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // Desktop: pin the section and scrub the card row left→right as you scroll,
    // then release and continue the page. Mobile / reduced-motion: the row is a
    // native horizontal swipe (scroll-snap) — no JS motion.
    useGSAP(
        () => {
            const track = trackRef.current;
            const pin = pinRef.current;
            if (!track || !pin) return;

            const mm = gsap.matchMedia();
            mm.add(
                "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
                () => {
                    const distance = () => track.scrollWidth - pin.clientWidth;
                    if (distance() <= 0) return;

                    gsap.to(track, {
                        x: () => -distance(),
                        ease: "none",
                        scrollTrigger: {
                            trigger: pin,
                            start: "top top",
                            end: () => "+=" + distance(),
                            scrub: 1,
                            pin: true,
                            pinType: "fixed",
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });
                }
            );
            return () => mm.revert();
        },
        { scope: pinRef }
    );

    return (
        <Section id="benefits" className="overflow-hidden scroll-mt-24">
            <div className="container relative z-2">
                <Heading
                    className="md:max-w-md lg:max-w-2xl"
                    title="More booked meetings, without hiring more callers"
                />
            </div>

            <div ref={pinRef} className="relative">
                <div
                    ref={trackRef}
                    className="flex gap-5 overflow-x-auto px-5 pb-4 snap-x snap-mandatory [scrollbar-width:none] md:px-10 lg:snap-none lg:overflow-visible lg:px-15 [&::-webkit-scrollbar]:hidden"
                >
                    {benefits.map((item, i) => (
                        <div
                            key={item.id}
                            className="w-[82vw] max-w-[22rem] shrink-0 snap-center sm:w-[22rem] lg:w-[23rem]"
                        >
                            <SpotlightCard
                                className="h-full p-8"
                                spotlight={ACCENTS[i % ACCENTS.length]}
                            >
                                <div className="flex h-full flex-col">
                                    <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-n-7/60">
                                        <Image
                                            src={item.iconUrl}
                                            width={28}
                                            height={28}
                                            alt=""
                                        />
                                    </span>
                                    <h3 className="mb-3 text-xl font-semibold text-n-1">
                                        {item.title}
                                    </h3>
                                    <p className="body-2 mb-8 text-n-3">
                                        {item.text}
                                    </p>
                                    <a
                                        href="#features"
                                        className="mt-auto inline-flex items-center gap-3 font-code text-xs font-bold uppercase tracking-wider text-n-1 transition-colors hover:text-color-1"
                                    >
                                        Explore more
                                        <Arrow />
                                    </a>
                                </div>
                            </SpotlightCard>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Benefits;

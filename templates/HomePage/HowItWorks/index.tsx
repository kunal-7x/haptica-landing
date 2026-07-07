"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import Section from "@/components/Section";

const STEPS = [
    {
        n: "01",
        title: "Bring in your leads",
        text: "Upload a list or connect a form, funnel or webhook. New leads drop straight into the dialer queue.",
        icon: (
            <>
                <path d="M12 3v11" />
                <path d="M8 7l4-4 4 4" />
                <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
            </>
        ),
    },
    {
        n: "02",
        title: "Riya calls & qualifies",
        text: "Within minutes she calls in Hindi, Hinglish or English — pitches, handles objections, and books the meeting.",
        icon: (
            <>
                <path d="M5 4h3l1.8 4.5-2.3 1.4a11 11 0 0 0 5.6 5.6l1.4-2.3L19 16v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
            </>
        ),
    },
    {
        n: "03",
        title: "WhatsApp follows up",
        text: "Brochures, floor plans and reminders go out automatically. No lead is left waiting.",
        icon: (
            <>
                <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.2A8 8 0 1 1 20 11.5z" />
            </>
        ),
    },
    {
        n: "04",
        title: "It all lands in your CRM",
        text: "Every call, recording, outcome and next step is logged and scored — live, as it happens.",
        icon: (
            <>
                <rect x="3" y="4" width="7" height="16" rx="1.5" />
                <rect x="14" y="4" width="7" height="10" rx="1.5" />
            </>
        ),
    },
    {
        n: "05",
        title: "You close warm leads",
        text: "Your team spends its time on qualified, ready-to-talk leads instead of dialing cold lists.",
        icon: (
            <>
                <path d="M6 3h12v4a6 6 0 0 1-12 0z" />
                <path d="M12 13v4M9 21h6M4 5H2v1a3 3 0 0 0 3 3M20 5h2v1a3 3 0 0 1-3 3" />
            </>
        ),
    },
];

const HowItWorks = () => {
    const root = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    useGSAP(
        () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                return;
            if (!window.matchMedia("(min-width: 1024px)").matches) return;

            const panels = gsap.utils.toArray<HTMLElement>(".hiw-step");
            const n = panels.length;
            gsap.set(panels.slice(1), { xPercent: 70, opacity: 0 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: root.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => "+=" + n * window.innerHeight * 0.7,
                    invalidateOnRefresh: true,
                    onUpdate: (self) =>
                        setActive(
                            Math.min(n - 1, Math.floor(self.progress * n))
                        ),
                },
            });
            for (let i = 1; i < n; i++) {
                tl.to(panels[i - 1], {
                    xPercent: -70,
                    opacity: 0,
                    ease: "power2.in",
                }).to(
                    panels[i],
                    { xPercent: 0, opacity: 1, ease: "power2.out" },
                    "<"
                );
            }
        },
        { scope: root }
    );

    return (
        <Section id="how-it-works" customPaddings className="scroll-mt-24">
            {/* Desktop: pinned scroll-scrub */}
            <div
                ref={root}
                className="relative hidden overflow-hidden lg:flex lg:h-screen lg:flex-col lg:justify-center"
            >
                <div className="pointer-events-none absolute left-1/4 top-1/3 h-[30rem] w-[30rem] rounded-full bg-color-3/10 blur-[130px]" aria-hidden />
                <div className="container relative">
                    <div className="mb-10 flex items-end justify-between gap-8">
                        <div>
                            <span className="tagline text-n-3">How it works</span>
                            <h2 className="h2 mt-3 max-w-xl">
                                From raw lead to booked meeting — on autopilot
                            </h2>
                        </div>
                        <div className="flex items-center">
                            {STEPS.map((s, i) => (
                                <div key={s.n} className="flex items-center">
                                    <span
                                        className={`flex h-10 w-10 items-center justify-center rounded-full font-code text-sm font-bold transition-all duration-500 ${
                                            i <= active
                                                ? "bg-gradient-to-br from-color-1 to-color-2 text-n-8"
                                                : "bg-n-7 text-n-4"
                                        }`}
                                    >
                                        {s.n}
                                    </span>
                                    {i < STEPS.length - 1 && (
                                        <span
                                            className={`h-px w-7 transition-colors duration-500 ${
                                                i < active ? "bg-color-1" : "bg-n-6"
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[24rem]">
                        {STEPS.map((s) => (
                            <div
                                key={s.n}
                                className="hiw-step absolute inset-0 will-change-transform"
                            >
                                <div className="glass grid h-full items-center gap-8 rounded-[1.75rem] p-10 md:grid-cols-[1.1fr_1fr]">
                                    <div>
                                        <span className="bg-gradient-to-br from-color-1 to-color-2 bg-clip-text font-display text-6xl font-bold text-transparent">
                                            {s.n}
                                        </span>
                                        <h3 className="mt-4 font-display text-3xl font-semibold text-n-1">
                                            {s.title}
                                        </h3>
                                        <p className="body-1 mt-4 max-w-md text-n-3">
                                            {s.text}
                                        </p>
                                    </div>
                                    <div className="relative flex items-center justify-center">
                                        <div className="absolute h-52 w-52 rounded-full bg-gradient-to-br from-color-1/20 to-color-2/10 blur-2xl" aria-hidden />
                                        <div className="relative flex h-40 w-40 items-center justify-center rounded-[2rem] border border-n-1/10 bg-n-8/60">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-16 w-16 text-color-1"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                {s.icon}
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile / reduced-motion: clean vertical steps */}
            <div className="container py-16 lg:hidden">
                <div className="mb-10 text-center">
                    <span className="tagline text-n-3">How it works</span>
                    <h2 className="h2 mt-3">
                        From raw lead to booked meeting — on autopilot
                    </h2>
                </div>
                <ol className="space-y-4">
                    {STEPS.map((s) => (
                        <li
                            key={s.n}
                            className="glass flex gap-4 rounded-2xl p-5"
                        >
                            <span className="bg-gradient-to-br from-color-1 to-color-2 bg-clip-text font-display text-2xl font-bold text-transparent">
                                {s.n}
                            </span>
                            <div>
                                <h3 className="text-lg font-semibold text-n-1">
                                    {s.title}
                                </h3>
                                <p className="body-2 mt-1 text-n-3">{s.text}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </Section>
    );
};

export default HowItWorks;

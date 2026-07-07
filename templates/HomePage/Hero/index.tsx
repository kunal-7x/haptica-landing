"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";
import Section from "@/components/Section";
import MagneticButton from "@/components/MagneticButton";
import { HapticMark } from "@/components/Logo";
import { useDemo } from "@/components/DemoModal";

const HEAD = ["The", "AI", "telecaller", "that", "calls", "your", "leads", "and"];

const Hero = () => {
    const root = useRef<HTMLDivElement>(null);
    const win = useRef<HTMLDivElement>(null);
    const { open } = useDemo();

    useGSAP(
        () => {
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                return;

            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            tl.from(".hero-eyebrow", { opacity: 0, y: 16, duration: 0.6 })
                .from(
                    ".hero-word",
                    {
                        opacity: 0,
                        y: 30,
                        rotateX: -35,
                        stagger: 0.04,
                        duration: 0.8,
                    },
                    "-=0.2"
                )
                .from(".hero-sub", { opacity: 0, y: 18, duration: 0.7 }, "-=0.5")
                .from(
                    ".hero-cta",
                    { opacity: 0, y: 16, stagger: 0.08, duration: 0.6 },
                    "-=0.4"
                )
                .from(
                    ".hero-window",
                    { opacity: 0, y: 60, scale: 0.96, duration: 1.1 },
                    "-=0.6"
                )
                .from(
                    ".hero-float",
                    {
                        opacity: 0,
                        y: 24,
                        scale: 0.9,
                        stagger: 0.12,
                        duration: 0.7,
                    },
                    "-=0.7"
                );

            // scroll parallax on the window wrapper
            gsap.to(".hero-window", {
                yPercent: -7,
                ease: "none",
                scrollTrigger: {
                    trigger: root.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // mouse parallax: tilt the window, drift the floating chips
            const el = win.current;
            const rx = gsap.quickTo(el, "rotationX", {
                duration: 0.6,
                ease: "power3.out",
            });
            const ry = gsap.quickTo(el, "rotationY", {
                duration: 0.6,
                ease: "power3.out",
            });
            const floats = gsap.utils.toArray<HTMLElement>(".hero-float");
            const onMove = (e: MouseEvent) => {
                const nx = e.clientX / window.innerWidth - 0.5;
                const ny = e.clientY / window.innerHeight - 0.5;
                rx(-ny * 5);
                ry(nx * 7);
                floats.forEach((f, i) => {
                    const d = (i + 1) * 9;
                    gsap.to(f, {
                        x: nx * d,
                        y: ny * d,
                        duration: 0.7,
                        ease: "power3.out",
                    });
                });
            };
            window.addEventListener("mousemove", onMove);
            return () => window.removeEventListener("mousemove", onMove);
        },
        { scope: root }
    );

    return (
        <Section
            customPaddings
            className="relative -mt-[4.75rem] overflow-hidden pt-[7rem] pb-16 lg:-mt-[5.25rem] lg:pt-[9.5rem] lg:pb-24"
        >
            {/* ambient cinematic field */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="animate-blob absolute -top-40 left-1/4 h-[38rem] w-[38rem] rounded-full bg-color-1/20 blur-[130px]" />
                <div
                    className="animate-blob absolute top-24 right-0 h-[32rem] w-[32rem] rounded-full bg-color-3/20 blur-[130px]"
                    style={{ animationDelay: "-7s" }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,transparent_38%,#0B0914_78%)]" />
                <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:56px_56px]" />
            </div>

            <div ref={root} className="container relative z-1">
                {/* headline block */}
                <div className="mx-auto max-w-4xl text-center">
                    <span className="hero-eyebrow tagline mb-6 inline-flex items-center gap-2 rounded-full border border-n-1/10 bg-n-7/50 px-4 py-1.5 text-n-2 backdrop-blur">
                        <span className="h-2 w-2 animate-pulse rounded-full bg-color-1" />
                        AI Voice Telecaller · WhatsApp · CRM
                    </span>
                    <h1 className="h1 mx-auto max-w-4xl [perspective:800px]">
                        {HEAD.map((w, i) => (
                            <span key={i} className="hero-word mr-[0.26em] inline-block">
                                {w}
                            </span>
                        ))}
                        <span className="hero-word inline-block bg-gradient-to-r from-color-1 via-color-2 to-color-1 bg-clip-text text-transparent">
                            books the meeting.
                        </span>
                    </h1>
                    <p className="hero-sub body-1 mx-auto mt-7 max-w-2xl text-n-3">
                        Haptica AI dials every new lead in minutes, qualifies them
                        in natural Hindi, Hinglish or English, follows up on
                        WhatsApp, and logs it all to your CRM —{" "}
                        <span className="text-n-1">
                            one console for your entire sales floor.
                        </span>
                    </p>
                    <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <MagneticButton className="hero-cta">
                            <button
                                onClick={open}
                                className="button group relative flex h-14 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-color-1 to-color-2 px-8 text-n-8 shadow-[0_0_44px_-8px_rgba(255,106,61,0.65)]"
                            >
                                <span className="relative z-1">Book a demo</span>
                                <span
                                    className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)] transition-transform duration-700 group-hover:translate-x-full"
                                    aria-hidden
                                />
                            </button>
                        </MagneticButton>
                        <a
                            href="#product"
                            className="hero-cta button flex h-14 items-center gap-2 rounded-full border border-n-1/15 px-7 text-n-1 transition-colors hover:border-n-1/40"
                        >
                            See it live
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </a>
                    </div>
                    <p className="hero-cta mt-6 font-code text-xs uppercase tracking-[0.15em] text-n-4">
                        Built for India · DLT &amp; TRAI-ready · 10+ languages
                    </p>
                </div>

                {/* dashboard window */}
                <div className="hero-window relative mx-auto mt-14 max-w-5xl [perspective:1600px] lg:mt-20">
                    {/* floating chips */}
                    <div className="hero-float animate-floaty absolute -left-3 top-14 z-3 hidden w-[15rem] sm:block xl:-left-16">
                        <div className="glass flex items-center gap-3 rounded-2xl p-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-color-1 to-color-2">
                                <HapticMark className="h-4 w-4 text-n-8" />
                            </span>
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5 font-code text-[0.625rem] uppercase tracking-widest text-color-4">
                                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-color-4" />
                                    Live · Riya
                                </div>
                                <div className="mt-1 flex items-end gap-[2px]">
                                    {[7, 12, 9, 15, 8, 13, 6].map((h, i) => (
                                        <span
                                            key={i}
                                            className="w-[3px] rounded-full bg-gradient-to-t from-color-1/40 to-color-2"
                                            style={{ height: h }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <span className="ml-auto font-code text-xs tabular-nums text-n-2">02:14</span>
                        </div>
                    </div>

                    <div className="hero-float animate-floaty absolute -right-3 top-1/3 z-3 hidden w-[14rem] sm:block xl:-right-14" style={{ animationDelay: "-2s" }}>
                        <div className="glass flex items-center gap-2.5 rounded-2xl p-3">
                            <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-color-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                                <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="text-[0.8125rem] leading-tight text-n-1">
                                <span className="font-semibold">Site visit booked</span>
                                <div className="text-n-3">Saturday · 4:00 PM</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-float animate-floaty absolute -bottom-5 left-6 z-3 hidden w-[15rem] md:block" style={{ animationDelay: "-4s" }}>
                        <div className="glass flex items-center gap-3 rounded-2xl p-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-color-4/15">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 text-color-4" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.6 4.7-1.2A10 10 0 1 0 12 2z" opacity=".25"/><path d="M12 4a8 8 0 0 0-6.9 12l-.8 2.9 3-.8A8 8 0 1 0 12 4z"/></svg>
                            </span>
                            <div className="text-[0.8125rem] leading-tight text-n-1">
                                <span className="font-semibold">Floor plan sent</span>
                                <div className="font-code text-[0.625rem] uppercase tracking-widest text-color-4">Delivered ✓</div>
                            </div>
                        </div>
                    </div>

                    {/* window */}
                    <div
                        ref={win}
                        className="relative rounded-2xl border border-n-1/10 bg-n-7/40 p-1.5 shadow-2xl backdrop-blur will-change-transform [transform-style:preserve-3d]"
                    >
                        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-color-1/40 via-color-3/30 to-color-2/40 opacity-60 blur-xl" aria-hidden />
                        <div className="relative">
                            <div className="flex items-center gap-2 px-3 py-2.5">
                                <span className="flex gap-1.5">
                                    <span className="h-2.5 w-2.5 rounded-full bg-n-5" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-n-5" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-n-5" />
                                </span>
                                <div className="ml-3 flex h-6 items-center rounded-md bg-n-8/60 px-3 font-code text-[0.625rem] text-n-4">
                                    haptica.famit.in
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-n-1/10">
                                <Image
                                    src="/images/product/dashboard.png"
                                    width={1520}
                                    height={655}
                                    alt="Haptica AI dashboard — live call analytics, connect rate and trends"
                                    priority
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Hero;

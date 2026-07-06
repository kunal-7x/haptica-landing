"use client";

import { useEffect, useState } from "react";
import { HapticMark } from "@/components/Logo";

// ── The signature element ───────────────────────────────────────────────
// A live AI sales call, in progress: an animated voice waveform + a
// streaming Hinglish transcript of "Riya" qualifying a lead and booking a
// site visit, with a live call HUD. Self-contained; respects reduced-motion.

type Line = { who: "riya" | "lead"; text: string };

const SCRIPT: Line[] = [
    {
        who: "riya",
        text: "Namaste! Riya bol rahi hoon, Sunrise Estates se. Do minute baat kar sakte hain?",
    },
    { who: "lead", text: "Haan boliye, thoda busy hoon abhi." },
    {
        who: "riya",
        text: "Bilkul. Aapne 3 BHK ke liye enquiry ki thi — ready-to-move, river-facing. Weekend site visit set karun?",
    },
    { who: "lead", text: "Saturday shaam ko ho sakta hai?" },
    {
        who: "riya",
        text: "Perfect — Saturday 4 PM block kar diya. Location aur floor plan abhi WhatsApp par bhej rahi hoon.",
    },
];

// deterministic waveform bar heights (no random → SSR-stable, no hydration drift)
const BARS = Array.from({ length: 32 }, (_, i) =>
    28 + Math.round(60 * Math.abs(Math.sin(i * 0.7 + 0.5)))
);

export default function LiveCallConsole() {
    const [mounted, setMounted] = useState(false);
    const [reduce, setReduce] = useState(false);
    const [visible, setVisible] = useState(1); // line 1 shown in full → SSR-safe
    const [typed, setTyped] = useState("");
    const [seconds, setSeconds] = useState(72);

    useEffect(() => {
        const r =
            typeof window !== "undefined" &&
            !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        setReduce(r);
        if (r) setVisible(SCRIPT.length);
        setMounted(true);
    }, []);

    // live call timer
    useEffect(() => {
        if (!mounted || reduce) return;
        const t = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, [mounted, reduce]);

    // advance + typewriter the newest line (lines 2..n)
    useEffect(() => {
        if (!mounted || reduce) return;
        if (visible < 2) {
            const start = setTimeout(() => setVisible(2), 1200);
            return () => clearTimeout(start);
        }
        const line = SCRIPT[visible - 1];
        if (!line) return;
        setTyped("");
        let i = 0;
        let advance: ReturnType<typeof setTimeout>;
        const typer = setInterval(() => {
            i += 1;
            setTyped(line.text.slice(0, i));
            if (i >= line.text.length) {
                clearInterval(typer);
                if (visible < SCRIPT.length) {
                    advance = setTimeout(() => setVisible((v) => v + 1), 1100);
                }
            }
        }, 26);
        return () => {
            clearInterval(typer);
            clearTimeout(advance);
        };
    }, [mounted, reduce, visible]);

    const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
        seconds % 60
    ).padStart(2, "0")}`;
    const booked = visible >= SCRIPT.length;

    return (
        <div className="relative mx-auto w-full max-w-[30rem]">
            <div className="hc-glow" aria-hidden />
            <div className="relative z-1 rounded-[1.5rem] p-[1.5px] bg-conic-gradient shadow-2xl">
                <div className="rounded-[1.4rem] bg-n-8/95 backdrop-blur-xl overflow-hidden">
                    {/* HUD */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-n-1/10">
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-color-1 to-color-2">
                            <HapticMark className="w-4 h-4 text-n-8" />
                        </span>
                        <div className="flex flex-col leading-tight">
                            <span className="font-display text-sm font-semibold text-n-1">
                                Riya
                            </span>
                            <span className="font-code text-[0.625rem] uppercase tracking-[0.15em] text-n-4">
                                AI Telecaller
                            </span>
                        </div>
                        <div className="ml-auto flex items-center gap-3">
                            <span className="flex items-center gap-1.5 font-code text-[0.625rem] uppercase tracking-[0.15em] text-color-4">
                                <span className="hc-live w-1.5 h-1.5 rounded-full bg-color-4" />
                                Live
                            </span>
                            <span className="font-code text-xs text-n-2 tabular-nums">
                                {mounted ? mmss : "01:12"}
                            </span>
                        </div>
                    </div>

                    {/* voice waveform — the signature motion */}
                    <div
                        className="flex items-center justify-center gap-[3px] px-5 h-14"
                        aria-hidden
                    >
                        {BARS.map((h, i) => (
                            <span
                                key={i}
                                className="hc-bar w-[3px] rounded-full bg-gradient-to-t from-color-1/30 to-color-2"
                                style={{
                                    height: `${h}%`,
                                    animationDelay: `${(i % 16) * 70}ms`,
                                }}
                            />
                        ))}
                    </div>

                    {/* streaming transcript */}
                    <div className="px-5 pb-4 space-y-2.5 min-h-[10.5rem]">
                        {SCRIPT.slice(0, visible).map((line, idx) => {
                            const isActive = idx === visible - 1;
                            const isRiya = line.who === "riya";
                            const text =
                                isActive && visible > 1 && !reduce
                                    ? typed
                                    : line.text;
                            return (
                                <div
                                    key={idx}
                                    className={`flex ${
                                        isRiya ? "justify-start" : "justify-end"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[86%] rounded-2xl px-3.5 py-2 text-[0.8125rem] leading-relaxed ${
                                            isRiya
                                                ? "bg-n-6/60 text-n-1 rounded-tl-sm"
                                                : "bg-color-3/15 text-n-1 rounded-tr-sm border border-color-3/25"
                                        }`}
                                    >
                                        <span
                                            className={`mb-0.5 block font-code text-[0.5625rem] uppercase tracking-[0.15em] ${
                                                isRiya
                                                    ? "text-color-1"
                                                    : "text-color-3"
                                            }`}
                                        >
                                            {isRiya ? "Riya" : "Lead · Rohan"}
                                        </span>
                                        {text}
                                        {isActive && visible > 1 && !reduce && (
                                            <span className="hc-caret text-color-1">
                                                ▍
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* outcome */}
                    <div
                        className={`px-5 pb-5 transition-all duration-700 ${
                            booked
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-2 pointer-events-none"
                        }`}
                    >
                        <div className="flex items-center gap-2.5 rounded-xl border border-color-4/25 bg-color-4/10 px-3.5 py-2.5">
                            <svg
                                viewBox="0 0 20 20"
                                className="w-4 h-4 shrink-0 text-color-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                            >
                                <path
                                    d="M4 10.5l4 4 8-9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="text-[0.8125rem] text-n-1">
                                <span className="font-semibold">
                                    Site visit booked
                                </span>{" "}
                                · Saturday, 4:00 PM
                            </span>
                            <span className="ml-auto font-code text-[0.5625rem] uppercase tracking-[0.15em] text-color-4">
                                Synced to CRM
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .hc-glow {
                    position: absolute;
                    inset: -16% -10% -20% -10%;
                    background: radial-gradient(
                            58% 50% at 50% 28%,
                            rgba(255, 106, 61, 0.28),
                            transparent 70%
                        ),
                        radial-gradient(
                            45% 45% at 72% 82%,
                            rgba(123, 108, 255, 0.22),
                            transparent 70%
                        );
                    filter: blur(30px);
                    z-index: 0;
                    pointer-events: none;
                }
                .hc-bar {
                    transform-origin: center;
                    animation: hc-wave 1.2s ease-in-out infinite alternate;
                }
                @keyframes hc-wave {
                    0% {
                        transform: scaleY(0.32);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scaleY(1);
                        opacity: 1;
                    }
                }
                .hc-live {
                    animation: hc-pulse 1.5s ease-in-out infinite;
                }
                @keyframes hc-pulse {
                    0%,
                    100% {
                        opacity: 1;
                        box-shadow: 0 0 0 0 rgba(55, 224, 168, 0.55);
                    }
                    50% {
                        opacity: 0.5;
                        box-shadow: 0 0 0 5px rgba(55, 224, 168, 0);
                    }
                }
                .hc-caret {
                    display: inline-block;
                    margin-left: 1px;
                    animation: hc-blink 1s steps(2, start) infinite;
                }
                @keyframes hc-blink {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0;
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .hc-bar,
                    .hc-live,
                    .hc-caret {
                        animation: none !important;
                    }
                    .hc-bar {
                        transform: scaleY(0.75);
                        opacity: 0.85;
                    }
                }
            `}</style>
        </div>
    );
}

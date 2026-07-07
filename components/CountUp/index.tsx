"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, formatCount } from "@/lib/motion";

// Counts a number up when scrolled into view. SSR renders the final value
// (SEO-safe); reduced-motion shows it immediately.
export default function CountUp({
    to,
    prefix = "",
    suffix = "",
    duration = 1.6,
    className = "",
}: {
    to: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                return;
            const obj = { v: 0 };
            el.textContent = `${prefix}0${suffix}`;
            gsap.to(obj, {
                v: to,
                duration,
                ease: "expo.out",
                scrollTrigger: { trigger: el, start: "top 90%", once: true },
                onUpdate: () => {
                    el.textContent = `${prefix}${formatCount(obj.v)}${suffix}`;
                },
            });
        },
        { scope: ref }
    );

    return (
        <span ref={ref} className={className}>
            {prefix}
            {formatCount(to)}
            {suffix}
        </span>
    );
}

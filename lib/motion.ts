"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

// Register once (guarded for the static-export server pass).
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

// One premium easing, used everywhere for a cohesive rhythm.
export const EASE_EXPO = "expo.out";
export const EASE_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/** True when the user prefers reduced motion. Drives every "freeze animation" branch. */
export function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setReduced(mq.matches);
        const on = () => setReduced(mq.matches);
        mq.addEventListener?.("change", on);
        return () => mq.removeEventListener?.("change", on);
    }, []);
    return reduced;
}

/** Format an integer with thousands separators for count-up stats. */
export function formatCount(n: number): string {
    return Math.round(n).toLocaleString("en-IN");
}

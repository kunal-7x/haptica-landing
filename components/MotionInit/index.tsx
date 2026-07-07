"use client";

import { useEffect } from "react";

// One global, cheap scroll-reveal. Adds `.is-visible` to any [data-reveal]
// element when it scrolls into view. Respects reduced-motion (everything is
// shown immediately, no motion). Pure IntersectionObserver — no GSAP here.
export default function MotionInit() {
    useEffect(() => {
        const els = Array.from(
            document.querySelectorAll<HTMLElement>("[data-reveal]")
        );
        if (!els.length) return;

        const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reduce) {
            els.forEach((el) => el.classList.add("is-visible"));
            return;
        }

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        e.target.classList.add("is-visible");
                        io.unobserve(e.target);
                    }
                });
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
        );
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return null;
}

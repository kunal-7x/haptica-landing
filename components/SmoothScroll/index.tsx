"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion";

// Global buttery smooth scroll (Lenis) synced to GSAP ScrollTrigger.
// Skipped entirely under prefers-reduced-motion (native scroll takes over).
export default function SmoothScroll() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.6,
        });

        lenis.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        document.documentElement.classList.add("lenis", "lenis-smooth");

        // Anchor links (#section) → smooth Lenis scroll with header offset.
        const onClick = (e: MouseEvent) => {
            const a = (e.target as Element)?.closest?.(
                'a[href^="#"], a[href^="/#"]'
            ) as HTMLAnchorElement | null;
            if (!a) return;
            const hash = a.getAttribute("href")!.split("#")[1];
            const target = hash && document.getElementById(hash);
            if (target) {
                e.preventDefault();
                lenis.scrollTo(target, { offset: -96 });
            }
        };
        document.addEventListener("click", onClick);

        return () => {
            document.removeEventListener("click", onClick);
            gsap.ticker.remove(raf);
            lenis.destroy();
            document.documentElement.classList.remove("lenis", "lenis-smooth");
        };
    }, []);

    return null;
}

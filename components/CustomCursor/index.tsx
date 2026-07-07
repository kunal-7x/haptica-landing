"use client";

import { useEffect, useRef } from "react";

// A soft trailing glow that follows the cursor and grows over interactive
// elements — additive (native cursor stays). Off on touch + reduced-motion.
export default function CustomCursor() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(pointer: coarse)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        el.style.opacity = "1";
        let x = window.innerWidth / 2,
            y = window.innerHeight / 2,
            cx = x,
            cy = y;

        const onMove = (e: MouseEvent) => {
            x = e.clientX;
            y = e.clientY;
        };
        window.addEventListener("mousemove", onMove, { passive: true });

        let raf = 0;
        const loop = () => {
            cx += (x - cx) * 0.16;
            cy += (y - cy) * 0.16;
            el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
            raf = requestAnimationFrame(loop);
        };
        loop();

        const sel =
            "a, button, [role='button'], input, select, textarea, label, .cursor-grow";
        const over = (e: Event) => {
            if ((e.target as Element | null)?.closest?.(sel))
                el.classList.add("is-hover");
        };
        const out = (e: Event) => {
            if ((e.target as Element | null)?.closest?.(sel))
                el.classList.remove("is-hover");
        };
        document.addEventListener("mouseover", over, { passive: true });
        document.addEventListener("mouseout", out, { passive: true });

        return () => {
            window.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseover", over);
            document.removeEventListener("mouseout", out);
            cancelAnimationFrame(raf);
        };
    }, []);

    return <div ref={ref} className="hc-cursor" aria-hidden style={{ opacity: 0 }} />;
}

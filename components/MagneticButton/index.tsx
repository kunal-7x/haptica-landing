"use client";

import { useRef } from "react";
import { gsap } from "@/lib/motion";

// Wraps a CTA and gently pulls it toward the cursor (elastic). Desktop-only;
// respects reduced-motion.
export default function MagneticButton({
    children,
    className = "",
    strength = 0.35,
}: {
    children: React.ReactNode;
    className?: string;
    strength?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const xTo = useRef<((v: number) => void) | null>(null);
    const yTo = useRef<((v: number) => void) | null>(null);

    const onMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!xTo.current) {
            xTo.current = gsap.quickTo(el, "x", {
                duration: 0.5,
                ease: "elastic.out(1,0.4)",
            });
            yTo.current = gsap.quickTo(el, "y", {
                duration: 0.5,
                ease: "elastic.out(1,0.4)",
            });
        }
        const r = el.getBoundingClientRect();
        xTo.current((e.clientX - r.left - r.width / 2) * strength);
        yTo.current!((e.clientY - r.top - r.height / 2) * strength);
    };
    const onLeave = () => {
        xTo.current?.(0);
        yTo.current?.(0);
    };

    return (
        <span
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`inline-block will-change-transform ${className}`}
        >
            {children}
        </span>
    );
}

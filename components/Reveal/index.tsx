"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion";

type Props = {
    children: React.ReactNode;
    className?: string;
    y?: number;
    delay?: number;
    stagger?: boolean;
};

// Scroll-in reveal: fades/slides content up as it enters the viewport (once).
// stagger=true animates direct children in sequence. Reduced-motion → no-op.
export default function Reveal({
    children,
    className = "",
    y = 26,
    delay = 0,
    stagger = false,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
                return;
            const targets = stagger ? Array.from(el.children) : el;
            gsap.from(targets as gsap.TweenTarget, {
                opacity: 0,
                y,
                duration: 0.75,
                delay,
                ease: "expo.out",
                stagger: stagger ? 0.08 : 0,
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
            });
        },
        { scope: ref }
    );

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

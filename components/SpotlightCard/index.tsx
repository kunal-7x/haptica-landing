"use client";

import { useRef } from "react";

type Props = {
    children: React.ReactNode;
    className?: string;
    tilt?: boolean;
    spotlight?: string;
};

// Borderless card with a cursor-follow radial spotlight + a subtle 3D tilt
// toward the cursor. No border/ring by request. Desktop-only motion.
export default function SpotlightCard({
    children,
    className = "",
    tilt = true,
    spotlight = "rgba(255,140,90,0.18)",
}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
        if (
            tilt &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            const rx = ((e.clientY - r.top) / r.height - 0.5) * -5;
            const ry = ((e.clientX - r.left) / r.width - 0.5) * 5;
            el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
    };
    const onLeave = () => {
        const el = ref.current;
        if (el) el.style.transform = "";
    };

    return (
        <div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`group relative overflow-hidden rounded-2xl bg-n-7/40 backdrop-blur-md transition-transform duration-500 ease-out ${className}`}
            style={{ "--spot": spotlight } as React.CSSProperties}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(320px circle at var(--mx) var(--my), var(--spot), transparent 60%)",
                }}
                aria-hidden
            />
            <div className="relative z-1 h-full">{children}</div>
        </div>
    );
}

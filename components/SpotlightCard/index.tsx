"use client";

import { useRef } from "react";

type Props = {
    children: React.ReactNode;
    className?: string;
    tilt?: boolean;
    spotlight?: string;
};

// Premium glass card: frosted surface + gradient-hairline, a cursor-follow
// radial spotlight, and a subtle 3D tilt toward the cursor. Desktop-only motion.
export default function SpotlightCard({
    children,
    className = "",
    tilt = true,
    spotlight = "rgba(255,140,90,0.16)",
}: Props) {
    const ref = useRef<HTMLDivElement>(null);

    const onMove = (e: React.MouseEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = e.clientX - r.left;
        const py = e.clientY - r.top;
        el.style.setProperty("--mx", `${px}px`);
        el.style.setProperty("--my", `${py}px`);
        if (
            tilt &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            const rx = (py / r.height - 0.5) * -5;
            const ry = (px / r.width - 0.5) * 5;
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
            className={`hc-spot group relative overflow-hidden rounded-2xl border border-n-1/10 bg-n-7/40 backdrop-blur-md transition-transform duration-500 ease-expo ${className}`}
            style={{ "--spot": spotlight } as React.CSSProperties}
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background:
                        "radial-gradient(300px circle at var(--mx) var(--my), var(--spot), transparent 60%)",
                }}
                aria-hidden
            />
            <div
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-inset ring-color-1/20 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
            />
            <div className="relative z-1 h-full">{children}</div>
        </div>
    );
}

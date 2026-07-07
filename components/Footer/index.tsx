"use client";

import Logo from "../Logo";
import DemoButton from "../DemoButton";
import { socials } from "@/constants/socials";
import {
    LOGIN_URL,
    SIGNUP_URL,
    CONTACT_EMAIL,
    whatsappLink,
} from "@/constants/site";

const PRODUCT = [
    { title: "Features", url: "#features" },
    { title: "How it works", url: "#how-it-works" },
    { title: "Integrations", url: "#integrations" },
    { title: "Pricing", url: "#pricing" },
];

const ACCOUNT = [
    { title: "Sign in", url: LOGIN_URL },
    { title: "Create account", url: SIGNUP_URL },
    { title: "Email us", url: `mailto:${CONTACT_EMAIL}` },
    {
        title: "WhatsApp",
        url: whatsappLink("Hi Haptica, I'd like to book a demo."),
    },
];

// Official brand glyphs (Simple Icons paths), rendered with currentColor.
function BrandIcon({ id }: { id: string }) {
    const p = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true };
    switch (id) {
        case "x":
            return (
                <svg {...p} className="h-[18px] w-[18px]">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
                </svg>
            );
        case "linkedin":
            return (
                <svg {...p} className="h-[18px] w-[18px]">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            );
        case "youtube":
            return (
                <svg {...p} className="h-[18px] w-[18px]">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
                </svg>
            );
        case "instagram":
            return (
                <svg {...p} className="h-[18px] w-[18px]">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
            );
        default:
            return null;
    }
}

const Col = ({
    title,
    items,
}: {
    title: string;
    items: { title: string; url: string }[];
}) => (
    <div>
        <h6 className="mb-4 font-code text-xs uppercase tracking-wider text-n-4">
            {title}
        </h6>
        <ul className="space-y-3">
            {items.map((it) => (
                <li key={it.title}>
                    <a
                        href={it.url}
                        target={it.url.startsWith("http") ? "_blank" : undefined}
                        rel={
                            it.url.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                        }
                        className="body-2 text-n-3 transition-colors hover:text-n-1"
                    >
                        {it.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

const Footer = () => (
    <footer className="relative overflow-hidden border-t border-n-6">
        {/* ambient top hairline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-color-1/50 to-transparent" />
        {/* giant faint wordmark */}
        <div
            aria-hidden
            className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 select-none font-display text-[22vw] font-bold leading-none text-n-1/[0.03]"
        >
            Haptica
        </div>

        <div className="container relative z-1 py-14 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr]">
                {/* brand */}
                <div data-reveal>
                    <Logo />
                    <p className="h4 mt-6 max-w-xs">Spark the Voice of AI.</p>
                    <p className="body-2 mt-4 max-w-xs text-n-4">
                        Put Riya on your phones and book more meetings this week
                        — without hiring more callers.
                    </p>
                    <div className="mt-6">
                        <DemoButton white size="lg">
                            Book a demo
                        </DemoButton>
                    </div>
                </div>

                <Col title="Product" items={PRODUCT} />
                <Col title="Account" items={ACCOUNT} />

                {/* connect */}
                <div>
                    <h6 className="mb-4 font-code text-xs uppercase tracking-wider text-n-4">
                        Follow Haptica
                    </h6>
                    <p className="body-2 mb-5 max-w-xs text-n-4">
                        See Riya in action and get the playbooks — follow us.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {socials.map((s) => (
                            <a
                                key={s.id}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={s.title}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-n-1/10 bg-n-7/50 text-n-3 transition-colors hover:border-color-1/40 hover:text-color-1"
                            >
                                <BrandIcon id={s.id} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-n-6 pt-6 text-center sm:flex-row sm:text-left">
                <p className="caption text-n-4">
                    © {new Date().getFullYear()} Haptica AI by Famit · Built in
                    India 🇮🇳
                </p>
                <div className="caption flex gap-6 text-n-4">
                    <a href="#" className="transition-colors hover:text-n-1">
                        Privacy
                    </a>
                    <a href="#" className="transition-colors hover:text-n-1">
                        Terms
                    </a>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

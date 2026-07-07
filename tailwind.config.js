/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./templates/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Haptica "spark" accent system: warm coral→amber spark,
                // cool indigo AI counterpoint, mint = success/"booked".
                color: {
                    1: "#FF6A3D", // spark coral — PRIMARY accent
                    2: "#FFB443", // amber — spark partner
                    3: "#7B6CFF", // indigo — cool AI counterpoint
                    4: "#37E0A8", // mint — success / "booked"
                    5: "#9A8CFF", // light indigo
                    6: "#FF8FB0", // warm pink — tertiary
                },
                stroke: {
                    1: "#221D3A",
                },
                // violet-ink neutral ramp (n.1 lightest text → n.8 deepest bg)
                n: {
                    1: "#F6F4FF",
                    2: "#C9C4E0",
                    3: "#A29CC0",
                    4: "#6E6890",
                    5: "#363050",
                    6: "#1C1830",
                    7: "#131024",
                    8: "#0B0914",
                },
            },
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans], // Onest — body/UI
                display: ["var(--font-display)", ...fontFamily.sans], // Bricolage Grotesque — headings
                code: ["var(--font-code)", ...fontFamily.mono], // JetBrains Mono — data/transcript/buttons
                grotesk: ["var(--font-code)", ...fontFamily.mono], // alias → mono (taglines)
            },
            letterSpacing: {
                tagline: ".15em",
            },
            spacing: {
                0.25: "0.0625rem",
                7.5: "1.875rem",
                15: "3.75rem",
            },
            opacity: {
                15: ".15",
            },
            transitionDuration: {
                DEFAULT: "200ms",
            },
            transitionTimingFunction: {
                DEFAULT: "linear",
                expo: "cubic-bezier(0.16, 1, 0.3, 1)",
            },
            keyframes: {
                blob: {
                    "0%,100%": { transform: "translate(0,0) scale(1)" },
                    "33%": { transform: "translate(3%,-4%) scale(1.06)" },
                    "66%": { transform: "translate(-3%,3%) scale(0.96)" },
                },
                floaty: {
                    "0%,100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                marquee: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
            },
            animation: {
                blob: "blob 18s ease-in-out infinite",
                floaty: "floaty 6s ease-in-out infinite",
                shimmer: "shimmer 2.5s linear infinite",
                marquee: "marquee 32s linear infinite",
            },
            zIndex: {
                1: "1",
                2: "2",
                3: "3",
                4: "4",
                5: "5",
            },
            borderWidth: {
                DEFAULT: "0.0625rem",
            },
            backgroundImage: {
                "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
                "conic-gradient":
                    "conic-gradient(from 225deg, #FF6A3D, #FFB443, #7B6CFF, #37E0A8, #FF6A3D)",
            },
        },
    },
    plugins: [
        plugin(function ({ addBase, addComponents, addUtilities }) {
            addBase({
                // route all real heading tags to the display face
                "h1,h2,h3,h4,h5,h6": { fontFamily: "var(--font-display)" },
            });
            addComponents({
                ".container": {
                    "@apply max-w-[77.5rem] mx-auto px-5 md:px-10 lg:px-15 xl:max-w-[87.5rem]":
                        {},
                },
                ".h1": {
                    "@apply font-display font-bold tracking-[-0.03em] text-[clamp(2.6rem,6.2vw,5rem)] leading-[1.03]":
                        {},
                },
                ".h2": {
                    "@apply font-display font-semibold tracking-[-0.02em] text-[clamp(2rem,4vw,3.25rem)] leading-[1.08]":
                        {},
                },
                ".h3": {
                    "@apply font-display text-[2rem] leading-normal md:text-[2.5rem]":
                        {},
                },
                ".h4": {
                    "@apply font-display text-[2rem] leading-normal": {},
                },
                ".h5": {
                    "@apply font-display text-2xl leading-normal": {},
                },
                ".h6": {
                    "@apply font-display font-semibold text-lg leading-8": {},
                },
                ".body-1": {
                    "@apply text-[0.875rem] leading-[1.5rem] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-8":
                        {},
                },
                ".body-2": {
                    "@apply font-light text-[0.875rem] leading-6 md:text-base":
                        {},
                },
                ".caption": {
                    "@apply text-sm": {},
                },
                ".tagline": {
                    "@apply font-grotesk font-light text-xs tracking-tagline uppercase":
                        {},
                },
                ".quote": {
                    "@apply font-code text-lg leading-normal": {},
                },
                ".button": {
                    "@apply font-code text-xs font-bold uppercase tracking-wider":
                        {},
                },
            });
            addUtilities({
                ".tap-highlight-color": {
                    "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
                },
            });
        }),
    ],
};

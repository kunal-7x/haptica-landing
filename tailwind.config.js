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
                    "@apply font-display font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.75rem] xl:leading-[4.5rem]":
                        {},
                },
                ".h2": {
                    "@apply font-display text-[1.75rem] leading-[2.5rem] md:text-[2rem] md:leading-[2.5rem] lg:text-[2.5rem] lg:leading-[3.5rem] xl:text-[3rem] xl:leading-tight":
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

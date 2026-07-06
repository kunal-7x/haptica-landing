import "@splidejs/react-splide/css";
import "tippy.js/animations/shift-toward.css";
import "./globals.css";
import { Schibsted_Grotesk, Figtree, JetBrains_Mono } from "next/font/google";

// Display — confident grotesque used for headings only.
// adjustFontFallback disabled: this Next version has no metric-overrides for
// Schibsted Grotesk; we provide an explicit fallback instead (clean build, no error).
const display = Schibsted_Grotesk({
    weight: ["500", "600", "700", "800"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-display",
    adjustFontFallback: false,
    fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

// Body / UI.
const sans = Figtree({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-sans",
});

// Data / live transcript / call HUD / buttons.
const code = JetBrains_Mono({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-code",
});

const SITE_URL = "https://famit.in";
const TITLE = "Haptica AI — Spark the Voice of AI";
const DESC =
    "Haptica AI is the AI voice telecaller that calls your leads, books meetings, and follows up on WhatsApp — with a built-in Sales CRM and creative studio. One console for your entire sales motion.";

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: TITLE,
    description: DESC,
    icons: { icon: "/favicon.svg" },
    openGraph: {
        title: TITLE,
        description: DESC,
        url: SITE_URL,
        siteName: "Haptica AI",
        images: ["/og-image.png"],
        type: "website",
        locale: "en_IN",
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESC,
        images: ["/og-image.png"],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=5"
                />
                <meta name="theme-color" content="#0B0914" />
            </head>
            <body
                className={`${sans.variable} ${display.variable} ${code.variable} font-sans bg-n-8 text-n-1 text-base`}
            >
                {children}
                <svg className="block" width={0} height={0}>
                    <defs>
                        {/* Button animated-border gradients — Haptica spark palette */}
                        <linearGradient
                            id="btn-left"
                            x1="50%"
                            x2="50%"
                            y1="0%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#FFB443" />
                            <stop offset="100%" stopColor="#FF6A3D" />
                        </linearGradient>
                        <linearGradient
                            id="btn-top"
                            x1="100%"
                            x2="0%"
                            y1="50%"
                            y2="50%"
                        >
                            <stop offset="0%" stopColor="#7B6CFF" />
                            <stop offset="100%" stopColor="#FF6A3D" />
                        </linearGradient>
                        <linearGradient
                            id="btn-bottom"
                            x1="100%"
                            x2="0%"
                            y1="50%"
                            y2="50%"
                        >
                            <stop offset="0%" stopColor="#37E0A8" />
                            <stop offset="100%" stopColor="#7B6CFF" />
                        </linearGradient>
                        <linearGradient
                            id="btn-right"
                            x1="14.635%"
                            x2="14.635%"
                            y1="0%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#9A8CFF" />
                            <stop offset="100%" stopColor="#7B6CFF" />
                        </linearGradient>
                    </defs>
                </svg>
            </body>
        </html>
    );
}

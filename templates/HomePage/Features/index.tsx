import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";

const Ico = ({ children }: { children: React.ReactNode }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
    >
        {children}
    </svg>
);

// Accent system: tinted-gradient icon tile + inset ring + matching cursor
// spotlight, so each card glows in its own colour. Class strings are literal
// (never interpolated) so Tailwind keeps them.
const ACCENT = {
    coral: {
        tile: "bg-gradient-to-br from-color-1/25 to-color-1/5 text-color-1 ring-1 ring-inset ring-color-1/25",
        spot: "rgba(255,106,61,0.16)",
    },
    amber: {
        tile: "bg-gradient-to-br from-color-2/25 to-color-2/5 text-color-2 ring-1 ring-inset ring-color-2/25",
        spot: "rgba(255,180,67,0.16)",
    },
    indigo: {
        tile: "bg-gradient-to-br from-color-3/25 to-color-3/5 text-color-3 ring-1 ring-inset ring-color-3/25",
        spot: "rgba(123,108,255,0.16)",
    },
    mint: {
        tile: "bg-gradient-to-br from-color-4/25 to-color-4/5 text-color-4 ring-1 ring-inset ring-color-4/25",
        spot: "rgba(55,224,168,0.16)",
    },
    violet: {
        tile: "bg-gradient-to-br from-color-5/25 to-color-5/5 text-color-5 ring-1 ring-inset ring-color-5/25",
        spot: "rgba(154,140,255,0.16)",
    },
} as const;

type Accent = keyof typeof ACCENT;

const FEATURES: {
    title: string;
    text: string;
    accent: Accent;
    icon: React.ReactNode;
}[] = [
    {
        title: "AI Voice Telecaller",
        text: "Riya calls and qualifies every lead over a real phone line — in Hindi, Hinglish or English.",
        accent: "coral",
        icon: (
            <Ico>
                <path d="M5 4h3l1.8 4.5-2.3 1.4a11 11 0 0 0 5.6 5.6l1.4-2.3L19 16v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" />
            </Ico>
        ),
    },
    {
        title: "AI Manager",
        text: "Answers your inbound calls, records them, and hands you a live transcript and next step.",
        accent: "indigo",
        icon: (
            <Ico>
                <path d="M4 12a8 8 0 0 1 16 0" />
                <rect x="3" y="12" width="4" height="7" rx="1.5" />
                <rect x="17" y="12" width="4" height="7" rx="1.5" />
            </Ico>
        ),
    },
    {
        title: "WhatsApp automation",
        text: "Sends brochures, reminders and templates the moment a call ends — and chases the follow-ups.",
        accent: "mint",
        icon: (
            <Ico>
                <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.2A8 8 0 1 1 20 11.5z" />
            </Ico>
        ),
    },
    {
        title: "Sales CRM & pipeline",
        text: "Every lead scored and staged New → Qualified → Booked → Won, with recordings attached.",
        accent: "coral",
        icon: (
            <Ico>
                <rect x="3" y="4" width="7" height="16" rx="1.5" />
                <rect x="14" y="4" width="7" height="10" rx="1.5" />
            </Ico>
        ),
    },
    {
        title: "Creative Studio",
        text: "Generate on-brand images and short video ad clips for your campaigns, in batches.",
        accent: "amber",
        icon: (
            <Ico>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="8.5" cy="10" r="1.5" />
                <path d="M21 16l-5-4-4 3-2-1.5L3 18" />
            </Ico>
        ),
    },
    {
        title: "Analytics & reports",
        text: "Track call volume, connect rates, funnel and spend — per campaign and per caller, live.",
        accent: "indigo",
        icon: (
            <Ico>
                <path d="M3 21h18" />
                <path d="M6 21v-5" />
                <path d="M11 21V8" />
                <path d="M16 21v-9" />
                <path d="M21 21V5" />
            </Ico>
        ),
    },
    {
        title: "Knowledge base",
        text: "Feed Riya your projects, pricing and FAQs so every answer is accurate and on-message.",
        accent: "violet",
        icon: (
            <Ico>
                <path d="M6 4h11a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2z" />
                <path d="M8 4v14" />
            </Ico>
        ),
    },
    {
        title: "Integrations & Vault",
        text: "Connect forms, calendars and webhooks, and bring your own API keys — you stay in control.",
        accent: "mint",
        icon: (
            <Ico>
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </Ico>
        ),
    },
];

const Features = () => {
    return (
        <Section id="features" className="scroll-mt-24 overflow-hidden" crosses>
            <div className="container">
                <Reveal className="mx-auto mb-12 max-w-3xl text-center lg:mb-16">
                    <span className="tagline text-n-3">
                        Everything in one console
                    </span>
                    <h2 className="h2 mt-4">
                        One platform for your entire sales floor
                    </h2>
                    <p className="body-2 mx-auto mt-5 max-w-2xl text-n-3">
                        Stop stitching together a dialer, a chat tool, a
                        spreadsheet and a design app. Haptica runs the whole
                        motion — calls, follow-ups, pipeline and creative — in
                        one place.
                    </p>
                </Reveal>

                <Reveal
                    stagger
                    className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {FEATURES.map((f) => {
                        const a = ACCENT[f.accent];
                        return (
                            <SpotlightCard
                                key={f.title}
                                className="h-full p-6"
                                spotlight={a.spot}
                            >
                                <span
                                    className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-lg shadow-n-8/40 ${a.tile}`}
                                >
                                    {f.icon}
                                </span>
                                <h3 className="mb-2 text-lg font-semibold text-n-1">
                                    {f.title}
                                </h3>
                                <p className="body-2 text-n-3">{f.text}</p>
                            </SpotlightCard>
                        );
                    })}
                </Reveal>
            </div>
        </Section>
    );
};

export default Features;

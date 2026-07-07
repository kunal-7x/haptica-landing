import Section from "@/components/Section";
import SpotlightCard from "@/components/SpotlightCard";

const INTEGRATIONS = [
    "WhatsApp",
    "Google Calendar",
    "Google Sheets",
    "Razorpay",
    "Telegram",
    "Webhooks",
    "REST API",
    "Zapier",
];

const POINTS = [
    "Sync leads from forms, funnels and Sheets",
    "Book straight into Google Calendar",
    "Bring your own Groq, ElevenLabs & Sarvam keys via the Vault",
    "Fire events to any webhook or CRM",
];

const Check = () => (
    <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-4 w-4 shrink-0 text-color-4"
    >
        <path d="M4 10.5l4 4 8-9" />
    </svg>
);

const Collaboration = () => {
    return (
        <Section id="integrations" className="scroll-mt-24" crosses>
            <div className="container">
                <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                    <div>
                        <span className="tagline text-n-3">
                            Works with your stack
                        </span>
                        <h2 className="h2 mb-5 mt-4">
                            Plug Haptica into the tools you already run
                        </h2>
                        <p className="body-2 mb-8 text-n-3">
                            Connect your lead sources, calendar and payments,
                            fire webhooks into anything, and bring your own model
                            and provider keys through the Vault — your data and
                            spend stay in your control.
                        </p>
                        <ul className="space-y-4">
                            {POINTS.map((p) => (
                                <li key={p} className="flex items-start gap-3">
                                    <Check />
                                    <span className="body-2 text-n-2">{p}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {INTEGRATIONS.map((name, i) => (
                            <SpotlightCard
                                key={name}
                                className="flex items-center gap-3 px-4 py-3.5"
                                spotlight={
                                    i % 2
                                        ? "rgba(123,108,255,0.18)"
                                        : "rgba(255,106,61,0.18)"
                                }
                            >
                                <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-code text-sm font-bold ${
                                        i % 2
                                            ? "bg-color-3/12 text-color-3"
                                            : "bg-color-1/12 text-color-1"
                                    }`}
                                >
                                    {name[0]}
                                </span>
                                <span className="text-sm text-n-2">{name}</span>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Collaboration;

import Section from "@/components/Section";

const STEPS = [
    {
        n: "01",
        title: "Bring in your leads",
        text: "Upload a list or connect a form, funnel or webhook. New leads drop straight into the dialer queue.",
    },
    {
        n: "02",
        title: "Riya calls & qualifies",
        text: "Within minutes she calls in Hindi, Hinglish or English — pitches, handles objections, and books the meeting.",
    },
    {
        n: "03",
        title: "WhatsApp follows up",
        text: "Brochures, floor plans and reminders go out automatically. No lead is left waiting.",
    },
    {
        n: "04",
        title: "It all lands in your CRM",
        text: "Every call, recording, outcome and next step is logged and scored — live, as it happens.",
    },
    {
        n: "05",
        title: "You close warm leads",
        text: "Your team spends its time on qualified, ready-to-talk leads instead of dialing cold lists.",
    },
];

const HowItWorks = () => {
    return (
        <Section
            id="how-it-works"
            className="scroll-mt-24 overflow-hidden"
            crosses
        >
            <div className="container">
                <div className="mx-auto mb-12 max-w-3xl text-center lg:mb-20">
                    <span className="tagline text-n-3">How it works</span>
                    <h2 className="h2 mt-4">
                        From raw lead to booked meeting — on autopilot
                    </h2>
                </div>

                <div className="relative">
                    {/* connecting line (desktop) */}
                    <div
                        className="pointer-events-none absolute left-0 right-0 top-[2.125rem] hidden h-px bg-gradient-to-r from-transparent via-n-6 to-transparent lg:block"
                        aria-hidden
                    />
                    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
                        {STEPS.map((s) => (
                            <li key={s.n} className="relative">
                                <span className="relative z-1 mb-5 inline-flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-2xl border border-n-6 bg-n-8">
                                    <span className="bg-gradient-to-br from-color-1 to-color-2 bg-clip-text font-code text-xl font-bold text-transparent">
                                        {s.n}
                                    </span>
                                </span>
                                <h3 className="mb-2 text-lg font-semibold text-n-1">
                                    {s.title}
                                </h3>
                                <p className="body-2 text-n-3">{s.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </Section>
    );
};

export default HowItWorks;

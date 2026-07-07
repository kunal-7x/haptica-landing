import Section from "@/components/Section";
import LiveCallConsole from "@/components/LiveCallConsole";
import DemoButton from "@/components/DemoButton";

const Hero = () => {
    return (
        <Section
            className="pt-[7.5rem] -mt-[5.25rem] pb-16 overflow-hidden lg:pt-[10rem] lg:pb-24"
            customPaddings
            crosses
            crossesOffset="lg:translate-y-[5.25rem]"
        >
            <div className="container relative">
                {/* ambient spark field */}
                <div
                    className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[60rem] max-w-[130%] aspect-square opacity-70"
                    aria-hidden
                >
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,106,61,0.14),transparent_60%)]" />
                    <div className="absolute inset-[15%] rounded-full bg-[radial-gradient(circle_at_center,rgba(123,108,255,0.12),transparent_60%)]" />
                </div>

                <div className="relative z-2 grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8 xl:gap-16">
                    {/* left — copy */}
                    <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
                        <span className="tagline mb-5 inline-flex items-center gap-2 text-n-3">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-color-1" />
                            Spark the Voice of AI
                        </span>
                        <h1 className="h1 mb-6">
                            The AI telecaller that calls your leads and{" "}
                            <span className="bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">
                                books the meeting.
                            </span>
                        </h1>
                        <p className="body-1 mb-8 text-n-3 lg:max-w-xl">
                            Haptica AI dials every new lead in minutes, qualifies
                            them in natural Hindi, Hinglish or English, follows up
                            on WhatsApp, and logs it all to your CRM —{" "}
                            <span className="text-n-1">
                                one console for your entire sales floor.
                            </span>
                        </p>
                        <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                            <DemoButton white>Book a demo</DemoButton>
                            <a
                                href="#how-it-works"
                                className="button inline-flex items-center gap-2 text-n-2 transition-colors hover:text-color-1"
                            >
                                See how it works
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M4 6l4 4 4-4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </a>
                        </div>
                        <p className="mt-7 font-code text-xs uppercase tracking-[0.15em] text-n-4">
                            Built for India · DLT &amp; TRAI-ready · 10+ languages
                        </p>
                    </div>

                    {/* right — the live call, in progress */}
                    <div className="relative">
                        <LiveCallConsole />
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default Hero;

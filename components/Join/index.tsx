"use client";

import Section from "@/components/Section";
import MagneticButton from "@/components/MagneticButton";
import { useDemo } from "@/components/DemoModal";
import { SIGNUP_URL } from "@/constants/site";

const Join = () => {
    const { open } = useDemo();
    return (
        <Section customPaddings className="relative overflow-hidden py-24 lg:py-36">
            <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="animate-blob absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-color-1/15 blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_28%,#0B0914_72%)]" />
            </div>
            <div className="container relative text-center">
                <span className="tagline text-n-3">Ready when you are</span>
                <h2 className="h1 mx-auto mt-4 max-w-3xl">
                    Spark the voice of{" "}
                    <span className="bg-gradient-to-r from-color-1 to-color-2 bg-clip-text text-transparent">
                        your sales.
                    </span>
                </h2>
                <p className="body-1 mx-auto mt-6 max-w-xl text-n-3">
                    Put Riya on your phones and book more site visits this week.
                    She calls, qualifies and follows up — your team just closes.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <MagneticButton>
                        <button
                            onClick={open}
                            className="button group relative flex h-14 items-center overflow-hidden rounded-full bg-gradient-to-r from-color-1 to-color-2 px-8 text-n-8 shadow-[0_0_44px_-8px_rgba(255,106,61,0.65)]"
                        >
                            <span className="relative z-1">Book a demo</span>
                            <span
                                className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.55),transparent)] transition-transform duration-700 group-hover:translate-x-full"
                                aria-hidden
                            />
                        </button>
                    </MagneticButton>
                    <a
                        href={SIGNUP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button flex h-14 items-center rounded-full border border-n-1/15 px-7 text-n-1 transition-colors hover:border-n-1/40"
                    >
                        Start for free
                    </a>
                </div>
            </div>
        </Section>
    );
};

export default Join;

"use client";

import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import LiveCallConsole from "@/components/LiveCallConsole";

const POINTS = [
    {
        t: "Sounds human",
        d: "Natural Hindi, Hinglish or English — not a robotic IVR menu.",
    },
    {
        t: "Handles objections",
        d: "“Main busy hoon”, “abhi nahi” — Riya adapts and keeps the conversation moving.",
    },
    {
        t: "Books the meeting",
        d: "Confirms a slot and drops it straight into your calendar and CRM.",
    },
    {
        t: "Hands off to WhatsApp",
        d: "Sends the brochure or floor plan the moment the call ends.",
    },
];

const Product = () => {
    return (
        <Section id="product" crosses className="scroll-mt-24 overflow-hidden">
            <div className="container">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <Reveal>
                        <div>
                            <span className="tagline text-n-3">See Riya work</span>
                            <h2 className="h2 mb-5 mt-3">
                                Watch an AI close a real sales call
                            </h2>
                            <p className="body-1 mb-8 text-n-3">
                                A live outbound call — Riya greets, qualifies,
                                handles the objection, and books a site visit,
                                then hands it to WhatsApp and your CRM.
                            </p>
                            <ul className="space-y-5">
                                {POINTS.map((p) => (
                                    <li key={p.t} className="flex gap-4">
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-color-1/15">
                                            <svg
                                                viewBox="0 0 20 20"
                                                className="h-3.5 w-3.5 text-color-1"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.6"
                                            >
                                                <path
                                                    d="M4 10.5l4 4 8-9"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </span>
                                        <div>
                                            <div className="font-semibold text-n-1">
                                                {p.t}
                                            </div>
                                            <div className="body-2 text-n-3">
                                                {p.d}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Reveal>
                    <Reveal>
                        <div className="relative">
                            <div className="pointer-events-none absolute -inset-10 rounded-full bg-color-1/10 blur-[100px]" aria-hidden />
                            <div className="relative">
                                <LiveCallConsole />
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </Section>
    );
};

export default Product;

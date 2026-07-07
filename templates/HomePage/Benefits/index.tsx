import { useRef, useState } from "react";
import Link from "next/link";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import Section from "@/components/Section";
import Heading from "@/components/Heading";
import Image from "@/components/Image";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";

import { benefits } from "@/mocks/benefits";

type BenefitsProps = {};

// Per-card cursor spotlight colour, rotating through the spark accents.
const SPOTS = [
    "rgba(255,106,61,0.16)", // coral
    "rgba(123,108,255,0.16)", // indigo
    "rgba(55,224,168,0.16)", // mint
    "rgba(255,180,67,0.16)", // amber
    "rgba(154,140,255,0.16)", // violet
    "rgba(255,106,61,0.16)", // coral
];

const Benefits = ({}: BenefitsProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const ref = useRef<any>(null);

    const handleClick = (index: number) => {
        setActiveIndex(index);
        ref.current?.go(index);
    };

    return (
        <Section className="overflow-hidden">
            <div className="container relative z-2">
                <Reveal>
                    <Heading
                        className="md:max-w-md lg:max-w-2xl"
                        title="More booked meetings, without hiring more callers"
                    />
                </Reveal>
                <Reveal>
                    <Splide
                        className="splide-visible max-w-[24rem] md:max-w-none"
                        options={{
                            mediaQuery: "min",
                            pagination: false,
                            arrows: false,
                            gap: "1.5rem",
                            breakpoints: {
                                768: {
                                    autoWidth: "true",
                                },
                            },
                        }}
                        onMoved={(e, newIndex) => setActiveIndex(newIndex)}
                        hasTrack={false}
                        ref={ref}
                    >
                        <SplideTrack>
                            {benefits.map((item, index) => (
                                <SplideSlide key={item.id}>
                                    <SpotlightCard
                                        className="h-full w-full md:w-[24rem]"
                                        spotlight={SPOTS[index % SPOTS.length]}
                                    >
                                        <Link
                                            className="relative flex h-[22.625rem] flex-col p-8"
                                            href="/features"
                                        >
                                            {item.light && (
                                                <div
                                                    className="pointer-events-none absolute -top-1/4 left-1/4 aspect-square w-full bg-radial-gradient from-color-3/25 to-color-3/0 to-70%"
                                                    aria-hidden
                                                />
                                            )}
                                            {item.imageUrl && (
                                                <div
                                                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-expo group-hover:opacity-[0.08]"
                                                    aria-hidden
                                                >
                                                    <Image
                                                        className="h-full w-full object-cover"
                                                        src={item.imageUrl}
                                                        width={380}
                                                        height={362}
                                                        alt=""
                                                    />
                                                </div>
                                            )}
                                            <div className="relative z-1 flex h-full flex-col">
                                                <span className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-n-7/60 ring-1 ring-inset ring-n-1/10">
                                                    <Image
                                                        src={item.iconUrl}
                                                        width={28}
                                                        height={28}
                                                        alt=""
                                                    />
                                                </span>
                                                <h5 className="h5 mb-4">
                                                    {item.title}
                                                </h5>
                                                <p className="body-2 mb-6 text-n-3">
                                                    {item.text}
                                                </p>
                                                <div className="mt-auto flex items-center">
                                                    <span className="font-code text-xs font-bold uppercase tracking-wider text-n-1">
                                                        Explore more
                                                    </span>
                                                    <svg
                                                        className="ml-3 fill-color-1 transition-transform duration-300 ease-expo group-hover:translate-x-1"
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Link>
                                    </SpotlightCard>
                                </SplideSlide>
                            ))}
                        </SplideTrack>
                    </Splide>
                </Reveal>
                <div className="flex mt-12 -mx-2 md:mt-15 lg:justify-center xl:mt-20">
                    {benefits.map((item, index) => (
                        <button
                            className="relative w-6 h-6 mx-2"
                            onClick={() => handleClick(index)}
                            key={item.id}
                        >
                            <span
                                className={`absolute inset-0 bg-conic-gradient rounded-full transition-opacity ${
                                    index === activeIndex
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            ></span>
                            <span className="absolute inset-0.25 bg-n-8 rounded-full">
                                <span className="absolute inset-2 bg-n-1 rounded-full"></span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Benefits;

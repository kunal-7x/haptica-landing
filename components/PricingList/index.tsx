"use client";

import { useRef, useState } from "react";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import Button from "@/components/Button";
import SpotlightCard from "@/components/SpotlightCard";

import { pricing } from "@/mocks/pricing";
import { SIGNUP_URL } from "@/constants/site";
import { useDemo } from "@/components/DemoModal";

type PricingListProps = {
    monthly?: boolean;
};

const SPOTS = [
    "rgba(255,180,67,0.16)", // Starter — amber
    "rgba(255,106,61,0.18)", // Growth — coral (primary)
    "rgba(123,108,255,0.16)", // Scale — indigo
];

const TITLE_COLOR = ["text-color-2", "text-color-1", "text-color-3"];

const PricingList = ({ monthly = true }: PricingListProps) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const { open } = useDemo();

    const ref = useRef<any>(null);

    const handleClick = (index: number) => {
        setActiveIndex(index);
        ref.current?.go(index);
    };

    return (
        <Splide
            className="splide-pricing splide-visible"
            options={{
                mediaQuery: "min",
                autoWidth: true,
                pagination: false,
                arrows: false,
                gap: "1rem",
                breakpoints: {
                    1024: {
                        destroy: true,
                    },
                },
            }}
            onMoved={(e, newIndex) => setActiveIndex(newIndex)}
            hasTrack={false}
            ref={ref}
        >
            <SplideTrack>
                {pricing.map((item, index) => {
                    const popular = index === 1;
                    const priceValue = item.price
                        ? monthly
                            ? item.price
                            : item.price !== "0"
                            ? (+item.price * 12 * 0.9).toFixed(1)
                            : item.price
                        : null;

                    return (
                        <SplideSlide
                            className={popular ? "" : "py-3"}
                            key={item.id}
                        >
                            <div className="relative h-full w-[19rem] lg:w-auto">
                                {/* ambient glow behind the most-popular tier */}
                                {popular && (
                                    <div
                                        className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-b from-color-1/25 via-color-2/10 to-color-3/15 blur-2xl"
                                        aria-hidden
                                    />
                                )}
                                {/* spark gradient ring (1.5px) on the popular tier */}
                                <div
                                    className={`relative h-full ${
                                        popular
                                            ? "rounded-[1.15rem] bg-gradient-to-b from-color-1 via-color-2/70 to-color-3/70 p-[1.5px] shadow-[0_0_50px_-14px_rgba(255,106,61,0.55)]"
                                            : ""
                                    }`}
                                >
                                    {popular && (
                                        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-color-1 to-color-2 px-3 py-1 font-code text-[0.625rem] font-bold uppercase tracking-wider text-n-8 shadow-[0_6px_20px_-6px_rgba(255,106,61,0.7)]">
                                                <svg
                                                    width="11"
                                                    height="11"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    aria-hidden
                                                >
                                                    <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
                                                </svg>
                                                Most popular
                                            </span>
                                        </div>
                                    )}
                                    <SpotlightCard
                                        className={`h-full px-6 ${
                                            popular ? "py-11" : "py-8"
                                        }`}
                                        spotlight={SPOTS[index]}
                                    >
                                        <h4
                                            className={`h4 mb-4 ${TITLE_COLOR[index]}`}
                                        >
                                            {item.title}
                                        </h4>
                                        <p className="body-2 min-h-[4rem] mb-3 text-n-1/50">
                                            {item.description}
                                        </p>
                                        <div className="flex items-end h-[5.5rem] mb-6">
                                            {priceValue ? (
                                                <>
                                                    <div className="h3 mr-1 text-n-1/70">
                                                        ₹
                                                    </div>
                                                    <div className="text-[4.75rem] leading-[0.85] font-bold">
                                                        {priceValue}
                                                    </div>
                                                    <div className="mb-2 ml-1.5 font-code text-sm text-n-3">
                                                        /{monthly ? "mo" : "yr"}
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-[3.25rem] leading-none font-bold text-n-1">
                                                    Custom
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            className="w-full mb-6"
                                            href={
                                                item.price
                                                    ? SIGNUP_URL
                                                    : undefined
                                            }
                                            onClick={
                                                item.price ? undefined : open
                                            }
                                            white={!!item.price}
                                        >
                                            {item.price
                                                ? "Get started"
                                                : "Talk to sales"}
                                        </Button>
                                        <ul>
                                            {item.features.map(
                                                (feature, i) => (
                                                    <li
                                                        className="flex items-start py-4 border-t border-n-1/10"
                                                        key={i}
                                                    >
                                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-color-4/15 ring-1 ring-inset ring-color-4/25">
                                                            <svg
                                                                viewBox="0 0 20 20"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2.6"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="h-3 w-3 text-color-4"
                                                            >
                                                                <path d="M4 10.5l4 4 8-9" />
                                                            </svg>
                                                        </span>
                                                        <p className="body-2 ml-3">
                                                            {feature}
                                                        </p>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </SpotlightCard>
                                </div>
                            </div>
                        </SplideSlide>
                    );
                })}
            </SplideTrack>
            <div className="flex justify-center mt-8 -mx-2 md:mt-15 lg:hidden">
                {pricing.map((item, index) => (
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
        </Splide>
    );
};

export default PricingList;

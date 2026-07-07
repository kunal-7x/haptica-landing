"use client";

import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Image from "@/components/Image";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";

import { testimonials } from "@/mocks/testimonials";
import Arrows from "@/components/Arrows";
import Heading from "@/components/Heading";
import { useDemo } from "@/components/DemoModal";

type TestimonialsProps = {};

const Stars = () => (
    <div className="flex gap-0.5 text-color-2" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
            </svg>
        ))}
    </div>
);

const Testimonials = ({}: TestimonialsProps) => {
    const { open } = useDemo();

    return (
        <Section className="overflow-hidden">
            <div className="container relative z-2">
                <Reveal>
                    <Heading
                        tag="Ready to get started"
                        title="What the community is saying"
                    />
                </Reveal>
                <Reveal>
                    <Splide
                        className="splide-custom splide-visible"
                        options={{
                            mediaQuery: "min",
                            gap: "1.5rem",
                            breakpoints: {
                                1024: {
                                    autoWidth: true,
                                },
                            },
                            rewind: true,
                            pagination: false,
                        }}
                        hasTrack={false}
                    >
                        <SplideTrack>
                            {testimonials.map((item) => (
                                <SplideSlide key={item.id}>
                                    <SpotlightCard
                                        className="h-full lg:w-[46.125rem]"
                                        spotlight="rgba(255,106,61,0.14)"
                                    >
                                        <div className="flex h-full flex-col md:flex-row">
                                            {/* portrait + identity */}
                                            <div className="relative hidden shrink-0 overflow-hidden md:block md:w-[15.5rem]">
                                                <Image
                                                    className="absolute inset-0 h-full w-full object-cover"
                                                    src={item.imageUrl}
                                                    width={739}
                                                    height={472}
                                                    alt={item.name}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-r from-n-8/10 via-n-8/50 to-n-8" />
                                                <div className="absolute inset-x-0 bottom-0 p-6">
                                                    <Image
                                                        className="mb-3 h-7 w-auto object-contain opacity-90"
                                                        src={item.logoUrl}
                                                        width={204}
                                                        height={40}
                                                        alt=""
                                                    />
                                                    <div className="text-lg font-semibold text-n-1">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-sm text-n-3">
                                                        {item.role}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* quote */}
                                            <div className="flex flex-1 flex-col p-8">
                                                <div className="mb-6 flex items-center gap-3">
                                                    <Stars />
                                                    <span className="font-code text-[0.625rem] uppercase tracking-wider text-n-4">
                                                        Verified customer
                                                    </span>
                                                </div>
                                                <p className="quote mb-8 text-n-1">
                                                    “{item.text}”
                                                </p>
                                                <div className="mt-auto flex items-center gap-4 border-t border-n-1/10 pt-6">
                                                    {/* mobile identity */}
                                                    <div className="flex items-center gap-3 md:hidden">
                                                        <span className="block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-n-1/15">
                                                            <Image
                                                                className="h-full w-full object-cover"
                                                                src={item.imageUrl}
                                                                width={80}
                                                                height={80}
                                                                alt={item.name}
                                                            />
                                                        </span>
                                                        <div className="min-w-0">
                                                            <div className="truncate text-sm font-semibold text-n-1">
                                                                {item.name}
                                                            </div>
                                                            <div className="truncate text-xs text-n-3">
                                                                {item.role}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        className="ml-auto"
                                                        onClick={open}
                                                    >
                                                        Book a demo
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </SplideSlide>
                            ))}
                        </SplideTrack>
                        <Arrows
                            className="justify-center mt-12 md:mt-15 xl:mt-20"
                            prevClassName="mr-8"
                        />
                    </Splide>
                </Reveal>
            </div>
        </Section>
    );
};

export default Testimonials;

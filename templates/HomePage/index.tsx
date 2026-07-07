"use client";

import Layout from "@/components/Layout";
import Hero from "./Hero";
import Benefits from "./Benefits";
import HowItWorks from "./HowItWorks";
import Features from "./Features";
import Collaboration from "./Collaboration";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
import Join from "@/components/Join";

const HomePage = () => {
    return (
        <Layout>
            <Hero />
            <Benefits />
            <HowItWorks />
            <Features />
            <Collaboration />
            <div id="pricing" className="scroll-mt-24">
                <Pricing />
            </div>
            <Testimonials />
            <Join />
        </Layout>
    );
};

export default HomePage;

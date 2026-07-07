"use client";

import Layout from "@/components/Layout";
import TrustStrip from "@/components/TrustStrip";
import Join from "@/components/Join";
import Hero from "./Hero";
import Benefits from "./Benefits";
import HowItWorks from "./HowItWorks";
import Product from "./Product";
import Features from "./Features";
import Collaboration from "./Collaboration";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";

const HomePage = () => {
    return (
        <Layout>
            <Hero />
            <TrustStrip />
            <Benefits />
            <HowItWorks />
            <Product />
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

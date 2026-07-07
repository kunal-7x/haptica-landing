// Single place that registers the GSAP ScrollTrigger plugin exactly once.
// Import { gsap, ScrollTrigger } from here in any client component that needs
// scroll-driven motion (e.g. the pinned horizontal Benefits scroll).
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

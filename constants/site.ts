// Single source of truth for outbound links to the Haptica AI app + lead capture.
export const APP_URL = "https://haptica.famit.in";
export const SIGNUP_URL = `${APP_URL}/signup`;
export const LOGIN_URL = `${APP_URL}/login`;

// "Book a demo" opens the DemoModal; this stays as a hard-link fallback.
export const DEMO_URL = SIGNUP_URL;
export const CONTACT_EMAIL = "haptica.cc@gmail.com";

// ── Lead capture ─────────────────────────────────────────────
// wa.me format: country code + number, no "+" or spaces.
export const WHATSAPP_NUMBER = "916375548830";
export const LEAD_EMAIL = "haptica.cc@gmail.com";
// Paste your free Web3Forms access key (get it in ~30s at web3forms.com using
// the email above). Until set, the full form falls back to WhatsApp delivery.
export const WEB3FORMS_KEY = "";

// ── Demo video ───────────────────────────────────────────────
// Bundled with the site (public/videos, public/images) and served by the CDN.
// Prefixed with the deploy basePath so it resolves on both a GitHub Pages
// project subpath and a root/custom domain (famit.in).
const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const DEMO_VIDEO_URL = `${BP}/videos/demo.mp4`;
export const DEMO_VIDEO_POSTER = `${BP}/images/demo-poster.jpg`;

export function whatsappLink(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

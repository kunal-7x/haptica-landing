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
// Hosted on DO Spaces + Cloudflare CDN (URL set during the deploy step).
// While empty, the hero shows the poster image only (still looks premium).
export const DEMO_VIDEO_URL = "/videos/demo.mp4";
export const DEMO_VIDEO_POSTER = "/images/demo-poster.jpg";

export function whatsappLink(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

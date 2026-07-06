// Single source of truth for outbound links to the Haptica AI app.
// The landing page is standalone; these are the only ties to the product.
export const APP_URL = "https://haptica.famit.in";
export const SIGNUP_URL = `${APP_URL}/signup`;
export const LOGIN_URL = `${APP_URL}/login`;

// "Book a demo" routes to signup (hands-on IS the demo). Swap to a real booking
// flow (WhatsApp / Calendly / form) when available — see LANDING_PAGE_STATE.md.
export const DEMO_URL = SIGNUP_URL;

export const CONTACT_EMAIL = "hello@famit.in";

import { LOGIN_URL, SIGNUP_URL } from "@/constants/site";

// Single-page nav — anchors resolve to home sections from any route.
export const navigation = [
    {
        id: "0",
        title: "How it works",
        url: "/#how-it-works",
    },
    {
        id: "1",
        title: "Features",
        url: "/#features",
    },
    {
        id: "2",
        title: "Integrations",
        url: "/#integrations",
    },
    {
        id: "3",
        title: "Pricing",
        url: "/#pricing",
    },
    {
        id: "4",
        title: "New account",
        url: SIGNUP_URL,
        onlyMobile: true,
    },
    {
        id: "5",
        title: "Sign in",
        url: LOGIN_URL,
        onlyMobile: true,
    },
];

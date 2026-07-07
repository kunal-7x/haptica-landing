"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    WEB3FORMS_KEY,
    LEAD_EMAIL,
    whatsappLink,
} from "@/constants/site";

type Mode = "quick" | "full";

const ROLES = ["Founder / CEO", "Sales head / manager", "Marketing", "Operations", "Other"];
const TEAM = ["Just me", "2–5", "6–20", "21–50", "50+"];
const INDUSTRY = ["Real estate", "Education", "Insurance", "Automotive", "Healthcare", "Other"];
const LEADS = ["Under 500 / mo", "500–2,000 / mo", "2,000–10,000 / mo", "10,000+ / mo"];
const TIMES = ["Morning (9–12)", "Afternoon (12–4)", "Evening (4–8)", "Anytime"];

const inputCls =
    "w-full rounded-xl border border-n-1/12 bg-n-8/60 px-4 py-3 text-sm text-n-1 placeholder:text-n-4 outline-none transition-colors focus:border-color-1/60 focus:ring-2 focus:ring-color-1/20";
const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-n-3";

function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className={labelCls}>{label}</span>
            {children}
            {error && (
                <span role="alert" className="mt-1 block text-xs text-color-3">
                    {error}
                </span>
            )}
        </label>
    );
}

function Select({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    options: string[];
    placeholder: string;
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`${inputCls} appearance-none pr-10 ${value ? "" : "text-n-4"}`}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((o) => (
                    <option key={o} value={o} className="bg-n-8 text-n-1">
                        {o}
                    </option>
                ))}
            </select>
            <svg
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-n-3"
                viewBox="0 0 16 16"
                fill="none"
            >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    );
}

const emptyForm = {
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    team: "",
    industry: "",
    leads: "",
    time: "",
};

export default function DemoModalUI({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [mode, setMode] = useState<Mode>("quick");
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ ...emptyForm });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
    const firstFieldRef = useRef<HTMLInputElement>(null);

    // reset on close; lock scroll + focus + Esc on open
    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
            clearTimeout(t);
            // reset a beat later so it doesn't flash during exit anim
            setTimeout(() => {
                setMode("quick");
                setStep(0);
                setForm({ ...emptyForm });
                setErrors({});
                setStatus("idle");
            }, 250);
        };
    }, [isOpen, onClose]);

    const set = (k: keyof typeof form, v: string) => {
        setForm((f) => ({ ...f, [k]: v }));
        setErrors((e) => ({ ...e, [k]: "" }));
    };

    const validPhone = (p: string) => p.replace(/\D/g, "").length >= 10;
    const validEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

    const validateQuick = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Your name, please.";
        if (!validPhone(form.phone)) e.phone = "Enter a valid 10-digit number.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const validateStep = (s: number) => {
        const e: Record<string, string> = {};
        if (s === 0) {
            if (!form.name.trim()) e.name = "Your name, please.";
            if (!validEmail(form.email)) e.email = "Enter a valid work email.";
        }
        if (s === 1) {
            if (!form.company.trim()) e.company = "Company name, please.";
            if (!form.role) e.role = "Pick one.";
            if (!form.team) e.team = "Pick one.";
        }
        if (s === 2) {
            if (!form.industry) e.industry = "Pick one.";
            if (!form.leads) e.leads = "Pick one.";
        }
        if (s === 3) {
            if (!validPhone(form.phone)) e.phone = "Enter a valid 10-digit number.";
            if (!form.time) e.time = "Pick a time.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const quickMessage = () =>
        `Hi Haptica! I'd like a callback.\nName: ${form.name}\nPhone: ${form.phone}${form.email ? `\nEmail: ${form.email}` : ""}`;

    const fullMessage = () =>
        `Hi Haptica! I'd like to book a demo.\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCompany: ${form.company}\nRole: ${form.role}\nTeam: ${form.team}\nIndustry: ${form.industry}\nMonthly leads: ${form.leads}\nBest time: ${form.time}`;

    const submitQuick = () => {
        if (!validateQuick()) return;
        window.open(whatsappLink(quickMessage()), "_blank", "noopener,noreferrer");
        setStatus("done");
    };

    const submitFull = async () => {
        if (!validateStep(3)) return;
        setStatus("sending");
        let emailed = false;
        if (WEB3FORMS_KEY) {
            try {
                const res = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({
                        access_key: WEB3FORMS_KEY,
                        subject: "New Haptica AI demo request",
                        from_name: "Haptica Landing",
                        to: LEAD_EMAIL,
                        ...form,
                    }),
                });
                emailed = (await res.json())?.success === true;
            } catch {
                emailed = false;
            }
        }
        // Always give the lead the WhatsApp path too (guarantees delivery).
        if (!emailed) {
            window.open(whatsappLink(fullMessage()), "_blank", "noopener,noreferrer");
        }
        setStatus("done");
    };

    const next = () => {
        if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
    };
    const back = () => setStep((s) => Math.max(0, s - 1));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    aria-modal="true"
                    role="dialog"
                    aria-label="Book a demo"
                >
                    <motion.div
                        className="absolute inset-0 bg-n-8/70 backdrop-blur-md"
                        onClick={onClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                    <motion.div
                        className="relative z-1 w-full max-w-lg overflow-hidden rounded-t-3xl border border-n-1/10 bg-n-8 p-6 shadow-2xl sm:rounded-3xl sm:p-8"
                        initial={{ y: 40, opacity: 0, scale: 0.98 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.98 }}
                        transition={{ type: "spring", damping: 24, stiffness: 240 }}
                    >
                        {/* spark border glow */}
                        <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-color-1/60 to-transparent" />
                        <button
                            onClick={onClose}
                            aria-label="Close"
                            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-n-3 transition-colors hover:bg-n-6/60 hover:text-n-1"
                        >
                            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                            </svg>
                        </button>

                        {status === "done" ? (
                            <div className="py-8 text-center">
                                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-color-4/15">
                                    <svg viewBox="0 0 24 24" className="h-8 w-8 text-color-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                                        <path d="M5 13l4 4 10-11" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="mb-2 font-display text-2xl font-semibold text-n-1">You’re in.</h3>
                                <p className="mx-auto max-w-sm text-sm text-n-3">
                                    Our team will reach out on WhatsApp shortly. Check the tab that just opened to send us your details.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="button mt-6 inline-flex h-11 items-center rounded-xl bg-n-1 px-6 text-n-8"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="tagline text-color-1">Book a demo</span>
                                <h3 className="mb-1 mt-2 font-display text-2xl font-semibold text-n-1">
                                    See Haptica on your leads
                                </h3>
                                <p className="mb-5 text-sm text-n-3">
                                    Two minutes — our team will call you back.
                                </p>

                                {/* mode switch */}
                                <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-n-7/60 p-1">
                                    {(["quick", "full"] as Mode[]).map((m) => (
                                        <button
                                            key={m}
                                            onClick={() => setMode(m)}
                                            className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                                                mode === m ? "bg-n-1 text-n-8" : "text-n-3 hover:text-n-1"
                                            }`}
                                        >
                                            {m === "quick" ? "Quick callback" : "Full demo"}
                                        </button>
                                    ))}
                                </div>

                                {mode === "quick" ? (
                                    <div className="space-y-4">
                                        <Field label="Your name" error={errors.name}>
                                            <input
                                                ref={firstFieldRef}
                                                className={inputCls}
                                                value={form.name}
                                                onChange={(e) => set("name", e.target.value)}
                                                autoComplete="name"
                                                placeholder="Rohan Sharma"
                                            />
                                        </Field>
                                        <Field label="Phone (WhatsApp)" error={errors.phone}>
                                            <input
                                                className={inputCls}
                                                value={form.phone}
                                                onChange={(e) => set("phone", e.target.value)}
                                                type="tel"
                                                autoComplete="tel"
                                                inputMode="tel"
                                                placeholder="98XXXXXXXX"
                                            />
                                        </Field>
                                        <Field label="Email (optional)">
                                            <input
                                                className={inputCls}
                                                value={form.email}
                                                onChange={(e) => set("email", e.target.value)}
                                                type="email"
                                                autoComplete="email"
                                                placeholder="you@company.com"
                                            />
                                        </Field>
                                        <button
                                            onClick={submitQuick}
                                            className="button relative flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-color-1 to-color-2 text-n-8"
                                        >
                                            Get a callback on WhatsApp
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        {/* progress */}
                                        <div className="mb-6 flex items-center gap-2">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                                                        i <= step ? "bg-gradient-to-r from-color-1 to-color-2" : "bg-n-6"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={step}
                                                initial={{ opacity: 0, x: 24 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -24 }}
                                                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                                                className="space-y-4"
                                            >
                                                {step === 0 && (
                                                    <>
                                                        <Field label="Your name" error={errors.name}>
                                                            <input ref={firstFieldRef} className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" placeholder="Rohan Sharma" />
                                                        </Field>
                                                        <Field label="Work email" error={errors.email}>
                                                            <input className={inputCls} value={form.email} onChange={(e) => set("email", e.target.value)} type="email" autoComplete="email" placeholder="you@company.com" />
                                                        </Field>
                                                    </>
                                                )}
                                                {step === 1 && (
                                                    <>
                                                        <Field label="Company" error={errors.company}>
                                                            <input className={inputCls} value={form.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" placeholder="Sunrise Estates" />
                                                        </Field>
                                                        <Field label="Your role" error={errors.role}>
                                                            <Select value={form.role} onChange={(v) => set("role", v)} options={ROLES} placeholder="Select role" />
                                                        </Field>
                                                        <Field label="Sales team size" error={errors.team}>
                                                            <Select value={form.team} onChange={(v) => set("team", v)} options={TEAM} placeholder="Select size" />
                                                        </Field>
                                                    </>
                                                )}
                                                {step === 2 && (
                                                    <>
                                                        <Field label="What do you sell?" error={errors.industry}>
                                                            <Select value={form.industry} onChange={(v) => set("industry", v)} options={INDUSTRY} placeholder="Select industry" />
                                                        </Field>
                                                        <Field label="Leads per month" error={errors.leads}>
                                                            <Select value={form.leads} onChange={(v) => set("leads", v)} options={LEADS} placeholder="Select volume" />
                                                        </Field>
                                                    </>
                                                )}
                                                {step === 3 && (
                                                    <>
                                                        <Field label="Phone (WhatsApp)" error={errors.phone}>
                                                            <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} type="tel" autoComplete="tel" inputMode="tel" placeholder="98XXXXXXXX" />
                                                        </Field>
                                                        <Field label="Best time to reach you" error={errors.time}>
                                                            <Select value={form.time} onChange={(v) => set("time", v)} options={TIMES} placeholder="Select time" />
                                                        </Field>
                                                    </>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        <div className="mt-6 flex items-center gap-3">
                                            {step > 0 && (
                                                <button onClick={back} className="button flex h-12 items-center rounded-xl border border-n-1/15 px-5 text-n-2 transition-colors hover:text-n-1">
                                                    Back
                                                </button>
                                            )}
                                            {step < 3 ? (
                                                <button onClick={next} className="button flex h-12 flex-1 items-center justify-center rounded-xl bg-n-1 text-n-8">
                                                    Continue
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={submitFull}
                                                    disabled={status === "sending"}
                                                    className="button flex h-12 flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-color-1 to-color-2 text-n-8 disabled:opacity-60"
                                                >
                                                    {status === "sending" ? "Sending…" : "Book my demo"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

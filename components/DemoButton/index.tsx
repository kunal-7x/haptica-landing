"use client";

import Button from "@/components/Button";
import { useDemo } from "@/components/DemoModal";

// A "Book a demo" button that keeps the original Button look but opens the
// onboarding modal instead of navigating.
type Props = {
    children: React.ReactNode;
    white?: boolean;
    className?: string;
    px?: string;
};

export default function DemoButton({ children, white, className, px }: Props) {
    const { open } = useDemo();
    return (
        <Button onClick={open} white={white} className={className} px={px}>
            {children}
        </Button>
    );
}

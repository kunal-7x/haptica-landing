import Link from "next/link";
import { svgs } from "./svgs";

type ButtonProps = {
    className?: string;
    href?: string;
    onClick?: () => void;
    children: React.ReactNode;
    px?: string;
    white?: boolean;
    size?: "md" | "lg";
};

const Button = ({
    className,
    href,
    onClick,
    children,
    px,
    white,
    size = "md",
}: ButtonProps) => {
    const sizing = size === "lg" ? "h-14 text-sm" : "h-11";
    const classes = `button relative inline-flex items-center justify-center ${sizing} ${
        px || (size === "lg" ? "px-9" : "px-7")
    } ${white ? "text-n-8" : "text-n-1"} transition-colors hover:text-color-1 ${
        className || ""
    }`;

    const spanClasses = `relative z-10`;

    return href ? (
        /^https?:\/\//.test(href) || href.startsWith("mailto:") ? (
            <a
                href={href}
                className={classes}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
                <span className={spanClasses}>{children}</span>
                {svgs(white)}
            </a>
        ) : (
            <Link href={href} className={classes}>
                <span className={spanClasses}>{children}</span>
                {svgs(white)}
            </Link>
        )
    ) : (
        <button className={classes} onClick={onClick}>
            <span className={spanClasses}>{children}</span>
            {svgs(white)}
        </button>
    );
};

export default Button;

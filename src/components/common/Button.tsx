"use client";
import Link from "next/link";
import React from "react";

const variants: { [key: string]: string } = {
    transparent: "p-2 px-3 border border-border dark:border-border-dark shadow-sm hover:shadow dark:shadow-white/5 dark:hover:shadow-white/10 text-text dark:text-text-dark",
    primary: "p-2 px-3 border border-primary shadow-sm hover:shadow dark:shadow-white/5 dark:hover:shadow-white/10 text-white bg-primary",
    white: "p-2 px-3 border border-white shadow-sm hover:shadow dark:shadow-white/5 dark:hover:shadow-white/10 text-black bg-white",
};
interface Props {
    border?: string;
    color?: string;
    children?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    data_html?: boolean;
    data_tip?: string;
    type?: "button" | "submit" | "reset" | undefined;
    noDisabledClass?: boolean;
    className?: string;
    href?: string;
    variant?: string;
}

const Button: React.FC<Props> = ({
    children,
    onClick,
    disabled,
    data_html,
    type,
    data_tip,
    className,
    href,
    variant,
    ...rest
}) => {
    return (
        <>
            {href ?
                <Link href={href} className={`flex items-center justify-center gap-1 font-semibold rounded-full cursor-pointer whitespace-nowrap ${variant && variants[variant]} ${className}`}
                    {...rest}
                >
                    {children}
                </Link>
                :
                <button
                    type={type || "button"}
                    data-tip={data_tip}
                    data-html={data_html}
                    onClick={() => { onClick && onClick() }}
                    disabled={disabled}
                    className={`flex items-center justify-center gap-1 font-semibold rounded-full cursor-pointer whitespace-nowrap ${variant && variants[variant]} px-8 ${className}`}>
                    {children}
                </button>
            }
        </>
    );
};

export default Button;
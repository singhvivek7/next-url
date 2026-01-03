import React from "react";

export const Logo = ({ className }: { className?: string }) => {
    return (
        <svg
            width="160"
            height="40"
            viewBox="0 0 160 52"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
            </defs>
            <text
                x="0"
                y="40"
                fontFamily="sans-serif"
                fontSize="36"
                fontWeight="800"
                letterSpacing="-1px"
                fill="var(--foreground)"
            >
                Next<tspan fill="url(#logoGradient)">Link</tspan>
            </text>
        </svg>
    );
};

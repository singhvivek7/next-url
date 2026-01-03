export type ColorPalette = {
    name: string;
    label: string;
    cssVars: {
        primary: string;
        ring: string;
        secondary: string;
        accent: string;
    };
};

export const colorPalettes: Record<string, ColorPalette> = {
    indigo: {
        name: "indigo",
        label: "Indigo",
        cssVars: {
            primary: "hsl(239 84% 67%)", // #6366F1
            ring: "hsl(239 84% 67%)",
            secondary: "hsl(271 91% 65%)", // #A855F7
            accent: "hsl(239 84% 67% / 0.1)",
        },
    },
    emerald: {
        name: "emerald",
        label: "Emerald",
        cssVars: {
            primary: "hsl(158 64% 52%)", // Emerald 500
            ring: "hsl(158 64% 52%)",
            secondary: "hsl(142 71% 45%)", // Green 600
            accent: "hsl(158 64% 52% / 0.1)",
        },
    },
    rose: {
        name: "rose",
        label: "Rose",
        cssVars: {
            primary: "hsl(340 75% 55%)", // Rose 500
            ring: "hsl(340 75% 55%)",
            secondary: "hsl(330 81% 60%)", // Pink 500
            accent: "hsl(340 75% 55% / 0.1)",
        },
    },
    amber: {
        name: "amber",
        label: "Amber",
        cssVars: {
            primary: "hsl(24 94% 50%)", // Orange 500
            ring: "hsl(24 94% 50%)",
            secondary: "hsl(35 92% 50%)", // Amber 500
            accent: "hsl(24 94% 50% / 0.1)",
        },
    },
    blue: {
        name: "blue",
        label: "Blue",
        cssVars: {
            primary: "hsl(221 83% 53%)", // Blue 500
            ring: "hsl(221 83% 53%)",
            secondary: "hsl(199 89% 48%)", // Sky 500
            accent: "hsl(221 83% 53% / 0.1)",
        },
    },
};

export const themes = {
    light: {
        background: "hsl(0 0% 100%)",
        foreground: "hsl(240 10% 3.9%)",
        card: "hsl(0 0% 100%)",
        cardForeground: "hsl(240 10% 3.9%)",
        popover: "hsl(0 0% 100%)",
        popoverForeground: "hsl(240 10% 3.9%)",
        secondaryForeground: "hsl(240 5.9% 10%)",
        muted: "hsl(240 4.8% 95.9%)",
        mutedForeground: "hsl(240 3.8% 46.1%)",
        accent: "hsl(240 4.8% 95.9%)",
        accentForeground: "hsl(240 5.9% 10%)",
        destructive: "hsl(0 84.2% 60.2%)",
        destructiveForeground: "hsl(0 0% 98%)",
        border: "hsl(240 5.9% 90%)",
        input: "hsl(240 5.9% 90%)",
    },
    dark: {
        background: "hsl(0 0% 2%)",
        foreground: "hsl(210 40% 98%)",
        card: "hsl(0 0% 100% / 0.03)",
        cardForeground: "hsl(210 40% 98%)",
        popover: "hsl(240 5% 4%)",
        popoverForeground: "hsl(210 40% 98%)",
        secondaryForeground: "hsl(0 0% 100%)",
        muted: "hsl(0 0% 100% / 0.05)",
        mutedForeground: "hsl(215 16% 47%)",
        accent: "hsl(239 84% 67% / 0.1)",
        accentForeground: "hsl(210 40% 98%)",
        destructive: "hsl(0 84% 60%)",
        destructiveForeground: "hsl(0 0% 100%)",
        border: "hsl(0 0% 100% / 0.1)",
        input: "hsl(0 0% 100% / 0.1)",
    }
};

export const defaultPalette = colorPalettes.indigo;

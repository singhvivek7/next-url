export const GridBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                          linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
                backgroundSize: "60px 60px",
            }}
        />
        <div
            className="absolute inset-0"
            style={{
                background:
                    "radial-gradient(ellipse 60% 50% at 50% -20%, hsl(var(--primary) / 0.15), transparent)",
            }}
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-transparent to-background" />
    </div>
);
